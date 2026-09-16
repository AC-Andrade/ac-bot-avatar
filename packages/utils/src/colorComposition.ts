import type {
  AvatarColor,
  BackgroundType,
  ColorCompositionColors,
  ColorCompositionInput,
  ColorCompositionResult,
  ColorContrastThresholds,
  ColorImportance,
  ColorRole,
  ColorValidationIssue,
  ColorValidationResult,
  SemanticColorPalette,
} from "@acandrade/ac-bot-avatar-core";
import {
  getColorDistance,
  getContrastRatio,
  isColorCollision,
  mixColors,
  parseColor,
  rgbToHex,
  sampleGradientColors,
} from "./color";
import { createPRNG, pickItem, stringToHash } from "./hash";

export const CRITICAL_CONTRAST = 4.5;
export const SECONDARY_CONTRAST = 3;
export const DECORATIVE_CONTRAST = 2.25;

export const DEFAULT_COLOR_THRESHOLDS: Readonly<ColorContrastThresholds> =
  Object.freeze({
    critical: CRITICAL_CONTRAST,
    secondary: SECONDARY_CONTRAST,
    decorative: DECORATIVE_CONTRAST,
    similarity: 8,
  });

export const COLOR_PALETTES: Readonly<
  Record<string, Readonly<SemanticColorPalette>>
> = Object.freeze({
  cyan: Object.freeze({
    name: "cyan",
    primary: "#06b6d4",
    secondary: "#67e8f9",
    accent: "#22d3ee",
    dark: "#083344",
    light: "#cffafe",
    background: "#071827",
    contrastText: "#f8fafc",
  }),
  purple: Object.freeze({
    name: "purple",
    primary: "#7c3aed",
    secondary: "#c084fc",
    accent: "#a855f7",
    dark: "#2e1065",
    light: "#f3e8ff",
    background: "#160b2d",
    contrastText: "#ffffff",
  }),
  blue: Object.freeze({
    name: "blue",
    primary: "#2563eb",
    secondary: "#60a5fa",
    accent: "#38bdf8",
    dark: "#172554",
    light: "#dbeafe",
    background: "#09162f",
    contrastText: "#ffffff",
  }),
  green: Object.freeze({
    name: "green",
    primary: "#10b981",
    secondary: "#6ee7b7",
    accent: "#34d399",
    dark: "#052e24",
    light: "#d1fae5",
    background: "#061c18",
    contrastText: "#ffffff",
  }),
  orange: Object.freeze({
    name: "orange",
    primary: "#f97316",
    secondary: "#fdba74",
    accent: "#fb923c",
    dark: "#431407",
    light: "#ffedd5",
    background: "#241006",
    contrastText: "#ffffff",
  }),
  red: Object.freeze({
    name: "red",
    primary: "#dc2626",
    secondary: "#f87171",
    accent: "#fb7185",
    dark: "#450a0a",
    light: "#fee2e2",
    background: "#26090d",
    contrastText: "#ffffff",
  }),
  yellow: Object.freeze({
    name: "yellow",
    primary: "#eab308",
    secondary: "#fde047",
    accent: "#facc15",
    dark: "#422006",
    light: "#fef9c3",
    background: "#201704",
    contrastText: "#111827",
  }),
  pink: Object.freeze({
    name: "pink",
    primary: "#db2777",
    secondary: "#f9a8d4",
    accent: "#f472b6",
    dark: "#500724",
    light: "#fce7f3",
    background: "#2b0a1c",
    contrastText: "#ffffff",
  }),
  neutral: Object.freeze({
    name: "neutral",
    primary: "#94a3b8",
    secondary: "#cbd5e1",
    accent: "#64748b",
    dark: "#111827",
    light: "#f8fafc",
    background: "#0f172a",
    contrastText: "#ffffff",
  }),
});

type PaletteSlot = Exclude<keyof SemanticColorPalette, "name">;

interface ThemeProfile {
  palettes: readonly string[];
  primarySlots: readonly PaletteSlot[];
  face: "body" | "none" | string;
  separateFace: boolean;
  semanticPrimary?: string;
}

const FRUIT_KINDS = [
  "apple",
  "pear",
  "banana",
  "grape",
  "orange",
  "strawberry",
  "pineapple",
  "watermelon",
  "lemon",
  "mango",
  "cherry",
  "peach",
  "kiwi",
  "coconut",
  "papaya",
  "guava",
  "passionfruit",
  "acai",
] as const;

type FruitKind = (typeof FRUIT_KINDS)[number];

const FRUIT_BODY_COLORS: Readonly<Record<FruitKind, string>> = Object.freeze({
  apple: "#d72438",
  pear: "#aec947",
  banana: "#f7ce18",
  grape: "#744e89",
  orange: "#e1772b",
  strawberry: "#d72438",
  pineapple: "#f7ce18",
  watermelon: "#4daa46",
  lemon: "#f7ce18",
  mango: "#eca523",
  cherry: "#d72334",
  peach: "#e58469",
  kiwi: "#b96d32",
  coconut: "#8a422d",
  papaya: "#e1772b",
  guava: "#aec947",
  passionfruit: "#f7ce18",
  acai: "#744e89",
});

const FRUIT_ALIASES: ReadonlyArray<readonly [FruitKind, readonly string[]]> = [
  ["passionfruit", ["passionfruit", "maracuja"]],
  ["strawberry", ["strawberry", "morango"]],
  ["watermelon", ["watermelon", "melancia"]],
  ["pineapple", ["pineapple", "abacaxi"]],
  ["coconut", ["coconut", "coco"]],
  ["banana", ["banana"]],
  ["cherry", ["cherry", "cereja"]],
  ["orange", ["orange", "laranja"]],
  ["papaya", ["papaya", "mamao"]],
  ["peach", ["peach", "pessego"]],
  ["apple", ["apple", "maca"]],
  ["pear", ["pear", "pera"]],
  ["grape", ["grape", "berry", "uva"]],
  ["lemon", ["lemon", "limao"]],
  ["mango", ["mango", "manga"]],
  ["guava", ["guava", "goiaba"]],
  ["kiwi", ["kiwi"]],
  ["acai", ["acai"]],
];

const normalizeName = (value: string | number | undefined): string =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]/g, "");

const findFruitKind = (
  value: string | number | undefined
): FruitKind | undefined => {
  const normalized = normalizeName(value);
  if (!normalized) return undefined;
  return FRUIT_ALIASES.find(([, aliases]) =>
    aliases.some((alias) => normalized.includes(alias))
  )?.[0];
};

const stableThemeIndex = (
  value: string | number | undefined,
  category: string,
  length: number
): number => {
  const source = `${value ?? "default"}:${category}`;
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return length > 0 ? (hash >>> 0) % length : 0;
};

const resolveFruitKind = (
  seed: string | number,
  themeVariant: string | undefined
): FruitKind =>
  findFruitKind(themeVariant) ??
  findFruitKind(seed) ??
  FRUIT_KINDS[stableThemeIndex(seed, "fruit-kind-v2", FRUIT_KINDS.length)];

const paletteForFruit = (kind: FruitKind): string => {
  if (kind === "grape" || kind === "acai") return "purple";
  if (kind === "watermelon" || kind === "pear" || kind === "guava") {
    return "green";
  }
  if (kind === "banana" || kind === "pineapple" || kind === "lemon") {
    return "yellow";
  }
  if (
    kind === "orange" ||
    kind === "mango" ||
    kind === "papaya" ||
    kind === "peach" ||
    kind === "kiwi" ||
    kind === "coconut"
  ) {
    return "orange";
  }
  return "red";
};

const resolveThemeProfile = (
  seed: string | number,
  input: ColorCompositionInput
): ThemeProfile => {
  const theme = input.theme ?? "classic";
  if (theme === "fruit") {
    const kind = resolveFruitKind(seed, input.themeVariant);
    return {
      palettes: [paletteForFruit(kind)],
      primarySlots: ["primary"],
      face: kind === "cherry" ? "#152133" : "#181d24",
      separateFace: true,
      semanticPrimary: FRUIT_BODY_COLORS[kind],
    };
  }
  if (theme === "robot") {
    return {
      palettes: ["cyan", "blue", "neutral"],
      primarySlots: ["light", "secondary", "primary"],
      face: "#202135",
      separateFace: true,
    };
  }
  if (theme === "face-minimal") {
    return {
      palettes: ["cyan", "purple", "neutral"],
      primarySlots: ["dark", "primary", "accent"],
      face: "none",
      separateFace: false,
    };
  }
  if (theme === "terminal") {
    return {
      palettes: ["green"],
      primarySlots: ["secondary", "primary", "accent"],
      face: "#050b12",
      separateFace: true,
    };
  }
  if (theme === "emoji") {
    return {
      palettes: ["yellow", "orange"],
      primarySlots: ["secondary", "primary", "light"],
      face: "body",
      separateFace: false,
    };
  }
  if (theme === "capsule") {
    return {
      palettes: ["purple"],
      primarySlots: ["primary", "secondary", "accent", "light"],
      face: input.themeVariant === "default" ? "#19171b" : "#18161b",
      separateFace: true,
    };
  }
  if (theme === "pixel") {
    return {
      palettes: ["green", "cyan"],
      primarySlots: ["primary", "accent", "secondary"],
      face: "#05090d",
      separateFace: true,
    };
  }
  if (theme === "arcade") {
    return {
      palettes: ["red", "orange"],
      primarySlots: ["primary", "secondary", "accent", "light"],
      face: "#193952",
      separateFace: true,
    };
  }
  if (theme === "neko") {
    return {
      palettes: ["purple", "pink"],
      primarySlots: ["primary", "secondary", "accent", "light"],
      face: "#0a0512",
      separateFace: true,
    };
  }
  if (theme === "square") {
    return {
      palettes: ["blue", "cyan"],
      primarySlots: ["secondary", "primary", "light"],
      face: "body",
      separateFace: false,
    };
  }
  if (theme === "initial") {
    return {
      palettes: ["cyan", "purple", "blue", "green", "orange", "red", "pink"],
      primarySlots: ["secondary", "primary", "light"],
      face: "body",
      separateFace: false,
    };
  }
  if ((input.variant ?? "robot") === "face") {
    return {
      palettes: Object.keys(COLOR_PALETTES),
      primarySlots: ["primary", "secondary", "accent"],
      face: "none",
      separateFace: false,
    };
  }
  return {
    palettes: Object.keys(COLOR_PALETTES),
    primarySlots: ["light", "secondary", "primary"],
    face: "#202135",
    separateFace: true,
  };
};

const uniqueColors = (colors: readonly string[]): string[] =>
  colors.filter(
    (color, index) =>
      parseColor(color) !== undefined &&
      colors.findIndex(
        (candidate) => candidate.toLowerCase() === color.toLowerCase()
      ) === index
  );

const normalizeAvatarColor = (
  color: AvatarColor | undefined
): string | undefined => {
  const value = Array.isArray(color)
    ? `hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`
    : color;
  if (!value) return undefined;
  const rgb = parseColor(value);
  return rgb ? rgbToHex(rgb) : undefined;
};

const deterministicOrder = (
  seed: string | number,
  category: string,
  values: readonly string[]
): string[] => {
  const ordered = [...values];
  const prng = createPRNG(
    stringToHash(`${seed}:color-composition:${category}`)
  );
  for (let index = ordered.length - 1; index > 0; index -= 1) {
    const target = Math.floor(prng() * (index + 1));
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
  }
  return ordered;
};

const makeCustomPalette = (values: readonly string[]): SemanticColorPalette => {
  const colors = uniqueColors(values);
  const value = (index: number, fallback: string): string =>
    colors[index % Math.max(1, colors.length)] ?? fallback;
  return {
    name: "custom",
    primary: value(0, "#06b6d4"),
    secondary: value(1, "#67e8f9"),
    accent: value(2, "#22d3ee"),
    dark: value(3, "#111827"),
    light: value(4, "#f8fafc"),
    background: value(5, "#0f172a"),
    contrastText: value(6, "#ffffff"),
  };
};

const resolvePalette = (
  seed: string | number,
  input: ColorCompositionInput,
  profile: ThemeProfile
): SemanticColorPalette => {
  if (Array.isArray(input.palette) && input.palette.length > 0) {
    return makeCustomPalette(
      input.palette
        .map((color) => normalizeAvatarColor(color) ?? "")
        .filter(Boolean)
    );
  }

  const groups: Readonly<Record<string, readonly string[]>> = {
    warm: ["red", "orange", "pink", "purple", "yellow"],
    cool: ["cyan", "blue", "green", "purple"],
    neutral: Object.keys(COLOR_PALETTES),
  };
  const requested =
    typeof input.palette === "string" ? groups[input.palette] : undefined;
  const compatible = requested
    ? profile.palettes.filter((name) => requested.includes(name))
    : profile.palettes;
  const names = compatible.length > 0 ? compatible : profile.palettes;
  const name = pickItem(
    createPRNG(stringToHash(`${seed}:color-composition:palette`)),
    names
  );
  return COLOR_PALETTES[name] ?? COLOR_PALETTES.neutral;
};

const resolveThresholds = (
  thresholds: ColorCompositionInput["thresholds"]
): ColorContrastThresholds => ({
  ...DEFAULT_COLOR_THRESHOLDS,
  ...thresholds,
});

const thresholdFor = (
  importance: ColorImportance,
  thresholds: ColorContrastThresholds
): number => thresholds[importance];

interface ValidationContext {
  input: ColorCompositionInput;
  profile: ThemeProfile;
  thresholds: ColorContrastThresholds;
  backgroundType: BackgroundType;
}

const backgroundSamples = (
  colors: ColorCompositionColors,
  backgroundType: BackgroundType
): string[] => {
  if (backgroundType === "transparent" || colors.background.length === 0) {
    return [];
  }
  if (backgroundType === "gradientLinear") {
    return sampleGradientColors(colors.background, 5);
  }
  if (backgroundType === "glass") {
    const base = colors.background[3] ?? "#080d18";
    return uniqueColors([
      base,
      ...colors.background
        .slice(0, 3)
        .map((color) => mixColors(base, color, 0.62) ?? base),
    ]);
  }
  return colors.background.slice(0, 1);
};

const FIXED_ACCESSORY_COLORS: Readonly<Record<string, string>> = Object.freeze({
  cowboy: "#92400e",
  crown: "#fbbf24",
  halo: "#fef08a",
  pirate: "#111827",
});

const addInvalidIssue = (
  issues: ColorValidationIssue[],
  role: ColorRole
): void => {
  issues.push({
    code: "invalid-color",
    roles: [role],
    importance: "critical",
  });
};

const addContrastIssue = (
  issues: ColorValidationIssue[],
  roleA: ColorRole,
  roleB: ColorRole,
  actual: number | undefined,
  importance: ColorImportance,
  thresholds: ColorContrastThresholds
): void => {
  const required = thresholdFor(importance, thresholds);
  if (actual === undefined || actual < required) {
    issues.push({
      code: "contrast",
      roles: [roleA, roleB],
      importance,
      actual,
      required,
    });
  }
};

const addCollisionIssue = (
  issues: ColorValidationIssue[],
  roleA: ColorRole,
  roleB: ColorRole,
  colorA: string,
  colorB: string,
  importance: ColorImportance,
  thresholds: ColorContrastThresholds
): void => {
  if (isColorCollision(colorA, colorB, thresholds.similarity)) {
    issues.push({
      code: "collision",
      roles: [roleA, roleB],
      importance,
      actual: getColorDistance(colorA, colorB),
      required: thresholds.similarity,
    });
  }
};

const minimumContrast = (
  foreground: string,
  surfaces: readonly string[]
): number | undefined => {
  const ratios = surfaces
    .map((surface) => getContrastRatio(foreground, surface))
    .filter((ratio): ratio is number => ratio !== undefined);
  return ratios.length > 0 ? Math.min(...ratios) : undefined;
};

/** Validates adjacency, perceptual distance, theme identity and gradient stops. */
export const validateColorComposition = (
  colors: ColorCompositionColors,
  input: ColorCompositionInput = {}
): ColorValidationResult => {
  const seed = "validation";
  const profile = resolveThemeProfile(seed, input);
  const thresholds = resolveThresholds(input.thresholds);
  const backgroundType =
    input.background === false || input.backgroundType === "transparent"
      ? "transparent"
      : input.backgroundType ?? (input.background ? "solid" : "transparent");
  const context: ValidationContext = {
    input,
    profile,
    thresholds,
    backgroundType,
  };
  const issues: ColorValidationIssue[] = [];
  const usedColors: ReadonlyArray<readonly [ColorRole, string]> = [
    ["body", colors.body],
    ["secondaryBody", colors.secondaryBody],
    ["face", colors.face],
    ["eyes", colors.eyes],
    ["mouth", colors.mouth],
    ["eyebrows", colors.eyebrows],
    ["details", colors.details],
    ["accessory", colors.accessory],
    ["accent", colors.accent],
  ];

  for (const [role, color] of usedColors) {
    if (!parseColor(color)) addInvalidIssue(issues, role);
  }
  for (const color of colors.background) {
    if (!parseColor(color)) addInvalidIssue(issues, "background");
  }

  const backgrounds = backgroundSamples(colors, context.backgroundType);
  if (backgrounds.length > 0 && profile.face !== "none") {
    addContrastIssue(
      issues,
      "body",
      "background",
      minimumContrast(colors.body, backgrounds),
      "critical",
      thresholds
    );
  }

  if (profile.separateFace) {
    addContrastIssue(
      issues,
      "face",
      "body",
      getContrastRatio(colors.face, colors.body),
      "secondary",
      thresholds
    );
    addCollisionIssue(
      issues,
      "face",
      "body",
      colors.face,
      colors.body,
      "secondary",
      thresholds
    );
  }

  const faceSurfaces = profile.face === "none" ? backgrounds : [colors.face];
  if (faceSurfaces.length > 0) {
    addContrastIssue(
      issues,
      "eyes",
      profile.face === "none" ? "background" : "face",
      minimumContrast(colors.eyes, faceSurfaces),
      "critical",
      thresholds
    );
    if (input.hasMouth !== false) {
      addContrastIssue(
        issues,
        "mouth",
        profile.face === "none" ? "background" : "face",
        minimumContrast(colors.mouth, faceSurfaces),
        "critical",
        thresholds
      );
    }
    if (input.hasEyebrows) {
      addContrastIssue(
        issues,
        "eyebrows",
        profile.face === "none" ? "background" : "face",
        minimumContrast(colors.eyebrows, faceSurfaces),
        "secondary",
        thresholds
      );
    }
    if (input.hasDetails) {
      addContrastIssue(
        issues,
        "details",
        profile.face === "none" ? "background" : "face",
        minimumContrast(colors.details, faceSurfaces),
        "decorative",
        thresholds
      );
    }
  }

  if (input.hasMouth !== false) {
    addCollisionIssue(
      issues,
      "eyes",
      "mouth",
      colors.eyes,
      colors.mouth,
      "secondary",
      thresholds
    );
  }

  if (input.hasAccessory) {
    const accessoryColor =
      FIXED_ACCESSORY_COLORS[input.accessory ?? ""] ?? colors.accessory;
    addContrastIssue(
      issues,
      "accessory",
      "body",
      getContrastRatio(accessoryColor, colors.body),
      "secondary",
      thresholds
    );
    addCollisionIssue(
      issues,
      "accessory",
      "body",
      accessoryColor,
      colors.body,
      "secondary",
      thresholds
    );
    if (backgrounds.length > 0) {
      addContrastIssue(
        issues,
        "accessory",
        "background",
        minimumContrast(accessoryColor, backgrounds),
        "decorative",
        thresholds
      );
    }
  }

  if (profile.semanticPrimary) {
    const distance = getColorDistance(colors.body, profile.semanticPrimary);
    if (distance === undefined || distance > 0.5) {
      issues.push({
        code: "identity",
        roles: ["body"],
        importance: "critical",
        actual: distance,
        required: 0.5,
      });
    }
  }

  const penalty = issues.reduce((total, issue) => {
    if (issue.code === "invalid-color" || issue.code === "identity") {
      return total + 35;
    }
    if (issue.importance === "critical") return total + 18;
    if (issue.importance === "secondary") return total + 9;
    return total + 4;
  }, 0);
  const score = Math.max(0, Math.min(100, 100 - penalty));
  const passed =
    score >= 75 && !issues.some((issue) => issue.importance === "critical");

  return { passed, score, issues };
};

const withDerivedFace = (
  colors: ColorCompositionColors,
  profile: ThemeProfile
): ColorCompositionColors => ({
  ...colors,
  face:
    profile.face === "body"
      ? colors.body
      : profile.face === "none"
      ? colors.face
      : profile.face,
});

const candidatePool = (palette: SemanticColorPalette): string[] =>
  uniqueColors([
    palette.primary,
    palette.secondary,
    palette.accent,
    palette.dark,
    palette.light,
    palette.background,
    palette.contrastText,
    "#ffffff",
    "#f8fafc",
    "#111827",
    "#05090d",
  ]);

const initialBackground = (
  seed: string | number,
  type: BackgroundType,
  requested: readonly AvatarColor[] | undefined,
  candidates: readonly string[]
): string[] => {
  if (type === "transparent") return [];
  const normalized = requested
    ?.map(normalizeAvatarColor)
    .filter((color): color is string => color !== undefined);
  const ordered = deterministicOrder(seed, "background-initial", candidates);
  const source = normalized && normalized.length > 0 ? normalized : ordered;
  if (type === "solid") return [source[0]];
  if (type === "glass") {
    return [
      source[0],
      source[1] ?? ordered[1],
      source[2] ?? ordered[2],
      source[3] ?? ordered[3],
    ];
  }
  return [source[0], source[1] ?? ordered[1]];
};

const backgroundCandidates = (
  seed: string | number,
  type: BackgroundType,
  palette: SemanticColorPalette,
  candidates: readonly string[]
): string[][] => {
  if (type === "transparent") return [[]];
  const ordered = deterministicOrder(
    seed,
    "background-repair",
    uniqueColors([
      palette.background,
      palette.dark,
      "#07111f",
      "#111827",
      palette.light,
      "#f8fafc",
      "#fff7ed",
      ...candidates,
    ])
  );
  if (type === "solid") return ordered.map((color) => [color]);

  const variants: string[][] = [];
  if (type === "glass") {
    for (let baseIndex = 0; baseIndex < ordered.length; baseIndex += 1) {
      const base = ordered[baseIndex];
      variants.push([base, base, base, base]);
      const similarSurfaceColors = ordered.filter((color) => {
        const ratio = getContrastRatio(base, color);
        return ratio !== undefined && ratio < 2.2;
      });
      variants.push([
        similarSurfaceColors[0] ?? base,
        similarSurfaceColors[1] ?? base,
        similarSurfaceColors[2] ?? base,
        base,
      ]);
    }
    return variants;
  }

  for (let firstIndex = 0; firstIndex < ordered.length; firstIndex += 1) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < ordered.length;
      secondIndex += 1
    ) {
      const first = ordered[firstIndex];
      const second = ordered[secondIndex];
      variants.push([first, second]);
    }
  }
  return variants;
};

const chooseBest = <T>(
  current: ColorCompositionColors,
  candidates: readonly T[],
  update: (
    colors: ColorCompositionColors,
    candidate: T
  ) => ColorCompositionColors,
  input: ColorCompositionInput,
  profile: ThemeProfile
): { colors: ColorCompositionColors; validation: ColorValidationResult } => {
  let bestColors = current;
  let bestValidation = validateColorComposition(current, input);

  for (const candidate of candidates) {
    const next = withDerivedFace(update(current, candidate), profile);
    const validation = validateColorComposition(next, input);
    const criticalIssues = validation.issues.filter(
      (issue) => issue.importance === "critical"
    ).length;
    const bestCriticalIssues = bestValidation.issues.filter(
      (issue) => issue.importance === "critical"
    ).length;
    if (
      criticalIssues < bestCriticalIssues ||
      (criticalIssues === bestCriticalIssues &&
        validation.score > bestValidation.score)
    ) {
      bestColors = next;
      bestValidation = validation;
    }
    if (validation.passed && validation.score === 100) break;
  }

  return { colors: bestColors, validation: bestValidation };
};

/**
 * Builds and repairs a deterministic whole-avatar color composition. The
 * legacy v1/v2 generators do not call this function.
 */
export const composeAvatarColors = (
  seed: string | number,
  input: ColorCompositionInput = {}
): ColorCompositionResult => {
  const profile = resolveThemeProfile(seed, input);
  const palette = resolvePalette(seed, input, profile);
  const thresholds = resolveThresholds(input.thresholds);
  const backgroundType: BackgroundType =
    input.background === false || input.backgroundType === "transparent"
      ? "transparent"
      : input.backgroundType ?? (input.background ? "solid" : "transparent");
  const validationInput: ColorCompositionInput = {
    ...input,
    themeVariant:
      input.theme === "fruit"
        ? resolveFruitKind(seed, input.themeVariant)
        : input.themeVariant,
    background: backgroundType !== "transparent",
    backgroundType,
    thresholds,
  };
  const pool = candidatePool(palette);
  const primaryCandidates = uniqueColors(
    profile.primarySlots.map((slot) => palette[slot])
  );
  const requestedPrimary = normalizeAvatarColor(input.color);
  const body =
    profile.semanticPrimary ??
    requestedPrimary ??
    deterministicOrder(seed, "body-initial", primaryCandidates)[0];
  const orderedFeatures = deterministicOrder(seed, "features-initial", pool);
  const explicitBackground = input.backgroundColors;
  let colors: ColorCompositionColors = withDerivedFace(
    {
      background: initialBackground(
        seed,
        backgroundType,
        explicitBackground,
        pool
      ),
      body,
      secondaryBody: palette.secondary,
      face: profile.face === "none" ? palette.background : body,
      eyes: normalizeAvatarColor(input.eyeColor) ?? orderedFeatures[0],
      mouth: normalizeAvatarColor(input.mouthColor) ?? orderedFeatures[1],
      eyebrows: normalizeAvatarColor(input.eyebrowsColor) ?? orderedFeatures[2],
      details: normalizeAvatarColor(input.detailsColor) ?? orderedFeatures[3],
      accessory:
        normalizeAvatarColor(input.accessoryColor) ?? orderedFeatures[4],
      accent: palette.accent,
    },
    profile
  );
  let validation = validateColorComposition(colors, validationInput);
  if (validation.passed) {
    return {
      palette: palette.name,
      backgroundType,
      colors,
      validation,
      repaired: false,
      repairs: [],
    };
  }

  const repairs: ColorRole[] = [];
  const applyRepair = <T>(
    role: ColorRole,
    candidates: readonly T[],
    update: (
      value: ColorCompositionColors,
      candidate: T
    ) => ColorCompositionColors
  ): void => {
    if (validation.passed) return;
    const best = chooseBest(
      colors,
      candidates,
      update,
      validationInput,
      profile
    );
    if (best.validation.score > validation.score || best.validation.passed) {
      colors = best.colors;
      validation = best.validation;
      if (!repairs.includes(role)) repairs.push(role);
    }
  };

  applyRepair(
    "background",
    backgroundCandidates(seed, backgroundType, palette, pool),
    (value, background) => ({ ...value, background })
  );
  applyRepair(
    "secondaryBody",
    deterministicOrder(seed, "secondary", pool),
    (value, color) => ({
      ...value,
      secondaryBody: color,
    })
  );
  applyRepair(
    "accessory",
    deterministicOrder(seed, "accessory", pool),
    (value, color) => ({
      ...value,
      accessory: color,
    })
  );
  applyRepair(
    "details",
    deterministicOrder(seed, "details", pool),
    (value, color) => ({
      ...value,
      details: color,
    })
  );
  applyRepair(
    "eyebrows",
    deterministicOrder(seed, "eyebrows", pool),
    (value, color) => ({
      ...value,
      eyebrows: color,
    })
  );
  applyRepair(
    "eyes",
    deterministicOrder(seed, "eyes", pool),
    (value, color) => ({
      ...value,
      eyes: color,
    })
  );
  applyRepair(
    "mouth",
    deterministicOrder(seed, "mouth", pool),
    (value, color) => ({
      ...value,
      mouth: color,
    })
  );

  if (!profile.semanticPrimary) {
    applyRepair(
      "body",
      deterministicOrder(seed, "body", primaryCandidates),
      (value, color) => ({
        ...value,
        body: color,
      })
    );
  }

  if (!validation.passed) {
    const bodies = profile.semanticPrimary
      ? [profile.semanticPrimary]
      : deterministicOrder(seed, "body-background-joint", primaryCandidates);
    const backgrounds = backgroundCandidates(
      seed,
      backgroundType,
      palette,
      pool
    );
    const pairs = bodies.flatMap((candidateBody) =>
      backgrounds.map((background) => ({ candidateBody, background }))
    );
    const best = chooseBest(
      colors,
      pairs,
      (value, pair) => ({
        ...value,
        body: pair.candidateBody,
        background: pair.background,
      }),
      validationInput,
      profile
    );
    if (best.validation.score > validation.score || best.validation.passed) {
      colors = best.colors;
      validation = best.validation;
      if (!profile.semanticPrimary && !repairs.includes("body")) {
        repairs.push("body");
      }
      if (!repairs.includes("background")) repairs.push("background");
    }
  }

  if (!validation.passed && validationInput.hasMouth !== false) {
    const featurePairs = pool.flatMap((eyes) =>
      pool
        .filter(
          (mouth) =>
            !isColorCollision(
              eyes,
              mouth,
              validationInput.thresholds?.similarity
            )
        )
        .map((mouth) => ({ eyes, mouth }))
    );
    const best = chooseBest(
      colors,
      deterministicOrder(
        seed,
        "face-features-joint",
        featurePairs.map(({ eyes, mouth }) => `${eyes}:${mouth}`)
      ).map((pair) => {
        const [eyes, mouth] = pair.split(":");
        return { eyes, mouth };
      }),
      (value, pair) => ({ ...value, eyes: pair.eyes, mouth: pair.mouth }),
      validationInput,
      profile
    );
    if (best.validation.score > validation.score || best.validation.passed) {
      colors = best.colors;
      validation = best.validation;
      if (!repairs.includes("eyes")) repairs.push("eyes");
      if (!repairs.includes("mouth")) repairs.push("mouth");
    }
  }

  // A late primary-color repair changes both silhouette and, in some themes,
  // face surface. Re-run the mutable surrounding roles to reach a stable
  // composition without ever changing a semantic primary such as a fruit.
  applyRepair(
    "background",
    backgroundCandidates(seed, backgroundType, palette, pool),
    (value, background) => ({ ...value, background })
  );
  applyRepair(
    "accessory",
    deterministicOrder(seed, "accessory-final", pool),
    (value, color) => ({
      ...value,
      accessory: color,
    })
  );
  applyRepair(
    "eyes",
    deterministicOrder(seed, "eyes-final", pool),
    (value, color) => ({
      ...value,
      eyes: color,
    })
  );
  applyRepair(
    "mouth",
    deterministicOrder(seed, "mouth-final", pool),
    (value, color) => ({
      ...value,
      mouth: color,
    })
  );

  // Resolve rare local minima (for example a medium shell where only light
  // features work while the background also needs to become dark). The
  // search space stays bounded to the small semantic palette and only runs
  // after the inexpensive ordered repairs could not produce a valid result.
  if (!validation.passed) {
    const bodies = profile.semanticPrimary
      ? [profile.semanticPrimary]
      : deterministicOrder(seed, "fallback-body", primaryCandidates);
    const backgrounds = backgroundCandidates(
      seed,
      backgroundType,
      palette,
      pool
    );
    const featurePairs =
      validationInput.hasMouth === false
        ? pool.map((eyes) => ({ eyes, mouth: colors.mouth }))
        : pool.flatMap((eyes) =>
            pool
              .filter(
                (mouth) =>
                  !isColorCollision(
                    eyes,
                    mouth,
                    validationInput.thresholds?.similarity
                  )
              )
              .map((mouth) => ({ eyes, mouth }))
          );
    const candidates = bodies.flatMap((candidateBody) =>
      backgrounds.flatMap((background) =>
        featurePairs.map(({ eyes, mouth }) => ({
          candidateBody,
          background,
          eyes,
          mouth,
        }))
      )
    );
    const best = chooseBest(
      colors,
      candidates,
      (value, candidate) => ({
        ...value,
        body: candidate.candidateBody,
        background: candidate.background,
        eyes: candidate.eyes,
        mouth: candidate.mouth,
      }),
      validationInput,
      profile
    );
    if (best.validation.score > validation.score || best.validation.passed) {
      colors = best.colors;
      validation = best.validation;
      for (const role of ["body", "background", "eyes", "mouth"] as const) {
        if (!repairs.includes(role)) repairs.push(role);
      }
    }
  }

  return {
    palette: palette.name,
    backgroundType,
    colors,
    validation,
    repaired: true,
    repairs,
  };
};
