import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ACCESSORY_TYPES,
  DETAILS_TYPES,
  EYEBROWS_TYPES,
  EYE_TYPES,
  MOUTH_TYPES,
  PATTERN_TYPES,
} from "@acandrade/ac-bot-avatar-core";
import {
  ACBotAvatar,
  BUILT_IN_AVATAR_THEME_IDS,
  CAPSULE_BOT_KINDS,
  FRUIT_BOT_KINDS,
  HashedACBotAvatar,
} from "@acandrade/ac-bot-avatar-react";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(rootDir, "docs", "gallery");
const sizes = [32, 64, 128];
const arcadeColorPresets = {
  crimson: { color: "#d72435", eyeColor: "#faf5e3", mouthColor: "#faf5e3" },
  cobalt: { color: "#2563eb", eyeColor: "#67e8f9", mouthColor: "#f9a8d4" },
  emerald: { color: "#059669", eyeColor: "#fef08a", mouthColor: "#fef08a" },
  violet: { color: "#7c3aed", eyeColor: "#f0abfc", mouthColor: "#5eead4" },
};
const capsuleColorPresets = {
  default: { color: "#7c3aed", eyeColor: "#67e8f9", mouthColor: "#f9a8d4" },
  antenna: { color: "#2563eb", eyeColor: "#fef08a", mouthColor: "#fef08a" },
  mohawk: { color: "#dc2626", eyeColor: "#ffffff", mouthColor: "#fb7185" },
  satellite: { color: "#059669", eyeColor: "#a7f3d0", mouthColor: "#fde68a" },
};
const classicRobotThemes = ["robot", "terminal", "emoji"];
const colorCompositionSeeds = [
  { name: "atlas", seed: "atlas-9823", background: false },
  {
    name: "solid",
    seed: "solid-contrast-2048",
    background: true,
    backgroundType: "solid",
  },
  {
    name: "gradient",
    seed: "gradient-spectrum-4096",
    background: true,
    backgroundType: "gradientLinear",
  },
  {
    name: "glass",
    seed: "glass-surface-8192",
    background: true,
    backgroundType: "glass",
  },
];
const colorCompositionCases = Object.fromEntries(
  BUILT_IN_AVATAR_THEME_IDS.flatMap((theme) =>
    colorCompositionSeeds.map((entry) => [
      `${theme}-${entry.name}`,
      {
        __hashed: true,
        ...entry,
        name: undefined,
        theme,
        generationVersion: "v3",
      },
    ])
  )
);

const categories = [
  ["eyes", EYE_TYPES, (name) => ({ eye: name, mouth: "smile" })],
  ["mouths", MOUTH_TYPES, (name) => ({ eye: "normal", mouth: name })],
  ["eyebrows", EYEBROWS_TYPES, (name) => ({ eyebrows: name })],
  ["details", DETAILS_TYPES, (name) => ({ details: name })],
  ["accessories", ACCESSORY_TYPES, (name) => ({ accessory: name })],
  [
    "patterns",
    PATTERN_TYPES,
    (name) => ({
      background: true,
      backgroundPattern: name,
      backgroundType: "gradientLinear",
      backgroundColors: ["#312e81", "#0f766e"],
      backgroundRotation: 35,
    }),
  ],
  [
    "themes",
    BUILT_IN_AVATAR_THEME_IDS,
    (name) => ({
      theme: name,
      themeSeed: `gallery-${name}`,
      themeVariant:
        name === "fruit" ? "apple" : name === "initial" ? "soft" : undefined,
      monogram: "A",
      eye: name === "initial" ? "love" : "normal",
      mouth: name === "pixel" ? "big_smile" : "smile",
    }),
  ],
  [
    "color-composition-v3",
    Object.keys(colorCompositionCases),
    (name) => colorCompositionCases[name],
  ],
  [
    "robot-face-safety",
    classicRobotThemes,
    (name) => ({
      theme: name,
      eye: "glasses",
      mouth: "talking",
      accessory: "none",
    }),
  ],
  [
    "robot-face-gap",
    classicRobotThemes,
    (name) => ({
      theme: name,
      eye: "glasses",
      mouth: "big_smile",
      accessory: "none",
    }),
  ],
  [
    "arcade-colors",
    Object.keys(arcadeColorPresets),
    (name) => ({
      theme: "arcade",
      eye: "glasses",
      mouth: "talking",
      ...arcadeColorPresets[name],
    }),
  ],
  [
    "arcade-face-gap",
    ["arcade"],
    () => ({
      theme: "arcade",
      eye: "glasses",
      mouth: "big_smile",
    }),
  ],
  [
    "capsule-bots",
    CAPSULE_BOT_KINDS,
    (name) => ({
      theme: "capsule",
      themeVariant: name,
      eye: name === "mohawk" ? "love" : "normal",
      mouth: name === "satellite" ? "big_smile" : "smile",
      ...capsuleColorPresets[name],
    }),
  ],
  [
    "capsule-face-fit",
    CAPSULE_BOT_KINDS,
    (name) => ({
      theme: "capsule",
      themeVariant: name,
      eye: "glasses",
      mouth: "talking",
    }),
  ],
  [
    "capsule-face-gap",
    CAPSULE_BOT_KINDS,
    (name) => ({
      theme: "capsule",
      themeVariant: name,
      eye: "glasses",
      mouth: "big_smile",
    }),
  ],
  [
    "fruit-bots",
    FRUIT_BOT_KINDS,
    (name) => ({
      theme: "fruit",
      themeVariant: name,
      eye: name === "grape" || name === "cherry" ? "love" : "normal",
      mouth: name === "banana" || name === "pineapple" ? "big_smile" : "smile",
    }),
  ],
  [
    "fruit-face-fit",
    FRUIT_BOT_KINDS,
    (name) => ({
      theme: "fruit",
      themeVariant: name,
      eye: "glasses",
      mouth: "talking",
    }),
  ],
  [
    "fruit-face-gap",
    FRUIT_BOT_KINDS,
    (name) => ({
      theme: "fruit",
      themeVariant: name,
      eye: "glasses",
      mouth: "big_smile",
    }),
  ],
];

const card = (category, name, size, props) => {
  const { __hashed, ...avatarProps } = props;
  const AvatarComponent = __hashed ? HashedACBotAvatar : ACBotAvatar;
  const avatar = renderToStaticMarkup(
    React.createElement(AvatarComponent, {
      ...avatarProps,
      size,
      title: `${category}: ${name}, ${size}px`,
      id: `gallery-${category}-${name}-${size}`,
    })
  );

  return `<article class="card" data-category="${category}" data-asset="${name}" data-size="${size}">
    <div class="stage stage-${size}">${avatar}</div>
    <strong>${name}</strong><span>${size}px</span>
  </article>`;
};

const sections = categories
  .map(([category, names, propsFor]) => {
    const cards = sizes
      .flatMap((size) =>
        names.map((name) => card(category, name, size, propsFor(name)))
      )
      .join("\n");
    return `<section><div class="section-heading"><h2>${category}</h2><span>${names.length} assets × ${sizes.length} resolutions</span></div><div class="grid">${cards}</div></section>`;
  })
  .join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AC Bot Avatar visual gallery</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, sans-serif; background: #080b12; color: #f8fafc; }
    * { box-sizing: border-box; }
    body { margin: 0; background: radial-gradient(circle at 50% -10%, #20244a 0, #0d1120 32rem, #080b12 70rem); }
    main { width: min(1440px, 100%); margin: auto; padding: 48px 32px 96px; }
    header { max-width: 760px; margin-bottom: 64px; }
    .eyebrow { color: #7dd3fc; font-size: 12px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; }
    h1 { margin: 12px 0; font-size: clamp(38px, 6vw, 78px); line-height: .95; letter-spacing: -.055em; }
    header p, .section-heading span { color: #94a3b8; }
    section { margin-top: 56px; }
    .section-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; border-bottom: 1px solid #293043; margin-bottom: 18px; padding-bottom: 12px; }
    h2 { margin: 0; font-size: 22px; text-transform: capitalize; }
    .grid { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 10px; }
    .card { min-height: 180px; display: grid; grid-template-columns: 1fr auto; align-items: end; gap: 8px; padding: 12px; overflow: hidden; border: 1px solid #273047; border-radius: 14px; background: linear-gradient(145deg, rgba(30,41,59,.82), rgba(15,23,42,.72)); }
    .card strong { min-width: 0; overflow: hidden; color: #e2e8f0; font-size: 12px; text-overflow: ellipsis; }
    .card span { color: #64748b; font: 10px ui-monospace, monospace; }
    .stage { grid-column: 1 / -1; min-height: 132px; display: grid; place-items: center; border-radius: 9px; background: repeating-conic-gradient(#131a2a 0 25%, #101624 0 50%) 50% / 12px 12px; }
    .stage svg { display: block; flex: none; }
    @media (max-width: 1050px) { .grid { grid-template-columns: repeat(5, minmax(0, 1fr)); } }
    @media (max-width: 680px) { main { padding-inline: 16px; } .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .section-heading { display: block; } }
  </style>
</head>
<body><main>
  <header><div class="eyebrow">Automated visual contract</div><h1>Every part.<br />Three resolutions.</h1><p>Canonical asset coverage at 32, 64 and 128 pixels, with deterministic SVG identifiers and representative patterned backgrounds.</p></header>
  ${sections}
</main></body>
</html>`;

await mkdir(outputDir, { recursive: true });
await writeFile(join(outputDir, "index.html"), html);
process.stdout.write(
  `Rendered ${categories.reduce(
    (total, [, names]) => total + names.length * sizes.length,
    0
  )} gallery cards.\n`
);
