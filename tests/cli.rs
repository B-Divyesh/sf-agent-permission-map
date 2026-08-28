use assert_cmd::Command;
use predicates::prelude::*;

#[test]
fn help_names_real_actions() {
    Command::cargo_bin("permit-map")
        .unwrap()
        .arg("--help")
        .assert()
        .success()
        .stdout(predicate::str::contains("Inspect known policy files"))
        .stdout(predicate::str::contains("Run the bundled sample"));
}

#[test]
fn demo_runs_without_setup() {
    Command::cargo_bin("permit-map")
        .unwrap()
        .args(["demo", "--format", "json"])
        .assert()
        .success()
        .stdout(predicate::str::contains("\"shadowed\": 1"))
        .stdout(predicate::str::contains("Read(.env*)"))
        .stderr(predicate::str::contains(
            "Nothing outside this temporary directory was read or changed",
        ));
}

#[test]
fn malformed_policy_returns_a_useful_error() {
    let root = std::env::temp_dir().join(format!("permit-map-bad-{}", std::process::id()));
    std::fs::create_dir_all(root.join(".claude")).unwrap();
    std::fs::write(root.join(".claude/settings.json"), "not json").unwrap();
    Command::cargo_bin("permit-map")
        .unwrap()
        .args(["inspect", root.to_str().unwrap(), "--no-global"])
        .assert()
        .code(2)
        .stderr(predicate::str::contains("Cannot parse"))
        .stderr(predicate::str::contains("Claude settings JSON"));
    std::fs::remove_dir_all(root).unwrap();
}

#[test]
fn output_never_overwrites_a_discovered_vendor_policy() {
    let root = std::env::temp_dir().join(format!("permit-map-output-{}", std::process::id()));
    std::fs::create_dir_all(root.join(".claude")).unwrap();
    let policy = root.join(".claude/settings.json");
    let contents = r#"{"permissions":{"deny":["Bash(git push:*)"]}}"#;
    std::fs::write(&policy, contents).unwrap();
    Command::cargo_bin("permit-map")
        .unwrap()
        .args([
            "inspect",
            root.to_str().unwrap(),
            "--no-global",
            "--format",
            "markdown",
            "--output",
            policy.to_str().unwrap(),
        ])
        .assert()
        .code(2)
        .stderr(predicate::str::contains(
            "Refusing to overwrite discovered vendor policy",
        ));
    assert_eq!(std::fs::read_to_string(&policy).unwrap(), contents);
    std::fs::remove_dir_all(root).unwrap();
}

#[cfg(unix)]
#[test]
fn output_never_overwrites_a_vendor_policy_through_a_hard_link() {
    let root = std::env::temp_dir().join(format!(
        "permit-map-hard-link-{}-{}",
        std::process::id(),
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_nanos()
    ));
    std::fs::create_dir_all(root.join(".claude")).unwrap();
    let policy = root.join(".claude/settings.json");
    let report_alias = root.join("report.md");
    let contents = r#"{"permissions":{"deny":["Bash(git push:*)"]}}"#;
    std::fs::write(&policy, contents).unwrap();
    std::fs::hard_link(&policy, &report_alias).unwrap();
    Command::cargo_bin("permit-map")
        .unwrap()
        .args([
            "inspect",
            root.to_str().unwrap(),
            "--no-global",
            "--format",
            "markdown",
            "--output",
            report_alias.to_str().unwrap(),
        ])
        .assert()
        .code(2)
        .stderr(predicate::str::contains(
            "Refusing to overwrite discovered vendor policy",
        ));
    assert_eq!(std::fs::read_to_string(&policy).unwrap(), contents);
    std::fs::remove_dir_all(root).unwrap();
}

#[test]
fn malformed_codex_rules_return_a_useful_error() {
    let root = std::env::temp_dir().join(format!(
        "permit-map-bad-rules-{}-{}",
        std::process::id(),
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_nanos()
    ));
    std::fs::create_dir_all(root.join(".codex/rules")).unwrap();
    std::fs::write(
        root.join(".codex/rules/default.rules"),
        "prefix_rule(pattern = [\"git\"], decision = \"forbidden\"",
    )
    .unwrap();
    Command::cargo_bin("permit-map")
        .unwrap()
        .args(["inspect", root.to_str().unwrap(), "--no-global"])
        .assert()
        .code(2)
        .stderr(predicate::str::contains("Cannot parse"))
        .stderr(predicate::str::contains("Codex rules"));
    std::fs::remove_dir_all(root).unwrap();
}

#[test]
fn demo_output_stays_inside_its_temporary_directory() {
    let caller = std::env::temp_dir().join(format!(
        "permit-map-demo-caller-{}-{}",
        std::process::id(),
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_nanos()
    ));
    std::fs::create_dir_all(&caller).unwrap();
    let sentinel = caller.join("keep.txt");
    std::fs::write(&sentinel, "unchanged").unwrap();
    Command::cargo_bin("permit-map")
        .unwrap()
        .current_dir(&caller)
        .args(["demo", "--format", "markdown", "--output", "report.md"])
        .assert()
        .success()
        .stdout(predicate::str::contains("Wrote"))
        .stderr(predicate::str::contains(
            "Nothing outside this temporary directory was read or changed",
        ));
    assert_eq!(std::fs::read_to_string(sentinel).unwrap(), "unchanged");
    assert!(!caller.join("report.md").exists());
    std::fs::remove_dir_all(caller).unwrap();
}

#[test]
fn json_shorthand_matches_the_documented_format() {
    Command::cargo_bin("permit-map")
        .unwrap()
        .args(["demo", "--json"])
        .assert()
        .success()
        .stdout(predicate::str::contains("\"schema_version\""));
}
