# Adversarial first-read review 2 — Permit Map

**Verdict: FAIL**

Reviewed 28 August 2026 UTC against live <https://agent-permission-map.sociobot.in>, commit `374410249ae55dcb7b0e85db47fc1f9c40f01cdc`, and a new clean local clone. Product code was not modified.

## Cold read

At 390 × 844 and 1440 × 1000, before scrolling, the first screen answers all three first-read questions.

- **What it does:** It resolves coding-agent permissions before they run.
- **For whom:** Engineers using several coding agents across repositories.
- **What to click:** **Try it with sample data**; its adjacent text says it opens an isolated sample map in this browser.

The exact headline, **“See agent permissions before they run,”** is six words. The audience sentence is visible on the phone without scrolling. This is not a first-screen blocker.

## Findings

### F-2-1 — MINOR — “Start for real” does not name the result

**Location/quote:** Demo banner button, **“Start for real.”**

**Why:** The action only scrolls to installation instructions. “Start for real” does not tell a cold visitor what appears or whether it will start an inspection. This fails the result-naming button check.

**Concrete fix:** Rename it **“View install command”** (or **“Show install steps”**) and keep the existing focus transfer to `#install`.

### F-2-2 — MINOR — README success-exit promise has no registered claim

**Location/quote:** [README.md](../README.md#L59), **“Successful reports exit with code `0`.”**

**Why:** A script author can rely on this behaviour, but `.factory/claims.json` contains no claim for a successful exit status. `report-formats` checks output formats, not this stated contract.

**Concrete fix:** Add `success-exit` to `claims.json` and a tagged test that runs a successful inspection and asserts status `0`; or remove the sentence.

### F-2-3 — MINOR — Terms page makes an untestable future-change promise

**Location/quote:** `/terms`, **“Material changes will appear in this page and the project changelog.”**

**Why:** This is a visitor-facing promise with no `claims.json` entry or executable way to verify future notice behaviour.

**Concrete fix:** Replace it with the non-promissory instruction **“Check this page and the project changelog for changes.”**

## Copy audit

Counts treat hyphenated compounds and code identifiers as one word. Commands, URLs, path-table cells, rule rows, and purely decorative route numbers are excluded because they are not sentences. All included landing and README copy is listed below. No item exceeds 22 words. No banned marketing adjective, inconsistent core term, or context-free semantic heading was found. The three findings above are noted in the result column.

### Landing page

| Copy | Words | Result |
|---|---:|---|
| Local policy inspector · line 01 | 5 | Pass |
| See agent permissions before they run | 6 | Pass |
| For engineers using several coding agents, Permit Map resolves the rules each repository will apply. | 14 | Pass |
| Try it with sample data | 6 | Pass |
| Opens the isolated sample map in this browser. | 8 | `demo-entry` |
| Reads known policy files only. | 5 | `policy-files` |
| Runs without an account. | 4 | `no-account` |
| Free under the MIT license. | 5 | `mit-license` |
| Global | 1 | Pass |
| Repo | 1 | Pass |
| Worktree | 1 | Pass |
| Resolved policy · line 02 | 5 | Pass |
| The sample table shows every decision | 6 | `demo-rule-provenance` |
| See each sample rule’s decision, status, and source file. | 9 | `demo-rule-provenance` |
| Open the full sample map | 6 | `demo-entry` |
| Bundled sample repository | 3 | Pass |
| Permit Map — 4 sources, 9 effective, 1 shadowed | 8 | `demo-resolves` |
| Working timetable · line 03 | 5 | Pass |
| Inspect a repository in three steps | 6 | Pass |
| Point at a repository | 4 | Pass |
| Permit Map checks documented Claude Code and Codex policy paths. | 9 | `policy-files` |
| Check the decision context | 4 | Pass |
| Claude denies win. | 3 | `resolution-order` |
| Codex project rules need the trust context. | 7 | `codex-context` |
| Share the result | 3 | Pass |
| Print a table or write JSON and Markdown for review. | 10 | `report-formats` |
| Depart from your terminal | 4 | Pass |
| Install the single binary | 4 | Pass |
| Clone the source repository, then build with a current Rust toolchain. | 11 | Instruction |
| Copy command | 2 | Pass |
| Clear boundaries · line 04 | 5 | Pass |
| What Permit Map does not do | 6 | Pass |
| It does not run an agent. | 6 | `cli-local` |
| It does not change vendor settings. | 6 | `vendor-settings-unchanged` |
| It does not read source files or credential stores. | 9 | `policy-files` |
| It does not guess when vendor patterns overlap. | 8 | `vendor-boundaries` |
| Resolve coding-agent permissions before a session. | 6 | Pass |
| Privacy | 1 | Pass |
| Terms | 1 | Pass |
| Built by Param Factory | 4 | Pass |
| Version 0.1.0 · build 2026.08.28 | 4 | Build identifier |

### README

| Copy | Words | Result |
|---|---:|---|
| Resolve coding-agent permissions before an agent runs. | 7 | Pass |
| Permit Map is for engineers who use Claude Code or Codex across several repositories. | 14 | Pass |
| The local CLI finds documented policy files, resolves supported exact matches, marks shadowed or unresolved rules, and writes a reviewable report. | 21 | Covered by policy/resolution/report claims |
| It does not run agents, scan source files, or store secrets. | 11 | `cli-local`; `policy-files` |
| It refuses to write a report over a discovered vendor policy. | 11 | `vendor-policy-safe` |
| Permit Map is free software under the MIT license. | 9 | `mit-license` |
| The demo command copies the bundled sample policies into a new temporary directory. | 13 | `demo-isolated` |
| It does not inspect the current repository. | 7 | `demo-isolated` |
| A demo `--output` path must be relative and is written inside that temporary directory. | 14 | `demo-isolated` |
| The browser route shows the same four sample files, nine effective rules, and one shadowed rule. | 16 | `demo-resolves` |
| It sets no cookies and stores no browser data. | 9 | `browser-privacy` |
| See `.factory/demo.md` for the reset and isolation contract. | 8 | Documentation link |
| Clone the repository, then build the single binary with a current stable Rust toolchain. | 14 | Instruction |
| The package starts at version `0.1.0`. | 6 | Release metadata |
| The factory owns registry publishing; this repository is ready for `cargo package` but does not publish from CI. | 18 | Process note |
| Inspect the current repository and user-level policy files. | 8 | Instruction |
| Write a Markdown report without user-level files. | 7 | `report-formats` |
| Produce JSON for scripts. | 4 | `report-formats` |
| Successful reports exit with code `0`. | 6 | **F-2-2** |
| Missing paths, unreadable files, and malformed supported files exit with code `2` and an actionable error. | 16 | `cli-errors` |
| For safety, `--output` creates a new report file and refuses known policy paths and their filesystem aliases. | 17 | `vendor-policy-safe` |
| Permit Map opens these paths automatically. | 6 | `policy-files` |
| The Claude adapter reads `permissions.allow`, `permissions.ask`, and `permissions.deny`. | 11 | `resolution-order` |
| The Codex adapter reads documented multiline `prefix_rule` entries. | 9 | `codex-rules` |
| Those rules accept string prefixes and union lists; an omitted decision defaults to `allow`. | 14 | `codex-rules` |
| It never treats the undocumented `config.local.toml` path as Codex configuration. | 10 | `policy-files` |
| Permit Map uses vendor-specific, explicit rules. | 6 | Pass |
| Claude exact matches resolve deny, then ask, then allow across every discovered scope. | 13 | `resolution-order` |
| Codex command rules resolve exact prefixes as forbidden, then prompt, then allow. | 12 | `codex-rules` |
| Codex controls use system, user, profile, and trusted project files. | 10 | `codex-context` |
| The closest file to the inspected directory wins. | 9 | `codex-context` |
| Codex project rows stay `unresolved` until you set `--codex-trust`. | 10 | `codex-context` |
| System, user, profile, and supplied CLI overrides still resolve. | 9 | `codex-context` |
| Accepted values are `trusted` and `untrusted`. | 6 | `codex-context` |
| Pass `--codex-profile NAME` and repeat `--codex-config key=value` for context supplied to the Codex invocation. | 15 | `codex-context` |
| Different vendors never shadow one another. | 6 | `vendor-boundaries` |
| Pattern overlap remains visible but unresolved. | 6 | `vendor-boundaries` |
| Vendor match languages can assign different meanings to broad and narrow patterns. | 12 | `vendor-boundaries` |
| Every report includes this limitation instead of guessing. | 8 | `vendor-boundaries` |
| Codex sandbox and approval settings are controls rather than command matchers. | 11 | `codex-context` |
| Permit Map compares those controls by name across layers and shows the selected value only when the trust context is known. | 21 | `codex-context` |
| CLI flags the inspector cannot observe remain a report limitation unless you supply them. | 14 | Pass |
| Requirements: Rust 1.85 or later, Node 22 or later, and Chromium for Playwright 1.58.2. | 14 | Requirement |
| `npm test` runs Rust and browser tests and checks every product claim. | 11 | Verification instruction |
| It also checks keyboard paths and axe findings at desktop and 390 px. | 12 | Verification instruction |
| `npm run build` creates the release binary under `target/release/permit-map` and the static site under `dist/site/`. | 18 | Build instruction |
| Run the site locally. | 4 | Instruction |
| The deploy target is `dist/site`. | 6 | Deployment instruction |
| Its `index.html` is at the root. | 6 | Deployment instruction |
| The site has no runtime third-party scripts, fonts, analytics, or API calls. | 12 | `site-no-third-parties` |

## Demo, sandbox, claims, and CLI

The one-click path goes to `/?demo=1`. In a fresh 390 × 844 context, its persistent banner says **“Demo — sample data, nothing is saved”** and exposes **Reset demo** and **Start for real**. The initial viewport contains the 4 sources / 9 effective / 1 shadowed summary and three realistic decision, matcher, and source rows. Reset updates the polite status to **“Sample reset…”** and works with the page offline.

Fresh phone and desktop contexts recorded only same-origin page, JavaScript, CSS, and image requests. After reset, cookies, localStorage, sessionStorage, IndexedDB, Cache Storage, and service-worker registrations were all empty. The sample remains in document memory, so it cannot read or write real browser data.

From a temporary caller directory, the built `permit-map demo --format json` created and reported a separate `/tmp/permit-map-demo-*` directory, returned the expected sample, and left a sentinel caller file unchanged.

I created a new clone, ran `npm ci`, then executed every literal command listed by all 19 `.factory/claims.json` entries. Every command passed. The subsequent `npm test` passed all 78 Playwright executions plus 6 Rust unit and 8 Rust integration tests. `npm run typecheck`, `npm run build`, `cargo fmt --all -- --check`, and `cargo clippy --all-targets --all-features -- -D warnings` passed.

## Earlier findings and history

Read `.factory/review-1.md`, `.factory/polish-1.md`, and `.factory/handoff.md` in full. All prior review findings are confirmed fixed in live behaviour and code:

| Earlier ID | Confirmation |
|---|---|
| F-1-1 | Phone demo now has the summary and three complete sample rows above the 844 px fold. |
| F-1-2 | README Codex-controls wording is split into two short sentences. |
| F-1-3 | README trust-context wording is split and accepted values are separate. |
| F-1-4 | README test-description wording is split. |
| F-1-5 | CTA says “isolated sample map” and `demo-entry` tests the one-click phone path. |
| F-1-6 | Preview copy is scoped to the sample and `demo-rule-provenance` compares all visible fields with the CLI data. |
| F-1-7 | `site-no-third-parties` visits all public routes and verifies requests and browser persistence. |

No prior finding was re-opened.

## Structure and live checks

`/`, `/demo`, `/privacy`, `/terms`, `/404`, and a missing route were checked directly. The real missing route returns HTTP 404 and renders the designed, branded recovery page; the named `/404` document is a normal static route and returns 200. Each checked route has a route-specific title, one h1, one main landmark, description, canonical URL, Open Graph/Twitter metadata, favicon, shared header/footer, skip link, Privacy and Terms links, and no horizontal phone overflow. The main title follows the required product-plus-job pattern; secondary routes follow the permitted `Route — Product` form.

Deep routes render on direct load. SPA navigation moves focus to the new h1; browser back restores the home h1 after the animation frame. `robots.txt`, `sitemap.xml`, CSP, and the deployed missing-route override are present. All internal, download, GitHub, and Param Factory links returned 200 (or the intentional missing-route 404). The art-deco transit-poster composition, warm paper/ink palette, clipped tickets, and route diagram are distinct from a generic SaaS template and match `.factory/design.md`.

The brief calls for a local policy CLI. JSON and Markdown output cover the implied export need; no account, sync service, or decorative AI feature is implied. No provider key or runtime AI call is present.

## What would make this perfect

Rename the demo exit action so it says it shows installation instructions, register the successful-zero-exit contract, and remove or make non-promissory the future-change sentence. Re-run this complete checklist afterward. A PASS requires zero findings.
