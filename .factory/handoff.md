# Permit Map polish round 3 handoff

**Verdict: PASS — zero findings remain.**

## What changed

- Closed F-3-1 with the stronger behavior instead of narrowing the README promise.
- Added actionable recovery guidance for unreadable policies and malformed Claude JSON, Codex TOML, and Codex rules.
- Expanded `cli-errors` so its claim, sandbox, and tagged test match the documented behavior exactly.
- The unreadable-file test copies the real binary into an isolated temporary repository, runs it as UID/GID 65534 against a mode-`000` policy, and asserts exit `2`, `Permission denied`, and the recovery step.
- Rechecked every F-1-* and F-2-* fix. First-screen wording, `/?demo=1`, reset/isolation, claims, routing, titles, metadata, focus, 404, legal links, mobile layout, and the transit-poster identity remain correct.
- Updated the catalog description to “Resolve coding-agent permissions before an agent runs.”
- Recorded the complete finding map in [.factory/polish-3.md](polish-3.md).

## How to verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
npm audit --audit-level=high
npm run build
cargo package --locked
```

Run each exact command listed in [.factory/claims.json](claims.json). The canonical browser sample is <https://agent-permission-map.sociobot.in/?demo=1>; the CLI sample is `cargo run -- demo --format json`.

## Exact verification record

- Functional repair commit: `e27805b`; pushed to `origin/main`.
- Clean clone: `/tmp/permit-map-polish3.TATxkL/repo`.
- All 20 claim commands passed independently.
- Full suite: 82 Playwright runs, 6 Rust unit tests, and 8 Rust integration tests passed.
- Typecheck, lint, Rust formatting, Clippy with warnings denied, high-severity npm audit, release build, and locked Cargo package verification passed.
- Build: 15.40 KB JavaScript / 5.25 KB gzip; 14.40 KB CSS / 4.19 KB gzip. Outputs are `dist/site/` and `target/release/permit-map`.
- Local standalone axe: 0 violations. Local mobile Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 0.942 s, CLS 0, TBT 27 ms.
- Azure Static Web Apps deployment `c3244741-f00c-4c7d-9ae1-d2abdf14a386` succeeded.
- Cold live checks passed for `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, `/404`, and a new missing route. The missing route returned HTTP 404.
- Live demo at 390 × 844 showed the persistent banner, 4/9/1 summary, and three complete sample rows ending at 514 px. Reset worked offline and preserved pre-seeded real storage.
- Live requests stayed same-origin. A clean context had no cookies, local/session storage, IndexedDB, Cache Storage, or service worker.
- Live standalone axe: 0 violations. Live mobile Lighthouse: 100/100/100/100; LCP 0.829 s, CLS 0, TBT 17.5 ms.
- Primary evidence: [cold live demo](evidence/polish-3-live/demo-cold-mobile.png), [cold browser assertions](evidence/polish-3-live/cold-check.json), [CLI error processes](evidence/polish-3-local/cli-errors.json), [live axe](evidence/polish-3-live/axe-demo.txt), and [live Lighthouse](evidence/polish-3-live/lighthouse-mobile.json).

## Known gaps and next steps

None. The crate remains ready for the factory-owned publication process; it was not published from this worker.
