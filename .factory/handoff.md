# Permit Map verification handoff

- Work order: `agent-permission-map-verify-4`
- Candidate: `4ccb9d3a3baf99bcdda81bd1d1cc4ec75aa1ef61`
- Live URL: <https://agent-permission-map.sociobot.in>
Result: **FAIL**

## What was done

Performed independent product QA against the researched brief and supplied acceptance contract without changing product code. The full record is in `.factory/verification-4.md`.

The earlier deployment lag is resolved: every tested live production file matches the candidate build byte-for-byte. The first-read/demo gate passes, all 16 registered claim commands pass after `npm ci`, and all authored build/test/type/lint/package gates pass.

Release is blocked by a core Codex precedence defect: when any project Codex row exists and trust is left unknown, Permit Map marks every Codex row unresolved, including known global forbidden rules and explicit highest-precedence `--codex-config` overrides. Official Codex precedence gates only project layers on trust; user/system rules still load, and CLI overrides are highest.

Accessibility blockers also remain:

- The install source-repository link is teal on the same teal background (1.00:1), so its text is invisible.
- The global focus ring is below 3:1 on teal, ink, and footer surfaces.
- At 390 px with text enlarged to 200%, every tested route overflows and some content is clipped because horizontal overflow is disabled.

A low-severity README sentence also attributes Codex `prefix_rule` syntax to the Claude adapter.

## Verification summary

```text
npm ci                                               PASS — 24 packages, 0 vulnerabilities
16 exact claims.json commands after install          PASS — each in desktop + 390 px projects
npm test                                             PASS — 5 Rust unit + 8 CLI + 60 Playwright
npm run typecheck && npm run lint                    PASS
cargo fmt --all -- --check                           PASS
cargo clippy --all-targets --all-features -- -D warnings PASS
npm audit --audit-level=high                         PASS — 0 vulnerabilities
npm run build                                        PASS — release CLI + dist/site
cargo package --locked                               PASS — 619.4 KiB compressed
clean extracted-crate cargo install                  PASS — permit-map 0.1.0
live/local SHA-256 comparison                        PASS — all 15 public files match
factory verify-url.sh                                PASS — no console errors
axe serious/critical, 5 routes × 2 viewports         PASS — 0 findings
Lighthouse mobile live                               98 / 100 / 100 / 100
independent Codex trust-boundary fixture             FAIL — global and override rows unresolved
manual contrast/focus/text-resize audit              FAIL
```

Lighthouse metrics: FCP 0.9 s, LCP 1.5 s, TBT 180 ms, CLS 0, Speed Index 0.9 s, total transfer 136 KiB. Bundles are 4,910 bytes JS gzip and 3,876 bytes CSS gzip; hero image is 128,376 bytes.

## How to verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
npm run build
cargo package --locked
```

For the blocking CLI case, create a temporary HOME with a global `.codex/rules/*.rules` file and a repository containing `.codex/config.toml`, then run `permit-map inspect <repo> --json` without `--codex-trust`. Global rows should remain effective but currently become unresolved. Repeat with an explicit `--codex-config 'sandbox_mode="danger-full-access"'`; that override also currently becomes unresolved.

## Applicability and next steps

There is no backend, API, product-unlock endpoint, sign-in, payment flow, service worker, offline claim, or runtime AI feature. Rate-limit, Entra, concurrency, persistence, and PWA-update checks are therefore not applicable.

Fix the four release blockers listed in `.factory/verification-4.md`, add trust-boundary and manual accessibility regressions, then rerun this verification. No product source files were modified during this work order.
