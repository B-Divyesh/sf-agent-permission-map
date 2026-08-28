# Polish round 2 — Permit Map

Base reviewed: `374410249ae55dcb7b0e85db47fc1f9c40f01cdc`. This round rechecked every finding in `.factory/review-1.md`, `.factory/polish-1.md`, and `.factory/review-2.md`.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Kept the canonical isolated `/?demo=1` entry and compact phone table. Its banner, 4/9/1 summary, and three complete sample rows remain above the 390 × 844 fold. | `@claim:demo-entry`; `390px layout stays inside the viewport`; [.factory/evidence/polish-2-local/demo-mobile.png](evidence/polish-2-local/demo-mobile.png). |
| F-1-2 | Kept the short two-sentence Codex controls explanation in README. | `reviewed README sentences use the approved short wording`; `.factory/copy-audit.md`. |
| F-1-3 | Kept the short trust-context wording and separate accepted-values sentence in README. | `reviewed README sentences use the approved short wording`; `.factory/copy-audit.md`. |
| F-1-4 | Kept the verification description split into two short sentences. | `reviewed README sentences use the approved short wording`; `.factory/copy-audit.md`. |
| F-1-5 | Kept the one-click CTA wording scoped to an isolated sample map. | `@claim:demo-entry`; `navigation uses real URLs and restores focus`. |
| F-1-6 | Kept preview copy scoped to the sample and retained field-for-field decision, status, matcher, and source checks against CLI JSON. | `@claim:demo-rule-provenance`; `@claim:demo-resolves`. |
| F-1-7 | Kept the site-wide no-third-party claim registered and tested on every public route, including storage and service-worker checks. | `@claim:site-no-third-parties`; `@claim:browser-privacy`. |
| F-2-1 | Renamed the demo exit action to **View install command**. It still routes to `/#install` and moves keyboard focus to the install heading. | `keyboard install action moves focus to the install destination`; `View install command exposes a complete source install command`; [.factory/evidence/polish-2-local/demo-mobile.png](evidence/polish-2-local/demo-mobile.png). |
| F-2-2 | Added the `success-exit` claim and its sole tagged test. The test runs a real successful inspection, asserts process status 0, and parses the JSON report. | `npm test -- --grep @claim:success-exit`; `every registered claim has exactly one matching tagged test`. |
| F-2-3 | Replaced the future promise with the present-tense instruction: “Check this page and the project changelog for changes.” | `terms uses a present-tense change instruction`; [.factory/evidence/polish-2-local/terms-mobile.png](evidence/polish-2-local/terms-mobile.png). |

## Verification evidence

- Clean clone: `/tmp/permit-map-polish2.iNS4Bx/repo` at repair commit `c7ba2df`.
- Every literal command in all 20 `.factory/claims.json` entries passed independently.
- `npm test`: 82 Playwright runs, 6 Rust unit tests, and 8 CLI integration tests passed.
- `npm run typecheck`, `npm run lint`, `cargo fmt --all -- --check`, `cargo clippy --all-targets --all-features -- -D warnings`, and `npm audit --audit-level=high` passed.
- `npm run build` emitted `dist/site/` plus the release CLI. Site output is 5.25 KB JS gzip and 4.19 KB CSS gzip.
- `cargo package --locked` packaged and verified the crate.
- Standalone axe CLI 4.10.3 found 0 violations on the canonical demo. Route-by-route Playwright axe checks found no serious or critical findings at desktop and 390 px.
- Local Lighthouse mobile: performance 100, accessibility 100, best practices 100, SEO 100, LCP 1.805 s, CLS 0, TBT 2 ms. Desktop scored 100 in all four categories.
- `@claim:browser-privacy`, `@claim:site-no-third-parties`, and the offline demo-reset test cover privacy and offline behaviour.

## Live deployment evidence

- Deployed `dist/site/` with `/opt/fleet/lib/deploy-static.sh agent-permission-map dist/site`; Azure deployment ID `c4e52e8f-05c6-4406-b989-009b7bfb8aa4` succeeded.
- Cold `verify-url.sh` runs passed for [home](https://agent-permission-map.sociobot.in/), [the canonical demo](https://agent-permission-map.sociobot.in/?demo=1), and [terms](https://agent-permission-map.sociobot.in/). Titles, language, one h1, main, image alternatives, labels, and normal-route console checks were clean. Evidence is under `.factory/evidence/polish-2-live/`.
- A fresh 390 × 844 live browser clicked the home CTA and found the persistent banner, 4/9/1 summary, and three complete sample rows above the fold. **View install command** moved focus to the install heading. Reset worked after the context went offline. Screenshot: [.factory/evidence/polish-2-live/demo-cold-mobile.png](evidence/polish-2-live/demo-cold-mobile.png).
- Live `/demo`, `/privacy`, `/terms`, and `/404` returned 200 with route titles, canonical metadata, one h1, one main, footer legal links, and zero serious or critical axe findings. `/missing-route-polish-2` returned HTTP 404 with the designed page and the same structural checks.
- The live terms page contains the new instruction and no future-change promise.
- The complete live crawl made only same-origin requests and ended with no cookies, local/session storage, IndexedDB, Cache Storage, or service worker. Normal routes produced no console errors; Chromium logged only the expected failed-document entry for the intentional HTTP 404 request.
- Standalone axe CLI 4.10.3 found 0 violations on the live canonical demo.
- Live mobile Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100, LCP 0.847 s, CLS 0, TBT 24 ms. Report: `.factory/evidence/polish-2-live/lighthouse-mobile.json`.

No finding from review rounds 1 or 2 remains open.
