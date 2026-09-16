import type {
  AccessoryType,
  DetailsType,
  EyeType,
  EyebrowsType,
  GenerateAvatarOptions,
  GeneratedAvatarConfig,
  MouthType,
  PaletteName,
  PatternType,
} from "@acandrade/ac-bot-avatar-core";
import { composeAvatarColors } from "./colorComposition";
import { createPRNG, pickItem, stringToHash } from "./hash";

const V1_EYES: readonly EyeType[] = [
  "normal",
  "blink",
  "chords",
  "closed",
  "cry_laugh",
  "glasses",
  "glow",
  "heart",
  "laugh",
  "love",
  "mischief",
  "music",
  "squint",
  "star",
  "sunglasses",
  "surprised",
  "talking",
];

const V1_MOUTHS: readonly MouthType[] = [
  "smile",
  "big_smile",
  "flat",
  "laugh_open",
  "mischief",
  "open",
  "open_happy",
  "open_tongue",
  "sad",
  "side_smile",
  "soft_smile",
  "surprised",
  "talking",
  "tongue",
  "wave",
  "wave_small",
];

const V2_EYEBROWS: readonly EyebrowsType[] = [
  "normal",
  "angry",
  "sad",
  "worried",
  "raised",
  "none",
];
const V2_DETAILS: readonly DetailsType[] = [
  "blush",
  "freckles",
  "none",
  "none",
];
const V2_ACCESSORIES: readonly AccessoryType[] = [
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
  "none",
  "none",
];
const V2_PATTERNS: readonly PatternType[] = [
  "dots",
  "lines",
  "noise",
  "none",
  "none",
];

const PALETTES: Record<PaletteName, readonly string[]> = {
  neutral: [
    "#61f3f7",
    "#8b4fe8",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
    "#f97316",
    "#ffffff",
    "#94a3b8",
  ],
  warm: ["#ec4899", "#8b4fe8", "#f97316", "#ffffff", "#61f3f7"],
  cool: ["#3b82f6", "#61f3f7", "#10b981", "#94a3b8", "#ffffff"],
};

const normalizeOptions = (
  optionsOrGender?: GenerateAvatarOptions | string
): GenerateAvatarOptions =>
  typeof optionsOrGender === "string"
    ? { gender: optionsOrGender }
    : optionsOrGender ?? {};

const resolvePalette = ({
  gender,
  palette,
}: GenerateAvatarOptions): readonly string[] => {
  if (Array.isArray(palette) && palette.length > 0) return palette;
  if (palette === "warm" || gender === "female") return PALETTES.warm;
  if (palette === "cool" || gender === "male") return PALETTES.cool;
  return PALETTES.neutral;
};

/**
 * Generates an avatar deterministically. Version v1 is the compatibility
 * default; v2 opts into the expanded detail, accessory and pattern catalogs.
 */
export const generateAvatarConfig = (
  identifier: string,
  optionsOrGender?: GenerateAvatarOptions | string
): GeneratedAvatarConfig => {
  const options = normalizeOptions(optionsOrGender);
  const generationVersion = options.generationVersion ?? "v1";
  const legacyGender = options.gender;
  const seed = stringToHash(`${identifier}-${legacyGender || "neutral"}`);
  const prng = createPRNG(seed);
  const colorPool = resolvePalette(options);
  const variant: "robot" | "face" =
    prng() > (legacyGender ? 0.3 : 0.5) ? "robot" : "face";

  const baseConfig: GeneratedAvatarConfig = {
    eye: pickItem(prng, V1_EYES),
    mouth: pickItem(prng, V1_MOUTHS),
    color: "",
    variant,
  };

  if (generationVersion === "v2" || generationVersion === "v3") {
    baseConfig.eyebrows = pickItem(prng, V2_EYEBROWS);
    baseConfig.details = pickItem(prng, V2_DETAILS);
    baseConfig.accessory = pickItem(prng, V2_ACCESSORIES);
    baseConfig.backgroundPattern = pickItem(prng, V2_PATTERNS);
  }

  if (generationVersion === "v3") {
    const requested = options.composition ?? {};
    const eye = requested.eye ?? baseConfig.eye;
    const mouth = requested.mouth ?? baseConfig.mouth;
    const eyebrows = requested.eyebrows ?? baseConfig.eyebrows;
    const details = requested.details ?? baseConfig.details;
    const accessory = requested.accessory ?? baseConfig.accessory;
    const composition = composeAvatarColors(identifier, {
      ...requested,
      palette:
        requested.palette ??
        options.palette ??
        (legacyGender === "female"
          ? "warm"
          : legacyGender === "male"
          ? "cool"
          : undefined),
      variant: requested.variant ?? baseConfig.variant,
      eye,
      mouth,
      eyebrows,
      details,
      accessory,
      hasMouth: requested.hasMouth ?? mouth !== "none",
      hasEyebrows: requested.hasEyebrows ?? eyebrows !== "none",
      hasDetails: requested.hasDetails ?? details !== "none",
      hasAccessory: requested.hasAccessory ?? accessory !== "none",
    });

    baseConfig.color = composition.colors.body;
    baseConfig.eyeColor = composition.colors.eyes;
    baseConfig.mouthColor = composition.colors.mouth;
    baseConfig.eyebrowsColor = composition.colors.eyebrows;
    baseConfig.detailsColor = composition.colors.details;
    baseConfig.accessoryColor = composition.colors.accessory;
    baseConfig.background = composition.backgroundType !== "transparent";
    baseConfig.backgroundType = composition.backgroundType;
    baseConfig.backgroundColors = [...composition.colors.background];
    return baseConfig;
  }

  baseConfig.color = pickItem(prng, colorPool);
  return baseConfig;
};
