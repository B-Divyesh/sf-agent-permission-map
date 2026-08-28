use clap::{Parser, Subcommand, ValueEnum};
use permit_map::{
    CodexTrust, InspectOptions, Report, inspect_with_options, render_markdown, render_table,
};
use std::fs;
use std::io::Write;
#[cfg(unix)]
use std::os::unix::fs::MetadataExt;
use std::path::{Path, PathBuf};
use std::process::ExitCode;
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Parser)]
#[command(name = "permit-map", version, about = "Resolve coding-agent permissions before an agent runs", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Option<Command>,
}

#[derive(Subcommand)]
enum Command {
    /// Inspect known policy files under a repository
    Inspect {
        /// Repository or worktree to inspect
        #[arg(default_value = ".")]
        path: PathBuf,
        /// Output format for people, automation, or review
        #[arg(long, value_enum, default_value = "table")]
        format: Format,
        /// Shorthand for --format json
        #[arg(long)]
        json: bool,
        /// Write the report to this file instead of standard output
        #[arg(short, long)]
        output: Option<PathBuf>,
        /// Skip policy files under the current user's home directory
        #[arg(long)]
        no_global: bool,
        /// Whether Codex loads project .codex layers for this inspection
        #[arg(long, value_enum, default_value = "unknown")]
        codex_trust: Trust,
        /// Selected Codex profile name, if the agent was started with --profile
        #[arg(long)]
        codex_profile: Option<String>,
        /// Codex key=value override passed to the agent; repeat for each --config
        #[arg(long = "codex-config")]
        codex_overrides: Vec<String>,
    },
    /// Run the bundled sample in a temporary directory
    Demo {
        /// Output format for people, automation, or review
        #[arg(long, value_enum, default_value = "table")]
        format: Format,
        /// Shorthand for --format json
        #[arg(long)]
        json: bool,
        /// Write the report to this relative path inside the demo directory
        #[arg(short, long)]
        output: Option<PathBuf>,
    },
}

#[derive(Clone, Copy, ValueEnum)]
enum Format {
    Table,
    Json,
    Markdown,
}

#[derive(Clone, Copy, ValueEnum)]
enum Trust {
    Unknown,
    Trusted,
    Untrusted,
}

impl From<Trust> for CodexTrust {
    fn from(value: Trust) -> Self {
        match value {
            Trust::Unknown => Self::Unknown,
            Trust::Trusted => Self::Trusted,
            Trust::Untrusted => Self::Untrusted,
        }
    }
}

fn main() -> ExitCode {
    match run(Cli::parse()) {
        Ok(()) => ExitCode::SUCCESS,
        Err(message) => {
            eprintln!("Permit Map could not finish: {message}");
            ExitCode::from(2)
        }
    }
}

fn run(cli: Cli) -> Result<(), String> {
    match cli.command.unwrap_or(Command::Inspect {
        path: PathBuf::from("."),
        format: Format::Table,
        json: false,
        output: None,
        no_global: false,
        codex_trust: Trust::Unknown,
        codex_profile: None,
        codex_overrides: Vec::new(),
    }) {
        Command::Inspect {
            path,
            format,
            json,
            output,
            no_global,
            codex_trust,
            codex_profile,
            codex_overrides,
        } => {
            let report = inspect_with_options(
                &path,
                InspectOptions {
                    include_global: !no_global,
                    codex_trust: codex_trust.into(),
                    codex_profile,
                    codex_overrides,
                    ..InspectOptions::default()
                },
            )?;
            write_output(
                format_report(&report, if json { Format::Json } else { format })?,
                output,
                &report,
            )
        }
        Command::Demo {
            format,
            json,
            output,
        } => run_demo(if json { Format::Json } else { format }, output),
    }
}

fn format_report(report: &permit_map::Report, format: Format) -> Result<String, String> {
    match format {
        Format::Table => Ok(render_table(report)),
        Format::Markdown => Ok(render_markdown(report)),
        Format::Json => {
            serde_json::to_string_pretty(report).map_err(|e| format!("Cannot create JSON: {e}"))
        }
    }
}

fn write_output(contents: String, output: Option<PathBuf>, report: &Report) -> Result<(), String> {
    if let Some(path) = output {
        if report
            .policy_paths
            .iter()
            .any(|policy| same_file(policy, &path))
            || is_vendor_policy_path(&path)
        {
            return Err(format!(
                "Refusing to overwrite discovered vendor policy {}. Choose a report path outside the policy files.",
                path.display()
            ));
        }
        let mut file = fs::OpenOptions::new()
            .write(true)
            .create_new(true)
            .open(&path)
            .map_err(|e| {
                format!(
                    "Cannot write {}: {e}. Report paths must be new files.",
                    path.display()
                )
            })?;
        file.write_all(contents.as_bytes())
            .map_err(|e| format!("Cannot write {}: {e}", path.display()))?;
        println!("Wrote {}", path.display());
    } else {
        print!("{contents}");
    }
    Ok(())
}

fn is_vendor_policy_path(path: &Path) -> bool {
    let components: Vec<_> = path.components().collect();
    let Some(file) = path.file_name().and_then(|name| name.to_str()) else {
        return false;
    };
    let in_claude = components
        .iter()
        .any(|component| component.as_os_str() == ".claude");
    if in_claude && matches!(file, "settings.json" | "settings.local.json") {
        return true;
    }
    let in_codex = components
        .iter()
        .any(|component| component.as_os_str() == ".codex");
    in_codex
        && (file == "config.toml" || file.ends_with(".config.toml") || file.ends_with(".rules"))
}

fn same_file(policy: &Path, candidate: &Path) -> bool {
    let (Ok(policy_metadata), Ok(candidate_metadata)) =
        (fs::metadata(policy), fs::metadata(candidate))
    else {
        return false;
    };
    #[cfg(unix)]
    {
        policy_metadata.dev() == candidate_metadata.dev()
            && policy_metadata.ino() == candidate_metadata.ino()
    }
    #[cfg(not(unix))]
    {
        fs::canonicalize(policy)
            .zip(fs::canonicalize(candidate))
            .is_ok_and(|(policy, candidate)| policy == candidate)
    }
}

fn run_demo(format: Format, output: Option<PathBuf>) -> Result<(), String> {
    let stamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_millis();
    let root = std::env::temp_dir().join(format!("permit-map-demo-{}-{stamp}", std::process::id()));
    fs::create_dir_all(root.join(".claude"))
        .map_err(|e| format!("Cannot create demo directory: {e}"))?;
    fs::create_dir_all(root.join(".codex/rules"))
        .map_err(|e| format!("Cannot create demo directory: {e}"))?;
    fs::write(
        root.join(".claude/settings.json"),
        include_str!("../examples/sample-repo/.claude/settings.json"),
    )
    .map_err(demo_write_error)?;
    fs::write(
        root.join(".claude/settings.local.json"),
        include_str!("../examples/sample-repo/.claude/settings.local.json"),
    )
    .map_err(demo_write_error)?;
    fs::write(
        root.join(".codex/config.toml"),
        include_str!("../examples/sample-repo/.codex/config.toml"),
    )
    .map_err(demo_write_error)?;
    fs::write(
        root.join(".codex/rules/release.rules"),
        include_str!("../examples/sample-repo/.codex/rules/release.rules"),
    )
    .map_err(demo_write_error)?;
    let report = inspect_with_options(
        &root,
        InspectOptions {
            include_global: false,
            codex_trust: CodexTrust::Trusted,
            ..InspectOptions::default()
        },
    )?;
    let output = output
        .map(|path| demo_output_path(&root, &path))
        .transpose()?
        .or_else(|| matches!(format, Format::Markdown).then(|| root.join("permit-map-report.md")));
    write_output(format_report(&report, format)?, output, &report)?;
    eprintln!("Demo files: {}", root.display());
    eprintln!("Nothing outside this temporary directory was read or changed.");
    Ok(())
}

fn demo_output_path(root: &Path, output: &Path) -> Result<PathBuf, String> {
    if output.is_absolute()
        || output.components().any(|component| {
            matches!(
                component,
                std::path::Component::ParentDir
                    | std::path::Component::RootDir
                    | std::path::Component::Prefix(_)
            )
        })
    {
        return Err("Demo --output must be a relative path inside its temporary directory.".into());
    }
    Ok(root.join(output))
}

fn demo_write_error(error: std::io::Error) -> String {
    format!("Cannot write demo policy: {error}")
}

#[allow(dead_code)]
fn _path_is_documented(path: &Path) -> bool {
    path.exists()
}
