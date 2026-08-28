# Permit Map polish round 2 handoff

**PASS — all cumulative findings are closed and the repaired product is live.**

## What changed

- Renamed the demo exit action to **View install command** while preserving real `/#install` routing and heading focus.
- Added the registered `success-exit` claim and its single tagged behavioral test. A successful real inspection must return status 0 and valid JSON.
- Replaced the untestable future terms promise with “Check this page and the project changelog for changes.”
- Rechecked and retained every round-one repair: first-screen wording, isolated `/?demo=1` entry, persistent banner/reset, phone rows above the fold, claim coverage, route titles/metadata/focus, real 404, legal links, privacy, and the art-deco transit identity.
- Updated `.factory/catalog-description.txt` to the 59-character verb-first sentence: “See resolved coding-agent permissions before an agent runs.”
- `.factory/polish-2.md` maps F-1-1 through F-1-7 and F-2-1 through F-2-3 to changes and evidence.

## Verification

Clean clone: `/tmp/permit-map-polish2.iNS4Bx/repo` at code repair `c7ba2df`.

- Every exact command in all 20 `.factory/claims.json` entries passed independently.
- `npm test`: pass — 82 Playwright executions, 6 Rust unit tests, and 8 CLI integration tests.
- `npm run typecheck`, `npm run lint`, `cargo fmt --all -- --check`, `cargo clippy --all-targets --all-features -- -D warnings`, and `npm audit --audit-level=high`: pass.
- `npm run build`: pass; produced `dist/site/` and `target/release/permit-map`.
- `cargo package --locked`: pass; 73 files packaged and the crate verified.
- Initial site payload: 5.25 KB JavaScript gzip and 4.19 KB CSS gzip.
- Standalone axe CLI: 0 violations on local and live canonical demos. Route-level Playwright axe checks: 0 serious or critical findings at desktop and 390 px.
- Local mobile Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.805 s, CLS 0, TBT 2 ms.
- Live mobile Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 0.847 s, CLS 0, TBT 24 ms.
- Privacy/offline checks: same-origin requests only; no cookies, storage, IndexedDB, Cache Storage, or service worker; in-memory demo reset works offline.

## Deployment and cold live check

- Repair commits `c7ba2df` and `3e8af21` were pushed to `origin/main` before deployment.
- `/opt/fleet/lib/deploy-static.sh agent-permission-map dist/site` succeeded with deployment ID `c4e52e8f-05c6-4406-b989-009b7bfb8aa4`.
- Live: <https://agent-permission-map.sociobot.in/>
- Canonical demo: <https://agent-permission-map.sociobot.in/?demo=1>
- Cold checks passed on `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, `/404`, and a missing path. The missing path returns HTTP 404; normal routes return 200.
- `verify-url.sh` artifacts, live screenshots, and Lighthouse JSON are in `.factory/evidence/polish-2-live/`.

## Run and verify

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

# Isolated samples
cargo run -- demo --format json
npm test -- --grep @claim:demo-entry
npm test -- --grep @claim:success-exit
```

Deploy artifact: `dist/site/`. Registry publishing remains factory-owned and was not performed.

## Known gaps

None found. All findings from `.factory/review-1.md` and `.factory/review-2.md` are closed.
