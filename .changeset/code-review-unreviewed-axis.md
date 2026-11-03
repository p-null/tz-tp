---
"mattpocock-skills": patch
---

`code-review` checks that each sub-agent's report is a review before aggregating it. A sub-agent that hit a usage limit, timed out or failed returns that message as its report, which used to read as an axis with no findings; that axis is now re-run once and otherwise reported as `Not reviewed:` with the message it returned.
