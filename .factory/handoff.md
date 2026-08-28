# Permit Map review 4 handoff

**Verdict: FAIL.** Product code was not changed.

## What was done

- Performed fresh live first-read checks at 390 × 844 and desktop.
- Entered the one-click browser demo, reset it, checked its first viewport, request origins, and preservation of pre-seeded real browser values.
- Ran the CLI demo from a temporary caller directory.
- Read the brief, design, claims, every prior review/polish/verification/handoff record, source, README, and route configuration.
- Created a clean clone at `/tmp/permit-map-review4`; ran `npm ci` and every exact `claims.json` test command. The final Playwright status was passed.
- Ran local `npm test`, `npm run typecheck`, and `npm run build` successfully.

## Findings left

- **F-4-1 (minor):** decorative landing labels violate the plain-words rule.
- **F-4-2 (blocking):** `policy-files` does not observe file access, so it cannot prove the first-screen privacy claim that only known policy files are read.
- **F-4-3 (minor):** README contains three unlisted secret-storage/report-limitation promises.

See [review-4.md](review-4.md) for exact quotes, evidence, and concrete repairs.

## How to verify after repair

```sh
npm ci
npm test
npm run typecheck
npm run build
```

Then run every exact `test` command in `.factory/claims.json` from a clean clone. The repair must include a file-open-event assertion for `policy-files`; output content alone is not sufficient proof.

## Known gaps and next steps

Do not claim a pass until F-4-1 through F-4-3 are repaired and this entire adversarial checklist is re-run.
