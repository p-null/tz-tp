---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
---

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save to the temporary directory of the user's OS - not the current workspace.

This means the real OS-level temp dir (`/tmp`, `$TMPDIR`, `mktemp`) - never a harness- or session-scoped scratch directory, even one the running session's own instructions call its "temp" location. A Claude Code background job, for example, is told to route "temporary files" to `$CLAUDE_JOB_DIR/tmp`, which is deleted the moment that job is deleted - often immediately after `/clear`, with no grace period. A handoff document's entire purpose is to outlive the session that wrote it, so that instruction does not apply to it: resolve "OS temp dir" against the machine, not the session.

Include a "suggested skills" section in the document, naming which skills the next agent should call the Skill tool for.

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.
