---
name: research
description: Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use when the user wants a topic researched, docs or API facts gathered, or reading legwork delegated to a background agent.
---

Spin up a **background agent** to do the research, so you keep working while it reads.

Its job:

1. Check whether the repo already settled the question. Search its decision records (`docs/adr/`, `docs/decisions/`) and open issues (`.scratch/*/issues/`) for the topic, e.g. `grep -rli '<term>' docs/adr docs/decisions .scratch 2>/dev/null`. An accepted decision is the deliverable's home: cite it, state what has changed since its date, and write only that delta. A research note the decision supersedes stays deleted: cite the decision instead (2026-10-31: a research pass cited a 2026-08-30 note that a 2026-09-06 decision record had absorbed and deleted).
2. Investigate the question against **primary sources** (official docs, source code, specs, first-party APIs), not a secondary write-up of them. Follow every claim back to the source that owns it.
3. Write the findings to a single Markdown file, citing each claim's source.
4. Save it where the repo already keeps such notes (a decision record counts); match the existing convention, and if there is none, put it somewhere sensible and say where.
