# Adversarial first-read review 6 — Permit Map

**Verdict: PASS**

Reviewed 28 August 2026 UTC against live `https://agent-permission-map.sociobot.in`, repository commit `dd1bd84ca607ea2a301450cea4026d0b95116b0f`, and clean clone `/tmp/permit-map-review6.E0KZvV/repo`. Product code was not modified. This is a full re-run, not a diff review.

## Cold read

Fresh 390 × 844 and 1440 × 1000 contexts opened the home page without scrolling.

| Question | Answer from the first screen | Exact live text |
|---|---|---|
| What does this do? | It resolves coding-agent permissions before an agent runs. | “Resolve coding-agent permissions before an agent runs” |
| For whom? | Engineers using several coding agents and repositories. | “For engineers using several coding agents, Permit Map resolves the rules each repository will apply.” |
| What should I click first? | Open the isolated sample. | “Try it with sample data” and “Opens the isolated sample map in this browser.” |

All three answers and the three plain facts are visible without scrolling. On the phone their bottoms are 741, 770, and 800 px, within the 844 px viewport. This is not a blocking first-screen failure.

## Findings

None. No blocking or minor issue remains.

## Copy audit

Counts use visible words separated by whitespace. Hyphenated terms, identifiers, versions, and numbers count as one word. Commands, URLs, policy-table paths, and sample-rule cells are data rather than prose. Headings, labels, buttons, image alternatives, and informative fragments are included because clarity and action naming were checked too.

No landing or README sentence exceeds 22 words. No banned marketing adjective, unexplained jargon, inconsistent core term, metaphor heading, slogan, or non-result-naming button was found. Claim-like product statements map to the named registered claims below; the remaining items are instructions, metadata, or documentation labels.

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
| Opens the isolated sample map in this browser. | 8 | `demo-entry` |
| Reads known policy files only. | 5 | `policy-files` |
| Runs without an account. | 4 | `no-account` |
| Free under the MIT license. | 5 | `mit-license` |
| Three geometric rail routes converge on permit, review, and stop signals. | 11 | Informative image alternative |
| Policy layers resolve from global to worktree | 7 | Informative diagram label |
| Global | 1 | Diagram label |
| Repo | 1 | Diagram label |
| Worktree | 1 | Diagram label |
| The sample table shows every decision | 6 | `demo-rule-provenance` |
| See each sample rule’s decision, status, and source file. | 9 | `demo-rule-provenance` |
| Open the full sample map | 5 | Result-naming link |
| Bundled sample repository | 3 | Terminal caption |
| Permit Map — 4 sources, 9 effective, 1 shadowed | 8 | `demo-resolves` |
| Inspect a repository in three steps | 6 | Clear section heading |
| Point at a repository | 4 | Clear step heading |
| Permit Map checks documented Claude Code and Codex policy paths. | 10 | `policy-files` |
| Check the decision context | 4 | Clear step heading |
| Claude deny rules take precedence. | 5 | `resolution-order` |
| Codex project rules need the trust context. | 7 | `codex-context` |
| Share the result | 3 | Clear step heading |
| Print a table or write JSON and Markdown for review. | 10 | `report-formats` |
| Install the single binary | 4 | Clear section heading |
| Clone the source repository, then build with a current Rust toolchain. | 11 | Installation instruction |
| Copy command | 2 | Result-naming button |
| What Permit Map does not do | 6 | Clear section heading |
| It does not run an agent. | 6 | `cli-local` |
| It does not change vendor settings. | 6 | `vendor-settings-unchanged` |
| It does not read source files or credential stores. | 9 | `policy-files` |
| It does not guess when vendor patterns overlap. | 8 | `vendor-boundaries` |
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
| The local CLI finds documented policy files, resolves supported exact matches, marks shadowed or unresolved rules, and writes a reviewable report. | 21 | Policy, resolution, and report claims |
| It does not run agents, scan source files, or store secrets. | 11 | `cli-local`, `policy-files`, `no-secret-storage` |
| It refuses to write a report over a discovered vendor policy. | 11 | `vendor-policy-safe` |
| Permit Map is free software under the MIT license. | 9 | `mit-license` |
| The demo command copies bundled policies into a new temporary directory. | 11 | `demo-isolated` |
| It does not read the current repository. | 7 | `demo-isolated` |
| A demo `--output` path stays inside that directory. | 9 | `demo-isolated` |
| The browser route shows the same four sample files, nine effective rules, and one shadowed rule. | 16 | `demo-resolves` |
| It sets no cookies and stores no browser data. | 9 | `browser-privacy` |
| See `.factory/demo.md` for the reset and isolation contract. | 8 | Documentation instruction |
| Clone the repository, then build the single binary with a current stable Rust toolchain. | 14 | Installation instruction |
| The package starts at version `0.1.0`. | 6 | Release metadata |
| The factory owns registry publishing; this repository is ready for `cargo package` but does not publish from CI. | 18 | Packaging note |
| Inspect the current repository and user-level policy files. | 8 | Usage instruction |
| Write a Markdown report without user-level files. | 7 | `report-formats` |
| Produce JSON for scripts. | 4 | `report-formats` |
| Successful reports exit with code `0`. | 6 | `success-exit` |
| Missing paths, unreadable files, and malformed supported files exit with code `2` and an actionable error. | 16 | `cli-errors` |
| For safety, `--output` creates a new report file and refuses known policy paths and their filesystem aliases. | 17 | `vendor-policy-safe` |
| Permit Map opens these paths automatically. | 6 | `policy-files` |
| The Claude adapter reads `permissions.allow`, `permissions.ask`, and `permissions.deny`. | 11 | `resolution-order` |
| The Codex adapter reads documented multiline `prefix_rule` entries. | 9 | `codex-rules` |
| Those rules accept string prefixes and union lists; an omitted decision defaults to `allow`. | 14 | `codex-rules` |
| It never treats the undocumented `config.local.toml` path as Codex configuration. | 10 | `policy-files` |
| Permit Map uses vendor-specific, explicit rules. | 6 | Explanation |
| Claude exact matches resolve deny, then ask, then allow across every discovered scope. | 13 | `resolution-order` |
| Codex command rules resolve exact prefixes as forbidden, then prompt, then allow. | 12 | `codex-rules` |
| Codex controls use system, user, profile, and trusted project files. | 10 | `codex-context` |
| The closest file to the inspected directory wins. | 8 | `codex-context` |
| Codex project rows stay `unresolved` until you set `--codex-trust`. | 9 | `codex-context` |
| System, user, profile, and supplied CLI overrides still resolve. | 9 | `codex-context` |
| Accepted values are `trusted` and `untrusted`. | 6 | `codex-context` |
| Pass `--codex-profile NAME` and repeat `--codex-config key=value` for context supplied to the Codex invocation. | 15 | Usage instruction |
| Different vendors never shadow one another. | 6 | `vendor-boundaries` |
| Pattern overlap remains visible but unresolved. | 6 | `vendor-boundaries` |
| Vendor match languages can assign different meanings to broad and narrow patterns. | 12 | Technical explanation |
| Every report includes this limitation instead of guessing. | 8 | `report-limitations` |
| Codex sandbox and approval settings are controls rather than command matchers. | 11 | `codex-context` |
| Permit Map compares those controls by name across layers and shows the selected value only when the trust context is known. | 21 | `codex-context` |
| CLI flags the inspector cannot observe remain a report limitation unless you supply them. | 14 | `report-limitations` |
| Requirements: Rust 1.85 or later, Node 22 or later, and Chromium for Playwright 1.58.2. | 14 | Requirement |
| `npm test` runs Rust and browser tests and checks every product claim. | 12 | Verification instruction |
| It also checks keyboard paths and axe findings at desktop and 390 px. | 13 | Verification instruction |
| `npm run build` creates the release binary under `target/release/permit-map` and the static site under `dist/site/`. | 18 | Build instruction |
| Run the site locally. | 4 | Usage instruction |
| The deploy target is `dist/site`. | 5 | Deployment instruction |
| Its `index.html` is at the root. | 6 | Deployment instruction |
| The site has no runtime third-party scripts, fonts, analytics, or API calls. | 12 | `site-no-third-parties` |

Core terms remain consistent: policy file, matcher, decision, effective, shadowed, layer, report, and demo.

## Demo and sandbox behavior

- One click from the landing page reached `/?demo=1` in a fresh context.
- At 390 × 844, the first demo viewport contained the persistent **“Demo — sample data, nothing is saved”** banner, Reset demo, View install command, the 4 / 9 / 1 summary, and three complete realistic rules. Their bottoms were 442, 466, and 491 px.
- The full browser table showed all ten sample rows with decision, status, matcher, and source data.
- Reset restored the sample status, worked after the loaded page was made offline, and retained text contrast; the existing active-reset test passed.
- Fresh live contexts requested only `https://agent-permission-map.sociobot.in`; cookies, local/session storage, IndexedDB, Cache Storage, and service workers were empty.
- When `real:sentinel` localStorage and `real:session` sessionStorage values were seeded before entry, they remained unchanged after entering and resetting demo mode. The demo itself added no storage.
- From a new temporary caller directory, the compiled CLI `demo --format json` exited 0, reported a separate `permit-map-demo-*` directory, returned 4 sources / 9 effective / 1 shadowed rules, and left the caller directory containing only its sentinel. The registered syscall trace further proves no caller path is opened.

## Claims audit

Read `.factory/claims.json` first. Every one of its 22 literal test commands was run separately from the fresh clone after `npm ci`; all passed. A clean-clone `npm test` also passed: 6 Rust unit tests, 8 Rust integration tests, and 88 Playwright tests.

| Claim ID | Result | Observable check |
|---|---|---|
| `demo-resolves` | PASS | Browser and CLI report 4 sources, 9 effective, 1 shadowed. |
| `demo-entry` | PASS | One click opens phone-visible banner, summary, and real rows. |
| `demo-rule-provenance` | PASS | Browser decision, status, matcher, and source match CLI JSON. |
| `report-formats` | PASS | Terminal, JSON, and Markdown reports are produced. |
| `success-exit` | PASS | A successful inspection returns 0 and valid JSON. |
| `policy-files` | PASS | The open/openat trace includes known policy and excludes decoys. |
| `no-secret-storage` | PASS | The secret decoy is absent from output, report, and state directory. |
| `no-account` | PASS | A clean demo has no account form or cookies. |
| `mit-license` | PASS | LICENSE and Cargo metadata identify MIT. |
| `browser-privacy` | PASS | Demo requests stay same-origin and browser stores remain empty. |
| `site-no-third-parties` | PASS | Every route avoids third parties and persistence. |
| `cli-local` | PASS | Runtime dependencies and source contain no network, telemetry, or agent-launch client. |
| `resolution-order` | PASS | Claude exact matches resolve deny, then ask, then allow. |
| `codex-context` | PASS | Project trust gating and unaffected scopes resolve as documented. |
| `codex-rules` | PASS | Multiline, union, default, and precedence cases resolve as documented. |
| `vendor-policy-safe` | PASS | Direct and hard-link policy overwrite attempts are refused. |
| `vendor-settings-unchanged` | PASS | Discovered policy hashes remain unchanged. |
| `cli-errors` | PASS | Missing, unreadable, and malformed cases return 2 with recovery steps. |
| `vendor-boundaries` | PASS | Vendors stay separate and overlaps remain visible. |
| `report-limitations` | PASS | Every output format states overlap and unobserved-context limits. |
| `touch-targets` | PASS | Visible home links measure at least 44 px at 390 px. |
| `demo-isolated` | PASS | CLI demo neither reads caller paths nor changes anything outside its temporary directory. |

No claim-like sentence on the landing page or README was left without coverage. No listed claim was untested or failed.

## Earlier findings

Every earlier `.factory/review-*.md`, `.factory/polish-*.md`, and the preceding handoff was read. Each finding was checked against live behavior and current code.

| Earlier ID | Current confirmation |
|---|---|
| F-1-1 | Fixed: the phone demo shows its banner, 4 / 9 / 1 summary, and three complete rows above the fold. |
| F-1-2 | Fixed: README separates Codex layers and precedence; the sentences are under 22 words. |
| F-1-3 | Fixed: unknown trust, unaffected scopes, and accepted values are separate short sentences. |
| F-1-4 | Fixed: README splits the `npm test` description into two short sentences. |
| F-1-5 | Fixed: the CTA states it opens an isolated sample, and `demo-entry` tests the path. |
| F-1-6 | Fixed: sample wording is scoped and displayed rule fields match CLI JSON. |
| F-1-7 | Fixed: whole-route privacy testing checks requests, storage, cookies, and service workers. |
| F-2-1 | Fixed: **View install command** names its result and focuses the install heading. |
| F-2-2 | Fixed: `success-exit` is registered and asserts status 0 plus valid output. |
| F-2-3 | Fixed: Terms uses the present instruction “Check this page and the project changelog for changes.” |
| F-3-1 | Fixed: `cli-errors` covers missing, unreadable, and malformed input with exit 2 and recovery text. |
| F-4-1 | Fixed: decorative transit labels and metaphor headings are absent while the art-deco identity remains. |
| F-4-2 | Fixed: `policy-files` uses the checked-in syscall tracer against known and decoy paths. |
| F-4-3 | Fixed: secret-storage and report-limitations contracts are registered and pass. |
| F-5-1 | Fixed: Reset uses an opaque feedback outline; the active phone state keeps visible table text at 4.5:1 or better. |
| F-5-2 | Fixed: `demo-isolated` traces caller-directory reads as well as writes and proves the broader documented isolation contract. |

No earlier finding is reopened.

## Structure, routing, links, and identity

- Live `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and `/404/` returned 200. A new unknown path returned HTTP 404 with the designed recovery page and way home.
- Each checked route had `lang=en`, one `<h1>`, one `<main>`, route-specific title, description, canonical URL, Open Graph/Twitter metadata, favicon, shared header/footer, skip link, Privacy, and Terms.
- Titles follow the required product/route patterns; direct deep links work. In-app route changes focus the new heading and update the live region. Browser Back restores the previous route and focus.
- All landing links, including the source repository and Param Factory, returned 200. `robots.txt` and `sitemap.xml` are present.
- Fresh normal routes produced no console errors. The browser reports the expected network error for an intentional HTTP-404 document, not an application exception.
- The deployed CSP is self-only and includes response-header `frame-ancestors`; nosniff, strict-origin referrer policy, HSTS, and permissions policy are present.
- Live axe scans returned zero violations on every public route. The built JavaScript is about 5.14 kB gzip, well within the static-site limit.
- The warm paper, dark ink, clipped ticket controls, rail geometry, and original art-deco poster match `.factory/design.md` and are visibly distinct from a generic SaaS template.

## Missed leverage

No finding. The brief calls for deterministic local policy resolution. JSON and Markdown output provide the useful export paths. Sync would violate the local-only scope; model output would add uncertainty to a precedence tool. No decorative AI feature, provider key, or runtime model call is present.

## What would make this perfect

The current implementation has no review action remaining. Preserve the claim-by-claim clean-clone checks and the live mobile demo path on future changes.
