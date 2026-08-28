# Permit Map — round 4 handoff

## Delivered

Permit Map is a local Rust CLI with a static, art-deco transit-map documentation site. This repair closes every finding from reviews 1–4 against release candidate `105c221c962b0d38029f050979bb3a822bc80e54`.

Product repairs: `ece44519b9de092a825b7197443fe86fd5ebeccd`.
Packaged/deployed source: `1bdb4ae8012782b26cf95af2163f2088f35f6289`.
Production deployment: `48bbc700-5d05-43d4-b37c-abe45c9032f0`.
Live URL: https://agent-permission-map.sociobot.in

The round-4 changes delete decorative copy, make the first screen name the job plainly, preserve the one-click isolated `?demo=1` path, and repair the missing privacy proofs. `policy-files` now observes real `open`/`openat` calls through the checked-in Linux tracing fixture instead of inferring behavior from report content. New claim coverage proves no secret-shaped decoy is stored and that limitation text appears in table, JSON, and Markdown reports, including empty reports. The cargo package manifest excludes npm artifacts and ships 20 essential files.

## Run and verify

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

Run each exact command in `.factory/claims.json` from a fresh clone. The demo URL is `https://agent-permission-map.sociobot.in/?demo=1`; **Reset demo** restores its bundled in-memory sample, and **View install command** leaves demo and focuses the install heading. See `.factory/demo.md` for the sandbox contract.

## Exact verification evidence

- Fresh remote clone: `/tmp/permit-map-polish4-final.Yvxfy4/repo`, checked out at `1bdb4ae8012782b26cf95af2163f2088f35f6289`.
- `npm ci` installed 24 packages with zero vulnerabilities.
- All 22 exact claim commands were run separately and passed in desktop Chromium and 390 px mobile (`ALL_REGISTERED_CLAIMS_PASSED`): `demo-resolves`, `demo-entry`, `demo-rule-provenance`, `report-formats`, `success-exit`, `policy-files`, `no-secret-storage`, `no-account`, `mit-license`, `browser-privacy`, `site-no-third-parties`, `cli-local`, `resolution-order`, `codex-context`, `codex-rules`, `vendor-policy-safe`, `vendor-settings-unchanged`, `cli-errors`, `vendor-boundaries`, `report-limitations`, `touch-targets`, and `demo-isolated`.
- Full clean suite passed (`FINAL_CLEAN_FULL_SUITE_PASSED`): 6 Rust unit tests, 8 Rust integration tests, 86 Playwright tests; `npm run typecheck`; `npm run lint`; `cargo fmt --all -- --check`; `cargo clippy --all-targets --all-features -- -D warnings`; `npm audit --audit-level=high`; and `npm run build`.
- Build output: `dist/site/`; JavaScript 15.05 kB / 5.12 kB gzip, CSS 14.40 kB / 4.19 kB gzip. A fresh bare clone also passed `cargo package --locked`: 20 files, 103.6 KiB (27.4 KiB compressed).
- Deployed with `/opt/fleet/lib/deploy-static.sh agent-permission-map dist/site`; deployment ID `48bbc700-5d05-43d4-b37c-abe45c9032f0` succeeded.
- Cold live checks passed for `/`, `/?demo=1`, `/privacy`, and `/terms`; evidence is in `.factory/evidence/polish-4-live/*/verify.json`. They report the correct route title, `lang=en`, one H1, one main landmark, no missing image alt text, no unlabeled button, and zero console errors.
- A fresh 390 × 844 live context showed the complete first-screen CTA and facts ([home screenshot](evidence/polish-4-live/home-cold-mobile.png)); the direct demo showed its banner, 4 / 9 / 1 summary, and three complete source rows ([demo screenshot](evidence/polish-4-live/demo-cold-mobile.png)). Reset updates the polite status; **View install command** focuses `#install-title`; all requests stayed same-origin.
- `https://agent-permission-map.sociobot.in/not-a-real-page` returned HTTP 404 with the designed recovery page ([screenshot](evidence/polish-4-live/not-found/desktop.png)).
- Live axe: zero violations on `/`, `/?demo=1`, `/privacy`, `/terms`, and the unknown route. Live response headers include a self-only CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy, and permissions policy.
- Production mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.53 s, CLS 0, TBT 36 ms. Raw result: `.factory/evidence/polish-4-live/lighthouse-mobile.json`.

## Known gaps / next steps

None. The site and CLI retain their local-only scope; do not add telemetry, hosted AI, or third-party runtime assets.
