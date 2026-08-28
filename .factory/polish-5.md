# Polish round 5 — Permit Map

Repaired candidate `34c81adb6ddd8207e4fcdfbf27084d7e556b496f` from review `c2e065bf1193d1b6b57ca25369ed2e4e80fac3f8`. The product repair is `af8cd1da4aceaf7cdd4daaf3f729557237217d78`. This record rechecked every finding in reviews 1–5 and all earlier polish records.

## Finding map

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Retained the direct `?demo=1` sample map, persistent banner, 4 / 9 / 1 summary, and three complete rules above the 390 × 844 fold. | `@claim:demo-entry`; [reset-state phone screenshot](evidence/polish-5-live/demo/reset-midpoint-mobile.png); live [demo](https://agent-permission-map.sociobot.in/?demo=1) recheck recorded row bottoms 441.91, 466.13, and 491.34 px. |
| F-1-2 | Retained the short README sentence that names Codex layers separately from precedence. | `reviewed README sentences use the approved short wording`; screenshot N/A (CLI documentation); clean source at [README.md](../README.md). |
| F-1-3 | Retained separate short README sentences for unknown trust, unaffected scopes, and accepted values. | `reviewed README sentences use the approved short wording`; screenshot N/A (CLI documentation); clean source at [README.md](../README.md). |
| F-1-4 | Retained the two short README sentences that describe the test suite. | `reviewed README sentences use the approved short wording`; screenshot N/A (CLI documentation); clean source at [README.md](../README.md). |
| F-1-5 | Retained the first-screen **Try it with sample data** action and its isolated-browser helper. | `@claim:demo-entry`; [home phone screenshot](evidence/polish-5-live/home/screenshot-mobile.png); live home click reached [the canonical demo](https://agent-permission-map.sociobot.in/?demo=1). |
| F-1-6 | Retained sample-scoped result copy and field-for-field decision, status, matcher, and source checks. | `@claim:demo-rule-provenance`; [demo desktop screenshot](evidence/polish-5-live/demo/screenshot-desktop.png); live [demo](https://agent-permission-map.sociobot.in/?demo=1) passed the recheck. |
| F-1-7 | Retained the whole-route no-third-party privacy test. | `@claim:site-no-third-parties`; screenshot N/A (network/storage assertion); live [recheck](evidence/polish-5-live/live-recheck.json) recorded only the product origin and empty storage. |
| F-2-1 | Retained **View install command** and its destination focus transfer. | `keyboard install action moves focus to the install destination`; [demo phone screenshot](evidence/polish-5-live/demo/screenshot-mobile.png); live [demo](https://agent-permission-map.sociobot.in/demo) passed route and keyboard checks. |
| F-2-2 | Retained the successful-inspection exit-code claim and test. | `@claim:success-exit`; screenshot N/A (CLI process result); clean-clone CLI report exited 0. |
| F-2-3 | Retained the present-tense Terms instruction. | `terms uses a present-tense change instruction`; [terms phone screenshot](evidence/polish-5-live/terms/screenshot-mobile.png); live [terms](https://agent-permission-map.sociobot.in/terms) passed cold verification. |
| F-3-1 | Retained actionable exit-2 errors for missing, unreadable, and malformed policies. | `@claim:cli-errors`; screenshot N/A (CLI process result); clean-clone claim run passed every input class. |
| F-4-1 | Retained plain-language headings and removed decorative route labels without changing the art-deco transit-poster identity. | `reviewed README sentences use the approved short wording` and [.factory/copy-audit.md](copy-audit.md); [home phone screenshot](evidence/polish-5-live/home/screenshot-mobile.png); live [home](https://agent-permission-map.sociobot.in/) passed cold verification. |
| F-4-2 | Retained syscall-level evidence that the inspector opens known policy files and not repository or credential decoys. | `@claim:policy-files`; screenshot N/A (LD_PRELOAD `open`/`openat` trace); clean-clone claim run passed. |
| F-4-3 | Retained registered secret-storage and report-limitation contracts. | `@claim:no-secret-storage` and `@claim:report-limitations`; screenshot N/A (CLI report assertion); clean-clone claim run passed. |
| F-5-1 | Replaced the 0.58 table-opacity reset pulse with an opaque teal signal outline on both demo tables. Added an active-midpoint 390 px test that runs axe and asserts all visible text treatments are at least 4.5:1. | `Reset demo keeps every visible phone table text treatment at 4.5:1 during feedback`; [reset midpoint screenshot](evidence/polish-5-live/demo/reset-midpoint-mobile.png); live [recheck](evidence/polish-5-live/live-recheck.json) reports six opacity values of `1` and zero reset color-contrast violations. |
| F-5-2 | Expanded `demo-isolated` to cover caller-directory reads, then traced the real binary from a caller directory containing policy and secret-shaped decoys. Updated README, demo documentation, CLI stderr, and Rust tests to state the precise contract. | `@claim:demo-isolated`; screenshot N/A (LD_PRELOAD `open`/`openat` trace); clean-clone claim run found no caller path opened. |

## Verification and live re-check

- Fresh remote clone: `/tmp/permit-map-polish5-af8cd1d` at `af8cd1da4aceaf7cdd4daaf3f729557237217d78` after `npm ci`.
- Clean-clone `npm test` passed: 6 Rust unit tests, 8 Rust integration tests, and 88 Playwright tests across desktop and 390 px mobile.
- Ran every literal command in [.factory/claims.json](claims.json) separately from that clone. All 22 commands passed; each ran its desktop and mobile project. The exact transcript is `/tmp/permit-map-polish5-af8cd1d/clean-claims.log`.
- Clean-clone checks passed: `npm run typecheck`, `npm run lint`, `cargo fmt --all -- --check`, `cargo clippy --all-targets --all-features -- -D warnings`, `npm audit --audit-level=high`, `npm run build`, and `cargo package --locked`. The package contained 20 files, 104.7 KiB uncompressed and 27.8 KiB compressed.
- Deployment `401fe479-1c36-47a6-8f7e-811e00d3979c` completed through `deploy-static.sh agent-permission-map dist/site`.
- Cold production verifier checks passed for [home](evidence/polish-5-live/home/verify.json), [demo](evidence/polish-5-live/demo/verify.json), [privacy](evidence/polish-5-live/privacy/verify.json), and [terms](evidence/polish-5-live/terms/verify.json): correct title, `lang=en`, exactly one H1, one main landmark, no missing alt text or unlabeled buttons, and no console errors.
- The production recheck in [live-recheck.json](evidence/polish-5-live/live-recheck.json) confirmed one-click demo entry, three phone-visible rules, offline Reset demo, no serious/critical axe issue on every public route, no reset contrast issue, same-origin-only requests, no cookies or browser storage, and the designed HTTP 404 at [the missing route](https://agent-permission-map.sociobot.in/not-a-real-page).
- Production mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 839 ms, CLS 0, TBT 13.5 ms. Full result: [lighthouse-mobile.json](evidence/polish-5-live/lighthouse-mobile.json).

No finding from review rounds 1–5 remains open.
