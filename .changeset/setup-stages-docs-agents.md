---
"mattpocock-skills": patch
---

`setup-matt-pocock-skills` now stages the `docs/agents/*.md` files together with `AGENTS.md`, and its final verification requires `git ls-files --error-unmatch` to succeed for `AGENTS.md` and every docs file its `## Agent skills` block names. Before this, a setup could commit `AGENTS.md` while the docs files it points at stayed untracked, leaving every fresh clone with dangling pointers.
