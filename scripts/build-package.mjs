import { spawnSync } from "node:child_process";
import { readdir, rm } from "node:fs/promises";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const packageDir = process.cwd();
const srcDir = join(packageDir, "src");
const distDir = join(packageDir, "dist");
const packageName = basename(packageDir);

const collectEntries = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = join(directory, entry.name);
      if (entry.isDirectory()) return collectEntries(absolutePath);
      if (!/\.(ts|tsx)$/.test(entry.name)) return [];
      if (/\.(test|spec)\.(ts|tsx)$/.test(entry.name)) return [];
      if (entry.name.endsWith(".d.ts")) return [];
      return [absolutePath];
    })
  );
  return files.flat();
};

await rm(distDir, { recursive: true, force: true });
await rm(join(packageDir, "tsconfig.tsbuildinfo"), { force: true });
const entryPoints = { index: join(srcDir, "index.ts") };

if (packageName === "assets") {
  const assetEntries = await collectEntries(srcDir);
  for (const entry of assetEntries) {
    const outputName = relative(srcDir, entry).slice(0, -extname(entry).length);
    const fileName = basename(outputName);
    if (fileName === "index" || fileName === "all") continue;
    if (!entry.endsWith(".tsx")) continue;
    entryPoints[outputName.replaceAll("\\", "/")] = entry;
  }
}

const sharedOptions = {
  entryPoints,
  bundle: true,
  entryNames: "[dir]/[name]",
  external: ["react", "react/*", "@acandrade/*"],
  jsx: "automatic",
  logLevel: "warning",
  outbase: srcDir,
  platform: "neutral",
  sourcemap: true,
  sourcesContent: false,
  target: "es2019",
};

await Promise.all([
  build({
    ...sharedOptions,
    format: "esm",
    outdir: join(distDir, "esm"),
  }),
  build({
    ...sharedOptions,
    format: "cjs",
    outdir: join(distDir, "cjs"),
    outExtension: { ".js": ".cjs" },
  }),
]);

const tscPath = resolve(rootDir, "node_modules", "typescript", "bin", "tsc");
const result = spawnSync(
  process.execPath,
  [
    tscPath,
    "--project",
    join(packageDir, "tsconfig.json"),
    "--pretty",
    "false",
  ],
  { cwd: packageDir, stdio: "inherit" }
);

if (result.status !== 0) process.exit(result.status ?? 1);

const relativePackage = relative(rootDir, packageDir);
process.stdout.write(`Built ${relativePackage}\n`);
