# Permit Map policy inspection review 7

**Verdict: PASS**

Reviewed 6 September 2026 UTC. This was a full independent re-review of the live product and a separate clean checkout. Product code was not changed.

| Record | SHA |
|---|---|
| Implementation reviewed | `af8cd1da4aceaf7cdd4daaf3f729557237217d78` (`fix: prove reset and demo isolation`) |
| Documentation reviewed before this report | `221a7628ec9b044c64bc3903d4f7d6aa3b7fcf77` (`docs: record adversarial review six`) |

The commits after the implementation candidate change factory documentation and review evidence only. A fresh local build from the reviewed checkout matched the live HTML, JS, CSS, checked images, terminal recording, `robots.txt`, and `sitemap.xml` byte-for-byte.

## Job, audience, and first action

Before scrolling, in fresh desktop and 390 × 844 phone contexts, the page states:

- **Job:** “Resolve coding-agent permissions before an agent runs.”
- **Audience:** Engineers using several coding agents across repositories.
- **First action:** **Try it with sample data**. The adjacent explanation says it opens the isolated sample map in the browser.

The landing screen has one visible primary action, three short facts, and plain language. The headline is seven words. No finding was raised for the first screen.

## Demo and normal paths

The one-click action changed the address to `/?demo=1` in both fresh contexts. The populated demo had a persistent **Demo — sample data, nothing is saved** banner, **Reset demo**, **View install command**, a 4-source / 9-effective / 1-shadowed summary, three realistic phone-visible sample rows, and ten rows in the full table. On the phone, the first sample table ended at 492.84 px, inside the 844 px viewport.

Reset restored the supplied status text and did not change cookies, local storage, session storage, IndexedDB, Cache Storage, or service-worker registrations. Requests stayed on `https://agent-permission-map.sociobot.in`. The demo has no real-data namespace or persistence, so entering and resetting it cannot change real data.

Normal, invalid, boundary, and recovery checks passed:

- The installed CLI printed helpful `--help`, completed `demo --format json`, and returned 4 sources, 9 effective rules, and 1 shadowed rule.
- An invalid inspection path returned exit code 2 and a direct recovery step.
- The registered tests cover malformed, unreadable, and missing policy files; hard-link and direct output aliases; vendor-setting immutability; pattern overlap; trust context; and clean demo isolation.
- The product is a static site and local CLI. There is no backend, tenant, rate-limit, health, restart-persistence, account, or API path to test. No offline/update claim is made.

## Claims and clean checkout

A separate checkout at `/tmp/permit-map-review7.R6JEY0/repo` ran `npm ci` successfully (24 packages, no vulnerabilities). `npm test` passed: 6 Rust unit tests, 8 Rust integration tests, and 88 Playwright tests. `npm run typecheck`, `npm run lint`, `npm run build`, `cargo fmt --check`, `cargo clippy --all-targets --all-features -- -D warnings`, and `cargo package --locked` also passed. The package artifact was 28 KiB.

Every literal command declared in `.factory/claims.json` was then run separately after prerequisites were installed. All 22 passed:

`demo-resolves`, `demo-entry`, `demo-rule-provenance`, `report-formats`, `success-exit`, `policy-files`, `no-secret-storage`, `no-account`, `mit-license`, `browser-privacy`, `site-no-third-parties`, `cli-local`, `resolution-order`, `codex-context`, `codex-rules`, `vendor-policy-safe`, `vendor-settings-unchanged`, `cli-errors`, `vendor-boundaries`, `report-limitations`, `touch-targets`, and `demo-isolated`.

Untested claim count: **0**. Failed claim count: **0**. The current landing page, legal pages, and README claims map to this registry or are instructions, metadata, or limitations; no unlisted material claim was found.

## Installed consumer check

From the clean checkout, `cargo install --path . --root /tmp/permit-map-review7-consumer.aOk9rk --locked` installed the single `permit-map` binary. Its help named `inspect` and `demo`; its bundled JSON demo used an OS temporary directory and returned the documented sample counts. A nonexistent inspection path returned code 2 with “Choose a repository directory and try again.” This exercised the installed artifact rather than `cargo run`.

## Live site checks

Fresh Chromium desktop and phone checks covered `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, `/404`, and a deliberately missing route.

- Normal routes have a route-specific title, description, canonical URL, one `h1`, one `main`, and `lang=en`.
- The unknown route returned HTTP 404 and showed the designed recovery page. The intentional document 404 emitted the expected browser network error only; it is not an application failure.
- Axe found zero violations at both sizes on every route. There was no normal-load console or page error and no phone horizontal page overflow.
- Keyboard checks found the skip link first with a 3 px focus outline. Enter on the primary action reached the demo and focused its `h1`. Reduced motion computed to the short no-motion duration.
- The phone and desktop page screenshots are in `/work/.evidence/review-7-phone-home.png`, `/work/.evidence/review-7-phone-demo.png`, `/work/.evidence/review-7-desktop-home.png`, and `/work/.evidence/review-7-desktop-demo.png`.
- The live response sends HTTPS, HSTS, `nosniff`, strict-origin referrer policy, restrictive permissions policy, and a self-only CSP with response-header `frame-ancestors`.
- The static build is small: JS 5.14 KiB gzip and CSS 4.21 KiB gzip. There are no third-party runtime scripts, fonts, analytics, API calls, cookies, browser storage, or service worker.

The linked Param Factory destination was not fetched because the work-order scope prohibits connecting to another product. Its external-link label is present. All Permit Map internal routes and assets exercised here worked.

## Earlier findings

All earlier review, verification, polish, and handoff records were read. No finding is reopened.

| Earlier finding | Current disposition and proof |
|---|---|
| F-1-1 | Fixed. Phone demo shows banner, summary, and three real rows above the fold. |
| F-1-2, F-1-3, F-1-4 | Fixed. README copy audit retains the short separated Codex and test sentences. |
| F-1-5, F-1-6, F-1-7 | Fixed. Demo-entry, demo-rule-provenance, and whole-route privacy claims are registered and passed. |
| F-2-1, F-2-2, F-2-3 | Fixed. The link says **View install command**; `success-exit` passes; Terms uses a present instruction, not a future promise. |
| F-3-1 | Fixed. `cli-errors` separately passed for missing, unreadable, and malformed inputs with status 2 and recovery text. |
| F-4-1 | Fixed. No decorative route labels or metaphor headings remain in the user-facing page copy. |
| F-4-2 | Fixed. `policy-files` uses the checked-in syscall tracer and passed against known paths and decoys. |
| F-4-3 | Fixed. `no-secret-storage` and `report-limitations` are registered and passed. |
| F-5-1 | Fixed. Reset has an outline-only signal; phone reset check and axe pass without reduced table contrast. |
| F-5-2 | Fixed. `demo-isolated` traces caller reads and writes, and passed. |
| Verification 1: Claude precedence, Codex completeness, vendor-policy overwrite | Fixed. `resolution-order`, `codex-context`, `codex-rules`, and `vendor-policy-safe` pass. |
| Verification 1: incomplete claims, touch targets, TypeScript gate, 404, cache, `--json` | Fixed. All 22 claims pass; touch-target test passes; typecheck passes; unknown URL is HTTP 404; hashed assets are immutable; installed `--json` behavior is covered by tests. |
| Verification 2: forbidden rule, parser syntax, hard-link overwrite, demo output isolation, lost focus | Fixed. Codex and safety claim tests pass; reset/demo behavior is isolated; Enter navigation moves focus to the demo heading. |
| Verification 3: below-fold action, justified Codex rule, unusable install command, layer label, safety claim, legal metadata | Fixed. CTA is visible before scrolling; Codex fixture coverage passes; install link works; browser uses project labels; safety claims are listed; legal pages have complete metadata. |
| Verification 4: trust hid global/override rows, source link, focus contrast, 200% text, adapter wording | Fixed. `codex-context` passes; source link is visible; focus and axe checks pass; phone has no overflow; README adapter wording is correct. |
| Verification 5 and review 6 | Those records reported PASS. This re-review independently repeated their live, clean-checkout, claim, accessibility, demo, and installed-artifact checks. |

## Scope checks

The visual identity remains the documented art-deco transit-poster system, with original product art and a distinct utility layout. It does not use generic landing-page copy or an AI feature. The brief calls for deterministic local inspection; JSON and Markdown reports supply the useful review/export path. A model call, sync service, or backend would conflict with the local-only scope.

## Result

**PASS — zero findings of every severity and zero untested claims.**
