---
"mattpocock-skills": patch
---

`setup-matt-pocock-skills` converges on root `AGENTS.md` alone again, this time for good: it never creates or commits any `CLAUDE.md`, root or `.claude/`, as a Claude Code bridge. An existing `CLAUDE.md` is merged into `AGENTS.md` during confirmation and then deleted, never replaced. Claude Code still has no native `AGENTS.md` fallback (re-verified 2026-09-22), so bridging it is left entirely as a personal, local choice; anyone who sets one up should name it `.claude/AGENTS.md` rather than `.claude/CLAUDE.md` to stay AGENTS-shaped, understanding that Claude Code doesn't auto-load that name either today, so it's a manual reference file rather than a working bridge until native support ships. This repo's own root follows that layout too: `AGENTS.md` is the canonical file, `.claude/CLAUDE.md` is gone, and `.claude/` is gitignored wholesale again so it can't come back by accident.
