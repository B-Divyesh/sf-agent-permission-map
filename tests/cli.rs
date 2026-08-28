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
