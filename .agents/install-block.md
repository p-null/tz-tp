# The canonical install block

One install story, one wording. `README.md`, `.changeset/*`, and every page under `docs/` must say **this** and nothing else. Change it here first, then propagate.

`mskills` is this fork's plugin, served from the fork's own marketplace `tz-tp` (the repo `p-null/tz-tp`). The official marketplace (`claude-plugins-official`) lists the upstream `mattpocock-skills` plugin instead, which keeps some skills user-only, so no install line here points at it. A third-party marketplace does not auto-update by default ([discover-plugins](https://code.claude.com/docs/en/discover-plugins)), so the block says how to update.

## Claude Code: the plugin

<canonical-block name="claude-code">

```bash
claude plugin marketplace add p-null/tz-tp
claude plugin install mskills@tz-tp
```

Or, from inside a session:

```
/plugin marketplace add p-null/tz-tp
/plugin install mskills@tz-tp
```

This fork is not in Claude Code's official marketplace, so the marketplace is added first, and it does not update itself by default. To update, run `claude plugin marketplace update tz-tp`, then `claude plugin update mskills@tz-tp`.

</canonical-block>

## Codex: the plugin

From a checkout of this repository:

<canonical-block name="codex">

```bash
codex plugin marketplace add /path/to/tz-tp/dist
codex plugin add mskills@tz-tp
```

</canonical-block>

The generated bundle contains the same promoted skill set as the Claude Code plugin. Start a new Codex thread after installing it.

## Antigravity: the plugin

From a checkout of this repository:

<canonical-block name="antigravity">

```bash
mkdir -p ~/.gemini/config/plugins
ln -s /path/to/tz-tp/dist/antigravity-plugin ~/.gemini/config/plugins/mskills
```

</canonical-block>

The generated bundle contains the same promoted skill set as the Claude Code plugin. Start a new Antigravity thread after linking it.

## Other agents: skills.sh

[skills.sh](https://skills.sh/mattpocock/skills) copies editable skill files into the project. Use the whole-set form on `README.md`:

<canonical-block name="skills-sh-whole-set">

```bash
npx skills@latest add mattpocock/skills
```

Pick the skills you want, and which coding agents to install them on. **The installer lets you choose which skills to take: make sure `setup-matt-pocock-skills` is one of them.**

</canonical-block>

…and the single-skill form wherever one skill is named on its own. Note that **`docs/` pages are not a consumer of this block**: ai-hero renders the install widget above the body, so a page that writes the commands out duplicates it. See [writing-docs.md](./writing-docs.md).

<canonical-block name="skills-sh-one-skill">

```bash
npx skills@latest add mattpocock/skills --skill=<name>
```

```bash
npx skills@latest update <name>
```

</canonical-block>

`skills@latest` is the pinned spelling in all three. The pages under `docs/` used to carry their own copy of these commands; those blocks are now deleted rather than corrected, because the site renders the install commands itself.

## The two routes are exclusive

The plugin is a managed, read-only bundle you subscribe to. skills.sh writes files you own and edit. Installing both leaves the user with every skill twice: always say "pick one".

## Not the install story

`.claude-plugin/marketplace.json` makes the repo its own single-plugin Claude marketplace. The generated `dist/.agents/plugins/marketplace.json` is the corresponding Codex marketplace, and `dist/antigravity-plugin/` is the native Antigravity plugin bundle. The Claude fallback is retained for installing the repository directly and is **not** documented to users.
