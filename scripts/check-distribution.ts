import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SHA256 = /^[a-f0-9]{64}$/;
export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export function digest(value: string | Uint8Array) {
  return createHash("sha256").update(value).digest("hex");
}
export function stable(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stable).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .filter(([, item]) => item !== undefined)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${stable(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}
export async function verify(directory = root) {
  const release = (await Bun.file(
    join(directory, "mcp-release.json")
  ).json()) as {
    sourceDigest: string;
    contractDigest: string;
    files: Record<string, string>;
  };
  if (!SHA256.test(release.sourceDigest)) {
    throw new Error("Missing source release identity");
  }
  if (
    !(
      release.files["mcp-contract.json"] &&
      release.files["plugin.json"] &&
      release.files["mcp.json"]
    )
  ) {
    throw new Error("Missing managed package files");
  }
  for (const [path, hash] of Object.entries(release.files)) {
    if (
      path.startsWith("/") ||
      path.split("/").some((part) => ["..", ".git"].includes(part))
    ) {
      throw new Error("Unsafe managed file path");
    }
    const file = Bun.file(join(directory, path));
    if (
      !(await file.exists()) ||
      digest(new Uint8Array(await file.arrayBuffer())) !== hash
    ) {
      throw new Error(
        `Distribution drift: ${path}. Update the canonical integration package in Cleve and regenerate the public sync PR.`
      );
    }
  }
  const contract = await Bun.file(join(directory, "mcp-contract.json")).json();
  if (digest(stable(contract)) !== release.contractDigest) {
    throw new Error("Contract digest does not match this release");
  }
}
if (import.meta.main) {
  await verify();
}
