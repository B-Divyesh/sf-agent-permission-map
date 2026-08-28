# Permit Map adversarial review 3 handoff

**Verdict: FAIL — one minor finding remains.**

## What was done

- Completed the required cold first-read review on the live site at 390 × 844 and 1366 × 768.
- Audited every landing-page and README sentence, plus headings and action labels.
- Exercised the one-click browser demo, offline Reset, real-storage sentinels, request log, and CLI demo isolation.
- Ran every literal command in all 20 claim entries from a separate clean clone at `7e39808e`.
- Rechecked every finding from review rounds 1 and 2 against live behavior and repository source/tests.
- Crawled live routes and links; checked titles, metadata, 404 behavior, focus/history, shared structure, visual identity, and axe results.
- Wrote `.factory/review-3.md`. No product code was changed.

## Result

F-3-1 remains: README promises exit-2 handling for unreadable files and “an actionable error,” but `cli-errors` registers and tests only missing and malformed inputs. An independent unreadable-file run returned 2, while the unreadable and malformed messages did not consistently provide a next action.

## Verification

Clean clone: `/tmp/permit-map-review3.vLV5EJ/repo`, commit `7e39808efd94e6f857e8570badd18ecf4e9a3c34`.

- All 20 exact claim commands: pass.
- `npm test`: pass — 82 Playwright, 6 Rust unit, and 8 Rust integration tests.
- `npm run typecheck`, `npm run lint`, `npm run build`: pass.
- Live axe at desktop and 390 px on home, canonical demo, `/demo`, `/privacy`, `/terms`, and a missing route: zero violations.
- Live URL verifier on home and canonical demo: pass, no console errors.
- Live crawl: all intended links returned 200; an intentional missing path returned the designed 404.
- Live demo: same-origin requests only; Reset works offline; no demo-created cookies, browser storage, IndexedDB, Cache Storage, or service worker.
- CLI demo: 4 sources, 9 effective, 1 shadowed, 10 rows; caller sentinel unchanged.

## Next step

Resolve F-3-1 by narrowing the README sentence or expanding the registered claim, error copy, and tagged test to cover unreadable files and concrete recovery guidance. Then rerun the full checklist.
