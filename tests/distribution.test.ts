import { expect, test } from "bun:test";
import { cp, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { root, verify } from "../scripts/check-distribution";

test("synchronized public files match the source release", async () => {
  await verify();
});
test("an edited plugin cannot pass as a synchronized release", async () => {
  const directory = await mkdtemp(join(tmpdir(), "cleve-public-drift-"));
  try {
    await cp(root, directory, {
      recursive: true,
      filter: (path) => !path.endsWith("/.git"),
    });
    const path = join(directory, "plugin.json");
    const plugin = await Bun.file(path).json();
    plugin.description = "An unsynchronized change to the public package";
    await Bun.write(path, JSON.stringify(plugin));
    await expect(verify(directory)).rejects.toThrow(
      "Distribution drift: plugin.json"
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
