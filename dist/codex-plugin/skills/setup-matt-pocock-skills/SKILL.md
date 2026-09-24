---
name: setup-matt-pocock-skills
description: "Configure this repo for the engineering skills: set up its issue tracker, triage label vocabulary, and domain doc layout. Run once before first use of the other engineering skills."
---

# Setup Matt Pocock's Skills

Scaffold the per-repo configuration that the engineering skills assume:

- **Issue tracker**: where issues live (GitHub by default; local markdown is also supported out of the box)
- **Triage labels**: the strings used for the five canonical triage roles
- **Domain docs**: where `CONTEXT.md` and ADRs live, and the consumer rules for reading them

This is a prompt-driven skill, not a deterministic script. Explore, present what you found, confirm with the user, then write.

## Process

### 1. Explore

Look at the current repo to understand its starting state. Read whatever exists; don't assume:

- `git remote -v` and `.git/config`: is this a GitHub repo? Which one?
- `AGENTS.md` at the repo root, and `CLAUDE.md` at both `./CLAUDE.md` and `./.claude/CLAUDE.md`: record every existing instruction in each. The setup converges all of it into root `AGENTS.md` in step 4.
- Whether `.claude/CLAUDE.md` would be excluded from commits: run `git check-ignore -v .claude/CLAUDE.md`. A repo that gitignores `.claude/` wholesale (a common pattern) will swallow the bridge silently unless step 4's gitignore fix runs first.
- `CONTEXT.md` and `CONTEXT-MAP.md` at the repo root
- `docs/adr/` and any `src/*/docs/adr/` directories
- `docs/agents/`: does this skill's prior output already exist?
- `.scratch/`: a sign that a local-markdown issue tracker convention is already in use
- Is the `triage` skill installed? (a `triage` skill folder alongside this one, or `triage` in your available skills.) This decides whether Section B runs at all.
- Monorepo signals: a `pnpm-workspace.yaml`, a `workspaces` field in `package.json`, or a populated `packages/*` with its own `src/`. These are present only in a genuinely large multi-package repo; their absence means single-context, which is almost every repo.

### 2. Present findings and ask

Summarise what's present and what's missing. Then take the sections in order. One section, one answer, then the next.

Lead each section with the recommended answer so the user can accept it in a word. Give a one-line explainer only when the choice genuinely branches; skip the section entirely when exploration already settled it (Section B when `triage` isn't installed, Section C when there's no monorepo).

**Section A: Issue tracker.**

> Explainer: The "issue tracker" is where issues live for this repo. Skills like `to-tickets`, `triage`, and `to-spec` read from and write to it. They need to know whether to call `gh issue create`, write a markdown file under `.scratch/`, or follow some other workflow you describe. Pick the place you actually track work for this repo.

Default posture: these skills were designed for GitHub. If a `git remote` points at GitHub, propose that. If a `git remote` points at GitLab (`gitlab.com` or a self-hosted host), propose GitLab. Otherwise (or if the user prefers), offer:

- **GitHub**: issues live in the repo's GitHub Issues (uses the `gh` CLI)
- **GitLab**: issues live in the repo's GitLab Issues (uses the [`glab`](https://gitlab.com/gitlab-org/cli) CLI)
- **Local markdown**: issues live as files under `.scratch/<feature>/` in this repo (good for solo projects or repos without a remote)
- **Other** (Jira, Linear, etc.): ask the user to describe the workflow in one paragraph; the skill will record it as freeform prose

Record the choice in `docs/agents/issue-tracker.md`. The GitHub and GitLab templates carry a "PRs as a request surface" flag, defaulted **off**. Leave it off and don't raise it: a user who wants external PRs in the triage queue can flip the flag in the file later.

**Section B: Triage label vocabulary.** Skip this section entirely if the `triage` skill isn't installed (exploration told you), since an uninstalled skill needs no labels.

If it is installed, ask exactly one question:

> Do you want to keep the default triage labels? (recommended: **yes**)

The defaults are the five canonical roles, each label string equal to its name: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. On **yes**, write them as-is. Only if the user says no, usually because their tracker already uses other names (e.g. `bug:triage` for `needs-triage`), collect the overrides so `triage` applies existing labels instead of creating duplicates.

**Section C: Domain docs.** Default to **single-context** (one `CONTEXT.md` + `docs/adr/` at the repo root). This fits almost every repo; write it without asking.

Offer **multi-context** (a root `CONTEXT-MAP.md` pointing to per-context `CONTEXT.md` files) only when exploration found monorepo signals. Then confirm which layout they want.

### 3. Confirm and edit

Show the user a draft of:

- The `## Agent skills` block to add to root `AGENTS.md`, plus the `.claude/CLAUDE.md` bridge (and any `.gitignore` fix it needs)
- The contents of `docs/agents/issue-tracker.md`, `docs/agents/domain.md`, and `docs/agents/triage-labels.md` (the last only when `triage` is installed)

Let them edit before writing.

### 4. Write

**Converge on one canonical content file, plus a committed bridge.** Every completed setup has exactly this layout:

- `AGENTS.md` at the repo root is the canonical content file for every shared instruction.
- `.claude/CLAUDE.md` is a committed one-line bridge, `@../AGENTS.md`. Codex (and any other AGENTS.md-native tool) reads root `AGENTS.md` directly and never opens this file. Claude Code reads `AGENTS.md` only through its built-in `agents-md` plugin (2.1.277+), which is feature-flagged off wherever telemetry is disabled and on Bedrock, Vertex and Foundry, so this bridge is what makes Claude Code load the same content everywhere; keep writing it while that plugin stays flag-gated. **Never a root `CLAUDE.md`**: the bridge always lives at `.claude/CLAUDE.md`, never the repo root, and this skill writes and commits it itself rather than leaving it as a personal, BYO choice.

Move every retained repo-wide instruction from an existing root `CLAUDE.md` and from `.claude/CLAUDE.md` (read its target first if it is a symlink) into root `AGENTS.md`. When two files overlap or conflict, show the merged draft during confirmation; preserve the user's intent rather than silently choosing one. Once that draft is accepted:

- `git rm` any root `CLAUDE.md` (its content now lives in `AGENTS.md`); never recreate one there.
- Fix a gitignore collision before writing the bridge, not after. If `.gitignore` excludes `.claude` or `.claude/` wholesale (a common pattern, and the reason a `.claude/CLAUDE.md` bridge silently fails to commit), replace that line with `.claude/*` plus a `!.claude/CLAUDE.md` negation immediately below it — the negation only takes effect because the *contents* of `.claude/` are excluded via the `*` wildcard, not the directory itself. Excluding the directory itself (a bare `.claude` or `.claude/` line) makes git skip it entirely and the negation can't reach inside. This keeps everything else under `.claude/` (worktrees, local settings) ignored while the bridge is tracked.
- Write `.claude/CLAUDE.md` containing exactly `@../AGENTS.md` and stage it. If it was previously a symlink or gitignored file, replace it with this plain tracked import — the same failure modes that ruled out a symlink bridge (doesn't survive filesystems/archives without symlink support) apply regardless of location.

If `.claude/CLAUDE.md` already exists as something other than this bridge (a directory, or content beyond the import line worth preserving), stop and ask the user rather than overwriting it. If an `## Agent skills` block already exists in `AGENTS.md` or an instruction file being migrated, update it in the merged root `AGENTS.md` rather than appending a duplicate. Don't overwrite user edits to the surrounding sections.

Before finishing, verify: `AGENTS.md` exists with the full merged content; `git ls-files --error-unmatch` succeeds for `AGENTS.md` and every `docs/agents/*.md` its `## Agent skills` block names; `.claude/CLAUDE.md` exists containing exactly `@../AGENTS.md`; `git ls-files` shows no `CLAUDE.md` at the repo root; and `git check-ignore -v .claude/CLAUDE.md` reports nothing (i.e. the bridge isn't excluded).

The block:

```markdown
## Agent skills

### Issue tracker

[one-line summary of where issues are tracked]. See `docs/agents/issue-tracker.md`.

### Triage labels

[one-line summary of the label vocabulary]. See `docs/agents/triage-labels.md`.

### Domain docs

[one-line summary of layout: "single-context" or "multi-context"]. See `docs/agents/domain.md`.
```

Include the `### Triage labels` sub-block, and write `docs/agents/triage-labels.md`, only when `triage` is installed and Section B ran. When it isn't, both are omitted.

Then write the docs files using the seed templates in this skill folder as a starting point:

- [issue-tracker-github.md](./issue-tracker-github.md): GitHub issue tracker
- [issue-tracker-gitlab.md](./issue-tracker-gitlab.md): GitLab issue tracker
- [issue-tracker-local.md](./issue-tracker-local.md): local-markdown issue tracker
- [triage-labels.md](./triage-labels.md): label mapping (only if `triage` is installed)
- [domain.md](./domain.md): domain doc consumer rules + layout

For "other" issue trackers, write `docs/agents/issue-tracker.md` from scratch using the user's description.

Stage each `docs/agents/*.md` file together with `AGENTS.md`: the `## Agent skills` block points at them, so a commit that carries `AGENTS.md` without them ships dangling pointers to every fresh clone.

### 5. Done

Tell the user the setup is complete and which engineering skills will now read from these files. Mention they can edit `docs/agents/*.md` directly later; re-running this skill is only necessary if they want to switch issue trackers or restart from scratch.
