# Adversarial first-read review 4 — Permit Map

**Verdict: FAIL**

Reviewed 28 August 2026 UTC against the live site, repository commit `105c221c962b0d38029f050979bb3a822bc80e54`, and a new clean clone. Product code was not modified.

## Cold read

Fresh 390 × 844 and 1440 × 1000 browser contexts opened `/` before scrolling.

- **What it does:** It shows the coding-agent permissions that will apply before an agent runs.
- **For whom:** Engineers using several coding agents across repositories.
- **What to click first:** **Try it with sample data**. The adjacent sentence says it opens an isolated sample map in the browser.

The phone first screen contains the six-word headline, the 15-word audience sentence, the primary action, and three concrete facts. This is not a cold-read blocker. The live requests were the page, its own JS/CSS, and its own poster image only; there were no console errors.

## Findings

### F-4-1 — MINOR — Decorative route labels violate the plain-words copy rule

**Locations and exact text:** landing eyebrow labels: **“Local policy inspector · line 01”**, **“Resolved policy · line 02”**, **“Working timetable · line 03”**, **“Depart from your terminal”**, and **“Clear boundaries · line 04.”**

**Why:** These labels are not section names a reader can use. “Working timetable” and “Depart from your terminal” are transit metaphors; the numbered route labels add decoration without product information. This directly conflicts with the supplied plain-words requirement to delete decorative labels and mood/metaphor headings. The useful headings immediately after them already name the sections.

**Concrete fix:** Delete the first, second, third, and fifth eyebrow labels. Replace **“Depart from your terminal”** with **“Install Permit Map”**, or delete it because the following heading already says **“Install the single binary.”**

### F-4-2 — BLOCKING — The first-screen privacy claim is not proven by its registered test

**Location and exact quote:** landing fact, **“Reads known policy files only.”** The matching registry entry is `policy-files`.

**Evidence:** `site-tests/claims.spec.ts` creates `.env`, `other-policy.json`, and `.codex/config.local.toml`, runs the CLI, then only asserts that their *contents do not appear in the JSON report*. A CLI that opened each decoy and silently discarded its content would pass this test. The test does not record file-open events or otherwise observe the claimed non-read behavior.

**Why:** This is a privacy/safety promise visible before a visitor tries the tool. The claims contract requires the test to assert the promised observable outcome, not an adjacent output property. Its current test cannot distinguish “read known policy paths only” from “scan everything but do not report it.”

**Concrete fix:** Replace the test with an OS-level file-access fixture. Run the compiled binary in a temporary repository with known policy files and decoys, record `open`/`openat` events (or use a portable file-access shim), and assert that no `.env`, unrelated JSON, credential path, or undocumented `config.local.toml` is opened. Keep the current report-content assertions as additional coverage.

### F-4-3 — MINOR — README retains unlisted report and secret-storage promises

**Locations and exact quotes:**

- `README.md:7`: **“It does not run agents, scan source files, or store secrets.”** `cli-local` checks for launch/network/telemetry APIs; it does not register or test the **“store secrets”** promise.
- `README.md:87`: **“Every report includes this limitation instead of guessing.”** No claim tests the limitation in terminal, JSON, and Markdown output.
- `README.md:89`: **“CLI flags the inspector cannot observe remain a report limitation unless you supply them.”** No claim registers or tests that report behavior.

**Why:** These are statements a CLI user can rely on, but none has a matching claims entry with one observable sandbox test. The existing `policy-files` test also does not cure the first quote because it cannot observe reads, as F-4-2 explains.

**Concrete fix:** Either remove/narrow the promises to instructions, or add claims. Add a `no-secret-storage` test that supplies a unique secret-shaped decoy and verifies no report, output file, or product state contains it; add a `report-limitations` test that exercises overlapping rules and unobserved CLI context and asserts the appropriate limitation in every promised report format. Do not mark this finding fixed merely by pointing those sentences at the existing broader claims.

## Copy audit

Counts treat hyphenated compounds, code identifiers, and route numbers as one word. Commands, URLs, rule-table data, and path-table cells are excluded because they are examples or data rather than prose. The audit includes rendered navigation, headings, labels, image alternative, footer text, landing sentences, and README prose. No included item exceeds 22 words. No banned marketing adjective or inconsistent core term was found. Results name the registered claim where applicable.

### Landing page

| Copy | Words | Result |
|---|---:|---|
| Skip to main content | 4 | Clear utility link |
| Permit Map | 2 | Wordmark |
| Demo | 1 | Clear nav link |
| Install | 1 | Clear nav link |
| Privacy | 1 | Clear nav link |
| Local policy inspector · line 01 | 5 | F-4-1 |
| See agent permissions before they run | 6 | Resolution job |
| For engineers using several coding agents, Permit Map resolves the rules each repository will apply. | 15 | Resolution/policy claims |
| Try it with sample data | 5 | `demo-entry` |
| Opens the isolated sample map in this browser. | 8 | `demo-entry` |
| Reads known policy files only. | 5 | F-4-2 (`policy-files` is insufficient) |
| Runs without an account. | 4 | `no-account` |
| Free under the MIT license. | 5 | `mit-license` |
| Three geometric rail routes converge on permit, review, and stop signals. | 11 | Informative image alternative |
| Policy layers resolve from global to worktree | 7 | Informative diagram label |
| Global | 1 | Diagram label |
| Repo | 1 | Diagram label |
| Worktree | 1 | Diagram label |
| Resolved policy · line 02 | 5 | F-4-1 |
| The sample table shows every decision | 6 | `demo-rule-provenance` |
| See each sample rule’s decision, status, and source file. | 9 | `demo-rule-provenance` |
| Open the full sample map | 5 | Clear result-naming link |
| Bundled sample repository | 3 | Terminal caption |
| Permit Map — 4 sources, 9 effective, 1 shadowed | 8 | `demo-resolves` |
| Working timetable · line 03 | 4 | F-4-1 |
| Inspect a repository in three steps | 6 | Clear section heading |
| Point at a repository | 4 | Clear step heading |
| Permit Map checks documented Claude Code and Codex policy paths. | 10 | `policy-files` (test gap in F-4-2) |
| Check the decision context | 4 | Clear step heading |
| Claude denies win. | 3 | `resolution-order` |
| Codex project rules need the trust context. | 7 | `codex-context` |
| Share the result | 3 | Clear step heading |
| Print a table or write JSON and Markdown for review. | 10 | `report-formats` |
| Depart from your terminal | 4 | F-4-1 |
| Install the single binary | 4 | Clear section heading |
| Clone the source repository, then build with a current Rust toolchain. | 11 | Installation instruction |
| Copy command | 2 | Clear result-naming button |
| Clear boundaries · line 04 | 4 | F-4-1 |
| What Permit Map does not do | 6 | Clear section heading |
| It does not run an agent. | 6 | `cli-local` |
| It does not change vendor settings. | 6 | `vendor-settings-unchanged` |
| It does not read source files or credential stores. | 9 | F-4-2 (`policy-files` is insufficient) |
| It does not guess when vendor patterns overlap. | 8 | `vendor-boundaries` |
| Resolve coding-agent permissions before a session. | 6 | Product summary |
| Terms | 1 | Clear footer link |
| Built by Param Factory | 4 | Clear external link |
| Version 0.1.0 · build 2026.08.28 | 4 | Build identifier |

### README

| Copy | Words | Result |
|---|---:|---|
| Resolve coding-agent permissions before an agent runs. | 7 | Product summary |
| Permit Map is for engineers who use Claude Code or Codex across several repositories. | 14 | Audience statement |
| The local CLI finds documented policy files, resolves supported exact matches, marks shadowed or unresolved rules, and writes a reviewable report. | 21 | Policy, resolution, and format claims |
| It does not run agents, scan source files, or store secrets. | 11 | F-4-2 and F-4-3 |
| It refuses to write a report over a discovered vendor policy. | 11 | `vendor-policy-safe` |
| Permit Map is free software under the MIT license. | 9 | `mit-license` |
| The demo command copies the bundled sample policies into a new temporary directory. | 13 | `demo-isolated` |
| It does not inspect the current repository. | 7 | `demo-isolated` |
| A demo `--output` path must be relative and is written inside that temporary directory. | 14 | `demo-isolated` |
| The browser route shows the same four sample files, nine effective rules, and one shadowed rule. | 16 | `demo-resolves` |
| It sets no cookies and stores no browser data. | 9 | `browser-privacy` |
| See `.factory/demo.md` for the reset and isolation contract. | 8 | Documentation link |
| Clone the repository, then build the single binary with a current stable Rust toolchain. | 14 | Installation instruction |
| The package starts at version `0.1.0`. | 6 | Release metadata |
| The factory owns registry publishing; this repository is ready for `cargo package` but does not publish from CI. | 18 | Process note |
| Inspect the current repository and user-level policy files. | 8 | Usage instruction |
| Write a Markdown report without user-level files. | 7 | `report-formats` |
| Produce JSON for scripts. | 4 | `report-formats` |
| Successful reports exit with code `0`. | 6 | `success-exit` |
| Missing paths, unreadable files, and malformed supported files exit with code `2` and an actionable error. | 16 | `cli-errors` |
| For safety, `--output` creates a new report file and refuses known policy paths and their filesystem aliases. | 17 | `vendor-policy-safe` |
| Permit Map opens these paths automatically. | 6 | F-4-2 (`policy-files` is insufficient) |
| The Claude adapter reads `permissions.allow`, `permissions.ask`, and `permissions.deny`. | 11 | `resolution-order` |
| The Codex adapter reads documented multiline `prefix_rule` entries. | 9 | `codex-rules` |
| Those rules accept string prefixes and union lists; an omitted decision defaults to `allow`. | 14 | `codex-rules` |
| It never treats the undocumented `config.local.toml` path as Codex configuration. | 10 | F-4-2 (`policy-files` is insufficient) |
| Permit Map uses vendor-specific, explicit rules. | 6 | Explanation |
| Claude exact matches resolve deny, then ask, then allow across every discovered scope. | 13 | `resolution-order` |
| Codex command rules resolve exact prefixes as forbidden, then prompt, then allow. | 12 | `codex-rules` |
| Codex controls use system, user, profile, and trusted project files. | 10 | `codex-context` |
| The closest file to the inspected directory wins. | 9 | `codex-context` |
| Codex project rows stay `unresolved` until you set `--codex-trust`. | 10 | `codex-context` |
| System, user, profile, and supplied CLI overrides still resolve. | 9 | `codex-context` |
| Accepted values are `trusted` and `untrusted`. | 6 | `codex-context` |
| Pass `--codex-profile NAME` and repeat `--codex-config key=value` for context supplied to the Codex invocation. | 15 | Usage instruction |
| Different vendors never shadow one another. | 6 | `vendor-boundaries` |
| Pattern overlap remains visible but unresolved. | 6 | `vendor-boundaries` |
| Vendor match languages can assign different meanings to broad and narrow patterns. | 12 | `vendor-boundaries` |
| Every report includes this limitation instead of guessing. | 8 | F-4-3 |
| Codex sandbox and approval settings are controls rather than command matchers. | 11 | `codex-context` |
| Permit Map compares those controls by name across layers and shows the selected value only when the trust context is known. | 21 | `codex-context` |
| CLI flags the inspector cannot observe remain a report limitation unless you supply them. | 14 | F-4-3 |
| Requirements: Rust 1.85 or later, Node 22 or later, and Chromium for Playwright 1.58.2. | 14 | Requirement |
| `npm test` runs Rust and browser tests and checks every product claim. | 11 | Verification instruction |
| It also checks keyboard paths and axe findings at desktop and 390 px. | 12 | Verification instruction |
| `npm run build` creates the release binary under `target/release/permit-map` and the static site under `dist/site/`. | 18 | Build instruction |
| Run the site locally. | 4 | Instruction |
| The deploy target is `dist/site`. | 6 | Deployment instruction |
| Its `index.html` is at the root. | 6 | Deployment instruction |
| The site has no runtime third-party scripts, fonts, analytics, or API calls. | 12 | `site-no-third-parties` |

## Demo and sandbox behavior

The landing CTA reached `/?demo=1` in one click. At 390 × 844, the persistent **“Demo — sample data, nothing is saved”** banner, 4 / 9 / 1 summary, and three realistic decision/matcher/source rows were visible above the fold; their row bottoms were 465, 489, and 514 px. The demo screen showed the product in use immediately.

**Reset demo** changed the polite status and retained the bundled sample. A fresh context made only same-origin requests, and a clean context had no cookies, local/session storage, IndexedDB, Cache Storage, or service worker. In a deliberately non-clean context, pre-seeded `real:*` local/session values and a sentinel cookie were unchanged after entering and resetting demo. The static sample is document memory, so it does not write a real-data namespace.

From a temporary caller directory, `cargo run --manifest-path /work/repo/Cargo.toml -- demo --format json` reported a separate `/tmp/permit-map-demo-*` directory, returned four sources, nine effective rules, and one shadowed rule, and left the caller sentinel unchanged.

## Claims and quality gates

A new clone at `/tmp/permit-map-review4` ran `npm ci`, then every exact command named by the 20 `claims.json` records. The final Playwright result was `passed` with no failed tests. The local checkout also passed `npm test` (6 Rust unit tests, 8 Rust integration tests, and 82 Playwright tests), `npm run typecheck`, and `npm run build`; the build produced `dist/site/` and the release binary.

This does not close F-4-2: the `policy-files` test command passes, but its assertion is not capable of proving the registered claim.

## Earlier findings and history

Read every earlier `review-*`, `polish-*`, verification record, and handoff. The live site and source confirm that each prior finding is actually repaired:

| Earlier ID | Confirmation |
|---|---|
| F-1-1 | Mobile demo now exposes its banner, 4/9/1 summary, and three complete rows above the 844 px fold. |
| F-1-2 to F-1-4 | The three long README sentences remain split under 22 words. |
| F-1-5 to F-1-7 | The CTA is sample-specific; provenance and site-wide no-third-party behavior have registered tests. |
| F-2-1 | The exit action is now **View install command** and focuses the install heading. |
| F-2-2 | `success-exit` is registered and passes. |
| F-2-3 | Terms now gives a present-tense change instruction. |
| F-3-1 | `cli-errors` now covers missing, unreadable, and malformed inputs with recovery instructions. |

No earlier finding is re-opened. F-4-2 is a newly identified adequacy failure in the `policy-files` proof, not a regression of a previously marked fix.

## Structure, routing, and identity

Live `/`, `/demo`, `/privacy`, `/terms`, and `/404` returned 200; an unknown route returned the designed 404 with HTTP 404. The routes have their expected titles, descriptions, canonical links, social image metadata, favicon, one `h1`, one `main`, shared header/footer, legal links, and skip link. The live header includes CSP, `nosniff`, strict-origin referrer policy, permissions policy, and HSTS. `robots.txt` and `sitemap.xml` are present. Direct deep links render; the source moves focus to the new heading on SPA navigation and restores it on history navigation. Local browser tests cover the keyboard, route, focus, metadata, touch-target, reduced-motion, and axe checks.

The warm-paper, green-ink, clipped-ticket, art-deco transit system is recognisably product-specific and matches `design.md`; it is not a generic SaaS template. Its decorative copy must nevertheless meet the plain-words rule (F-4-1).

## Missed leverage

No missed-leverage finding. The brief calls for a deterministic local permission inspector. Terminal, JSON, and Markdown reports provide the implied export path. Sync would violate the local-only scope, and an AI step would add no useful judgment to policy precedence. No decorative AI feature or embedded provider key was found.

## What would make this perfect

Delete the non-informative transit labels, replace `policy-files` with an actual file-access proof, and register or remove the three unlisted README promises. Re-run this whole checklist from a fresh clone and fresh browser contexts. Only then can the zero-finding standard be met.
