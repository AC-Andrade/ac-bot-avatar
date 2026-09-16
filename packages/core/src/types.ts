import {
  ACCESSORY_TYPES,
  AVATAR_VARIANTS,
  BACKGROUND_TYPES,
  DETAILS_TYPES,
  EYEBROWS_TYPES,
  EYE_TYPES,
  GENERATION_VERSIONS,
  MOUTH_TYPES,
  PALETTE_NAMES,
  PATTERN_TYPES,
} from "./generatedCatalogs";

export {
  ACCESSORY_TYPES,
  AVATAR_VARIANTS,
  BACKGROUND_TYPES,
  DETAILS_TYPES,
  EYEBROWS_TYPES,
  EYE_TYPES,
  GENERATION_VERSIONS,
  MOUTH_TYPES,
  PALETTE_NAMES,
  PATTERN_TYPES,
};

export type EyeType = (typeof EYE_TYPES)[number];
export type MouthType = (typeof MOUTH_TYPES)[number];
export type EyebrowsType = (typeof EYEBROWS_TYPES)[number];
export type DetailsType = (typeof DETAILS_TYPES)[number];
export type AccessoryType = (typeof ACCESSORY_TYPES)[number];
export type PatternType = (typeof PATTERN_TYPES)[number];
export type AvatarVariant = (typeof AVATAR_VARIANTS)[number];
export type BackgroundType = (typeof BACKGROUND_TYPES)[number];
export type PaletteName = (typeof PALETTE_NAMES)[number];
export type GenerationVersion = (typeof GENERATION_VERSIONS)[number];
export type HslColor = [number, number, number];
export type AvatarColor = HslColor | string;

export type ColorImportance = "critical" | "secondary" | "decorative";

export type ColorRole =
  | "background"
  | "body"
  | "secondaryBody"
  | "face"
  | "eyes"
  | "mouth"
  | "eyebrows"
  | "details"
  | "accessory"
  | "accent";

export interface SemanticColorPalette {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  dark: string;
  light: string;
  background: string;
  contrastText: string;
}

export interface ColorContrastThresholds {
  critical: number;
  secondary: number;
  decorative: number;
  similarity: number;
}

export interface ColorCompositionInput {
  theme?: string;
  themeVariant?: string;
  variant?: AvatarVariant;
  eye?: EyeType;
  mouth?: MouthType;
  eyebrows?: EyebrowsType;
  details?: DetailsType;
  accessory?: AccessoryType;
  palette?: PaletteName | readonly string[];
  background?: boolean;
  backgroundType?: BackgroundType;
  backgroundColors?: readonly AvatarColor[];
  color?: AvatarColor;
  eyeColor?: string;
  mouthColor?: string;
  eyebrowsColor?: string;
  detailsColor?: string;
  accessoryColor?: string;
  hasMouth?: boolean;
  hasEyebrows?: boolean;
  hasDetails?: boolean;
  hasAccessory?: boolean;
  thresholds?: Partial<ColorContrastThresholds>;
}

export interface ColorCompositionColors {
  background: readonly string[];
  body: string;
  secondaryBody: string;
  face: string;
  eyes: string;
  mouth: string;
  eyebrows: string;
  details: string;
  accessory: string;
  accent: string;
}

export interface ColorValidationIssue {
  code: "collision" | "contrast" | "invalid-color" | "identity";
  roles: readonly ColorRole[];
  importance: ColorImportance;
  actual?: number;
  required?: number;
}

export interface ColorValidationResult {
  passed: boolean;
  score: number;
  issues: readonly ColorValidationIssue[];
}

export interface ColorCompositionResult {
  palette: string;
  backgroundType: BackgroundType;
  colors: ColorCompositionColors;
  validation: ColorValidationResult;
  repaired: boolean;
  repairs: readonly ColorRole[];
}

export type Face =
  | "cool"
  | "normal"
  | "wink"
  | "love"
  | "scheming"
  | "grinning"
  | "shiny"
  | "crying"
  | "stars"
  | "speaking"
  | "music"
  | "shocked"
  | "lines";

export interface AvatarFaceConfig {
  face?: Face;
  eye?: EyeType;
  mouth?: MouthType;
  eyebrows?: EyebrowsType;
  details?: DetailsType;
  eyeColor?: string;
  mouthColor?: string;
  eyebrowsColor?: string;
  detailsColor?: string;
  variant?: AvatarVariant;
}

export interface AvatarAppearanceConfig {
  color?: AvatarColor;
  background?: boolean;
  backgroundType?: BackgroundType;
  backgroundColors?: AvatarColor[];
  backgroundRotation?: number;
  backgroundPattern?: PatternType;
  variant?: AvatarVariant;
  accessory?: AccessoryType;
  accessoryColor?: string;
}

export type AvatarConfig = AvatarFaceConfig & AvatarAppearanceConfig;

export interface GeneratedAvatarConfig
  extends Required<Pick<AvatarConfig, "eye" | "mouth" | "color" | "variant">> {
  eyebrows?: EyebrowsType;
  details?: DetailsType;
  accessory?: AccessoryType;
  backgroundPattern?: PatternType;
  eyeColor?: string;
  mouthColor?: string;
  eyebrowsColor?: string;
  detailsColor?: string;
  accessoryColor?: string;
  background?: boolean;
  backgroundType?: BackgroundType;
  backgroundColors?: AvatarColor[];
}

export interface GenerateAvatarOptions {
  generationVersion?: GenerationVersion;
  palette?: PaletteName | readonly string[];
  /** @deprecated Use palette instead. */
  gender?: string;
  /** Inputs used only by the opt-in v3 color composition engine. */
  composition?: ColorCompositionInput;
}

/**
 * @deprecated React component props now live in @acandrade/ac-bot-avatar-react.
 */
export type ACBotFaceProps = AvatarFaceConfig;

/**
 * @deprecated React component props now live in @acandrade/ac-bot-avatar-react.
 */
export type BaseACBotAvatarProps = AvatarAppearanceConfig & {
  size?: number | "inherit";
  maxSize?: number;
  /** @deprecated Import the React props for the precise CSSProperties type. */
  style?: Record<string, string | number | undefined>;
};

/**
 * @deprecated React component props now live in @acandrade/ac-bot-avatar-react.
 */
export type ACBotAvatarProps = ACBotFaceProps & BaseACBotAvatarProps;

/**
 * @deprecated Import HashedACBotAvatarProps from @acandrade/ac-bot-avatar-react.
 */
export interface HashedACBotAvatarProps extends ACBotAvatarProps {
  identifier?: string | number | null;
  gender?: string;
}

/** @deprecated Use BaseACBotAvatarProps. */
export interface BaseBotIdenticonProps {
  size?: number | "inherit";
  background?: boolean;
}

/** @deprecated Use ACBotAvatarProps. */
export interface BotIdenticonProps
  extends ACBotFaceProps,
    BaseBotIdenticonProps {
  color?: AvatarColor;
}
