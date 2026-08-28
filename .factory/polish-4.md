# Polish round 4 — Permit Map

Repaired the candidate `105c221c962b0d38029f050979bb3a822bc80e54` using every finding in reviews 1–4 and all earlier polish records. The product repair is `ece44519b9de092a825b7197443fe86fd5ebeccd`; the lean, verified package revision deployed to production is `1bdb4ae8012782b26cf95af2163f2088f35f6289`.

## Finding map

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Kept the mobile-first demo repair: `?demo=1` opens directly into the seeded 4 / 9 / 1 map with three complete source rows and its persistent demo banner. | `@claim:demo-entry`; live cold screenshot [demo-cold-mobile.png](evidence/polish-4-live/demo-cold-mobile.png); `https://agent-permission-map.sociobot.in/?demo=1` |
| F-1-2 | Kept the repaired short README wording for the first reviewed sentence. | `site-tests/site.spec.ts` — `reviewed README sentences use the approved short wording`; clean-clone `npm test` |
| F-1-3 | Kept the repaired short README wording for the second reviewed sentence. | `site-tests/site.spec.ts` — `reviewed README sentences use the approved short wording`; clean-clone `npm test` |
| F-1-4 | Kept the repaired short README wording for the third reviewed sentence. | `site-tests/site.spec.ts` — `reviewed README sentences use the approved short wording`; clean-clone `npm test` |
| F-1-5 | Kept the explicit sample-only CTA and direct canonical demo entry. | `@claim:demo-entry`; live `/?demo=1` title is `Demo — Permit Map` |
| F-1-6 | Kept source, decision, matcher, and status visible for every sample rule. | `@claim:demo-rule-provenance`; [demo-cold-mobile.png](evidence/polish-4-live/demo-cold-mobile.png) |
| F-1-7 | Kept the no-runtime-third-party implementation and its whole-route privacy test. | `@claim:site-no-third-parties`; cold live request log contained only `https://agent-permission-map.sociobot.in` |
| F-2-1 | Kept **View install command** as the demo exit action; it now moves focus to the complete install heading. | `site-tests/site.spec.ts` — `View install command exposes a complete source install command`; live cold check recorded `install-title` focus |
| F-2-2 | Kept the successful inspection exit-code contract. | `@claim:success-exit` |
| F-2-3 | Kept the present-tense Terms change instruction. | `site-tests/site.spec.ts` — `terms uses a present-tense change instruction`; `https://agent-permission-map.sociobot.in/terms` |
| F-3-1 | Kept actionable missing, unreadable, and malformed policy failures with exit code 2. | `@claim:cli-errors` |
| F-4-1 | Deleted all five decorative transit/numbered eyebrow labels. Rewrote the first H1, legal H1s, footer line, and 404 copy in plain words while retaining the art-deco transit visual system. | `.factory/copy-audit.md`; [home-cold-mobile.png](evidence/polish-4-live/home-cold-mobile.png); `https://agent-permission-map.sociobot.in/` |
| F-4-2 | Replaced output-only privacy proof with an OS-level `LD_PRELOAD` open/openat trace. It proves known policy files are opened and `.env`, unrelated JSON, source credential decoys, AWS credentials, and undocumented `config.local.toml` are never opened. | `@claim:policy-files`; `site-tests/open-trace.c`; clean-clone claim run |
| F-4-3 | Registered and tested the secret-storage promise, then made every table, JSON, and Markdown report state the unsupported CLI-context limitation, including empty reports. | `@claim:no-secret-storage`; `@claim:report-limitations`; clean-clone claim run |

## Verification and live re-check

- Fresh remote clone: `/tmp/permit-map-polish4-final.Yvxfy4/repo` at `1bdb4ae8012782b26cf95af2163f2088f35f6289`.
- Ran all 22 literal commands listed in `.factory/claims.json` individually. Every command passed in desktop Chromium and the 390 px mobile project (`ALL_REGISTERED_CLAIMS_PASSED`).
- Full clean-clone suite passed: `npm test` (6 Rust unit, 8 Rust integration, 86 Playwright tests), `npm run typecheck`, `npm run lint`, `cargo fmt --all -- --check`, `cargo clippy --all-targets --all-features -- -D warnings`, `npm audit --audit-level=high`, `npm run build`, and `cargo package --locked --allow-dirty` (`FINAL_CLEAN_FULL_SUITE_PASSED`). A second bare clone passed `cargo package --locked`: 20 files, 103.6 KiB (27.4 KiB compressed).
- Deployment `48bbc700-5d05-43d4-b37c-abe45c9032f0` completed successfully. Cold live verifier checks passed for [home](evidence/polish-4-live/home/verify.json), [demo](evidence/polish-4-live/demo/verify.json), [privacy](evidence/polish-4-live/privacy/verify.json), and [terms](evidence/polish-4-live/terms/verify.json): a title, `lang=en`, exactly one H1, one main landmark, no missing alt text or unlabeled buttons, and no console errors.
- Live unknown route returned HTTP 404 and rendered the designed recovery page: [desktop screenshot](evidence/polish-4-live/not-found/desktop.png), `https://agent-permission-map.sociobot.in/not-a-real-page`.
- Live axe check found zero violations on `/`, `/?demo=1`, `/privacy`, `/terms`, and `/not-a-real-page`. Mobile Lighthouse on production: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.53 s, CLS 0, TBT 36 ms. Full result: [lighthouse-mobile.json](evidence/polish-4-live/lighthouse-mobile.json).

No review finding remains open.
