import type { ComponentType, SVGProps } from "react";
import type {
  AccessoryType,
  AvatarConfig,
  AvatarVariant,
  BackgroundType,
  DetailsType,
  EyeType,
  EyebrowsType,
  Face,
  GenerateAvatarOptions,
  HslColor,
  MouthType,
  PatternType,
} from "@acandrade/ac-bot-avatar-core";
import type { PatternProps } from "@acandrade/ac-bot-avatar-assets";

export type AvatarPartComponent = ComponentType<SVGProps<SVGGElement>>;

export type BuiltInAvatarThemeId =
  | "classic"
  | "robot"
  | "face-minimal"
  | "fruit"
  | "terminal"
  | "emoji"
  | "capsule"
  | "pixel"
  | "arcade"
  | "initial"
  | "neko"
  | "square";

export interface ACBotShapeProps {
  h?: number;
  s?: number;
  l?: number;
  background?: boolean;
  backgroundType?: BackgroundType;
  backgroundColors?: (string | HslColor)[];
  backgroundRotation?: number;
  backgroundPattern?: PatternType;
  /** Stable input available to themes that vary their base silhouette. */
  themeSeed?: string | number;
  /** Explicit base variant. When omitted, themes may derive one from themeSeed. */
  themeVariant?: string;
  variant?: AvatarVariant | "emoji";
  accessory?: AccessoryType;
  accessoryColor?: string;
  idPrefix?: string;
  accessoryRegistry?: Partial<Record<AccessoryType, AvatarPartComponent>>;
  patternRegistry?: Partial<Record<PatternType, ComponentType<PatternProps>>>;
}

export interface AvatarThemeRendererProps extends ACBotShapeProps {
  face?: Face;
  eye?: EyeType;
  mouth?: MouthType;
  eyebrows?: EyebrowsType;
  details?: DetailsType;
  eyeColor?: string;
  mouthColor?: string;
  eyebrowsColor?: string;
  detailsColor?: string;
  /** Optional character rendered by themes that include a monogram. */
  monogram?: string;
}

/**
 * Options that produce a meaningful visual result in a theme renderer.
 *
 * When omitted, consumers can fall back to the keys exposed by the theme
 * registries. Complete renderers should declare narrower lists whenever
 * multiple catalog entries collapse to the same drawing or are ignored.
 */
export interface AvatarThemeSupportedOptions {
  eyes?: readonly EyeType[];
  mouths?: readonly MouthType[];
  eyebrows?: readonly EyebrowsType[];
  details?: readonly DetailsType[];
  accessories?: readonly AccessoryType[];
  patterns?: readonly PatternType[];
}

export interface AvatarFaceLayout {
  transform?: string;
  detailsTransform?: string;
  eyesTransform?: string;
  eyebrowsTransform?: string;
  mouthTransform?: string;
}

export interface AvatarFaceLayoutContext {
  themeSeed?: string | number;
  themeVariant?: string;
}

export interface AvatarTheme {
  id: string;
  viewBox?: string;
  /** Composition fixed by styles that split the legacy classic variants. */
  avatarVariant?: AvatarVariant;
  /** Default shell color used when the avatar has no explicit color. */
  defaultColor?: string;
  /** Default face color. Supports currentColor to follow the shell color. */
  faceColor?: string;
  /** Base variants made available by this theme. */
  variants?: readonly string[];
  /** Catalog options that this theme renders distinctly. */
  supportedOptions?: AvatarThemeSupportedOptions;
  /** Lock theme and secondary colors; only background, eye and mouth colors remain configurable. */
  lockPalette?: boolean;
  /** Optional transforms used to align composable face assets with a custom shell. */
  faceLayout?: AvatarFaceLayout;
  /** Resolves a layout when variants of the same theme have different face geometry. */
  resolveFaceLayout?: (context: AvatarFaceLayoutContext) => AvatarFaceLayout;
  /** CSS filter applied to each recolorable face part after its color is resolved. */
  faceFilter?: string;
  /** Complete composition renderer for themes that do not use the classic face. */
  renderer?: ComponentType<AvatarThemeRendererProps>;
  shape?: ComponentType<ACBotShapeProps>;
  shapeRendering?: SVGProps<SVGSVGElement>["shapeRendering"];
  eyes: Partial<Record<EyeType, AvatarPartComponent>>;
  mouths: Partial<Record<MouthType, AvatarPartComponent>>;
  eyebrows: Partial<Record<EyebrowsType, AvatarPartComponent>>;
  details: Partial<Record<DetailsType, AvatarPartComponent>>;
  accessories: Partial<Record<AccessoryType, AvatarPartComponent>>;
  patterns: Partial<Record<PatternType, ComponentType<PatternProps>>>;
}

export interface ACBotFaceProps {
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
  theme?: AvatarTheme;
  themeSeed?: string | number;
  themeVariant?: string;
}

export interface ACBotAvatarProps
  extends Omit<SVGProps<SVGSVGElement>, "color" | "height" | "seed" | "width">,
    AvatarConfig {
  size?: number | "inherit";
  maxSize?: number;
  title?: string;
  theme?: AvatarTheme | BuiltInAvatarThemeId;
  /** Stable input forwarded to the selected theme shape. */
  themeSeed?: string | number;
  /** Explicit base variant supported by the selected theme. */
  themeVariant?: string;
  /** Explicit character for monogram themes. Defaults to the seed's first character. */
  monogram?: string;
  [dataAttribute: `data-${string}`]: string | number | boolean | undefined;
}

export interface HashedACBotAvatarProps extends ACBotAvatarProps {
  /** Preferred deterministic input. */
  seed?: string | number | null;
  /** @deprecated Use seed instead. */
  identifier?: string | number | null;
  palette?: GenerateAvatarOptions["palette"];
  generationVersion?: GenerateAvatarOptions["generationVersion"];
  /** @deprecated Use palette instead. */
  gender?: string;
}
