import { expect, test } from "bun:test";
import { lstat, readdir } from "node:fs/promises";
import { join } from "node:path";

const VERSION = /^\d+\.\d+\.\d+$/;
const FRONTMATTER = /^---\s*$/m;
const WIDTH = /width="512"/;
const HEIGHT = /height="512"/;
const VIEWBOX = /viewBox="-36\.5 -69 512 512"/;
const ACTIVE_SVG = /<script|<foreignObject|onload=|href=/i;
const PRIVATE_KEY = /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/;
const TOKEN = /\b(?:sk_live_|sk_test_|ghp_|github_pat_)[A-Za-z0-9_]{16,}/;
const SECRET =
  /(?:password|client_secret|access_token|refresh_token)\s*[=:]\s*["'][^"']+["']/i;
const VAULT = /https:\/\/(?:send\.bitwarden|vault\.bitwarden)\.com\//i;

const root = new URL("../", import.meta.url).pathname;
const skillNames = ["recall", "save", "share", "update"];
const expectedFiles = [
  ".gitignore",
  "LICENSE",
  "LICENSE-SCOPE.md",
  "README.md",
  "assets/cleve-icon-square.svg",
  "assets/directory-logo.png",
  ".github/workflows/check.yml",
  "docs/distribution.md",
  "mcp-contract.json",
  "mcp-release.json",
  "scripts/check-distribution.ts",
  "tests/distribution.test.ts",
  "docs/cursor.md",
  "docs/smithery.md",
  "mcp.json",
  "package.json",
  "plugin.json",
  ...skillNames.map((name) => `skills/${name}/SKILL.md`),
  "tests/package.test.ts",
].sort();

async function filesIn(directory: string, prefix = ""): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === ".git") {
      continue;
    }
    const path = join(directory, entry.name);
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if ((await lstat(path)).isSymbolicLink()) {
      throw new Error(`Package contains a symlink: ${relative}`);
    }
    if (entry.isDirectory()) {
      files.push(...(await filesIn(path, relative)));
    } else {
      files.push(relative);
    }
  }
  return files.sort();
}

test("standalone repository contains only the reviewed integration files", async () => {
  expect(await filesIn(root)).toEqual(expectedFiles);
});

test("portable manifest has the supported fields and a distinct public identity", async () => {
  const manifest = await Bun.file(join(root, "plugin.json")).json();
  const allowed = [
    "$schema",
    "name",
    "version",
    "description",
    "author",
    "homepage",
    "repository",
    "license",
    "keywords",
    "extensions",
  ];
  expect(Object.keys(manifest).every((key) => allowed.includes(key))).toBe(
    true
  );
  expect(manifest.$schema).toBe(
    "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json"
  );
  expect(manifest.name).toBe("cleve");
  expect(manifest.version).toMatch(VERSION);
  expect(manifest.license).toBe("MIT");
  expect(manifest.description.length).toBeGreaterThan(20);
  expect(manifest.author).toEqual({
    name: "Cleve Sdn. Bhd.",
    email: "support@cleve.ai",
    url: "https://cleve.ai",
  });
});

test("MIT licensing excludes brand assets and identifies the public integration repository", async () => {
  const license = await Bun.file(join(root, "LICENSE")).text();
  const scope = await Bun.file(join(root, "LICENSE-SCOPE.md")).text();
  const readme = await Bun.file(join(root, "README.md")).text();
  const manifest = await Bun.file(join(root, "plugin.json")).json();
  const packageMetadata = await Bun.file(join(root, "package.json")).json();
  expect(license).toContain("MIT License");
  expect(license).toContain("Copyright (c) 2026 Cleve Sdn. Bhd.");
  expect(license).toContain("Permission is hereby granted, free of charge");
  expect(scope).toContain("All files under `assets/`");
  expect(scope).toContain("are excluded from the MIT license");
  expect(scope).toContain("does not grant trademark rights");
  expect(readme).toContain("[license scope](LICENSE-SCOPE.md)");
  expect(packageMetadata.license).toBe("MIT");
  expect(packageMetadata.private).toBe(true);
  expect(manifest.repository).toBe("https://github.com/cleve-ai/mcp");
  expect(readme).toContain("https://github.com/cleve-ai/mcp");
  expect(readme).not.toContain("Publication is deliberately on hold");
});

test("MCP configuration connects only to Cleve without credentials or local execution", async () => {
  expect(await Bun.file(join(root, "mcp.json")).json()).toEqual({
    $schema: "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
    mcpServers: {
      cleve: { type: "streamable-http", url: "https://app.cleve.ai/mcp" },
    },
  });
});

for (const name of skillNames) {
  test(`${name} is discoverable and has no missing host-specific metadata dependency`, async () => {
    const text = await Bun.file(join(root, "skills", name, "SKILL.md")).text();
    const parts = text.split(FRONTMATTER);
    expect(parts.length).toBe(3);
    const metadata = Bun.YAML.parse(parts[1]) as Record<string, unknown>;
    expect(metadata.name).toBe(name);
    expect(typeof metadata.description).toBe("string");
    expect(String(metadata.description).length).toBeGreaterThan(20);
    expect(parts[2].trim().length).toBeGreaterThan(100);
    expect(text).not.toContain("agents/openai.yaml");
  });
}

test("SVG icon declares a square viewport and has no active or external content", async () => {
  const svg = await Bun.file(join(root, "assets/cleve-icon-square.svg")).text();
  expect(svg).toMatch(WIDTH);
  expect(svg).toMatch(HEIGHT);
  expect(svg).toMatch(VIEWBOX);
  expect(svg).not.toMatch(ACTIVE_SVG);
});

test("PNG directory asset has a valid square image header", async () => {
  const png = new Uint8Array(
    await Bun.file(join(root, "assets/directory-logo.png")).arrayBuffer()
  );
  expect(Array.from(png.slice(0, 8))).toEqual([
    137, 80, 78, 71, 13, 10, 26, 10,
  ]);
  const header = new DataView(png.buffer);
  expect(header.getUint32(16)).toBe(256);
  expect(header.getUint32(20)).toBe(256);
});

test("text files do not contain common embedded credential forms", async () => {
  const files = await filesIn(root);
  for (const file of files.filter(
    (path) => !path.endsWith(".png") && path !== "tests/package.test.ts"
  )) {
    const text = await Bun.file(join(root, file)).text();
    expect(text).not.toMatch(PRIVATE_KEY);
    expect(text).not.toMatch(TOKEN);
    expect(text).not.toMatch(SECRET);
    expect(text).not.toMatch(VAULT);
  }
});
