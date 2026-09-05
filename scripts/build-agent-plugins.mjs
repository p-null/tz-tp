import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = join(root, "dist");
const codexTemplate = join(root, "codex-plugin");
const check = process.argv.includes("--check");
const claudeManifest = JSON.parse(
  readFileSync(join(root, ".claude-plugin", "plugin.json"), "utf8"),
);
const codexManifest = JSON.parse(
  readFileSync(join(codexTemplate, ".codex-plugin", "plugin.json"), "utf8"),
);

if (!Array.isArray(claudeManifest.skills) || claudeManifest.skills.length === 0) {
  throw new Error("Claude plugin manifest must declare at least one promoted skill");
}

if (typeof codexManifest.name !== "string" || codexManifest.name.length === 0) {
  throw new Error("Codex plugin manifest must declare the plugin name");
}

function copyPromotedSkills(destination) {
  const skillsDestination = join(destination, "skills");
  mkdirSync(skillsDestination, { recursive: true });
  for (const listedPath of claudeManifest.skills) {
    const source = resolve(root, listedPath);
    const name = basename(source);
    const target = join(skillsDestination, name);
    if (!existsSync(join(source, "SKILL.md"))) {
      throw new Error(`Promoted skill is missing SKILL.md: ${listedPath}`);
    }
    if (existsSync(target)) {
      throw new Error(`Promoted skills must have unique directory names: ${name}`);
    }
    cpSync(source, target, { recursive: true, dereference: true });
  }
}

function writeGeneratedFrom(destination) {
  writeFileSync(join(destination, ".generated-from"), ".claude-plugin/plugin.json\n");
}

function buildCodex(destination) {
  rmSync(destination, { recursive: true, force: true });
  cpSync(codexTemplate, destination, { recursive: true, dereference: true });
  copyPromotedSkills(destination);
  writeGeneratedFrom(destination);
}

function buildAntigravity(destination) {
  rmSync(destination, { recursive: true, force: true });
  mkdirSync(destination, { recursive: true });
  writeFileSync(
    join(destination, "plugin.json"),
    `${JSON.stringify({ name: codexManifest.name }, null, 2)}\n`,
  );
  copyPromotedSkills(destination);
  writeGeneratedFrom(destination);
}

function build(destinationRoot) {
  rmSync(join(destinationRoot, "codex-skills"), { recursive: true, force: true });
  buildCodex(join(destinationRoot, "codex-plugin"));
  buildAntigravity(join(destinationRoot, "antigravity-plugin"));

  const marketplace = join(destinationRoot, ".agents", "plugins");
  rmSync(marketplace, { recursive: true, force: true });
  mkdirSync(marketplace, { recursive: true });
  writeFileSync(
    join(marketplace, "marketplace.json"),
    `${JSON.stringify({
      name: "tz-tp",
      interface: { displayName: "Matt Pocock Skills" },
      plugins: [{
        name: codexManifest.name,
        source: { source: "local", path: "./codex-plugin" },
        policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
        category: "Productivity",
      }],
    }, null, 2)}\n`,
  );
}

function inventory(directory) {
  const entries = new Map();
  function walk(current) {
    for (const name of readdirSync(current).sort()) {
      const full = join(current, name);
      const key = relative(directory, full);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        entries.set(`${key}/`, "directory");
        walk(full);
      } else if (stat.isFile()) {
        entries.set(key, createHash("sha256").update(readFileSync(full)).digest("hex"));
      } else {
        throw new Error(`Unsupported generated entry: ${key}`);
      }
    }
  }
  walk(directory);
  return entries;
}

function assertCurrent(expectedRoot, actualRoot, label) {
  if (!existsSync(actualRoot)) {
    throw new Error(`Generated ${label} payload is missing. Run: npm run build-agent-plugins`);
  }
  const expected = inventory(expectedRoot);
  const actual = inventory(actualRoot);
  if (JSON.stringify([...actual]) !== JSON.stringify([...expected])) {
    throw new Error(`Generated ${label} payload is stale. Run: npm run build-agent-plugins`);
  }
}

if (check) {
  const temporary = mkdtempSync(join(tmpdir(), "mskills-agent-"));
  try {
    build(temporary);
    assertCurrent(join(temporary, "codex-plugin"), join(outputRoot, "codex-plugin"), "Codex plugin");
    assertCurrent(join(temporary, "antigravity-plugin"), join(outputRoot, "antigravity-plugin"), "Antigravity plugin");
    assertCurrent(join(temporary, ".agents", "plugins"), join(outputRoot, ".agents", "plugins"), "Codex marketplace");
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
} else {
  build(outputRoot);
}
