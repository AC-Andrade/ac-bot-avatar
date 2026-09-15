import { spawnSync } from "node:child_process";
import { mkdir, readFile, rm, symlink } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const workDir = join(rootDir, ".pack-check");
const tarballDir = join(workDir, "tarballs");
const consumerDir = join(workDir, "consumer");
const scopeDir = join(consumerDir, "node_modules", "@acandrade");
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

const packages = [
  ["core", "ac-bot-avatar-core"],
  ["utils", "ac-bot-avatar-utils"],
  ["assets", "ac-bot-avatar-assets"],
  ["react", "ac-bot-avatar-react"],
];

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  });
  if (result.status !== 0) {
    if (result.error) process.stderr.write(`${result.error.message}\n`);
    process.stderr.write(result.stdout ?? "");
    process.stderr.write(result.stderr ?? "");
    process.exit(result.status ?? 1);
  }
  return result.stdout;
};

await rm(workDir, { recursive: true, force: true });
await mkdir(tarballDir, { recursive: true });
await mkdir(scopeDir, { recursive: true });

for (const [directory, unscopedName] of packages) {
  const packageDir = join(rootDir, "packages", directory);
  const manifest = JSON.parse(
    await readFile(join(packageDir, "package.json"), "utf8")
  );
  const output = run(
    npmCommand,
    [...npmPrefix, "pack", "--json", "--pack-destination", tarballDir],
    {
      cwd: packageDir,
      env: { ...process.env, npm_config_cache: join(rootDir, ".npm-cache") },
    }
  );
  const [packed] = JSON.parse(output);
  const paths = packed.files.map((file) => file.path.replaceAll("\\", "/"));

  for (const required of [
    "LICENSE",
    "README.md",
    "package.json",
    "dist/esm/index.js",
    "dist/cjs/index.cjs",
    "dist/types/index.d.ts",
  ]) {
    if (!paths.includes(required)) {
      throw new Error(`${manifest.name}: tarball is missing ${required}`);
    }
  }

  const forbidden = paths.find(
    (path) =>
      path.includes(".test.") ||
      path.includes(".spec.") ||
      path.endsWith("tsconfig.tsbuildinfo") ||
      path.startsWith("src/") ||
      path.endsWith(".log") ||
      path.endsWith(".tgz")
  );
  if (forbidden)
    throw new Error(`${manifest.name}: unexpected file ${forbidden}`);

  for (const field of ["license", "repository", "homepage", "bugs"]) {
    if (!manifest[field]) throw new Error(`${manifest.name}: missing ${field}`);
  }
  for (const range of Object.values(manifest.dependencies ?? {})) {
    if (range === "*")
      throw new Error(`${manifest.name}: wildcard dependency found`);
  }

  const destination = join(scopeDir, unscopedName);
  await mkdir(destination, { recursive: true });
  run(
    "tar",
    [
      "-xzf",
      join(tarballDir, packed.filename),
      "-C",
      destination,
      "--strip-components=1",
    ],
    { cwd: rootDir }
  );

  process.stdout.write(
    `${manifest.name}: ${packed.entryCount} files, ${packed.size} B packed\n`
  );
}

for (const dependency of ["react", "react-dom"]) {
  await symlink(
    resolve(rootDir, "node_modules", dependency),
    join(consumerDir, "node_modules", dependency),
    process.platform === "win32" ? "junction" : "dir"
  );
}

const smokeTest = String.raw`
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const require = createRequire(import.meta.url);
const names = [
  "@acandrade/ac-bot-avatar-core",
  "@acandrade/ac-bot-avatar-utils",
  "@acandrade/ac-bot-avatar-assets",
  "@acandrade/ac-bot-avatar-react",
];

for (const name of names) {
  assert.ok(Object.keys(await import(name)).length > 0, name + " ESM export");
  assert.ok(Object.keys(require(name)).length > 0, name + " CommonJS export");
}

assert.equal(typeof (await import("@acandrade/ac-bot-avatar-assets/eyes/normal")).NormalEye, "function");
assert.equal(typeof require("@acandrade/ac-bot-avatar-assets/dist/eyes/normal").NormalEye, "function");

const { HashedACBotAvatar } = await import("@acandrade/ac-bot-avatar-react");
const avatar = React.createElement(HashedACBotAvatar, { identifier: 0, title: "Smoke" });
const first = renderToStaticMarkup(avatar);
const second = renderToStaticMarkup(avatar);
assert.equal(first, second, "SSR output must be stable");
assert.match(first, /^<svg/);
`;

await import("node:fs/promises").then(({ writeFile }) =>
  writeFile(join(consumerDir, "smoke.mjs"), smokeTest)
);
run(process.execPath, [join(consumerDir, "smoke.mjs")], { cwd: consumerDir });

process.stdout.write(
  "ESM, CommonJS, deep imports and SSR tarball smoke tests passed.\n"
);
