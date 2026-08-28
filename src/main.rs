use clap::{Parser, Subcommand, ValueEnum};
use permit_map::{inspect, render_markdown, render_table};
use std::fs;
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
        /// Write the report to this file instead of standard output
        #[arg(short, long)]
        output: Option<PathBuf>,
        /// Skip policy files under the current user's home directory
        #[arg(long)]
        no_global: bool,
    },
    /// Run the bundled sample in a temporary directory
    Demo {
        /// Output format for people, automation, or review
        #[arg(long, value_enum, default_value = "table")]
        format: Format,
        /// Write the report to this file; defaults to permit-map-report.md in the demo directory
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
        output: None,
        no_global: false,
    }) {
        Command::Inspect {
            path,
            format,
            output,
            no_global,
        } => {
            let report = inspect(&path, !no_global)?;
            write_output(format_report(&report, format)?, output)
        }
        Command::Demo { format, output } => run_demo(format, output),
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

fn write_output(contents: String, output: Option<PathBuf>) -> Result<(), String> {
    if let Some(path) = output {
        fs::write(&path, contents).map_err(|e| format!("Cannot write {}: {e}", path.display()))?;
        println!("Wrote {}", path.display());
    } else {
        print!("{contents}");
    }
    Ok(())
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
    let report = inspect(&root, false)?;
    let output = output
        .or_else(|| matches!(format, Format::Markdown).then(|| root.join("permit-map-report.md")));
    write_output(format_report(&report, format)?, output)?;
    eprintln!("Demo files: {}", root.display());
    eprintln!("Nothing outside this temporary directory was read or changed.");
    Ok(())
}

fn demo_write_error(error: std::io::Error) -> String {
    format!("Cannot write demo policy: {error}")
}

#[allow(dead_code)]
fn _path_is_documented(path: &Path) -> bool {
    path.exists()
}
