import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = dirname(dirname(fileURLToPath(import.meta.url)));
const fruitDir = join(packageDir, "svgs", "fruits");
const checkOnly = process.argv.includes("--check");
const screenColors = new Set(["#181d24", "#152133"]);

const pathPattern =
  /<path\s+d="([^"]+)"\s+style="fill:(#[0-9a-f]{6});"\s*\/>/gi;

const formatSvg = (source) => {
  const declaration =
    source.match(/<\?xml[^>]*\?>/i)?.[0] ??
    '<?xml version="1.0" encoding="UTF-8"?>';
  const svgOpen = source.match(/<svg\b[^>]*>/i)?.[0];
  if (!svgOpen) throw new Error("Invalid SVG source: missing <svg>");

  const cleanOpen = svgOpen.replace(/\s+id="[^"]*"/i, "");
  const bodyStart = source.indexOf(svgOpen) + svgOpen.length;
  const bodyEnd = source.lastIndexOf("</svg>");
  const body = source
    .slice(bodyStart, bodyEnd)
    .trim()
    .replace(/>\s*</g, ">\n<")
    .split("\n")
    .map((line) => `  ${line.trim()}`)
    .join("\n");

  return `${declaration}\n${cleanOpen}\n${body}\n</svg>\n`;
};

const removeEmbeddedFace = (source, fileName) => {
  const paths = [...source.matchAll(pathPattern)];
  const screen = paths
    .filter((match) => screenColors.has(match[2].toLowerCase()))
    .sort((left, right) => right[1].length - left[1].length)[0];

  if (!screen || screen.index === undefined) {
    throw new Error(`${fileName}: dark screen path not found`);
  }

  const screenEnd = screen[1].search(/[zZ]/);
  if (screenEnd < 0) {
    throw new Error(`${fileName}: dark screen path is not closed`);
  }

  const cleanScreen = screen[0].replace(
    screen[1],
    screen[1].slice(0, screenEnd + 1)
  );
  const withoutFace = `${source.slice(0, screen.index)}${cleanScreen}</svg>`;
  return formatSvg(withoutFace);
};

const fileNames = (await readdir(fruitDir))
  .filter((fileName) => fileName.endsWith(".svg"))
  .sort((left, right) => left.localeCompare(right));

if (fileNames.length === 0) {
  throw new Error("No canonical fruit SVGs found");
}

const changedFiles = [];
for (const fileName of fileNames) {
  const filePath = join(fruitDir, fileName);
  const current = await readFile(filePath, "utf8");
  const clean = removeEmbeddedFace(current, fileName);

  if (current.replace(/\r\n/g, "\n") === clean) continue;

  changedFiles.push(fileName);
  if (!checkOnly) await writeFile(filePath, clean, "utf8");
}

if (checkOnly && changedFiles.length > 0) {
  process.stderr.write(
    `Fruit SVGs still contain embedded face data:\n${changedFiles
      .map((fileName) => `- ${fileName}`)
      .join("\n")}\n`
  );
  process.exit(1);
}

process.stdout.write(
  checkOnly
    ? `Verified ${fileNames.length} face-free fruit SVGs.\n`
    : `Cleaned ${changedFiles.length} of ${fileNames.length} fruit SVGs.\n`
);
