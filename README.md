# Permit Map

Resolve coding-agent permissions before an agent runs.

Permit Map is for engineers who use Claude Code or Codex across several repositories. The local CLI finds known policy files, resolves exact matches by layer, marks shadowed rules, and writes a reviewable report.

It does not run agents, change settings, scan source files, or store secrets. Permit Map is free software under the [MIT license](LICENSE).

Website: <https://agent-permission-map.sociobot.in>  
One-click sample: <https://agent-permission-map.sociobot.in/demo>

## Try the sandbox

The demo command copies the bundled sample policies into a new temporary directory. It does not inspect the current repository.

```sh
cargo run -- demo
cargo run -- demo --format json
cargo run -- demo --format markdown
```

The browser route shows the same four sample files, nine effective rules, and one shadowed rule. It sets no cookies and stores no browser data. See [.factory/demo.md](.factory/demo.md) for the reset and isolation contract.

## Install

Build the single binary with a current stable Rust toolchain:

```sh
cargo install --path .
permit-map --help
```

The package starts at version `0.1.0`. The factory owns registry publishing; this repository is ready for `cargo package` but does not publish from CI.

## Usage

Inspect the current repository and user-level policy files:

```sh
permit-map inspect .
```

Write a Markdown report without user-level files:

```sh
permit-map inspect . --no-global --format markdown --output permit-map.md
```

Produce JSON for scripts:

```sh
permit-map inspect . --format json
```

Successful reports exit with code `0`. Missing paths, unreadable files, and malformed supported files exit with code `2` and an actionable error.

## Supported policy paths

Permit Map opens these paths automatically:

| Vendor | Layer | Path |
|---|---|---|
| Claude Code | Global | `~/.claude/settings.json` |
| Claude Code | Repo | `<repo>/.claude/settings.json` |
| Claude Code | Worktree | `<repo>/.claude/settings.local.json` |
| Codex | Global | `~/.codex/config.toml`, `~/.codex/rules/*.rules` |
| Codex | Repo | `<repo>/.codex/config.toml`, `<repo>/.codex/rules/*.rules` |
| Codex | Worktree | `<repo>/.codex/config.local.toml`, `<repo>/.codex/rules.local/*.rules` |

The Claude adapter reads `permissions.allow`, `permissions.ask`, and `permissions.deny`. The Codex adapter reads `sandbox_mode`, `approval_policy`, and `prefix_rule` entries with allow, prompt, or forbidden decisions.

## Resolution rules

Permit Map uses a small, explicit cross-vendor model:

1. An exact matcher in a worktree shadows the same matcher in repo and global layers.
2. An exact repo matcher shadows the same global matcher.
3. At one layer, deny wins over ask and allow.
4. Different vendors never shadow one another.

Pattern overlap remains visible but unresolved. Vendor match languages can assign different meanings to broad and narrow patterns. Every report includes this limitation instead of guessing.

Codex sandbox and approval settings are controls rather than command matchers. Permit Map compares those controls by name across layers and shows the selected value.

## Develop and verify

Requirements: Rust 1.85 or later, Node 22 or later, and Chromium for Playwright 1.58.2.

```sh
npm install
npm test
npm run build
```

`npm test` runs Rust tests, builds the site, checks every product claim, tests keyboard paths at desktop and 390 px, and runs axe checks. `npm run build` creates the release binary under `target/release/permit-map` and the static site under `dist/site/`.

Run the site locally:

```sh
npm run dev:site
```

The deploy target is `dist/site`. Its `index.html` is at the root. The site has no runtime third-party scripts, fonts, analytics, or API calls.

## Package without publishing

```sh
cargo package
```

## Project records

- [.factory/brief.json](.factory/brief.json) — researched job and scope
- [.factory/design.md](.factory/design.md) — visual system and asset provenance
- [.factory/claims.json](.factory/claims.json) — claims and their sandbox tests
- [.factory/handoff.md](.factory/handoff.md) — verification record and known gaps
- [CHANGELOG.md](CHANGELOG.md) — release notes
