# Permit Map copy audit

Audited 28 August 2026, polish round 4. Counts treat hyphenated terms as one word. Interface labels and headings are included even when they are fragments. Commands, URLs, rule-table values, and file paths are examples or data rather than prose. No line exceeds 22 words. No line contains a banned marketing word or decorative transit lore.

## First screen

| Copy | Words | Result |
|---|---:|---|
| Resolve coding-agent permissions before an agent runs | 7 | Resolution job |
| For engineers using several coding agents, Permit Map resolves the rules each repository will apply. | 15 | Pass |
| Try it with sample data | 5 | Pass |
| Opens the isolated sample map in this browser. | 8 | Pass |
| Reads known policy files only. | 5 | `policy-files` |
| Runs without an account. | 4 | Pass |
| Free under the MIT license. | 5 | Pass |

Read-aloud check: “Resolve coding-agent permissions before an agent runs. For engineers using several coding agents, Permit Map resolves the rules each repository will apply. Try it with sample data.” This states the job, audience, and first action in one breath.

## Remaining landing page

| Copy | Words | Result |
|---|---:|---|
| Skip to main content | 4 | Clear utility link |
| Permit Map | 2 | Wordmark |
| Demo | 1 | Clear nav link |
| Install | 1 | Clear nav link |
| Privacy | 1 | Clear nav link |
| Three geometric rail routes converge on permit, review, and stop signals. | 11 | Informative image alternative |
| Policy layers resolve from global to worktree | 7 | Informative diagram label |
| Global | 1 | Diagram label |
| Repo | 1 | Diagram label |
| Worktree | 1 | Diagram label |
| The sample table shows every decision | 6 | Pass |
| See each sample rule’s decision, status, and source file. | 9 | Pass |
| Open the full sample map | 5 | Pass |
| Bundled sample repository | 3 | Terminal caption |
| Inspect a repository in three steps | 6 | Pass |
| Point at a repository | 4 | Pass |
| Permit Map checks documented Claude Code and Codex policy paths. | 10 | Pass |
| Check the decision context | 4 | Pass |
| Claude deny rules take precedence. Codex project rules need the trust context. | 11 | Pass |
| Share the result | 3 | Pass |
| Print a table or write JSON and Markdown for review. | 10 | Pass |
| Install the single binary | 4 | Pass |
| Clone the source repository, then build with a current Rust toolchain. | 11 | Pass |
| Copy command | 2 | Pass |
| What Permit Map does not do | 6 | Pass |
| It does not run an agent. | 6 | Pass |
| It does not change vendor settings. | 6 | Pass |
| It does not read source files or credential stores. | 9 | Pass |
| It does not guess when vendor patterns overlap. | 8 | Pass |
| Resolve coding-agent permissions before an agent runs. | 7 | Footer summary |
| Terms | 1 | Clear footer link |
| Built by Param Factory | 4 | Clear external link |
| Version 0.1.0 · build 2026.08.28 | 4 | Build identifier |

## Demo and terms updates

| Copy | Words | Result |
|---|---:|---|
| Demo — sample data, nothing is saved | 6 | Pass |
| Reset demo | 2 | Pass |
| View install command | 3 | Pass |
| Check this page and the project changelog for changes. | 9 | Pass |
| How Permit Map handles data | 5 | Clear privacy heading |
| Terms for using Permit Map | 5 | Clear terms heading |
| This page was not found | 5 | Clear 404 heading |
| Return to Permit Map | 4 | Clear recovery action |

## README error contract

| Copy | Words | Result |
|---|---:|---|
| Missing paths, unreadable files, and malformed supported files exit with code 2 and an actionable error. | 16 | `cli-errors` |
| It does not run agents, scan source files, or store secrets. | 11 | `cli-local`; `policy-files`; `no-secret-storage` |
| Every report includes this limitation instead of guessing. | 8 | `report-limitations` |
| CLI flags the inspector cannot observe remain a report limitation unless you supply them. | 14 | `report-limitations` |

The error claim covers every listed input class. Its test asserts the cause, exit status, and a concrete recovery step.

## Catalog description

"Inspect coding-agent permissions before an agent runs." — 7 words, 54 characters, starts with a verb.

## Terminology

| Concept | One term used |
|---|---|
| A vendor rule expression | matcher |
| The selected rule | effective |
| A replaced exact rule | shadowed |
| Machine/user/repository scope | layer |
| Input configuration | policy file |
| Browser try-out | demo |
| Exported inspection result | report |
