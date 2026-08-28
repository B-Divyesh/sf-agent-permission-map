use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fmt::{self, Display};
use std::fs;
use std::path::{Path, PathBuf};

#[derive(Clone, Copy, Debug, Deserialize, Eq, Ord, PartialEq, PartialOrd, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum Layer {
    Global,
    Repo,
    Worktree,
}

impl Display for Layer {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "{}",
            match self {
                Self::Global => "global",
                Self::Repo => "repo",
                Self::Worktree => "worktree",
            }
        )
    }
}

#[derive(Clone, Copy, Debug, Deserialize, Eq, Ord, PartialEq, PartialOrd, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum Effect {
    Allow,
    Ask,
    Deny,
}

impl Effect {
    fn weight(self) -> u8 {
        match self {
            Self::Allow => 0,
            Self::Ask => 1,
            Self::Deny => 2,
        }
    }
}

impl Display for Effect {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "{}",
            match self {
                Self::Allow => "allow",
                Self::Ask => "ask",
                Self::Deny => "deny",
            }
        )
    }
}

#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct Rule {
    pub vendor: String,
    pub layer: Layer,
    pub effect: Effect,
    pub target: String,
    pub source: String,
    pub status: RuleStatus,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub shadowed_by: Option<String>,
}

#[derive(Clone, Copy, Debug, Deserialize, Eq, Ord, PartialEq, PartialOrd, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum RuleStatus {
    Effective,
    Shadowed,
}

impl Display for RuleStatus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "{}",
            match self {
                Self::Effective => "effective",
                Self::Shadowed => "shadowed",
            }
        )
    }
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct SourceSummary {
    pub vendor: String,
    pub layer: Layer,
    pub path: String,
    pub rules: usize,
}

#[derive(Clone, Debug, Default, Deserialize, Serialize)]
pub struct Counts {
    pub sources: usize,
    pub effective: usize,
    pub shadowed: usize,
    pub allow: usize,
    pub ask: usize,
    pub deny: usize,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Report {
    pub schema_version: u8,
    pub root: String,
    pub counts: Counts,
    pub sources: Vec<SourceSummary>,
    pub rules: Vec<Rule>,
    pub notes: Vec<String>,
}

#[derive(Clone, Debug)]
struct RawRule {
    vendor: String,
    layer: Layer,
    effect: Effect,
    target: String,
    match_key: String,
    source: String,
    order: usize,
}

pub fn inspect(root: &Path, include_global: bool) -> Result<Report, String> {
    if !root.exists() {
        return Err(format!(
            "{} does not exist. Choose a repository directory and try again.",
            root.display()
        ));
    }
    if !root.is_dir() {
        return Err(format!(
            "{} is not a directory. Choose a repository directory and try again.",
            root.display()
        ));
    }

    let root =
        fs::canonicalize(root).map_err(|e| format!("Cannot open {}: {e}", root.display()))?;
    let mut candidates: Vec<(String, Layer, PathBuf)> = Vec::new();
    if let (true, Some(home)) = (include_global, std::env::var_os("HOME")) {
        let home = PathBuf::from(home);
        candidates.extend([
            (
                "claude".into(),
                Layer::Global,
                home.join(".claude/settings.json"),
            ),
            (
                "codex".into(),
                Layer::Global,
                home.join(".codex/config.toml"),
            ),
        ]);
        candidates.extend(rule_files(&home.join(".codex/rules"), Layer::Global));
    }
    candidates.extend([
        (
            "claude".into(),
            Layer::Repo,
            root.join(".claude/settings.json"),
        ),
        (
            "claude".into(),
            Layer::Worktree,
            root.join(".claude/settings.local.json"),
        ),
        ("codex".into(), Layer::Repo, root.join(".codex/config.toml")),
        (
            "codex".into(),
            Layer::Worktree,
            root.join(".codex/config.local.toml"),
        ),
    ]);
    candidates.extend(rule_files(&root.join(".codex/rules"), Layer::Repo));
    candidates.extend(rule_files(
        &root.join(".codex/rules.local"),
        Layer::Worktree,
    ));

    let mut raw = Vec::new();
    let mut sources = Vec::new();
    let mut notes = Vec::new();
    for (vendor, layer, path) in candidates {
        if !path.is_file() {
            continue;
        }
        let source = display_path(&path, &root);
        let before = raw.len();
        match vendor.as_str() {
            "claude" => parse_claude(&path, layer, &source, &mut raw)?,
            "codex" if path.extension().and_then(|v| v.to_str()) == Some("rules") => {
                parse_codex_rules(&path, layer, &source, &mut raw, &mut notes)?
            }
            "codex" => parse_codex_config(&path, layer, &source, &mut raw, &mut notes)?,
            _ => unreachable!(),
        }
        sources.push(SourceSummary {
            vendor,
            layer,
            path: source,
            rules: raw.len() - before,
        });
    }

    notes.push(
        "Exact duplicate matchers resolve by layer: worktree, then repo, then global.".into(),
    );
    notes.push("At one layer, deny wins over ask and allow for the same exact matcher.".into());
    notes.push(
        "Pattern overlap is vendor-specific; Permit Map lists it but does not infer overlap."
            .into(),
    );
    notes.push(
        "Codex sandbox and approval settings are shown as policy controls, not command rules."
            .into(),
    );

    let mut winner: HashMap<(String, String), usize> = HashMap::new();
    for (index, candidate) in raw.iter().enumerate() {
        let key = (candidate.vendor.clone(), candidate.match_key.clone());
        match winner.get(&key).copied() {
            None => {
                winner.insert(key, index);
            }
            Some(current) => {
                let old = &raw[current];
                let new_rank = (candidate.layer, candidate.effect.weight(), candidate.order);
                let old_rank = (old.layer, old.effect.weight(), old.order);
                if new_rank > old_rank {
                    winner.insert(key, index);
                }
            }
        }
    }

    let mut rules = Vec::new();
    for (index, item) in raw.iter().enumerate() {
        let winning_index = winner[&(item.vendor.clone(), item.match_key.clone())];
        let is_winner = index == winning_index;
        rules.push(Rule {
            vendor: item.vendor.clone(),
            layer: item.layer,
            effect: item.effect,
            target: item.target.clone(),
            source: item.source.clone(),
            status: if is_winner {
                RuleStatus::Effective
            } else {
                RuleStatus::Shadowed
            },
            shadowed_by: (!is_winner).then(|| raw[winning_index].source.clone()),
        });
    }
    rules.sort_by(|a, b| {
        a.status
            .cmp(&b.status)
            .then(a.vendor.cmp(&b.vendor))
            .then(a.target.cmp(&b.target))
            .then(b.layer.cmp(&a.layer))
    });

    let mut counts = Counts {
        sources: sources.len(),
        ..Counts::default()
    };
    for rule in &rules {
        match rule.status {
            RuleStatus::Effective => {
                counts.effective += 1;
                match rule.effect {
                    Effect::Allow => counts.allow += 1,
                    Effect::Ask => counts.ask += 1,
                    Effect::Deny => counts.deny += 1,
                }
            }
            RuleStatus::Shadowed => counts.shadowed += 1,
        }
    }
    Ok(Report {
        schema_version: 1,
        root: root.display().to_string(),
        counts,
        sources,
        rules,
        notes,
    })
}

fn rule_files(dir: &Path, layer: Layer) -> Vec<(String, Layer, PathBuf)> {
    let Ok(entries) = fs::read_dir(dir) else {
        return Vec::new();
    };
    let mut files: Vec<_> = entries
        .flatten()
        .map(|e| e.path())
        .filter(|p| p.is_file() && p.extension().and_then(|v| v.to_str()) == Some("rules"))
        .map(|p| ("codex".into(), layer, p))
        .collect();
    files.sort_by(|a, b| a.2.cmp(&b.2));
    files
}

fn parse_claude(
    path: &Path,
    layer: Layer,
    source: &str,
    out: &mut Vec<RawRule>,
) -> Result<(), String> {
    #[derive(Deserialize)]
    struct Settings {
        permissions: Option<Permissions>,
    }
    #[derive(Deserialize)]
    struct Permissions {
        allow: Option<Vec<String>>,
        ask: Option<Vec<String>>,
        deny: Option<Vec<String>>,
    }
    let input =
        fs::read_to_string(path).map_err(|e| format!("Cannot read {}: {e}", path.display()))?;
    let settings: Settings = serde_json::from_str(&input).map_err(|e| {
        format!(
            "Cannot parse {} as Claude settings JSON: {e}",
            path.display()
        )
    })?;
    let Some(p) = settings.permissions else {
        return Ok(());
    };
    for (effect, values) in [
        (Effect::Allow, p.allow),
        (Effect::Ask, p.ask),
        (Effect::Deny, p.deny),
    ] {
        for target in values.unwrap_or_default() {
            push_rule(out, "claude", layer, effect, target, source);
        }
    }
    Ok(())
}

fn parse_codex_config(
    path: &Path,
    layer: Layer,
    source: &str,
    out: &mut Vec<RawRule>,
    notes: &mut Vec<String>,
) -> Result<(), String> {
    let input =
        fs::read_to_string(path).map_err(|e| format!("Cannot read {}: {e}", path.display()))?;
    let value: toml::Value = toml::from_str(&input)
        .map_err(|e| format!("Cannot parse {} as Codex TOML: {e}", path.display()))?;
    if let Some(mode) = value.get("sandbox_mode").and_then(|v| v.as_str()) {
        let effect = match mode {
            "danger-full-access" => Effect::Allow,
            "workspace-write" => Effect::Ask,
            _ => Effect::Deny,
        };
        push_control(
            out,
            "codex",
            layer,
            effect,
            "sandbox",
            format!("sandbox:{mode}"),
            source,
        );
    }
    if let Some(policy) = value.get("approval_policy").and_then(|v| v.as_str()) {
        let effect = if policy == "never" {
            Effect::Allow
        } else {
            Effect::Ask
        };
        push_control(
            out,
            "codex",
            layer,
            effect,
            "approval",
            format!("approval:{policy}"),
            source,
        );
    }
    if value.get("sandbox_mode").is_none() && value.get("approval_policy").is_none() {
        notes.push(format!(
            "{source}: no supported top-level Codex policy controls found."
        ));
    }
    Ok(())
}

fn parse_codex_rules(
    path: &Path,
    layer: Layer,
    source: &str,
    out: &mut Vec<RawRule>,
    notes: &mut Vec<String>,
) -> Result<(), String> {
    let input =
        fs::read_to_string(path).map_err(|e| format!("Cannot read {}: {e}", path.display()))?;
    for (line_no, line) in input.lines().enumerate() {
        let line = line.trim();
        if line.is_empty() || line.starts_with('#') {
            continue;
        }
        if !line.starts_with("prefix_rule(") {
            notes.push(format!(
                "{source}:{} uses unsupported Codex rule syntax.",
                line_no + 1
            ));
            continue;
        }
        let decision = extract_quoted_after(line, "decision=")
            .or_else(|| extract_quoted_after(line, "decision ="));
        let Some(decision) = decision else {
            notes.push(format!(
                "{source}:{} has no readable decision.",
                line_no + 1
            ));
            continue;
        };
        let effect = match decision.as_str() {
            "allow" => Effect::Allow,
            "prompt" | "ask" => Effect::Ask,
            "forbidden" | "deny" => Effect::Deny,
            _ => {
                notes.push(format!(
                    "{source}:{} has unsupported decision '{decision}'.",
                    line_no + 1
                ));
                continue;
            }
        };
        let pattern = extract_bracket_strings(line).join(" ");
        if pattern.is_empty() {
            notes.push(format!(
                "{source}:{} has no readable command prefix.",
                line_no + 1
            ));
            continue;
        }
        push_rule(
            out,
            "codex",
            layer,
            effect,
            format!("command:{pattern}"),
            source,
        );
    }
    Ok(())
}

fn extract_quoted_after(line: &str, marker: &str) -> Option<String> {
    let rest = line.split_once(marker)?.1.trim_start();
    let quote = rest.chars().next()?;
    if quote != '"' && quote != '\'' {
        return None;
    }
    Some(rest[1..].split(quote).next()?.to_string())
}

fn extract_bracket_strings(line: &str) -> Vec<String> {
    let Some(start) = line.find('[') else {
        return Vec::new();
    };
    let Some(end_rel) = line[start..].find(']') else {
        return Vec::new();
    };
    let mut values = Vec::new();
    let mut chars = line[start + 1..start + end_rel].chars().peekable();
    while let Some(ch) = chars.next() {
        if ch == '"' || ch == '\'' {
            let mut value = String::new();
            for next in chars.by_ref() {
                if next == ch {
                    break;
                }
                value.push(next);
            }
            values.push(value);
        }
    }
    values
}

fn push_rule(
    out: &mut Vec<RawRule>,
    vendor: &str,
    layer: Layer,
    effect: Effect,
    target: String,
    source: &str,
) {
    let target = target.trim().to_string();
    if target.is_empty() {
        return;
    }
    out.push(RawRule {
        vendor: vendor.into(),
        layer,
        effect,
        match_key: target.clone(),
        target,
        source: source.into(),
        order: out.len(),
    });
}

fn push_control(
    out: &mut Vec<RawRule>,
    vendor: &str,
    layer: Layer,
    effect: Effect,
    match_key: &str,
    target: String,
    source: &str,
) {
    out.push(RawRule {
        vendor: vendor.into(),
        layer,
        effect,
        target,
        match_key: match_key.into(),
        source: source.into(),
        order: out.len(),
    });
}

fn display_path(path: &Path, root: &Path) -> String {
    path.strip_prefix(root)
        .map(|p| p.display().to_string())
        .unwrap_or_else(|_| path.display().to_string())
}

pub fn render_table(report: &Report) -> String {
    if report.sources.is_empty() {
        return format!(
            "No policy files found in {}.\nAdd .claude/settings.json or .codex/config.toml, then run Permit Map again.\n",
            report.root
        );
    }
    let mut out = format!(
        "Permit Map — {} source(s), {} effective, {} shadowed\n\n",
        report.counts.sources, report.counts.effective, report.counts.shadowed
    );
    out.push_str(&format!(
        "{:<9} {:<10} {:<7} {:<10} {}\n",
        "VENDOR", "LAYER", "EFFECT", "STATUS", "TARGET"
    ));
    out.push_str(&format!("{}\n", "─".repeat(76)));
    for r in &report.rules {
        out.push_str(&format!(
            "{:<9} {:<10} {:<7} {:<10} {}\n",
            r.vendor, r.layer, r.effect, r.status, r.target
        ));
        if let Some(by) = &r.shadowed_by {
            out.push_str(&format!("          ↳ replaced by {by}\n"));
        }
    }
    if report.rules.is_empty() {
        out.push_str("No supported permission rules found in these files.\n");
    }
    out
}

pub fn render_markdown(report: &Report) -> String {
    let mut out = String::from("# Permit Map report\n\n");
    out.push_str(&format!(
        "Root: `{}`  \nSources: {} · Effective: {} · Shadowed: {}\n\n",
        report.root, report.counts.sources, report.counts.effective, report.counts.shadowed
    ));
    if report.sources.is_empty() {
        out.push_str("No policy files found. Add `.claude/settings.json` or `.codex/config.toml`, then run Permit Map again.\n");
        return out;
    }
    out.push_str(
        "| Vendor | Layer | Effect | Status | Matcher | Source |\n|---|---|---|---|---|---|\n",
    );
    for r in &report.rules {
        out.push_str(&format!(
            "| {} | {} | {} | {} | `{}` | `{}` |\n",
            r.vendor,
            r.layer,
            r.effect,
            r.status,
            escape_md(&r.target),
            escape_md(&r.source)
        ));
    }
    if report.rules.is_empty() {
        out.push_str("\nNo supported permission rules were found in these files.\n");
    }
    out.push_str("\n## Adapter notes\n\n");
    for note in &report.notes {
        out.push_str(&format!("- {note}\n"));
    }
    out
}

fn escape_md(value: &str) -> String {
    value.replace('|', "\\|").replace('`', "\\`")
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::time::{SystemTime, UNIX_EPOCH};

    fn temp_root() -> PathBuf {
        let name = format!(
            "permit-map-test-{}-{}",
            std::process::id(),
            SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        );
        let path = std::env::temp_dir().join(name);
        fs::create_dir_all(&path).unwrap();
        path
    }

    #[test]
    fn resolves_exact_matchers_by_layer_and_marks_shadowed() {
        let root = temp_root();
        fs::create_dir_all(root.join(".claude")).unwrap();
        fs::write(
            root.join(".claude/settings.json"),
            r#"{"permissions":{"allow":["Bash(git status:*)","Read(src/**)"]}}"#,
        )
        .unwrap();
        fs::write(
            root.join(".claude/settings.local.json"),
            r#"{"permissions":{"deny":["Bash(git status:*)"]}}"#,
        )
        .unwrap();
        let report = inspect(&root, false).unwrap();
        assert_eq!(report.counts.effective, 2);
        assert_eq!(report.counts.shadowed, 1);
        assert!(report.rules.iter().any(|r| r.target == "Bash(git status:*)"
            && r.effect == Effect::Deny
            && r.status == RuleStatus::Effective));
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn parses_codex_rules_and_controls() {
        let root = temp_root();
        fs::create_dir_all(root.join(".codex/rules")).unwrap();
        fs::write(
            root.join(".codex/config.toml"),
            "sandbox_mode = \"workspace-write\"\napproval_policy = \"on-request\"\n",
        )
        .unwrap();
        fs::write(
            root.join(".codex/config.local.toml"),
            "sandbox_mode = \"read-only\"\n",
        )
        .unwrap();
        fs::write(
            root.join(".codex/rules/release.rules"),
            "prefix_rule(pattern = [\"git\", \"push\"], decision = \"forbidden\")\n",
        )
        .unwrap();
        let report = inspect(&root, false).unwrap();
        assert_eq!(report.counts.effective, 3);
        assert_eq!(report.counts.shadowed, 1);
        assert!(report.rules.iter().any(|r| r.target == "sandbox:read-only"
            && r.layer == Layer::Worktree
            && r.status == RuleStatus::Effective));
        assert!(
            report
                .rules
                .iter()
                .any(|r| r.target == "command:git push" && r.effect == Effect::Deny)
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn empty_state_explains_the_next_step() {
        let root = temp_root();
        let report = inspect(&root, false).unwrap();
        let output = render_table(&report);
        assert!(output.contains("No policy files found"));
        assert!(output.contains("run Permit Map again"));
        fs::remove_dir_all(root).unwrap();
    }
}
