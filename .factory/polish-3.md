# Polish round 3 — Permit Map

Base candidate: `7e39808efd94e6f857e8570badd18ecf4e9a3c34`. Review report: `8eee7f50bbf53d9a2e2fa71ada5cb8406cb88ff9`. Functional repair: `e27805b`.

Every finding from review rounds 1–3 was rechecked. Earlier fixes remain in place; round 3 closes the only open finding, F-3-1.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Retained the one-click `/?demo=1` path and compact phone demo. The sticky banner, 4/9/1 summary, and three real decision/matcher/source rows fit above the fold. | `@claim:demo-entry`; `landing action opens the isolated sample with real rows in the phone viewport`; [cold live phone screenshot](evidence/polish-3-live/demo-cold-mobile.png); live `/?demo=1` rows end at 465, 489, and 514 px in [cold-check.json](evidence/polish-3-live/cold-check.json). |
| F-1-2 | Retained the split Codex-controls wording: supported layers are one sentence and nearest-file precedence is another. | `reviewed README sentences use the approved short wording`; clean-clone `npm test`; README source check. |
| F-1-3 | Retained separate short sentences for unknown trust, unaffected scopes, and accepted values. | `reviewed README sentences use the approved short wording`; clean-clone `npm test`; README source check. |
| F-1-4 | Retained the two-sentence test description in README. | `reviewed README sentences use the approved short wording`; clean-clone `npm test`; [.factory/copy-audit.md](copy-audit.md). |
| F-1-5 | Retained the first-screen **Try it with sample data** action and helper that names the isolated browser sample. | `@claim:demo-entry`; [cold live phone screenshot](evidence/polish-3-live/demo-cold-mobile.png); live CTA opened `https://agent-permission-map.sociobot.in/?demo=1` in one click. |
| F-1-6 | Retained sample-scoped copy and the field-for-field browser/CLI provenance claim. | `@claim:demo-rule-provenance`; browser rows matched `permit-map demo --format json`; live `/?demo=1` has ten decision/status/matcher/source rows. |
| F-1-7 | Retained the site-wide no-third-party claim and route crawl. | `@claim:site-no-third-parties`; live `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and `/404` requested only the product origin and created no persistence in [cold-check.json](evidence/polish-3-live/cold-check.json). |
| F-2-1 | Retained **View install command** and its focus transfer to the install heading. | `keyboard install action moves focus to the install destination`; `View install command exposes a complete source install command`; live focus assertion in [cold-check.json](evidence/polish-3-live/cold-check.json); [phone screenshot](evidence/polish-3-live/demo-cold-mobile.png). |
| F-2-2 | Retained `success-exit` as a registered claim with one tagged test that asserts status `0` and valid report output. | `@claim:success-exit`; `every registered claim has exactly one matching tagged test`; clean-clone literal claim run. |
| F-2-3 | Retained the present-tense terms instruction without a future promise. | `terms uses a present-tense change instruction`; cold live `/terms` URL verifier in [verify.json](evidence/polish-3-live/terms/verify.json). |
| F-3-1 | Kept the stronger README contract. All policy reads now report the operating-system cause and say to check file access. Claude JSON, Codex TOML, and Codex rules parse errors name the syntax to fix and say to rerun Permit Map. The registered `cli-errors` claim now matches the full promise. Its test runs the mode-`000` case as UID/GID 65534 and asserts cause, recovery step, and exit `2`. | `@claim:cli-errors`; `missing, unreadable, and malformed policies exit 2 with recovery steps`; Rust tests `malformed_policy_returns_a_useful_error` and `malformed_codex_rules_return_a_useful_error`; five real process results in [cli-errors.json](evidence/polish-3-local/cli-errors.json). |

## Required acceptance work

- First screen: the six-word job headline, 15-word audience sentence, sample action, helper, and three facts remain visible and are recorded in [.factory/copy-audit.md](copy-audit.md).
- Demo isolation: `/?demo=1` is the primary route. Reset works after the browser goes offline. Pre-seeded `real:*` storage and a sentinel cookie remained unchanged; a clean context retained no cookies, local/session storage, IndexedDB, Cache Storage, or service worker.
- Claims: [.factory/claims.json](claims.json) has 20 unique IDs and exactly one tagged test per ID. Every literal command passed independently from the clean clone.
- Routing and metadata: `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and `/404` returned route-specific titles, descriptions, canonicals, one `h1`, one `main`, legal links, and zero serious/critical axe findings. `/missing-route-polish-3` returned HTTP 404 with the designed recovery page.
- Mobile and keyboard: the 390 × 844 demo shows three complete rows above the fold. Tests cover 200% text, horizontal overflow, touch targets, visible focus, CTA history restoration, reset, and hash-destination focus.
- Identity: the art-deco transit-poster system, paper/ink palette, clipped tickets, rail geometry, and original poster assets were preserved.
- Catalog: [.factory/catalog-description.txt](catalog-description.txt) is now “Resolve coding-agent permissions before an agent runs.” It is verb-first and 54 characters.

## Verification evidence

- Clean clone: `/tmp/permit-map-polish3.TATxkL/repo` at `e27805b`.
- Every literal `test` command in all 20 claim records passed independently.
- Clean-clone `npm test`: 82 Playwright runs, 6 Rust unit tests, and 8 Rust integration tests passed.
- Clean-clone `npm run typecheck`, `npm run lint`, `cargo fmt --all -- --check`, `cargo clippy --all-targets --all-features -- -D warnings`, `npm audit --audit-level=high`, `npm run build`, and `cargo package --locked` passed.
- Build output: 15.40 KB JavaScript / 5.25 KB gzip and 14.40 KB CSS / 4.19 KB gzip. `dist/site/` and `target/release/permit-map` were produced.
- Local factory URL verifier: no console errors on home or demo. Standalone axe-core found 0 violations on `/?demo=1`.
- Local mobile Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 0.942 s, CLS 0, TBT 27 ms.
- Deployment: `/opt/fleet/lib/deploy-static.sh agent-permission-map dist/site`; Azure deployment `c3244741-f00c-4c7d-9ae1-d2abdf14a386` succeeded.
- Live factory URL verifier: home, canonical demo, and terms returned 200 with clean console/accessibility basics.
- Live cold crawl and demo assertions: [cold-check.json](evidence/polish-3-live/cold-check.json), with no failures.
- Live standalone axe-core: [axe-demo.txt](evidence/polish-3-live/axe-demo.txt), 0 violations.
- Live mobile Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 0.829 s, CLS 0, TBT 17.5 ms. Report: [lighthouse-mobile.json](evidence/polish-3-live/lighthouse-mobile.json).

No finding remains open.
