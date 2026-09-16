import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const packageDir = dirname(dirname(fileURLToPath(import.meta.url)));
const checkOnly = process.argv.includes("--check");
const featureColors = new Set([
  "#61f3f7",
  "#5ffbf9",
  "#44ffff",
  "#00f0ff",
  "#b6aef1",
]);

const categories = [
  {
    source: "eyes",
    output: "eyes",
    typeName: "EyeType",
    mapName: "eyesMap",
    suffix: "Eye",
    includeNone: false,
  },
  {
    source: "mouth",
    output: "mouths",
    typeName: "MouthType",
    mapName: "mouthsMap",
    suffix: "Mouth",
    includeNone: true,
  },
];

const toPascalCase = (value) =>
  value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

const normalizeColor = (value, colorOverrides = new Map()) =>
  colorOverrides.get(value.toLowerCase()) ??
  (featureColors.has(value.toLowerCase()) ? "currentColor" : value);

const styleToJsx = (styleText, colorOverrides) => {
  const properties = styleText
    .split(";")
    .map((rule) => rule.trim())
    .filter(Boolean)
    .map((rule) => {
      const separator = rule.indexOf(":");
      const rawKey = rule.slice(0, separator).trim();
      const rawValue = rule.slice(separator + 1).trim();
      const key = rawKey.replace(/-([a-z])/g, (_part, letter) =>
        letter.toUpperCase()
      );
      return `${key}: ${JSON.stringify(
        normalizeColor(rawValue, colorOverrides)
      )}`;
    });

  return properties.length > 0 ? `style={{ ${properties.join(", ")} }}` : "";
};

const extractSvgBody = (svg, colorOverrides = new Map()) => {
  const svgStart = svg.indexOf("<svg");
  const bodyStart = svg.indexOf(">", svgStart) + 1;
  const bodyEnd = svg.lastIndexOf("</svg>");
  if (svgStart < 0 || bodyStart === 0 || bodyEnd < bodyStart) {
    throw new Error("Invalid SVG source");
  }

  return svg
    .slice(bodyStart, bodyEnd)
    .replace(/<rect\b[^>]*style="[^"]*fill:none;?[^"]*"[^>]*\/>/gi, "")
    .replace(/<path\b[^>]*style="[^"]*fill-opacity:0;?[^"]*"[^>]*\/>/gi, "")
    .replace(/\s(?:serif:)?id="[^"]*"/g, "")
    .replace(/\sxmlns(?::[a-z]+)?="[^"]*"/g, "")
    .replace(/\bfill-rule=/g, "fillRule=")
    .replace(/\bclip-rule=/g, "clipRule=")
    .replace(/\bstroke-linecap=/g, "strokeLinecap=")
    .replace(/\bstroke-linejoin=/g, "strokeLinejoin=")
    .replace(/\bstroke-miterlimit=/g, "strokeMiterlimit=")
    .replace(/\bstroke-width=/g, "strokeWidth=")
    .replace(/\bfill-opacity=/g, "fillOpacity=")
    .replace(/\bclip-path=/g, "clipPath=")
    .replace(/\bxlink:href=/g, "href=")
    .replace(/\bclass=/g, "className=")
    .replace(/style="([^"]*)"/g, (_match, styleText) =>
      styleToJsx(styleText, colorOverrides)
    )
    .replace(
      /(fill|stroke)="([^"]+)"/g,
      (_match, attribute, value) =>
        `${attribute}=${JSON.stringify(normalizeColor(value, colorOverrides))}`
    );
};

const stripArcadeFace = (svg) => {
  const faceStart = svg.indexOf('<rect x="102.92" y="91.77"');
  const svgEnd = svg.lastIndexOf("</svg>");
  if (faceStart < 0 || svgEnd < faceStart) {
    throw new Error("Arcade face marker was not found in the canonical SVG");
  }

  const embeddedFace = svg.slice(faceStart, svgEnd);
  const faceElements = embeddedFace.match(
    /<(?:path|rect|polygon|circle|ellipse)\b[^>]*\/>/g
  );
  if (faceElements?.length !== 7 || /<(?:g|path)[\s>]/.test(embeddedFace)) {
    throw new Error("Unexpected Arcade face structure; review the source SVG");
  }

  return `${svg.slice(0, faceStart)}${svg.slice(svgEnd)}`;
};

const prepareCapsuleSvg = (
  svg,
  { faceMarker, visorFaceMarker, visorMarker }
) => {
  const visorStart = `<path d="${visorMarker}`;
  if (svg.split(visorStart).length !== 2) {
    throw new Error("Capsule visor marker was not found exactly once");
  }

  const markedVisorPrefix = `<path data-capsule-visor="" d="${visorMarker}`;
  let markedSvg = svg.replace(visorStart, markedVisorPrefix);

  const markedVisorStart = markedSvg.indexOf(markedVisorPrefix);
  const markedVisorEnd = markedSvg.indexOf(
    '"',
    markedVisorStart + markedVisorPrefix.length
  );
  const embeddedFaceStart = markedSvg.indexOf(
    visorFaceMarker,
    markedVisorStart
  );
  if (
    markedVisorStart < 0 ||
    markedVisorEnd < 0 ||
    embeddedFaceStart < markedVisorStart ||
    embeddedFaceStart > markedVisorEnd
  ) {
    throw new Error(
      "Capsule face contours were not found inside the visor path"
    );
  }
  markedSvg = `${markedSvg.slice(0, embeddedFaceStart)}${markedSvg.slice(
    markedVisorEnd
  )}`;

  const faceStart = markedSvg.indexOf(`<path d="${faceMarker}`);
  if (faceStart < 0) {
    throw new Error("Capsule face marker was not found in the canonical SVG");
  }

  let faceEnd = faceStart;
  for (let index = 0; index < 5; index += 1) {
    const facePath = markedSvg.slice(faceEnd).match(/^\s*<path\b[^>]*\/>/);
    if (!facePath) {
      throw new Error(
        "Unexpected Capsule face structure; expected five consecutive paths"
      );
    }
    faceEnd += facePath[0].length;
  }

  return `${markedSvg.slice(0, faceStart)}${markedSvg.slice(faceEnd)}`;
};

const format = (content) =>
  prettier.format(content, {
    parser: "typescript",
    semi: true,
    singleQuote: false,
    trailingComma: "all",
  });

const expectedFiles = new Map();
const catalogValues = new Map();

for (const category of categories) {
  const rawDir = join(packageDir, "svgs", category.source);
  const outputDir = join(packageDir, "src", category.output);
  await mkdir(outputDir, { recursive: true });
  const fileNames = (await readdir(rawDir))
    .filter((fileName) => fileName.endsWith(".svg"))
    .sort((left, right) => left.localeCompare(right));
  const assets = [];

  for (const fileName of fileNames) {
    const slug = fileName.slice(0, -4).toLowerCase().replace(/\s+/g, "_");
    const componentName = `${toPascalCase(slug)}${category.suffix}`;
    const svg = await readFile(join(rawDir, fileName), "utf8");
    const colorOverrides =
      category.source === "eyes" && slug === "heart"
        ? new Map([["#f07b9a", "var(--ac-feature-color, #f07b9a)"]])
        : new Map();
    const body = extractSvgBody(svg, colorOverrides);
    const component = format(`
      import type { SVGProps } from "react";

      export const ${componentName} = (props: SVGProps<SVGGElement>) => (
        <g {...props}>${body}</g>
      );
    `);
    expectedFiles.set(join(outputDir, `${slug}.tsx`), component);
    assets.push({ slug, componentName });
  }

  catalogValues.set(category.output, [
    ...assets.map(({ slug }) => slug),
    ...(category.includeNone ? ["none"] : []),
  ]);

  const imports = assets
    .map(
      ({ slug, componentName }) =>
        `import { ${componentName} } from "./${slug}";`
    )
    .join("\n");
  const entries = assets
    .map(
      ({ slug, componentName }) => `${JSON.stringify(slug)}: ${componentName},`
    )
    .join("\n");
  const noneEntry = category.includeNone ? '"none": () => null,' : "";
  const map = format(`
    import type { ComponentType, SVGProps } from "react";
    import type { ${category.typeName} } from "@acandrade/ac-bot-avatar-core";
    ${imports}

    export const ${category.mapName}: Record<
      ${category.typeName},
      ComponentType<SVGProps<SVGGElement>>
    > = {
      ${entries}
      ${noneEntry}
    };
  `);
  expectedFiles.set(join(outputDir, "all.tsx"), map);

  const index = format(
    `export * from "./all";\n${assets
      .map(({ slug }) => `export * from "./${slug}";`)
      .join("\n")}`
  );
  expectedFiles.set(join(outputDir, "index.ts"), index);
}

const fruitSources = [
  ["apple", "maca"],
  ["pear", "pera"],
  ["banana", "banana"],
  ["grape", "uva"],
  ["orange", "laranja"],
  ["strawberry", "morango"],
  ["pineapple", "abacaxi"],
  ["watermelon", "melancia"],
  ["lemon", "limao"],
  ["mango", "manga"],
  ["cherry", "cereja"],
  ["peach", "pessego"],
  ["kiwi", "kiwi"],
  ["coconut", "coco"],
  ["papaya", "mamao"],
  ["guava", "goiaba"],
  ["passionfruit", "maracuja"],
  ["acai", "acai"],
];
const fruitOutputDir = join(packageDir, "src", "fruits");
await mkdir(fruitOutputDir, { recursive: true });
const fruitAssets = [];

for (const [key, slug] of fruitSources) {
  const componentName = `${toPascalCase(slug)}Fruit`;
  const svg = await readFile(
    join(packageDir, "svgs", "fruits", `${slug}.svg`),
    "utf8"
  );
  const body = extractSvgBody(svg);
  const component = format(`
    import type { SVGProps } from "react";

    export const ${componentName} = (props: SVGProps<SVGGElement>) => (
      <g {...props}>${body}</g>
    );
  `);
  expectedFiles.set(join(fruitOutputDir, `${slug}.tsx`), component);
  fruitAssets.push({ key, slug, componentName });
}

const fruitImports = fruitAssets
  .map(
    ({ slug, componentName }) => `import { ${componentName} } from "./${slug}";`
  )
  .join("\n");
const fruitEntries = fruitAssets
  .map(({ key, componentName }) => `${JSON.stringify(key)}: ${componentName},`)
  .join("\n");
const fruitRegistry = format(`
  import type { ComponentType, SVGProps } from "react";
  ${fruitImports}

  export const FRUIT_ASSET_NAMES = ${JSON.stringify(
    fruitAssets.map(({ key }) => key)
  )} as const;
  export type FruitAssetName = (typeof FRUIT_ASSET_NAMES)[number];

  export const fruitsMap: Record<
    FruitAssetName,
    ComponentType<SVGProps<SVGGElement>>
  > = {
    ${fruitEntries}
  };
`);
expectedFiles.set(join(fruitOutputDir, "all.tsx"), fruitRegistry);
expectedFiles.set(
  join(fruitOutputDir, "index.ts"),
  format(
    `export * from "./all";\n${fruitAssets
      .map(({ slug }) => `export * from "./${slug}";`)
      .join("\n")}`
  )
);

const capsuleSources = [
  {
    key: "default",
    slug: "default",
    faceMarker: "M463.27,672.32",
    visorFaceMarker: "M856.76,673.22",
    visorMarker: "M768.44,933.01",
  },
  {
    key: "antenna",
    slug: "antena",
    faceMarker: "M516.1,803.19",
    visorFaceMarker: "M516.1,803.19",
    visorMarker: "M465.07,1013.69",
  },
  {
    key: "mohawk",
    slug: "moicano",
    faceMarker: "M516.1,814.92",
    visorFaceMarker: "M516.1,814.92",
    visorMarker: "M465.07,1025.41",
  },
  {
    key: "satellite",
    slug: "parabolica",
    faceMarker: "M516.1,843.67",
    visorFaceMarker: "M516.1,843.67",
    visorMarker: "M465.07,1054.16",
  },
];
const capsuleBodyColors = {
  body: [
    "#5a5490",
    "#655f98",
    "#6a6199",
    "#6a6299",
    "#6b5e96",
    "#6b6299",
    "#6c6299",
    "#6d6299",
    "#6f6097",
    "#736399",
    "#756298",
    "#756399",
    "#76659a",
    "#776499",
    "#796399",
  ],
  shade: [
    "#221b41",
    "#281f44",
    "#30235f",
    "#302561",
    "#342767",
    "#352769",
    "#4b3a7a",
  ],
  highlight: [
    "#9d86b1",
    "#a890b7",
    "#a991b7",
    "#b29dc1",
    "#bea9c8",
    "#bfaac9",
    "#c2adcb",
    "#cbbbd5",
  ],
};
const capsuleColorOverrides = new Map([
  ...capsuleBodyColors.body.map((color) => [
    color,
    "var(--ac-capsule-body, currentColor)",
  ]),
  ...capsuleBodyColors.shade.map((color) => [
    color,
    "var(--ac-capsule-body-shade, currentColor)",
  ]),
  ...capsuleBodyColors.highlight.map((color) => [
    color,
    "var(--ac-capsule-body-highlight, currentColor)",
  ]),
]);
const capsuleOutputDir = join(packageDir, "src", "capsules");
await mkdir(capsuleOutputDir, { recursive: true });
const capsuleAssets = [];

for (const source of capsuleSources) {
  const componentName = `RobotCapsule${toPascalCase(source.key)}`;
  const svg = await readFile(
    join(packageDir, "svgs", "robot-capsule", `robot-${source.slug}.svg`),
    "utf8"
  );
  const body = extractSvgBody(
    prepareCapsuleSvg(svg, source),
    capsuleColorOverrides
  );
  expectedFiles.set(
    join(capsuleOutputDir, `${source.key}.tsx`),
    format(`
      import type { SVGProps } from "react";

      export const ${componentName} = (props: SVGProps<SVGGElement>) => (
        <g {...props}>${body}</g>
      );
    `)
  );
  capsuleAssets.push({ ...source, componentName });
}

const capsuleImports = capsuleAssets
  .map(
    ({ key, componentName }) => `import { ${componentName} } from "./${key}";`
  )
  .join("\n");
const capsuleEntries = capsuleAssets
  .map(({ key, componentName }) => `${JSON.stringify(key)}: ${componentName},`)
  .join("\n");
expectedFiles.set(
  join(capsuleOutputDir, "all.tsx"),
  format(`
    import type { ComponentType, SVGProps } from "react";
    ${capsuleImports}

    export const CAPSULE_ASSET_NAMES = ${JSON.stringify(
      capsuleAssets.map(({ key }) => key)
    )} as const;
    export type CapsuleAssetName = (typeof CAPSULE_ASSET_NAMES)[number];

    export const capsules: Record<
      CapsuleAssetName,
      ComponentType<SVGProps<SVGGElement>>
    > = {
      ${capsuleEntries}
    };
  `)
);
expectedFiles.set(
  join(capsuleOutputDir, "index.ts"),
  format(
    `export * from "./all";\n${capsuleAssets
      .map(({ key }) => `export * from "./${key}";`)
      .join("\n")}`
  )
);

const arcadeOutputDir = join(packageDir, "src", "arcade");
await mkdir(arcadeOutputDir, { recursive: true });
const arcadeSvg = await readFile(
  join(packageDir, "svgs", "robot-arcade", "robot-arcade.svg"),
  "utf8"
);
const arcadeBody = extractSvgBody(
  stripArcadeFace(arcadeSvg),
  new Map([["#d72435", "currentColor"]])
);
expectedFiles.set(
  join(arcadeOutputDir, "robot-arcade.tsx"),
  format(`
    import type { SVGProps } from "react";

    export const RobotArcade = (props: SVGProps<SVGGElement>) => (
      <g {...props}>${arcadeBody}</g>
    );
  `)
);
expectedFiles.set(
  join(arcadeOutputDir, "index.ts"),
  format('export * from "./robot-arcade";')
);

const supplementalCategories = [
  {
    output: "eyebrows",
    typeName: "EyebrowsType",
    mapName: "eyebrowsMap",
    includeNone: true,
    aliases: { neutral: "normal" },
  },
  {
    output: "details",
    typeName: "DetailsType",
    mapName: "detailsMap",
    includeNone: true,
  },
  {
    output: "accessories",
    typeName: "AccessoryType",
    mapName: "accessoriesMap",
    includeNone: true,
  },
  {
    output: "patterns",
    typeName: "PatternType",
    mapName: "patternsMap",
    includeNone: true,
    pattern: true,
    additionalExports: ["types"],
  },
];

for (const category of supplementalCategories) {
  const outputDir = join(packageDir, "src", category.output);
  const fileNames = (await readdir(outputDir))
    .filter(
      (fileName) =>
        fileName.endsWith(".tsx") &&
        !fileName.endsWith(".test.tsx") &&
        fileName !== "all.tsx"
    )
    .sort((left, right) => left.localeCompare(right));
  const assets = [];

  for (const fileName of fileNames) {
    const slug = fileName.slice(0, -4);
    const source = await readFile(join(outputDir, fileName), "utf8");
    const componentName = source.match(/export const (\w+)/)?.[1];
    if (!componentName) {
      throw new Error(
        `No exported component found in ${category.output}/${fileName}`
      );
    }
    assets.push({
      slug,
      key: category.aliases?.[slug] ?? slug,
      componentName,
    });
  }

  catalogValues.set(category.output, [
    ...assets.map(({ key }) => key),
    ...(category.includeNone ? ["none"] : []),
  ]);

  const imports = assets
    .map(
      ({ slug, componentName }) =>
        `import { ${componentName} } from "./${slug}";`
    )
    .join("\n");
  const entries = assets
    .map(
      ({ key, componentName }) => `${JSON.stringify(key)}: ${componentName},`
    )
    .join("\n");
  const componentType = category.pattern
    ? "ComponentType<PatternProps>"
    : "ComponentType<SVGProps<SVGGElement>>";
  const reactTypes = category.pattern
    ? 'import type { ComponentType } from "react";\nimport type { PatternProps } from "./types";'
    : 'import type { ComponentType, SVGProps } from "react";';
  const registry = format(`
    ${reactTypes}
    import type { ${category.typeName} } from "@acandrade/ac-bot-avatar-core";
    ${imports}

    export const ${category.mapName}: Record<${
    category.typeName
  }, ${componentType}> = {
      ${entries}
      ${category.includeNone ? '"none": () => null,' : ""}
    };
  `);
  expectedFiles.set(join(outputDir, "all.tsx"), registry);

  const exports = [
    'export * from "./all";',
    ...assets.map(({ slug }) => `export * from "./${slug}";`),
    ...(category.additionalExports ?? []).map(
      (slug) => `export * from "./${slug}";`
    ),
  ].join("\n");
  expectedFiles.set(join(outputDir, "index.ts"), format(exports));
}

const preferredOrder = {
  eyes: [
    "mischief",
    "blink",
    "chords",
    "closed",
    "cry_laugh",
    "glasses",
    "glow",
    "heart",
    "laugh",
    "love",
    "music",
    "normal",
    "squint",
    "star",
    "sunglasses",
    "surprised",
    "talking",
  ],
  mouths: [
    "big_smile",
    "flat",
    "laugh_open",
    "mischief",
    "open",
    "open_happy",
    "open_tongue",
    "sad",
    "side_smile",
    "smile",
    "soft_smile",
    "surprised",
    "talking",
    "tongue",
    "wave",
    "wave_small",
    "none",
  ],
  eyebrows: ["normal", "angry", "sad", "worried", "raised", "none"],
  details: ["blush", "freckles", "none"],
  accessories: [
    "antenna",
    "headphones",
    "bow",
    "hat",
    "stars",
    "hearts",
    "explosions",
    "carnival",
    "lights",
    "none",
  ],
  patterns: ["dots", "lines", "noise", "none"],
};

const orderCatalog = (name) => {
  const discovered = catalogValues.get(name) ?? [];
  const preferred = preferredOrder[name] ?? [];
  return [
    ...preferred.filter((value) => discovered.includes(value)),
    ...discovered.filter((value) => !preferred.includes(value)).sort(),
  ];
};

const generatedCatalogs = format(`
  // Generated by packages/assets/scripts/convert-svgs.mjs. Do not edit manually.
  export const EYE_TYPES = ${JSON.stringify(orderCatalog("eyes"))} as const;
  export const MOUTH_TYPES = ${JSON.stringify(orderCatalog("mouths"))} as const;
  export const EYEBROWS_TYPES = ${JSON.stringify(
    orderCatalog("eyebrows")
  )} as const;
  export const DETAILS_TYPES = ${JSON.stringify(
    orderCatalog("details")
  )} as const;
  export const ACCESSORY_TYPES = ${JSON.stringify(
    orderCatalog("accessories")
  )} as const;
  export const PATTERN_TYPES = ${JSON.stringify(
    orderCatalog("patterns")
  )} as const;
  export const AVATAR_VARIANTS = ["robot", "face"] as const;
  export const BACKGROUND_TYPES = ["solid", "gradientLinear", "glass", "transparent"] as const;
  export const PALETTE_NAMES = ["neutral", "warm", "cool"] as const;
  export const GENERATION_VERSIONS = ["v1", "v2", "v3"] as const;
`);
expectedFiles.set(
  join(packageDir, "..", "core", "src", "generatedCatalogs.ts"),
  generatedCatalogs
);

const changedFiles = [];
for (const [filePath, expected] of expectedFiles) {
  let current = "";
  try {
    current = await readFile(filePath, "utf8");
  } catch {
    // Missing output is reported as a change below.
  }

  if (current.replace(/\r\n/g, "\n") === expected.replace(/\r\n/g, "\n")) {
    continue;
  }

  changedFiles.push(filePath.slice(packageDir.length + 1));
  if (!checkOnly) await writeFile(filePath, expected, "utf8");
}

if (checkOnly && changedFiles.length > 0) {
  process.stderr.write(
    `Generated assets are stale:\n${changedFiles
      .map((file) => `- ${file}`)
      .join("\n")}\n`
  );
  process.exit(1);
}

process.stdout.write(
  checkOnly
    ? `Verified ${expectedFiles.size} generated asset files.\n`
    : `Generated ${expectedFiles.size} asset files.\n`
);
