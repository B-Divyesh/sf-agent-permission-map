# Demo sandbox

## Entry points

- Browser: `https://agent-permission-map.sociobot.in/demo`
- Local browser: `npm run build:site && npm run preview`, then open `/demo`
- CLI: `cargo run -- demo`
- Machine-readable CLI: `cargo run -- demo --format json`

## Sample data

`examples/sample-repo/` contains two Claude Code settings files, one Codex config, and one Codex rules file. The rules include a repo allow that a worktree deny shadows. The same values appear in the browser demo.

The CLI copies these bundled files to a new operating-system temporary directory. It prints that directory before it exits. It does not inspect the caller's repository during a demo run.

## Reset and isolation

The browser demo holds sample data in memory. It uses no local storage, cookies, IndexedDB, or network API. **Reset demo** restores the bundled view. **Start for real** returns to local install instructions.

The CLI demo uses a unique directory named `permit-map-demo-<process>-<time>`. The operating system may clear that directory later. It never becomes a real Permit Map data namespace because the CLI saves no product state.
