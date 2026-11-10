---
"mattpocock-skills": patch
---

`setup-matt-pocock-skills` now writes `AGENTS.md`, `.claude/CLAUDE.md` and `docs/agents/*.md` locally and never stages or commits them. Step 4 appends their paths to the clone's `.git/info/exclude` instead of editing `.gitignore`, and the final verification requires `git ls-files` to list none of them. Before this, a setup committed the agent files to the repo, which published them to the remote.
