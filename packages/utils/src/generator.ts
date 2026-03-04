import {
  EyeType,
  MouthType,
  EyebrowsType,
  DetailsType,
  AccessoryType,
  PatternType,
  ACBotAvatarProps,
} from "@acandrade/ac-bot-avatar-core";
import { stringToHash, createPRNG, pickItem } from "./hash";

const EYEBROWS: EyebrowsType[] = [
  "normal",
  "angry",
  "sad",
  "worried",
  "raised",
  "none",
];
const DETAILS: DetailsType[] = ["blush", "freckles", "none", "none"];
const ACCESSORIES: AccessoryType[] = [
  "antenna",
  "headphones",
  "bow",
  "hat",
  "none",
  "none",
  "none",
];
const PATTERNS: PatternType[] = ["dots", "lines", "noise", "none", "none"];

const EYES: EyeType[] = [
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

const MOUTHS: MouthType[] = [
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

const COLORS = [
  "#61f3f7", // Primary Cyan
  "#8b4fe8", // Purple
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#ec4899", // Pink
  "#f97316", // Orange
  "#ffffff", // White
  "#94a3b8", // Slate
];

const FEMALE_COLORS = ["#ec4899", "#8b4fe8", "#f97316", "#ffffff", "#61f3f7"];
const MALE_COLORS = ["#3b82f6", "#61f3f7", "#10b981", "#94a3b8", "#ffffff"];

/**
 * Deterministically generates an avatar configuration based on an identifier and optional gender.
 */
export const generateAvatarConfig = (
  identifier: string,
  gender?: string
): Partial<ACBotAvatarProps> => {
  const seed = stringToHash(`${identifier}-${gender || "neutral"}`);
  const prng = createPRNG(seed);

  // Determine color pool based on gender rules
  let colorPool = COLORS;
  if (gender === "female") {
    colorPool = FEMALE_COLORS;
  } else if (gender === "male") {
    colorPool = MALE_COLORS;
  }

  // Determine variant preference (robots vs faces)
  // Faces might feel slightly more "human/gendered" if that's the intent
  const variant: "robot" | "face" =
    prng() > (gender ? 0.3 : 0.5) ? "robot" : "face";

  return {
    eye: pickItem(prng, EYES),
    mouth: pickItem(prng, MOUTHS),
    eyebrows: pickItem(prng, EYEBROWS),
    details: pickItem(prng, DETAILS),
    accessory: pickItem(prng, ACCESSORIES),
    backgroundPattern: pickItem(prng, PATTERNS),
    color: pickItem(prng, colorPool),
    variant,
  };
};
