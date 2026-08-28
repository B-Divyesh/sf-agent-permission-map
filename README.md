# Permit Map

Resolve coding-agent permissions before an agent runs.

Permit Map is for engineers who use Claude Code or Codex across several repositories. The local CLI finds documented policy files, resolves supported exact matches, marks shadowed or unresolved rules, and writes a reviewable report.

It does not run agents, scan source files, or store secrets. It refuses to write a report over a discovered vendor policy. Permit Map is free software under the [MIT license](LICENSE).

Website: <https://agent-permission-map.sociobot.in>  
One-click sample: <https://agent-permission-map.sociobot.in/?demo=1>

## Try the sandbox

The demo command copies bundled policies into a new temporary directory. It does not read the current repository. A demo `--output` path stays inside that directory.

```sh
cargo run -- demo
cargo run -- demo --format json
cargo run -- demo --format markdown
```

The browser route shows the same four sample files, nine effective rules, and one shadowed rule. It sets no cookies and stores no browser data. See [.factory/demo.md](.factory/demo.md) for the reset and isolation contract.

## Install

Clone the repository, then build the single binary with a current stable Rust toolchain:

```sh
git clone https://github.com/B-Divyesh/sf-agent-permission-map.git
cd sf-agent-permission-map
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
# equivalent scripting shorthand
permit-map inspect . --json
```

Successful reports exit with code `0`. Missing paths, unreadable files, and malformed supported files exit with code `2` and an actionable error. For safety, `--output` creates a new report file and refuses known policy paths and their filesystem aliases.

## Supported policy paths

Permit Map opens these paths automatically:

| Vendor | Layer | Path |
|---|---|---|
| Claude Code | Global | `~/.claude/settings.json` |
| Claude Code | Repo | `<repo>/.claude/settings.json` |
| Claude Code | Worktree | `<repo>/.claude/settings.local.json` |
| Codex | System | `/etc/codex/config.toml` when present |
| Codex | User | `~/.codex/config.toml`, `~/.codex/rules/*.rules` |
| Codex | Profile | `~/.codex/<profile>.config.toml` when passed with `--codex-profile` |
| Codex | Project | Every `.codex/config.toml` and `.codex/rules/*.rules` from the project root to the inspected directory |

The Claude adapter reads `permissions.allow`, `permissions.ask`, and `permissions.deny`. The Codex adapter reads documented multiline `prefix_rule` entries. Those rules accept string prefixes and union lists; an omitted decision defaults to `allow`. It never treats the undocumented `config.local.toml` path as Codex configuration.

## Resolution rules

Permit Map uses vendor-specific, explicit rules:

1. Claude exact matches resolve deny, then ask, then allow across every discovered scope.
2. Codex command rules resolve exact prefixes as forbidden, then prompt, then allow. Codex controls use system, user, profile, and trusted project files. The closest file to the inspected directory wins.
3. Codex project rows stay `unresolved` until you set `--codex-trust`. System, user, profile, and supplied CLI overrides still resolve. Accepted values are `trusted` and `untrusted`.
4. Pass `--codex-profile NAME` and repeat `--codex-config key=value` for context supplied to the Codex invocation.
5. Different vendors never shadow one another.

Pattern overlap remains visible but unresolved. Vendor match languages can assign different meanings to broad and narrow patterns. Every report includes this limitation instead of guessing.

Codex sandbox and approval settings are controls rather than command matchers. Permit Map compares those controls by name across layers and shows the selected value only when the trust context is known. CLI flags the inspector cannot observe remain a report limitation unless you supply them.

## Develop and verify

Requirements: Rust 1.85 or later, Node 22 or later, and Chromium for Playwright 1.58.2.

```sh
npm install
npm test
npm run typecheck
npm run lint
npm run build
```

`npm test` runs Rust and browser tests and checks every product claim. It also checks keyboard paths and axe findings at desktop and 390 px. `npm run build` creates the release binary under `target/release/permit-map` and the static site under `dist/site/`.

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
