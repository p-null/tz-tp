---
"mattpocock-skills": patch
---

`setup-matt-pocock-skills` commits a Claude Code bridge again, but fixes the actual defect instead of dropping the bridge: it always writes `.claude/CLAUDE.md` containing exactly `@../AGENTS.md` (never a root `CLAUDE.md`), and if `.gitignore` excludes `.claude/` wholesale — the reason the original `.claude/CLAUDE.md` bridge silently never got committed — it rewrites that to `.claude/*` plus a `!.claude/CLAUDE.md` negation so the bridge is tracked while the rest of `.claude/` stays ignored. This repo's own root now follows that layout too.
