import { accessories as defaultAccessories } from "@acandrade/ac-bot-avatar-assets";
import type { ReactNode } from "react";
import type {
  EyeType,
  Face,
  HslColor,
  MouthType,
} from "@acandrade/ac-bot-avatar-core";
import { ACBotShape } from "../ACBotShape";
import type {
  ACBotShapeProps,
  AvatarFaceLayout,
  AvatarPartComponent,
  AvatarThemeRendererProps,
} from "../types";

export type ThemeColor = readonly [number, number, number];

const clamp = (value: number, minimum = 0, maximum = 100): number =>
  Math.min(maximum, Math.max(minimum, value));

export const resolveThemeTone = (
  props: Pick<ACBotShapeProps, "h" | "s" | "l">,
  fallback: ThemeColor,
  lightnessOffset = 0,
  saturationOffset = 0
): string => {
  const hue = props.h ?? fallback[0];
  const saturation = clamp((props.s ?? fallback[1]) + saturationOffset);
  const lightness = clamp((props.l ?? fallback[2]) + lightnessOffset);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const stableThemeIndex = (
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

export const ROBOT_FACE_VERTICAL_SEPARATION = 350;

/**
 * Keeps eyes and mouth in separate vertical zones while allowing each visor
 * to choose its own optical center and outer transform.
 */
export const createSafeRobotFaceLayout = (
  transform: string,
  centerY: number,
  separation = ROBOT_FACE_VERTICAL_SEPARATION
): AvatarFaceLayout => {
  const halfSeparation = separation / 2;
  const eyesTransform = `translate(0, ${centerY - halfSeparation})`;

  return Object.freeze({
    transform,
    detailsTransform: eyesTransform,
    eyesTransform,
    eyebrowsTransform: eyesTransform,
    mouthTransform: `translate(0, ${centerY + halfSeparation})`,
  });
};

export const themeColorValue = (
  value: string | HslColor | undefined,
  fallback: string
): string =>
  Array.isArray(value)
    ? `hsl(${value[0]}, ${value[1]}%, ${value[2]}%)`
    : value ?? fallback;

const LEGACY_FACE_EXPRESSIONS: Record<
  Face,
  { eye: EyeType; mouth: MouthType }
> = {
  cool: { eye: "sunglasses", mouth: "side_smile" },
  normal: { eye: "normal", mouth: "smile" },
  wink: { eye: "blink", mouth: "smile" },
  love: { eye: "love", mouth: "smile" },
  scheming: { eye: "mischief", mouth: "mischief" },
  grinning: { eye: "laugh", mouth: "big_smile" },
  shiny: { eye: "star", mouth: "smile" },
  crying: { eye: "cry_laugh", mouth: "sad" },
  stars: { eye: "star", mouth: "laugh_open" },
  speaking: { eye: "talking", mouth: "talking" },
  music: { eye: "music", mouth: "smile" },
  shocked: { eye: "surprised", mouth: "surprised" },
  lines: { eye: "squint", mouth: "flat" },
};

export const resolveThemeExpression = (
  props: Pick<AvatarThemeRendererProps, "eye" | "face" | "mouth">
): { eye: EyeType; mouth: MouthType } => {
  const legacy = props.face ? LEGACY_FACE_EXPRESSIONS[props.face] : undefined;
  return {
    eye: props.eye ?? legacy?.eye ?? "normal",
    mouth: props.mouth ?? legacy?.mouth ?? "smile",
  };
};

interface ThemeCanvasProps {
  name: string;
  shapeProps: AvatarThemeRendererProps;
  fallback: string;
  children: ReactNode;
}

export const ThemeCanvas = ({
  name,
  shapeProps,
  fallback,
  children,
}: ThemeCanvasProps) => {
  const {
    background = false,
    backgroundColors,
    backgroundPattern = "none",
    backgroundRotation = 0,
    backgroundType = "solid",
    idPrefix = `ac-bot-${name}`,
    patternRegistry,
  } = shapeProps;
  const hasBackground = background && backgroundType !== "transparent";
  const colors = backgroundColors?.map((color) =>
    themeColorValue(color, fallback)
  );
  const primary = hasBackground ? colors?.[0] ?? fallback : fallback;
  const secondary = colors?.[1] ?? "#18243b";
  const gradientId = `${idPrefix}-${name}-canvas-gradient`;
  const Pattern =
    hasBackground && backgroundPattern !== "none"
      ? patternRegistry?.[backgroundPattern]
      : undefined;

  return (
    <g data-ac-bot-part="theme" data-ac-bot-theme={name}>
      {hasBackground && backgroundType === "gradientLinear" && colors?.[1] ? (
        <>
          <defs>
            <linearGradient
              id={gradientId}
              x1="0"
              y1="0"
              x2="1"
              y2="1"
              gradientTransform={`rotate(${backgroundRotation} .5 .5)`}
            >
              {colors.map((color, index) => (
                <stop
                  key={color + index}
                  offset={`${(index / (colors.length - 1)) * 100}%`}
                  stopColor={color}
                />
              ))}
            </linearGradient>
          </defs>
          <rect width="128" height="128" fill={`url(#${gradientId})`} />
        </>
      ) : hasBackground && backgroundType === "glass" ? (
        <>
          <rect width="128" height="128" fill={colors?.[3] ?? "#080d18"} />
          <circle cx="25" cy="22" r="62" fill={primary} opacity=".62" />
          <circle cx="111" cy="112" r="68" fill={secondary} opacity=".58" />
          <rect width="128" height="128" fill="#ffffff" opacity=".035" />
        </>
      ) : (
        <rect width="128" height="128" fill={primary} />
      )}
      {Pattern ? (
        <g opacity=".7">
          <Pattern idPrefix={`${idPrefix}-${name}-canvas-pattern`} />
        </g>
      ) : null}
      {children}
    </g>
  );
};

interface ThemeShapeFrameProps {
  name: string;
  shapeProps: ACBotShapeProps;
  children: ReactNode;
  accessoryTransform?: string;
  accessoryFallbackColor?: string;
}

export const ThemeShapeFrame = ({
  name,
  shapeProps,
  children,
  accessoryTransform,
  accessoryFallbackColor,
}: ThemeShapeFrameProps) => {
  const {
    accessory = "none",
    accessoryColor,
    accessoryRegistry = defaultAccessories,
  } = shapeProps;
  const Accessory = accessoryRegistry[accessory] as
    | AvatarPartComponent
    | undefined;

  return (
    <g data-ac-bot-part="shape" data-ac-bot-theme-shell={name}>
      <ACBotShape {...shapeProps} variant="face" accessory="none" />
      {children}
      {accessory !== "none" && Accessory ? (
        <g transform={accessoryTransform}>
          <Accessory
            className="ac-bot-accessory"
            style={{
              color: accessoryColor ?? accessoryFallbackColor ?? "currentColor",
            }}
          />
        </g>
      ) : null}
    </g>
  );
};
