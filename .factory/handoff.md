# Permit Map — polish round 5 handoff

## Delivered

Repaired review candidate `34c81adb6ddd8207e4fcdfbf27084d7e556b496f` in product commit `af8cd1da4aceaf7cdd4daaf3f729557237217d78`.

- Reset demo now signals with an opaque teal outline. It never lowers sample-table text contrast.
- The active-reset test runs at 390 × 844, samples the feedback midpoint, runs axe, and directly measures every visible table treatment at 4.5:1 or better.
- The CLI demo contract now precisely says it does not read caller-directory data or change anything outside its temporary directory.
- `demo-isolated` now proves that contract with an `LD_PRELOAD` `open`/`openat` trace against real policy and secret-shaped caller decoys.
- Updated CLI, README, demo documentation, claims, copy audit, changelog, and catalog description. The catalog line is verb-first, 54 characters, and within the 120-character limit.
- Preserved the art-deco transit-poster visual system, isolated `?demo=1` browser demo, real routing and legal pages, mobile table layout, focus transfer, and designed 404.

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
```

The static deployment directory is `dist/site`. Run the CLI sample with `cargo run -- demo --format json`. Open the browser sample directly at `https://agent-permission-map.sociobot.in/?demo=1`.

## Exact verification evidence

- Fresh remote clone: `/tmp/permit-map-polish5-af8cd1d` at `af8cd1da4aceaf7cdd4daaf3f729557237217d78`.
- `npm ci`, full `npm test`, and every one of the 22 literal `.factory/claims.json` test commands passed there. The full suite covered 6 Rust unit tests, 8 Rust integration tests, and 88 Playwright tests. The literal-claim transcript is `/tmp/permit-map-polish5-af8cd1d/clean-claims.log`; release-check transcript is `/tmp/permit-map-polish5-af8cd1d/clean-release.log`.
- Clean-clone typecheck, lint, format, clippy, high-severity audit, production build, and `cargo package --locked` passed. Package result: 20 files, 104.7 KiB (27.8 KiB compressed).
- Deployment: `401fe479-1c36-47a6-8f7e-811e00d3979c` via `/opt/fleet/lib/deploy-static.sh agent-permission-map dist/site`.
- Cold live verification passed for [home](evidence/polish-5-live/home/verify.json), [demo](evidence/polish-5-live/demo/verify.json), [privacy](evidence/polish-5-live/privacy/verify.json), and [terms](evidence/polish-5-live/terms/verify.json). All report title, language, one H1, main landmark, image/button basics, and no console errors.
- [Live recheck](evidence/polish-5-live/live-recheck.json) proves the live one-click path, three phone-visible rows, active-reset opacity of 1, zero active-reset contrast violations, offline reset, no serious/critical axe violations, no third-party origins or browser persistence, and the designed HTTP 404. The active state is captured in [reset-midpoint-mobile.png](evidence/polish-5-live/demo/reset-midpoint-mobile.png).
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 839 ms, CLS 0, TBT 13.5 ms in [lighthouse-mobile.json](evidence/polish-5-live/lighthouse-mobile.json).

## Known gaps

None.
