import { readdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const packagesDir = join(rootDir, "packages");
const packageNames = await readdir(packagesDir);

await Promise.all(
  packageNames.flatMap((packageName) => {
    const packageDir = join(packagesDir, packageName);
    return [
      rm(join(packageDir, "dist"), { recursive: true, force: true }),
      rm(join(packageDir, "tsconfig.tsbuildinfo"), { force: true }),
    ];
  })
);
