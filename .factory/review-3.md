# Adversarial first-read review 3 — Permit Map

**Verdict: FAIL**

Reviewed 28 August 2026 UTC against live <https://agent-permission-map.sociobot.in>, repository commit `7e39808efd94e6f857e8570badd18ecf4e9a3c34`, and a separate clean clone. Product code was not modified.

One minor finding remains. Under the stated zero-finding standard, that is a FAIL.

## Findings

### F-3-1 — MINOR — README promises error behavior that its registered claim does not test

**Location and exact quote:** `README.md:59`: “Missing paths, unreadable files, and malformed supported files exit with code `2` and an actionable error.”

**Claims/test mismatch:** `.factory/claims.json` registers only “Missing paths and malformed supported policy files exit with code 2.” The sole `@claim:cli-errors` test checks exit status for a missing path and malformed Claude/Codex files. It never creates an unreadable policy and never checks that an error tells the user what to do next.

**Observed behavior:** An independent unprivileged run against a mode-`000` policy did exit `2`, but its error ended at “Permission denied.” A malformed-file error identified the parse failure but gave no next action. The advertised “actionable” part is therefore both unregistered and not consistently present.

**Why this matters:** CLI users rely on documented exit and recovery behavior in scripts and incident response. Passing the narrower tagged test makes the broader README promise look verified when it is not.

**Concrete fix:** Either narrow the sentence to the registered result—“Missing paths and malformed supported policy files exit with code `2`.”—or expand `cli-errors` and its sandbox/test to cover an unreadable file under an unprivileged process and assert errors include the cause plus one concrete next step.

## Cold read

Fresh contexts were opened without scrolling at 390 × 844 and 1366 × 768.

| Question | First-screen answer |
|---|---|
| What does it do? | It shows which coding-agent permissions apply before an agent runs. |
| For whom? | Engineers using several coding agents across repositories. |
| What should I click first? | **Try it with sample data**. The adjacent line says it opens an isolated sample map in the browser. |

The exact visible copy was **“See agent permissions before they run”**, **“For engineers using several coding agents, Permit Map resolves the rules each repository will apply”**, and **“Try it with sample data.”** All three answers were visible on both viewports. No cold-read blocker was found.

## Copy audit

Counts treat hyphenated compounds and code identifiers as one word. Commands, URLs, data-table cells, and Markdown table path cells are not sentences. Interface headings and controls are included so their context and result naming are checked. No item exceeds 22 words. No banned marketing adjective, inconsistent core term, or unexplained jargon for the stated engineering audience was found. The one claims-coverage problem is F-3-1.

### Landing page

| Copy | Words | Result |
|---|---:|---|
| Local policy inspector · line 01 | 5 | Pass |
| See agent permissions before they run | 6 | Covered by resolution claims |
| For engineers using several coding agents, Permit Map resolves the rules each repository will apply. | 15 | Covered by resolution claims |
| Try it with sample data | 5 | `demo-entry` |
| Opens the isolated sample map in this browser. | 8 | `demo-entry` |
| Reads known policy files only. | 5 | `policy-files` |
| Runs without an account. | 4 | `no-account` |
| Free under the MIT license. | 5 | `mit-license` |
| Three geometric rail routes converge on permit, review, and stop signals. | 11 | Clear image alternative |
| Global | 1 | Pass |
| Repo | 1 | Pass |
| Worktree | 1 | Pass |
| Resolved policy · line 02 | 4 | Pass |
| The sample table shows every decision | 6 | `demo-rule-provenance` |
| See each sample rule’s decision, status, and source file. | 9 | `demo-rule-provenance` |
| Open the full sample map | 5 | Result-naming link |
| Bundled sample repository | 3 | Pass |
| Permit Map — 4 sources, 9 effective, 1 shadowed | 8 | `demo-resolves` |
| Working timetable · line 03 | 4 | Pass |
| Inspect a repository in three steps | 6 | Pass |
| Point at a repository | 4 | Pass |
| Permit Map checks documented Claude Code and Codex policy paths. | 10 | `policy-files` |
| Check the decision context | 4 | Pass |
| Claude denies win. | 3 | `resolution-order` |
| Codex project rules need the trust context. | 7 | `codex-context` |
| Share the result | 3 | Pass |
| Print a table or write JSON and Markdown for review. | 10 | `report-formats` |
| Depart from your terminal | 4 | Pass |
| Install the single binary | 4 | Pass |
| Clone the source repository, then build with a current Rust toolchain. | 11 | Clear instruction |
| Copy command | 2 | Result-naming button |
| Clear boundaries · line 04 | 4 | Pass |
| What Permit Map does not do | 6 | Pass |
| It does not run an agent. | 6 | `cli-local` |
| It does not change vendor settings. | 6 | `vendor-settings-unchanged` |
| It does not read source files or credential stores. | 9 | `policy-files` |
| It does not guess when vendor patterns overlap. | 8 | `vendor-boundaries` |
| Resolve coding-agent permissions before a session. | 6 | Covered by resolution claims |
| Privacy | 1 | Clear link |
| Terms | 1 | Clear link |
| Built by Param Factory | 4 | Clear external link |
| Version 0.1.0 · build 2026.08.28 | 4 | Build identifier |

### README

| Copy | Words | Result |
|---|---:|---|
| Resolve coding-agent permissions before an agent runs. | 7 | Covered by resolution claims |
| Permit Map is for engineers who use Claude Code or Codex across several repositories. | 14 | Pass |
| The local CLI finds documented policy files, resolves supported exact matches, marks shadowed or unresolved rules, and writes a reviewable report. | 21 | Covered by policy, resolution, and report claims |
| It does not run agents, scan source files, or store secrets. | 11 | `cli-local`; `policy-files` |
| It refuses to write a report over a discovered vendor policy. | 11 | `vendor-policy-safe` |
| Permit Map is free software under the MIT license. | 9 | `mit-license` |
| The demo command copies the bundled sample policies into a new temporary directory. | 13 | `demo-isolated` |
| It does not inspect the current repository. | 7 | `demo-isolated` |
| A demo `--output` path must be relative and is written inside that temporary directory. | 14 | `demo-isolated` |
| The browser route shows the same four sample files, nine effective rules, and one shadowed rule. | 16 | `demo-resolves` |
| It sets no cookies and stores no browser data. | 9 | `browser-privacy` |
| See `.factory/demo.md` for the reset and isolation contract. | 8 | Documentation link |
| Clone the repository, then build the single binary with a current stable Rust toolchain. | 14 | Clear instruction |
| The package starts at version `0.1.0`. | 6 | Release metadata |
| The factory owns registry publishing; this repository is ready for `cargo package` but does not publish from CI. | 18 | Process note |
| Inspect the current repository and user-level policy files. | 8 | Clear instruction |
| Write a Markdown report without user-level files. | 7 | `report-formats` |
| Produce JSON for scripts. | 4 | `report-formats` |
| Successful reports exit with code `0`. | 6 | `success-exit` |
| Missing paths, unreadable files, and malformed supported files exit with code `2` and an actionable error. | 16 | **F-3-1** |
| For safety, `--output` creates a new report file and refuses known policy paths and their filesystem aliases. | 17 | `vendor-policy-safe` |
| Permit Map opens these paths automatically. | 6 | `policy-files` |
| The Claude adapter reads `permissions.allow`, `permissions.ask`, and `permissions.deny`. | 8 | `resolution-order` |
| The Codex adapter reads documented multiline `prefix_rule` entries. | 8 | `codex-rules` |
| Those rules accept string prefixes and union lists; an omitted decision defaults to `allow`. | 14 | `codex-rules` |
| It never treats the undocumented `config.local.toml` path as Codex configuration. | 10 | `policy-files` |
| Permit Map uses vendor-specific, explicit rules. | 6 | Pass |
| Claude exact matches resolve deny, then ask, then allow across every discovered scope. | 13 | `resolution-order` |
| Codex command rules resolve exact prefixes as forbidden, then prompt, then allow. | 12 | `codex-rules` |
| Codex controls use system, user, profile, and trusted project files. | 10 | `codex-context` |
| The closest file to the inspected directory wins. | 8 | `codex-context` |
| Codex project rows stay `unresolved` until you set `--codex-trust`. | 9 | `codex-context` |
| System, user, profile, and supplied CLI overrides still resolve. | 9 | `codex-context` |
| Accepted values are `trusted` and `untrusted`. | 6 | `codex-context` |
| Pass `--codex-profile NAME` and repeat `--codex-config key=value` for context supplied to the Codex invocation. | 14 | `codex-context` |
| Different vendors never shadow one another. | 6 | `vendor-boundaries` |
| Pattern overlap remains visible but unresolved. | 6 | `vendor-boundaries` |
| Vendor match languages can assign different meanings to broad and narrow patterns. | 12 | `vendor-boundaries` |
| Every report includes this limitation instead of guessing. | 8 | `vendor-boundaries` |
| Codex sandbox and approval settings are controls rather than command matchers. | 11 | `codex-context` |
| Permit Map compares those controls by name across layers and shows the selected value only when the trust context is known. | 21 | `codex-context` |
| CLI flags the inspector cannot observe remain a report limitation unless you supply them. | 14 | Clear limitation |
| Requirements: Rust 1.85 or later, Node 22 or later, and Chromium for Playwright 1.58.2. | 14 | Requirement |
| `npm test` runs Rust and browser tests and checks every product claim. | 12 | Verification instruction |
| It also checks keyboard paths and axe findings at desktop and 390 px. | 13 | Verification instruction |
| `npm run build` creates the release binary under `target/release/permit-map` and the static site under `dist/site/`. | 15 | Build instruction |
| Run the site locally. | 4 | Clear instruction |
| The deploy target is `dist/site`. | 5 | Deployment instruction |
| Its `index.html` is at the root. | 6 | Deployment instruction |
| The site has no runtime third-party scripts, fonts, analytics, or API calls. | 12 | `site-no-third-parties` |

README headings were also checked in isolation: Permit Map, Try the sandbox, Install, Usage, Supported policy paths, Resolution rules, Develop and verify, Package without publishing, and Project records all name their contents. Landing headings and action labels are included in the table above. Core terms remain consistent: policy file, matcher, decision, effective, shadowed, layer, report, and demo.

## Demo and sandbox behavior

- The first-screen action opens `/?demo=1` in one click without an account or setup.
- At 390 × 844, the first post-click viewport contains **Demo — sample data, nothing is saved**, **Reset demo**, **View install command**, the 4 sources / 9 effective / 1 shadowed summary, and three realistic matcher/source rows. The last row ends at 514 px.
- Reset updates the polite status and still works after the browser context is put offline.
- A pre-seeded `real:sentinel` localStorage value, `real:session` sessionStorage value, and cookie remained unchanged through entry and Reset. The demo created no IndexedDB database, Cache Storage entry, or service worker.
- The live flow requested only the site origin. No console or page errors occurred.
- From a fresh caller directory, `permit-map demo --format json` created a separate `/tmp/permit-map-demo-*` directory, reported 4/9/1 and ten rows, and left the caller’s only sentinel file byte-for-byte unchanged.

The browser sample is immutable in-memory data, so there is no real browser-data namespace for demo actions to touch. No offline-product claim is made; only the already loaded in-memory Reset path was checked offline.

## Claims audit

All 20 literal commands from `.factory/claims.json` were run independently in clean clone `/tmp/permit-map-review3.vLV5EJ/repo` at commit `7e39808e`. Every listed test passed.

| Claim ID | Result | Observable evidence |
|---|---|---|
| `demo-resolves` | PASS | Browser and CLI both reported 4 sources, 9 effective, 1 shadowed. |
| `demo-entry` | PASS | One click exposed the banner, summary, and three phone-visible rows. |
| `demo-rule-provenance` | PASS | Browser decision/status/matcher/source fields matched CLI JSON. |
| `report-formats` | PASS | Terminal, JSON, and Markdown outputs were parsed/asserted. |
| `success-exit` | PASS | Successful inspection returned 0 with valid JSON. |
| `policy-files` | PASS | Known policy was read; `.env`, unrelated JSON, and undocumented Codex path were absent. |
| `no-account` | PASS | Fresh demo had no form or cookie. |
| `mit-license` | PASS | LICENSE and Cargo metadata identify MIT. |
| `browser-privacy` | PASS | Demo requests stayed same-origin and browser storage stayed empty. |
| `site-no-third-parties` | PASS | All public routes avoided third parties and persistence. |
| `cli-local` | PASS | Runtime dependencies/source contain no agent launch, network, or telemetry client. |
| `resolution-order` | PASS | Claude exact-match deny precedence was observed. |
| `codex-context` | PASS | Project trust gating and global/override behavior were observed. |
| `codex-rules` | PASS | Multiline, union, default, and decision precedence cases passed. |
| `vendor-policy-safe` | PASS | Direct and hard-link overwrite attempts were refused. |
| `vendor-settings-unchanged` | PASS | Policy hashes were unchanged after inspection. |
| `cli-errors` | PASS | Its registered missing/malformed exit-2 scope passed; see F-3-1 for extra README promises. |
| `vendor-boundaries` | PASS | Vendor separation and overlapping-pattern visibility passed. |
| `touch-targets` | PASS | Visible phone home links measured at least 44 px high. |
| `demo-isolated` | PASS | Caller sentinel stayed unchanged and output remained in the demo temp directory. |

No listed claim test failed. Live landing claim-like copy maps to the registered claims shown in the copy audit. F-3-1 is the only unlisted/untested claim found in the landing-page and README cross-check.

## Earlier findings and history

Every earlier `.factory/review-*.md`, `.factory/polish-*.md`, and the prior handoff was read. Each earlier finding was checked again on the live site and in source/tests.

| Earlier ID | Independent confirmation |
|---|---|
| F-1-1 | Live phone demo shows the banner, 4/9/1 summary, and three complete sample rows above the fold. |
| F-1-2 | README uses the short Codex-controls sentence. |
| F-1-3 | README separates trust context, unaffected scopes, and accepted values. |
| F-1-4 | README test description remains split into two short sentences. |
| F-1-5 | CTA names the isolated sample and `demo-entry` verifies the phone path. |
| F-1-6 | Preview is sample-scoped and `demo-rule-provenance` compares every displayed rule field. |
| F-1-7 | `site-no-third-parties` covers every public route, browser stores, cookies, requests, and service workers. |
| F-2-1 | Demo action reads **View install command**, routes to `/#install`, and focuses the install heading. |
| F-2-2 | `success-exit` exists exactly once and verifies status 0 plus valid output. |
| F-2-3 | Live terms copy says “Check this page and the project changelog for changes.” |

No earlier finding is reopened.

## Structure, accessibility, and live integrity

- `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and `/404` return 200. A new missing path returns 404 with the designed transit-signal recovery page.
- Each checked page has `lang=en`, one `main`, one `h1`, a route-appropriate title, description, canonical URL, Open Graph/Twitter metadata, SVG favicon, and apple-touch icon.
- Home uses the required “Product — what it does” title. Secondary titles use “Route — Product.” All are under 60 characters.
- Header, skip link, footer, Privacy, Terms, Param Factory credit, and build ID are consistent. All unique links crawled from every route returned their expected 200 response; the intentional missing document remained 404.
- Direct deep links work. SPA navigation focuses the destination `h1`; browser Back restores the triggering sample link. Route changes have a polite live region.
- `robots.txt`, `sitemap.xml`, security headers, static route documents, and the 404 response override are present.
- The art-deco transit-poster layout, paper/ink palette, clipped ticket controls, rule timetable, and route geometry match `.factory/design.md` and are not a generic SaaS template.
- Live Playwright axe scans reported zero violations on all checked routes at desktop and 390 px. The factory URL verifier reported one `h1`, one main landmark, no missing image alternatives, no unlabeled buttons, and no console errors on home and demo.
- The clean-clone full suite passed: 82 Playwright tests, 6 Rust unit tests, and 8 Rust integration tests. Typecheck, lint, and production build passed. The built JavaScript is 15.40 KB uncompressed / 5.25 KB gzip.

## Missed leverage

No missed-leverage finding was found. The brief calls for a local permission-resolution CLI. It already provides terminal, JSON, and Markdown output plus an isolated sample. Sync would conflict with the local-only scope, and an AI step would add no necessary judgment to deterministic precedence resolution. No decorative AI feature, provider key, or runtime model call is present.

## What would make this perfect

Close F-3-1 by making the README sentence and the executable claim identical. The smallest repair is to remove “unreadable files” and “actionable” from that sentence. The stronger repair is to keep the promise, add an unprivileged unreadable-file fixture, assert exit `2`, and assert every covered error states what happened, why, and one next action. Re-run the complete review afterward; PASS requires zero findings.
