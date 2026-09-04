import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "dist", "codex-plugin");
const template = join(root, "codex-plugin");
const check = process.argv.includes("--check");
const claudeManifest = JSON.parse(
  readFileSync(join(root, ".claude-plugin", "plugin.json"), "utf8"),
);

if (!Array.isArray(claudeManifest.skills) || claudeManifest.skills.length === 0) {
  throw new Error("Claude plugin manifest must declare at least one promoted skill");
}

function build(destination) {
  rmSync(destination, { recursive: true, force: true });
  rmSync(join(root, "dist", "codex-skills"), { recursive: true, force: true });
  cpSync(template, destination, { recursive: true, dereference: true });
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
  writeFileSync(join(destination, ".generated-from"), ".claude-plugin/plugin.json\n");
  rmSync(join(root, "dist", "marketplace"), { recursive: true, force: true });
  const marketplace = join(root, "dist", ".agents", "plugins");
  rmSync(marketplace, { recursive: true, force: true });
  mkdirSync(marketplace, { recursive: true });
  writeFileSync(
    join(marketplace, "marketplace.json"),
    `${JSON.stringify({
      name: "tz-tp",
      interface: { displayName: "Matt Pocock Skills" },
      plugins: [{
        name: "mskills",
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

if (check) {
  if (!existsSync(output)) {
    throw new Error("Generated Codex payload is missing. Run: npm run build-codex-plugin");
  }
  const temporary = mkdtempSync(join(tmpdir(), "mskills-codex-"));
  try {
    build(temporary);
    const expected = inventory(temporary);
    const actual = inventory(output);
    if (JSON.stringify([...actual]) !== JSON.stringify([...expected])) {
      throw new Error("Generated Codex payload is stale. Run: npm run build-codex-plugin");
    }
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
} else {
  build(output);
}
