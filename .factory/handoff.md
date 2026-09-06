# Permit Map — review 7 handoff

## Delivered

Completed the seven-day independent re-review without changing product code. The full evidence is in `.factory/review-7.md`. Verdict: **PASS** with zero findings and zero untested claims.

Implementation reviewed: `af8cd1da4aceaf7cdd4daaf3f729557237217d78`.
Documentation reviewed before this report: `221a7628ec9b044c64bc3903d4f7d6aa3b7fcf77`.

## Verification

- Fresh live desktop and 390 × 844 phone contexts confirmed the job, audience, first action, populated one-click sample, persistent demo banner, Reset demo, isolation, keyboard navigation, reduced motion, privacy, route metadata, legal pages, and designed HTTP-404 recovery.
- Live built artifacts matched the local candidate byte-for-byte for checked HTML, JS, CSS, images, recording, robots file, and sitemap.
- Live axe scans had zero violations on all public routes at both sizes. Normal loads had no console or page error. The deliberate unknown URL produced the expected HTTP-404 network entry only.
- Clean checkout `/tmp/permit-map-review7.R6JEY0/repo`: `npm ci`, `npm test` (6 unit, 8 integration, 88 browser tests), `npm run typecheck`, `npm run lint`, `npm run build`, `cargo fmt --check`, `cargo clippy --all-targets --all-features -- -D warnings`, and `cargo package --locked` passed.
- Every one of the 22 literal claim commands in `.factory/claims.json` passed separately after prerequisite installation.
- A clean-prefix `cargo install --path . --root ... --locked` consumer install passed `--help`, sample JSON output, and an invalid-path recovery check.

## How to run

```sh
npm ci
npm test
npm run typecheck
npm run build
cargo package --locked
```

Use `cargo run -- demo --format json` for the isolated bundled sample. The landing demo is `https://agent-permission-map.sociobot.in/?demo=1`.

## Known gaps

None. The external Param Factory footer target was not fetched in this review because the work-order scope prohibits connecting to another product; its external-link label is present.

## Next step

Commit and push the review-7 records. No product implementation change is required.
