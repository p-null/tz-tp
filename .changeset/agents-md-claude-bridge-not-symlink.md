---
"mattpocock-skills": patch
---

`setup-matt-pocock-skills` no longer bridges `AGENTS.md` to Claude Code with a `.claude/CLAUDE.md` symlink: that silently fails to commit in any repo that gitignores `.claude/` wholesale (a common pattern, and the reason this repo's own root never converged after the last rewrite). The bridge is now a plain root `CLAUDE.md` containing exactly `@AGENTS.md`, which Claude Code expands and Codex never opens. This repo's own root `AGENTS.md`/`CLAUDE.md` now follow that layout too.
