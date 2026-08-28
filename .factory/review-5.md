# Adversarial first-read review 5 — Permit Map

**Verdict: FAIL**

Reviewed 28 August 2026 UTC against the live site, repository commit 34c81adb6ddd8207e4fcdfbf27084d7e556b496f, and clean clone /tmp/permit-map-review5.3BOvtn/repo. Product code was not modified.

One blocking finding and one minor finding remain. Under the required zero-finding standard, the product cannot pass.

## Cold read

Fresh 390 × 844 and 1440 × 1000 contexts opened the home page without scrolling.

| Question | Answer from the first screen | Exact live text |
|---|---|---|
| What does this do? | It resolves coding-agent permissions before an agent runs. | “Resolve coding-agent permissions before an agent runs” |
| For whom? | Engineers using several coding agents across repositories. | “For engineers using several coding agents, Permit Map resolves the rules each repository will apply.” |
| What should I click first? | Try the isolated sample data. | “Try it with sample data” and “Opens the isolated sample map in this browser.” |

All three answers and the three facts were visible without scrolling on both viewports. On the phone, the facts ended at 800 px in the 844 px viewport. The first screen is not blocking.

## Findings

### F-5-1 — BLOCKING — Reset makes phone demo text fail minimum contrast

**Location and exact action:** live /?demo=1 at 390 × 844; activate **“Reset demo.”** The visible table receives the reset-pulse animation from site/src/style.css:127, which fades the entire table to opacity 0.58.

**Evidence:** Freezing the live animation at its 120 ms midpoint and running axe color-contrast checks produced seven serious failures:

| Visible text | Measured contrast | Required |
|---|---:|---:|
| First three resolved sample rules | 2.50:1 | 4.5:1 |
| Effect / Matcher / Source header text | 3.73:1 | 4.5:1 |
| deny badges | 3.12:1 | 4.5:1 |
| allow badge | 2.79:1 | 4.5:1 |

The settled page passes axe. Desktop does not expose this failure because the animated first-screen table is hidden above 600 px. The existing axe tests load routes only in their settled state, while the Reset test checks only that status text appears. Therefore npm test passes without testing the failing interactive state.

**Why:** The accessibility contract requires text contrast of at least 4.5:1. A control must not make its result text unreadable during feedback, even for 240 ms. This is a live interaction failure on the specified phone viewport.

**Concrete fix:** Remove opacity from the reset animation. Animate a border, outline, or opaque background that preserves text contrast. Add a 390 px test that activates Reset, freezes or samples the animation midpoint, and runs axe or directly asserts every animated text/background pair remains at least 4.5:1.

### F-5-2 — MINOR — CLI demo read-isolation promise is not registered or tested

**Locations and exact quotes:** README, Try the sandbox: **“It does not inspect the current repository.”** CLI demo stderr: **“Nothing outside this temporary directory was read or changed.”**

**Evidence:** The registered demo-isolated claim says only **“The demo command changes nothing outside its temporary directory.”** Its test verifies an unchanged caller sentinel and that report output stays in the demo directory. It does not observe reads from the caller directory. A separate review-time open/openat trace found eight application file opens, all inside /tmp/permit-map-demo-9431-1787952115938, and no caller-path open, so current behavior matches the intended narrower promise. The executable test still cannot detect a future caller-data read.

**Why:** “Does not inspect” and “nothing … was read” are claims a user may rely on when running the demo in a real repository. They are broader than the registered write-isolation claim.

**Concrete fix:** Expand demo-isolated to say the demo neither reads caller policy/data files nor changes anything outside its temporary directory. Extend its test with the existing open/openat tracer and assert that no path under the caller directory is opened. Alternatively, narrow the README and stderr to the write-isolation behavior the current test proves.

## Copy audit

Counts use visible words separated by whitespace. Hyphenated terms, identifiers, versions, and numbers count as one word. Commands, URLs, policy-table paths, and sample rule cells are data rather than sentences. Headings, labels, buttons, image alternatives, and informative fragments are included because the review also checks their clarity.

No landing or README sentence exceeds 22 words. No banned marketing adjective, metaphor heading, unexplained slogan, inconsistent core term, or non-result-naming button was found.

### Landing page

| Copy | Words | Result |
|---|---:|---|
| Skip to main content | 4 | Clear utility link |
| Permit Map | 2 | Wordmark |
| Demo | 1 | Clear navigation |
| Install | 1 | Clear navigation |
| Privacy | 1 | Clear navigation |
| Resolve coding-agent permissions before an agent runs | 7 | Plain job headline |
| For engineers using several coding agents, Permit Map resolves the rules each repository will apply. | 15 | Audience and outcome |
| Try it with sample data | 5 | Result-naming action |
| Opens the isolated sample map in this browser. | 8 | demo-entry |
| Reads known policy files only. | 5 | policy-files |
| Runs without an account. | 4 | no-account |
| Free under the MIT license. | 5 | mit-license |
| Three geometric rail routes converge on permit, review, and stop signals. | 11 | Informative image alternative |
| Policy layers resolve from global to worktree | 7 | Informative diagram label |
| Global | 1 | Diagram label |
| Repo | 1 | Diagram label |
| Worktree | 1 | Diagram label |
| The sample table shows every decision | 6 | demo-rule-provenance |
| See each sample rule’s decision, status, and source file. | 9 | demo-rule-provenance |
| Open the full sample map | 5 | Result-naming link |
| Bundled sample repository | 3 | Terminal caption |
| Permit Map — 4 sources, 9 effective, 1 shadowed | 8 | demo-resolves |
| Inspect a repository in three steps | 6 | Clear section heading |
| Point at a repository | 4 | Clear step heading |
| Permit Map checks documented Claude Code and Codex policy paths. | 10 | policy-files |
| Check the decision context | 4 | Clear step heading |
| Claude deny rules take precedence. | 5 | resolution-order |
| Codex project rules need the trust context. | 7 | codex-context |
| Share the result | 3 | Clear step heading |
| Print a table or write JSON and Markdown for review. | 10 | report-formats |
| Install the single binary | 4 | Clear section heading |
| Clone the source repository, then build with a current Rust toolchain. | 11 | Installation instruction |
| Copy command | 2 | Result-naming button |
| What Permit Map does not do | 6 | Clear section heading |
| It does not run an agent. | 6 | cli-local |
| It does not change vendor settings. | 6 | vendor-settings-unchanged |
| It does not read source files or credential stores. | 9 | policy-files |
| It does not guess when vendor patterns overlap. | 8 | vendor-boundaries |
| Resolve coding-agent permissions before an agent runs. | 7 | Footer summary |
| Terms | 1 | Clear footer link |
| Built by Param Factory | 4 | Clear external link |
| Version 0.1.0 · build 2026.08.28 | 4 | Build identifier |

### README headings and labels

| Copy | Words | Result |
|---|---:|---|
| Permit Map | 2 | Document title |
| Website | 1 | Clear label |
| One-click sample | 2 | Clear label |
| Try the sandbox | 3 | Clear section heading |
| Install | 1 | Clear section heading |
| Usage | 1 | Clear section heading |
| Supported policy paths | 3 | Clear section heading |
| Resolution rules | 2 | Clear section heading |
| Develop and verify | 3 | Clear section heading |
| Package without publishing | 3 | Clear section heading |
| Project records | 2 | Clear section heading |
| brief.json — researched job and scope | 5 | Clear record description |
| design.md — visual system and asset provenance | 6 | Clear record description |
| claims.json — claims and their sandbox tests | 6 | Clear record description |
| handoff.md — verification record and known gaps | 6 | Clear record description |
| CHANGELOG.md — release notes | 3 | Clear record description |

### README sentences

| Copy | Words | Result |
|---|---:|---|
| Resolve coding-agent permissions before an agent runs. | 7 | Product summary |
| Permit Map is for engineers who use Claude Code or Codex across several repositories. | 14 | Audience |
| The local CLI finds documented policy files, resolves supported exact matches, marks shadowed or unresolved rules, and writes a reviewable report. | 21 | policy, resolution, and report claims |
| It does not run agents, scan source files, or store secrets. | 11 | cli-local, policy-files, no-secret-storage |
| It refuses to write a report over a discovered vendor policy. | 11 | vendor-policy-safe |
| Permit Map is free software under the MIT license. | 9 | mit-license |
| The demo command copies the bundled sample policies into a new temporary directory. | 13 | demo-isolated |
| It does not inspect the current repository. | 7 | F-5-2 |
| A demo --output path must be relative and is written inside that temporary directory. | 14 | demo-isolated |
| The browser route shows the same four sample files, nine effective rules, and one shadowed rule. | 16 | demo-resolves |
| It sets no cookies and stores no browser data. | 9 | browser-privacy |
| See .factory/demo.md for the reset and isolation contract. | 8 | Documentation instruction |
| Clone the repository, then build the single binary with a current stable Rust toolchain. | 14 | Installation instruction |
| The package starts at version 0.1.0. | 6 | Release metadata |
| The factory owns registry publishing; this repository is ready for cargo package but does not publish from CI. | 18 | Packaging note |
| Inspect the current repository and user-level policy files. | 8 | Usage instruction |
| Write a Markdown report without user-level files. | 7 | report-formats |
| Produce JSON for scripts. | 4 | report-formats |
| Successful reports exit with code 0. | 6 | success-exit |
| Missing paths, unreadable files, and malformed supported files exit with code 2 and an actionable error. | 16 | cli-errors |
| For safety, --output creates a new report file and refuses known policy paths and their filesystem aliases. | 17 | vendor-policy-safe |
| Permit Map opens these paths automatically. | 6 | policy-files |
| The Claude adapter reads permissions.allow, permissions.ask, and permissions.deny. | 8 | resolution-order |
| The Codex adapter reads documented multiline prefix_rule entries. | 8 | codex-rules |
| Those rules accept string prefixes and union lists; an omitted decision defaults to allow. | 14 | codex-rules |
| It never treats the undocumented config.local.toml path as Codex configuration. | 10 | policy-files |
| Permit Map uses vendor-specific, explicit rules. | 6 | Explanation |
| Claude exact matches resolve deny, then ask, then allow across every discovered scope. | 13 | resolution-order |
| Codex command rules resolve exact prefixes as forbidden, then prompt, then allow. | 12 | codex-rules |
| Codex controls use system, user, profile, and trusted project files. | 10 | codex-context |
| The closest file to the inspected directory wins. | 8 | codex-context |
| Codex project rows stay unresolved until you set --codex-trust. | 9 | codex-context |
| System, user, profile, and supplied CLI overrides still resolve. | 9 | codex-context |
| Accepted values are trusted and untrusted. | 6 | codex-context |
| Pass --codex-profile NAME and repeat --codex-config key=value for context supplied to the Codex invocation. | 14 | Usage instruction |
| Different vendors never shadow one another. | 6 | vendor-boundaries |
| Pattern overlap remains visible but unresolved. | 6 | vendor-boundaries |
| Vendor match languages can assign different meanings to broad and narrow patterns. | 12 | Technical explanation |
| Every report includes this limitation instead of guessing. | 8 | report-limitations |
| Codex sandbox and approval settings are controls rather than command matchers. | 11 | codex-context |
| Permit Map compares those controls by name across layers and shows the selected value only when the trust context is known. | 21 | codex-context |
| CLI flags the inspector cannot observe remain a report limitation unless you supply them. | 14 | report-limitations |
| Requirements: Rust 1.85 or later, Node 22 or later, and Chromium for Playwright 1.58.2. | 14 | Requirement |
| npm test runs Rust and browser tests and checks every product claim. | 12 | Verification instruction |
| It also checks keyboard paths and axe findings at desktop and 390 px. | 13 | Verification instruction |
| npm run build creates the release binary under target/release/permit-map and the static site under dist/site/. | 15 | Build instruction |
| Run the site locally. | 4 | Usage instruction |
| The deploy target is dist/site. | 5 | Deployment instruction |
| Its index.html is at the root. | 6 | Deployment instruction |
| The site has no runtime third-party scripts, fonts, analytics, or API calls. | 12 | site-no-third-parties |

Core terms remain consistent: policy file, matcher, decision, effective, shadowed, layer, report, and demo.

## Demo and sandbox behavior

- The home action reached /?demo=1 in one click.
- The first phone viewport contained the persistent **“Demo — sample data, nothing is saved”** banner, Reset demo, View install command, the 4 / 9 / 1 summary, and three realistic rules. Their bottoms were 442, 466, and 491 px.
- The full browser table contained ten rows with decision, status, matcher, and source data.
- Reset restored the sample status and worked after the loaded page was put offline in the registered test. F-5-1 covers its visual regression.
- Fresh live contexts requested only the product origin. Cookies, IndexedDB, Cache Storage, and service-worker registrations remained empty.
- A seeded real:sentinel localStorage value, real:session sessionStorage value, and sentinel cookie remained unchanged after entering and resetting the demo.
- A CLI demo run from /tmp/permit-map-review5-caller.mv3cvf exited 0, reported /tmp/permit-map-demo-7023-1787951737426, returned four sources, nine effective rules, one shadowed rule, and ten total rows. The caller directory still contained only its unchanged sentinel.
- A separate open/openat trace observed eight application file opens, all inside the generated demo directory, and no caller-path open. F-5-2 records the missing permanent claim coverage.

## Claims audit

Every literal test command in .factory/claims.json ran separately from the clean clone. All 22 passed.

| Claim ID | Result | Observable check |
|---|---|---|
| demo-resolves | PASS | Browser and CLI report 4 sources, 9 effective, 1 shadowed. |
| demo-entry | PASS | One click opens the phone-visible banner, summary, and real rows. |
| demo-rule-provenance | PASS | Browser decision, status, matcher, and source match CLI JSON. |
| report-formats | PASS | Terminal, JSON, and Markdown reports are produced. |
| success-exit | PASS | A successful inspection returns 0 and valid JSON. |
| policy-files | PASS | The open/openat trace includes the known policy and excludes every decoy. |
| no-secret-storage | PASS | The secret decoy is absent from output, report, and state directory. |
| no-account | PASS | A clean demo has no account form or cookies. |
| mit-license | PASS | LICENSE and Cargo metadata identify MIT. |
| browser-privacy | PASS | Demo requests stay same-origin and browser stores remain empty. |
| site-no-third-parties | PASS | Every route avoids third parties and persistence. |
| cli-local | PASS | Runtime dependencies and source contain no network, telemetry, or agent-launch client. |
| resolution-order | PASS | Claude exact matches resolve deny, then ask, then allow. |
| codex-context | PASS | Project trust gating and unaffected scopes resolve as documented. |
| codex-rules | PASS | Multiline, union, default, and precedence cases resolve as documented. |
| vendor-policy-safe | PASS | Direct and hard-link vendor-policy overwrite attempts are refused. |
| vendor-settings-unchanged | PASS | Discovered policy hashes remain unchanged. |
| cli-errors | PASS | Missing, unreadable, and malformed cases return 2 with recovery steps. |
| vendor-boundaries | PASS | Vendors stay separate and overlapping patterns remain visible. |
| report-limitations | PASS | Every output format states overlap and unobserved-context limits. |
| touch-targets | PASS | Visible home links measure at least 44 px at 390 px. |
| demo-isolated | PASS | CLI demo output stays in its temporary directory. |

Claim-like sentences on the live home, demo, privacy, and terms pages and in README otherwise map to the entries named in the copy audit or to instructions, metadata, limitations, and legal text. F-5-2 is the only unlisted claim. No listed claim remains untested.

## Earlier findings

Every earlier review, polish record, and handoff was read. Each earlier finding was checked against both the live behavior and current code.

| Earlier ID | Current confirmation |
|---|---|
| F-1-1 | Fixed: the phone demo shows its banner, 4 / 9 / 1 summary, and three complete rows above the fold. |
| F-1-2 | Fixed: README splits supported Codex layers from nearest-file precedence; both sentences are under 22 words. |
| F-1-3 | Fixed: unknown trust, unaffected scopes, and accepted values are separate short sentences. |
| F-1-4 | Fixed: README splits the npm test description into two sentences. |
| F-1-5 | Fixed: the CTA says it opens an isolated sample and demo-entry tests the one-click route. |
| F-1-6 | Fixed: sample wording is scoped, and every displayed rule field is compared with CLI JSON. |
| F-1-7 | Fixed: site-no-third-parties checks every public route, storage, cookies, requests, and service workers. |
| F-2-1 | Fixed: the action is View install command and moves focus to the install heading. |
| F-2-2 | Fixed: success-exit is registered once and asserts status 0 plus valid output. |
| F-2-3 | Fixed: Terms uses the present instruction “Check this page and the project changelog for changes.” |
| F-3-1 | Fixed: cli-errors covers missing, unreadable, and malformed input with exit 2 and recovery text. |
| F-4-1 | Fixed: the decorative numbered transit labels and metaphor headings are absent from the live landing page and source. |
| F-4-2 | Fixed: policy-files uses the checked-in LD_PRELOAD open/openat tracer and verifies known and decoy paths directly. |
| F-4-3 | Fixed: no-secret-storage and report-limitations are registered and pass in all promised output formats. |

No earlier finding is reopened. F-5-1 is a newly observed interactive-state failure.

## Structure, routing, links, and identity

- /, /?demo=1, /demo, /privacy, /terms, and /404 returned 200. /review-5-definitely-missing returned HTTP 404 with the designed recovery page.
- Every checked route had lang=en, one h1, one main, a route-specific title, a description, canonical URL, social image metadata, favicon, shared header/footer, skip link, Privacy, and Terms.
- Titles follow the required home “Product — what it does” and secondary “Route — Product” patterns.
- Direct deep links rendered. SPA navigation focused the new h1. Browser Back restored the home URL, scroll position, and sample-link focus.
- All linked site assets, the source repository, and Param Factory returned 200. robots.txt and sitemap.xml returned 200.
- Live normal routes produced no console or page errors. The only console network entry was the expected failed document request for the deliberate 404.
- Response headers include self-only CSP with frame-ancestors, HSTS, nosniff, strict-origin referrer policy, and permissions policy.
- JavaScript is 15.05 kB uncompressed and 5.12 kB gzip. CSS is 14.40 kB uncompressed and 4.19 kB gzip.
- The warm paper, dark ink, clipped ticket controls, rail geometry, and original art-deco poster match .factory/design.md. The result is distinct from a generic SaaS template.
- Settled route axe scans returned no violations. F-5-1 records the contrast failures in the Reset interaction.

The factory URL verifier also confirmed a title, lang=en, one h1, one main, no missing image alternative, no unlabeled button, and no normal-load console error.

## Clean-clone quality gates

- npm test: PASS — 6 Rust unit tests, 8 Rust integration tests, and 86 Playwright tests.
- npm run typecheck: PASS.
- npm run lint: PASS.
- npm run build: PASS; dist/site and target/release/permit-map were produced.
- All 22 exact claim commands: PASS.

Passing these gates does not close F-5-1 because the current tests do not audit contrast during Reset. It also does not close F-5-2 because demo-isolated checks writes, not caller-file reads.

## Missed leverage

No missed-leverage finding was found. The brief calls for deterministic local policy resolution. Terminal, JSON, and Markdown reports provide the useful export paths. Sync would conflict with the local-only scope, and model output would add unnecessary uncertainty to precedence resolution. No decorative AI feature, provider key, or runtime model call is present.

## What would make this perfect

Replace the table-wide opacity pulse with feedback that preserves text contrast, then add a phone test for the animation midpoint after Reset. Register and trace the CLI demo’s caller-read isolation, or narrow that promise. Re-run the complete live and clean-clone checklist. A PASS requires zero findings.
