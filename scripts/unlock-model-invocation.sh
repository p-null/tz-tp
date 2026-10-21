#!/usr/bin/env bash
# Make every skill reachable by the model in both harnesses this repo ships to:
# Claude Code's `disable-model-invocation: true` (SKILL.md frontmatter) and
# Codex's `policy.allow_implicit_invocation: false` (agents/openai.yaml).
# Upstream keeps the two in sync by hand (.agents/invocation.md); this does it in one pass.
# Idempotent. `--check` prints the locked files and exits 1 instead of editing.
set -euo pipefail
cd "$(dirname "$0")/.."

locked() {
  grep -rlx 'disable-model-invocation: true' --include=SKILL.md skills || true
  grep -rl 'allow_implicit_invocation: false' --include=openai.yaml skills || true
}

if [ "${1:-}" = "--check" ]; then
  files=$(locked)
  [ -z "$files" ] && exit 0
  echo "$files"
  exit 1
fi

grep -rlx 'disable-model-invocation: true' --include=SKILL.md skills \
  | xargs -r sed -i '/^disable-model-invocation: true$/d' || true
grep -rl 'allow_implicit_invocation: false' --include=openai.yaml skills \
  | xargs -r sed -i '/^policy:$/{N;/allow_implicit_invocation: false/d}' || true
