# Adversarial first-read review 1 — Permit Map

**Verdict: FAIL**

Reviewed on 28 August 2026 UTC against the live site, commit d838adacd7d05b0a5888c06fd83295876a5276ce, and a fresh clone. This is a full re-run.

## Cold read

At 390 × 844 and desktop, before scrolling, I understood that this shows coding-agent permissions before they run, it is for engineers using several agents or repositories, and I should click **Try it with sample data**. The landing hero is clear.

## Findings

### F-1-1 — BLOCKING — Phone demo shows no sample rule in the first viewport

**Location:** live /demo at 390 × 844, entered through **Try it with sample data**.

**Evidence:** The first viewport shows the banner, **Review the resolved permission map**, **The sample combines Claude Code and Codex policies from four files**, and **Resolved rules**. It shows no table row, decision, matcher, source file, or numerical summary. Desktop does show sample rows.

**Why:** A one-click demo must show realistic sample data being used on the first screen. On the stated first-read device this is another introduction; the visitor must scroll before seeing the map.

**Fix:** At 390 px, reduce the header/banner or show 4 sources · 9 effective · 1 shadowed and at least three real table rows above the fold. Add a 390 × 844 CTA test that asserts a visible row with decision and source.

### F-1-2 — MINOR — README exceeds the 22-word limit

**Location:** Resolution rules, item 2.

**Quote (25 words):** “Codex sandbox and approval controls resolve system, user, selected profile, and trusted project files from the root to the inspected directory; the closest control wins.”

**Why:** It combines discovery and precedence in one long technical sentence.

**Fix:** “Codex controls use system, user, profile, and trusted project files. The closest file to the inspected directory wins.”

### F-1-3 — MINOR — README exceeds the 22-word limit

**Location:** Resolution rules, item 3.

**Quote (24 words):** “Only Codex project rows stay unresolved until you state --codex-trust trusted or --codex-trust untrusted; system, user, profile, and supplied CLI override rows still resolve.”

**Why:** The prerequisite and exception list need two reads.

**Fix:** “Codex project rows stay unresolved until you set --codex-trust. System, user, profile, and supplied CLI overrides still resolve.” List accepted values in the option reference.

### F-1-4 — MINOR — README exceeds the 22-word limit

**Location:** Develop and verify.

**Quote (24 words):** “npm test runs Rust tests, builds the site, checks every product claim, tests keyboard paths at desktop and 390 px, and runs axe checks.”

**Why:** It is a dense list of unrelated checks.

**Fix:** “npm test runs Rust and browser tests and checks every product claim. It also checks keyboard paths and axe findings at desktop and 390 px.”

### F-1-5 — MINOR — Unlisted landing demo-navigation claim

**Location and quote:** landing CTA helper, “Opens a browser preview of the bundled repository.”

**Why:** This visitor promise has no matching claims.json entry. The navigation test proves it incidentally, not as a registered claim.

**Fix:** Add demo-entry: from a clean browser click the CTA; assert /demo, the banner, four-file summary, and visible sample data at 390 px.

### F-1-6 — MINOR — Unlisted landing result-coverage claims

**Location and quotes:** landing preview, “One table shows every decision” and “See what wins, what gets shadowed, and which file set each rule.”

**Why:** These promise coverage and provenance. demo-resolves declares counts and one shadowed rule, not these promises.

**Fix:** Add a claim that the demo table shows each sample rule’s decision, status, and source file, tested against permit-map demo --format json. If scope is only the sample, say “The sample table shows every sample decision.”

### F-1-7 — MINOR — Unlisted README third-party claim

**Location and quote:** “The site has no runtime third-party scripts, fonts, analytics, or API calls.”

**Why:** browser-privacy declares only a fresh /demo session, not this site-wide promise.

**Fix:** Add site-no-third-parties: visit every public route and assert no cross-origin request, cookie, local/session storage, IndexedDB, or service-worker registration. Or narrow the sentence to the tested demo route.

## Copy audit

Counts treat hyphenated words and code identifiers as one word. Commands, URLs, path-table cells, and link destinations are not sentences. No banned marketing adjective or inconsistent core term was found. Shadowed, matcher, and trust context are consistent and fit the stated engineering audience.

### Landing sentences and labels

| Copy | Words | Result |
|---|---:|---|
| Local policy inspector · line 01 | 5 | Pass |
| See agent permissions before they run | 6 | Pass |
| For engineers using several coding agents, Permit Map resolves the rules each repository will apply. | 14 | Pass |
| Try it with sample data | 6 | Pass |
| Opens a browser preview of the bundled repository. | 8 | F-1-5 |
| Reads known policy files only. | 5 | policy-files |
| Runs without an account. | 4 | no-account |
| Free under the MIT license. | 5 | mit-license |
| Resolved policy · line 02 | 5 | Pass |
| One table shows every decision | 5 | F-1-6 |
| See what wins, what gets shadowed, and which file set each rule. | 12 | F-1-6 |
| Open the full sample map | 5 | Pass |
| Working timetable · line 03 | 5 | Pass |
| Inspect a repository in three steps | 6 | Pass |
| Point at a repository | 4 | Pass |
| Permit Map checks documented Claude Code and Codex policy paths. | 9 | policy-files |
| Check the decision context | 4 | Pass |
| Claude denies win. | 3 | resolution-order |
| Codex project rules need the trust context. | 7 | codex-context |
| Share the result | 3 | Pass |
| Print a table or write JSON and Markdown for review. | 10 | report-formats |
| Depart from your terminal | 4 | Pass |
| Install the single binary | 4 | Pass |
| Clone the source repository, then build with a current Rust toolchain. | 11 | Instruction |
| Copy command | 2 | Pass |
| Clear boundaries · line 04 | 5 | Pass |
| What Permit Map does not do | 6 | Pass |
| It does not run an agent. | 6 | cli-local |
| It does not change vendor settings. | 6 | vendor-settings-unchanged |
| It does not read source files or credential stores. | 9 | policy-files |
| It does not guess when vendor patterns overlap. | 8 | vendor-boundaries |
| Resolve coding-agent permissions before a session. | 6 | Pass |

### README sentences

| Copy | Words | Result |
|---|---:|---|
| Resolve coding-agent permissions before an agent runs. | 7 | Pass |
| Permit Map is for engineers who use Claude Code or Codex across several repositories. | 14 | Pass |
| The local CLI finds documented policy files, resolves supported exact matches, marks shadowed or unresolved rules, and writes a reviewable report. | 21 | Listed |
| It does not run agents, scan source files, or store secrets. | 11 | cli-local; policy-files |
| It refuses to write a report over a discovered vendor policy. | 11 | vendor-policy-safe |
| Permit Map is free software under the MIT license. | 9 | mit-license |
| The demo command copies the bundled sample policies into a new temporary directory. | 13 | demo-isolated |
| It does not inspect the current repository. | 7 | demo-isolated |
| A demo --output path must be relative and is written inside that temporary directory. | 14 | demo-isolated |
| The browser route shows the same four sample files, nine effective rules, and one shadowed rule. | 16 | demo-resolves |
| It sets no cookies and stores no browser data. | 9 | browser-privacy |
| Clone the repository, then build the single binary with a current stable Rust toolchain. | 14 | Instruction |
| The factory owns registry publishing; this repository is ready for cargo package but does not publish from CI. | 18 | Process note |
| Inspect the current repository and user-level policy files. | 8 | Instruction |
| Write a Markdown report without user-level files. | 7 | report-formats |
| Produce JSON for scripts. | 4 | report-formats |
| Successful reports exit with code 0. | 6 | Pass |
| Missing paths, unreadable files, and malformed supported files exit with code 2 and an actionable error. | 16 | cli-errors |
| For safety, --output creates a new report file and refuses known policy paths and their filesystem aliases. | 17 | vendor-policy-safe |
| Permit Map opens these paths automatically. | 6 | policy-files |
| The Claude adapter reads permissions.allow, permissions.ask, and permissions.deny. | 11 | resolution-order |
| The Codex adapter reads documented multiline prefix_rule entries. | 9 | codex-rules |
| Those rules accept string prefixes and union lists; an omitted decision defaults to allow. | 14 | codex-rules |
| It never treats the undocumented config.local.toml path as Codex configuration. | 10 | policy-files |
| Permit Map uses vendor-specific, explicit rules. | 6 | Pass |
| Claude exact matches resolve deny, then ask, then allow across every discovered scope. | 13 | resolution-order |
| Codex command rules resolve exact prefixes as forbidden, then prompt, then allow. | 12 | codex-rules |
| Codex sandbox and approval controls resolve system, user, selected profile, and trusted project files from the root to the inspected directory; the closest control wins. | 25 | F-1-2 |
| Only Codex project rows stay unresolved until you state --codex-trust trusted or --codex-trust untrusted; system, user, profile, and supplied CLI override rows still resolve. | 24 | F-1-3 |
| Pass --codex-profile NAME and repeat --codex-config key=value for context supplied to the Codex invocation. | 15 | codex-context |
| Different vendors never shadow one another. | 6 | vendor-boundaries |
| Pattern overlap remains visible but unresolved. | 6 | vendor-boundaries |
| Vendor match languages can assign different meanings to broad and narrow patterns. | 12 | vendor-boundaries |
| Every report includes this limitation instead of guessing. | 8 | vendor-boundaries |
| Codex sandbox and approval settings are controls rather than command matchers. | 11 | codex-context |
| Permit Map compares those controls by name across layers and shows the selected value only when the trust context is known. | 21 | codex-context |
| CLI flags the inspector cannot observe remain a report limitation unless you supply them. | 14 | Pass |
| Requirements: Rust 1.85 or later, Node 22 or later, and Chromium for Playwright 1.58.2. | 14 | Pass |
| npm test runs Rust tests, builds the site, checks every product claim, tests keyboard paths at desktop and 390 px, and runs axe checks. | 24 | F-1-4 |
| npm run build creates the release binary under target/release/permit-map and the static site under dist/site/. | 18 | Pass |
| Run the site locally. | 4 | Instruction |
| The deploy target is dist/site. | 6 | Pass |
| Its index.html is at the root. | 6 | Pass |
| The site has no runtime third-party scripts, fonts, analytics, or API calls. | 12 | F-1-7 |

## Demo, claims, history, and structure

The one-click path opens /demo without an account or form. The persistent banner, Reset demo, and Start for real are present. Reset changed its live-status message and worked after the loaded page was put offline. Fresh desktop and mobile contexts made only same-origin requests; cookies, localStorage, sessionStorage, IndexedDB, and service-worker registrations were empty. There is no offline-product claim to exercise.

From a temporary caller directory, cargo run --manifest-path /work/repo/Cargo.toml -- demo --format json reported 4 sources, 9 effective rules, and 1 shadowed rule, printed a separate permit-map-demo directory, and left a sentinel file untouched.

A new temporary clone ran npm ci, then each exact command npm test -- --grep @claim:id. All passed: demo-resolves, report-formats, policy-files, no-account, mit-license, browser-privacy, cli-local, resolution-order, codex-context, codex-rules, vendor-policy-safe, vendor-settings-unchanged, cli-errors, vendor-boundaries, touch-targets, and demo-isolated.

No earlier review or polish file exists. The prior handoff and verification records reported no open finding. Live /, /demo, /privacy, /terms, /404, and a missing route were checked. The site has route titles, descriptions, canonical and social metadata, favicon, one h1, main, language, shared header/footer, focus handling, a designed 404, live links, robots, sitemap, security headers, and a 404 override. The art-deco transit-poster identity matches design.md and is distinct from a generic SaaS template.

The brief implies a local CLI, not an AI workflow or sync service. JSON and Markdown reports are the appropriate export. No decorative AI feature or embedded provider key was found.

## What would make this perfect

Show real sample rules above the fold on the 390 px demo, shorten the three README sentences, and register the browser/report promises with observable claim tests. Re-run the whole review after repair. A PASS requires zero findings.
