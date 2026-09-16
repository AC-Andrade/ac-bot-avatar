import {
  accessories,
  details,
  eyebrows,
  eyes,
  mouths,
  patterns,
} from "@acandrade/ac-bot-avatar-assets";
import { ACBotShape } from "./ACBotShape";
import { FaceMinimalShape, RobotShape } from "./themes/ClassicBotShapes";
import { createSafeRobotFaceLayout } from "./themes/shared";
import {
  ArcadeBotShape,
  CAPSULE_BOT_KINDS,
  CapsuleBotShape,
  EmojiBotShape,
  FRUIT_BOT_KINDS,
  FruitBotShape,
  resolveFruitFaceLayout,
  resolveCapsuleFaceLayout,
  INITIAL_FACE_VARIANTS,
  InitialAvatarRenderer,
  NekoBotShape,
  SquareBotShape,
  PixelBotRenderer,
  TerminalBotShape,
} from "./themes";
import type { AvatarTheme, BuiltInAvatarThemeId } from "./types";

export const BUILT_IN_AVATAR_THEME_IDS = Object.freeze([
  "robot",
  "face-minimal",
  "fruit",
  "terminal",
  "emoji",
  "capsule",
  "pixel",
  "arcade",
  "initial",
  "neko",
  "square",
] as const satisfies readonly BuiltInAvatarThemeId[]);

export type { BuiltInAvatarThemeId } from "./types";

const sharedRegistries = {
  eyes,
  mouths,
  eyebrows,
  details,
  accessories,
  patterns,
};

export const classicTheme: AvatarTheme = {
  id: "classic",
  viewBox: "-25 -25 350 350",
  shape: ACBotShape,
  ...sharedRegistries,
};

export const robotTheme: AvatarTheme = {
  id: "robot",
  viewBox: "-25 -25 350 350",
  avatarVariant: "robot",
  faceLayout: createSafeRobotFaceLayout("translate(19.5, 43) scale(0.076)", 20),
  shape: RobotShape,
  ...sharedRegistries,
};

export const faceMinimalTheme: AvatarTheme = {
  id: "face-minimal",
  viewBox: "-25 -25 350 350",
  avatarVariant: "face",
  defaultColor: "#ffffff",
  faceColor: "currentColor",
  shape: FaceMinimalShape,
  supportedOptions: {
    accessories: ["none"],
    patterns: ["dots", "lines", "noise", "none"],
  },
  ...sharedRegistries,
};

export const fruitTheme: AvatarTheme = {
  id: "fruit",
  viewBox: "0 0 260 287.94",
  defaultColor: "#ff5f64",
  faceColor: "#8eeeff",
  variants: FRUIT_BOT_KINDS,
  lockPalette: true,
  resolveFaceLayout: resolveFruitFaceLayout,
  faceFilter: "drop-shadow(0 0 5px currentColor)",
  shape: FruitBotShape,
  ...sharedRegistries,
};

export const terminalTheme: AvatarTheme = {
  id: "terminal",
  viewBox: "-25 -25 350 350",
  defaultColor: "#52f7b6",
  faceColor: "currentColor",
  faceLayout: createSafeRobotFaceLayout("translate(24, 29.5) scale(0.076)", 20),
  shape: TerminalBotShape,
  ...sharedRegistries,
};

export const emojiTheme: AvatarTheme = {
  id: "emoji",
  viewBox: "-25 -25 350 350",
  defaultColor: "#ffd166",
  faceColor: "#11131b",
  faceLayout: createSafeRobotFaceLayout(
    "translate(9, 40) scale(0.085)",
    20,
    390
  ),
  shape: EmojiBotShape,
  ...sharedRegistries,
};

export const capsuleTheme: AvatarTheme = {
  id: "capsule",
  viewBox: "0 0 1308 1308",
  defaultColor: "#756399",
  faceColor: "#ffffff",
  variants: CAPSULE_BOT_KINDS,
  resolveFaceLayout: resolveCapsuleFaceLayout,
  shape: CapsuleBotShape,
  supportedOptions: {
    eyebrows: ["none"],
    details: ["none"],
    accessories: ["none"],
    patterns: ["dots", "lines", "noise", "none"],
  },
  ...sharedRegistries,
};

export const pixelTheme: AvatarTheme = {
  id: "pixel",
  viewBox: "0 0 128 128",
  defaultColor: "#48e597",
  faceColor: "currentColor",
  renderer: PixelBotRenderer,
  shapeRendering: "crispEdges",
  supportedOptions: {
    eyes: ["normal", "love", "closed", "blink", "glasses", "surprised"],
    mouths: ["smile", "sad", "surprised", "big_smile", "flat", "none"],
    eyebrows: ["normal", "none"],
    details: ["blush", "none"],
    accessories: ["antenna", "headphones", "bow", "hat", "none"],
    patterns: ["dots", "lines", "noise", "none"],
  },
  ...sharedRegistries,
};

export const arcadeTheme: AvatarTheme = {
  id: "arcade",
  viewBox: "0 0 270 270",
  defaultColor: "#d72435",
  faceColor: "#faf5e3",
  faceLayout: createSafeRobotFaceLayout(
    "translate(69.3, 54.6) scale(0.0396)",
    -120
  ),
  shape: ArcadeBotShape,
  supportedOptions: {
    accessories: ["none"],
    patterns: ["dots", "lines", "noise", "none"],
  },
  ...sharedRegistries,
};

export const initialTheme: AvatarTheme = {
  id: "initial",
  viewBox: "0 0 128 128",
  defaultColor: "#8ddbd3",
  faceColor: "#111827",
  variants: INITIAL_FACE_VARIANTS,
  renderer: InitialAvatarRenderer,
  supportedOptions: {
    eyes: ["normal", "love", "closed", "blink", "mischief", "surprised"],
    mouths: ["smile", "sad", "surprised", "big_smile", "flat", "none"],
    eyebrows: ["normal", "none"],
    details: ["blush", "freckles", "none"],
    accessories: ["hearts", "stars", "bow", "none"],
    patterns: ["dots", "lines", "noise", "none"],
  },
  ...sharedRegistries,
};

export const nekoTheme: AvatarTheme = {
  id: "neko",
  viewBox: "-25 -25 350 350",
  defaultColor: "#a855f7",
  faceColor: "currentColor",
  faceLayout: createSafeRobotFaceLayout("translate(50, 55) scale(0.06)", 20),
  shape: NekoBotShape,
  ...sharedRegistries,
};

export const squareTheme: AvatarTheme = {
  id: "square",
  viewBox: "-25 -25 350 350",
  defaultColor: "#4facfe",
  faceColor: "#111827",
  faceLayout: createSafeRobotFaceLayout(
    "translate(0, 30) scale(0.09)",
    15,
    350
  ),
  shape: SquareBotShape,
  ...sharedRegistries,
};

const themeRegistry: Record<BuiltInAvatarThemeId, AvatarTheme> = {
  robot: robotTheme,
  "face-minimal": faceMinimalTheme,
  fruit: fruitTheme,
  terminal: terminalTheme,
  emoji: emojiTheme,
  capsule: capsuleTheme,
  pixel: pixelTheme,
  arcade: arcadeTheme,
  initial: initialTheme,
  neko: nekoTheme,
  square: squareTheme,
  classic: classicTheme,
};

// Preserve direct avatarThemes.classic access without showing a third,
// duplicated option in menus that enumerate the public registry.
Object.defineProperty(themeRegistry, "classic", { enumerable: false });

export const avatarThemes: Readonly<Record<BuiltInAvatarThemeId, AvatarTheme>> =
  Object.freeze(themeRegistry);

export const getAvatarTheme = (
  id: string | null | undefined
): AvatarTheme | undefined => avatarThemes[id as BuiltInAvatarThemeId];

export const resolveAvatarTheme = (
  theme: AvatarTheme | BuiltInAvatarThemeId | null | undefined
): AvatarTheme =>
  typeof theme === "string"
    ? getAvatarTheme(theme) ?? classicTheme
    : theme ?? classicTheme;
