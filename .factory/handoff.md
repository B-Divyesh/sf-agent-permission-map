# Permit Map — review 5 handoff

## Delivered

Completed a read-only adversarial review of the live Permit Map site and CLI at repository commit 34c81adb6ddd8207e4fcdfbf27084d7e556b496f. Product code was not changed.

The verdict in .factory/review-5.md is **FAIL** with one blocking finding and one minor finding. The 390 px demo table fades to opacity 0.58 after Reset demo, causing seven transient WCAG text-contrast failures. The CLI also promises that demo mode reads nothing outside its temporary directory, while the registered test verifies writes only. Earlier findings F-1-1 through F-4-3 remain fixed.

## Verification

- Used fresh 390 × 844 and 1440 × 1000 browser contexts on https://agent-permission-map.sociobot.in.
- Verified the one-click demo, real sample rows, Reset, offline reset test, storage isolation, same-origin requests, deep links, Back/focus behavior, metadata, 404 response, headers, and every live link.
- Ran all 22 literal claim commands separately from clean clone /tmp/permit-map-review5.3BOvtn/repo; all passed.
- Ran npm test, npm run typecheck, npm run lint, and npm run build in that clone; all passed. The suite reported 6 Rust unit tests, 8 Rust integration tests, and 86 Playwright tests.
- Ran the CLI demo from a separate temporary caller directory. It returned 4 sources, 9 effective rules, 1 shadowed rule, and left the caller sentinel unchanged. A review-time open/openat trace found no caller-path read, but this proof is not part of the registered test.
- Ran the factory URL verifier and Playwright axe checks. Settled routes passed; freezing the Reset animation at 120 ms reproduced contrast ratios from 2.50:1 to 3.73:1.

## Required next step

Remove the table-wide opacity animation or replace it with opaque feedback that keeps all text at 4.5:1 or higher. Add a 390 px post-Reset contrast test. Register and trace the CLI demo’s caller-read isolation, or narrow that promise. Then repeat the full review.
