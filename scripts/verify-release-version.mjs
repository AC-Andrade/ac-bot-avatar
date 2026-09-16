import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const tag = process.argv[2] ?? process.env.GITHUB_REF_NAME;

if (!tag || !/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(tag)) {
  throw new Error(
    `Expected a semantic release tag, received: ${tag ?? "nothing"}`
  );
}

const expectedVersion = tag.slice(1);
const directories = ["core", "utils", "assets", "react"];

for (const directory of directories) {
  const manifest = JSON.parse(
    await readFile(join(rootDir, "packages", directory, "package.json"), "utf8")
  );
  if (manifest.version !== expectedVersion) {
    throw new Error(
      `${manifest.name} is ${manifest.version}; release tag requires ${expectedVersion}`
    );
  }
}

const changelog = await readFile(join(rootDir, "CHANGELOG.md"), "utf8");
if (!changelog.includes(`## [${expectedVersion}]`)) {
  throw new Error(`CHANGELOG.md has no ${expectedVersion} release entry`);
}

process.stdout.write(
  `Release ${tag} matches all four packages and the changelog.\n`
);
