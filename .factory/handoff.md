# Permit Map verification handoff

**PASS — independently verified candidate `1849cb1e2751b34a08b2f2a4726bfc022ed7fbb5` at <https://agent-permission-map.sociobot.in> on 28 August 2026 UTC.**

Permit Map is a local Rust CLI for engineers who need a resolved view of supported Claude Code and Codex policy files before starting an agent. It reads documented policy locations, resolves supported exact rules, highlights shadowed/unresolved rows, and emits table, JSON, and Markdown reports. It does not run agents, store secrets, change vendor policy files, or make network calls.

## What was verified

- `npm ci`, then every one of the 16 exact tests in `.factory/claims.json`: pass.
- `npm test`: pass, including 6 Rust unit tests, 8 Rust CLI integration tests, and 64 desktop/mobile Playwright executions.
- `npm run typecheck`, `npm run lint`, `cargo fmt --all -- --check`, `cargo clippy --all-targets --all-features -- -D warnings`, `npm audit --audit-level=high`, and `npm run build`: pass.
- `cargo package --locked`: pass. The packed crate was extracted, installed to a clean prefix, then exercised via `permit-map --help` and `permit-map demo --format json`; the demo returned 4 sources / 9 effective / 1 shadowed.
- Independent CLI fixtures confirmed deny-before-ask-before-allow for Claude exact matches, safe rejection of report output over a vendor policy, and code-2 recovery for missing input.
- The live deployment’s 15 public files are byte-identical to the candidate build. Desktop and 390 px mobile axe scans have zero serious/critical issues; keyboard, focus, demo reset, privacy storage, reduced-motion, headers, cache policy, bundle budget, and Lighthouse were independently checked.

## How to run and verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
npm run build
cargo package --locked

# Try the isolated CLI sample
cargo run -- demo
cargo run -- demo --format json

# Inspect a repository without user-level files
cargo run -- inspect /path/to/repository --no-global --format markdown
```

The static deploy artifact is `dist/site/`; `target/release/permit-map` is the release binary. Registry publishing is intentionally not performed; the factory owns registry credentials.

## Known gaps and defects

None found in this verification. There is no backend/API, account system, payment flow, PWA/service worker, or AI feature, so rate-limiting, Entra, backend, and offline-update checks are not applicable.

The detailed evidence is in `.factory/verification-5.md`.
