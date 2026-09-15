import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const npmCommand = process.platform === "win32" ? process.execPath : "npm";
const npmPrefix =
  process.platform === "win32"
    ? [
        join(
          dirname(process.execPath),
          "node_modules",
          "npm",
          "bin",
          "npm-cli.js"
        ),
      ]
    : [];
const budgets = JSON.parse(
  await readFile(join(rootDir, "package-size-budget.json"), "utf8")
);

for (const [directory, budget] of Object.entries(budgets.packages)) {
  const packageDir = join(rootDir, "packages", directory);
  const result = spawnSync(
    npmCommand,
    [...npmPrefix, "pack", "--dry-run", "--json"],
    {
      cwd: packageDir,
      encoding: "utf8",
      env: { ...process.env, npm_config_cache: join(rootDir, ".npm-cache") },
    }
  );
  if (result.status !== 0) {
    if (result.error) process.stderr.write(`${result.error.message}\n`);
    process.stderr.write(result.stdout ?? "");
    process.stderr.write(result.stderr ?? "");
    process.exit(result.status ?? 1);
  }

  const [packed] = JSON.parse(result.stdout);
  const packedLimit = Math.ceil(
    budget.baselinePackedBytes * (1 + budgets.allowedIncreasePercent / 100)
  );
  const unpackedLimit = Math.ceil(
    budget.baselineUnpackedBytes * (1 + budgets.allowedIncreasePercent / 100)
  );

  if (packed.size > packedLimit || packed.unpackedSize > unpackedLimit) {
    throw new Error(
      `${packed.name} exceeded its size budget: ` +
        `${packed.size}/${packedLimit} B packed, ` +
        `${packed.unpackedSize}/${unpackedLimit} B unpacked`
    );
  }

  process.stdout.write(
    `${packed.name}: ${packed.size}/${packedLimit} B packed, ` +
      `${packed.unpackedSize}/${unpackedLimit} B unpacked\n`
  );
}
