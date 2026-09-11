---
"mattpocock-skills": patch
---

`setup-matt-pocock-skills` now commits only root `AGENTS.md`. It no longer creates or commits any `CLAUDE.md`, root or `.claude/`, as a Claude Code bridge: an existing `CLAUDE.md` is merged into `AGENTS.md` and deleted, never replaced. Bridging `AGENTS.md` to Claude Code is left as a personal, local (gitignored) choice for whoever wants it. This repo's own root now follows that layout too: `AGENTS.md` is the real canonical file, and root `CLAUDE.md` is gone and gitignored so it can't come back by accident.
