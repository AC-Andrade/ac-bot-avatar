import type { EyeType, MouthType } from "@acandrade/ac-bot-avatar-core";
import type { AvatarThemeRendererProps } from "../types";
import {
  resolveThemeExpression,
  resolveThemeTone,
  ThemeCanvas,
} from "./shared";

type PixelPoint = readonly [number, number];

const PixelCells = ({
  cells,
  color,
  size = 6,
}: {
  cells: readonly PixelPoint[];
  color: string;
  size?: number;
}) => (
  <g fill={color}>
    {cells.map(([x, y]) => (
      <rect key={`${x}-${y}`} x={x} y={y} width={size} height={size} rx="1" />
    ))}
  </g>
);

const standardEye = (x: number): PixelPoint[] => [
  [x, 42],
  [x - 7, 49],
  [x, 49],
  [x + 7, 49],
  [x, 56],
];

const heartEye = (x: number): PixelPoint[] => [
  [x - 6, 44],
  [x + 1, 44],
  [x - 6, 51],
  [x + 1, 51],
  [x - 2.5, 58],
];

const eyeCells = (eye: EyeType): PixelPoint[] => {
  if (eye === "love" || eye === "heart") {
    return [...heartEye(39), ...heartEye(83)];
  }
  if (eye === "closed" || eye === "squint" || eye === "chords") {
    return [
      [34, 51],
      [41, 51],
      [78, 51],
      [85, 51],
    ];
  }
  if (eye === "blink") {
    return [...standardEye(38), [78, 51], [85, 51]];
  }
  if (eye === "glasses" || eye === "sunglasses") {
    return [
      [29, 45],
      [36, 45],
      [43, 45],
      [50, 49],
      [72, 49],
      [79, 45],
      [86, 45],
      [93, 45],
    ];
  }
  if (eye === "surprised" || eye === "talking") {
    return [
      [36, 45],
      [36, 52],
      [84, 45],
      [84, 52],
    ];
  }
  return [...standardEye(38), ...standardEye(82)];
};

const mouthCells = (mouth: MouthType): PixelPoint[] => {
  if (mouth === "none") return [];
  if (mouth === "sad") {
    return [
      [43, 83],
      [50, 76],
      [57, 76],
      [64, 76],
      [71, 76],
      [78, 83],
    ];
  }
  if (mouth === "surprised" || mouth === "open") {
    return [
      [57, 76],
      [64, 76],
      [57, 83],
      [64, 83],
    ];
  }
  if (
    mouth === "big_smile" ||
    mouth === "laugh_open" ||
    mouth === "open_happy" ||
    mouth === "open_tongue"
  ) {
    return [
      [43, 76],
      [50, 76],
      [57, 76],
      [64, 76],
      [71, 76],
      [78, 76],
      [50, 83],
      [57, 83],
      [64, 83],
      [71, 83],
    ];
  }
  if (mouth === "flat" || mouth === "talking") {
    return [
      [50, 80],
      [57, 80],
      [64, 80],
      [71, 80],
    ];
  }
  return [
    [43, 76],
    [50, 83],
    [57, 83],
    [64, 83],
    [71, 83],
    [78, 76],
  ];
};

const PixelAccessory = ({
  accessory,
  color,
}: Pick<AvatarThemeRendererProps, "accessory"> & { color: string }) => {
  if (!accessory || accessory === "none") return null;
  if (accessory === "headphones") {
    return (
      <g fill={color}>
        <rect x="14" y="43" width="5" height="34" />
        <rect x="109" y="43" width="5" height="34" />
        <rect x="21" y="24" width="86" height="5" />
      </g>
    );
  }
  if (accessory === "bow") {
    return (
      <g fill={color}>
        <rect x="86" y="16" width="8" height="8" />
        <rect x="102" y="16" width="8" height="8" />
        <rect x="94" y="20" width="8" height="8" />
      </g>
    );
  }
  if (accessory === "hat") {
    return (
      <g fill={color}>
        <rect x="40" y="13" width="48" height="6" />
        <rect x="49" y="7" width="30" height="7" />
      </g>
    );
  }
  return (
    <g fill={color}>
      <rect x="61" y="9" width="6" height="9" />
      <rect x="57" y="5" width="14" height="5" />
    </g>
  );
};

export const PixelBotRenderer = (props: AvatarThemeRendererProps) => {
  const { eye, mouth } = resolveThemeExpression(props);
  const accent = resolveThemeTone(props, [151, 76, 59]);
  const dimAccent = resolveThemeTone(props, [151, 76, 59], -24, -15);
  const gridId = `${props.idPrefix ?? "ac-bot-pixel"}-matrix`;

  return (
    <ThemeCanvas name="pixel" shapeProps={props} fallback="transparent">
      <defs>
        <pattern id={gridId} width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M8 0H0V8" fill="none" stroke={dimAccent} opacity=".17" />
        </pattern>
      </defs>
      <rect
        x="8"
        y="8"
        width="112"
        height="112"
        rx="10"
        fill="#05090d"
        stroke={dimAccent}
        strokeWidth="2"
      />
      <rect
        x="10"
        y="10"
        width="108"
        height="108"
        rx="8"
        fill={`url(#${gridId})`}
      />
      <path d="M18 31H110" stroke={dimAccent} strokeWidth="2" />
      <rect x="18" y="18" width="22" height="5" rx="1" fill={dimAccent} />
      <rect x="101" y="18" width="9" height="5" rx="1" fill={accent} />
      <g data-pixel-expression={`${eye}-${mouth}`}>
        <PixelCells cells={eyeCells(eye)} color={props.eyeColor ?? accent} />
        <PixelCells
          cells={mouthCells(mouth)}
          color={props.mouthColor ?? accent}
        />
      </g>
      {props.eyebrows && props.eyebrows !== "none" ? (
        <g fill={props.eyebrowsColor ?? dimAccent}>
          <rect x="31" y="36" width="20" height="4" />
          <rect x="77" y="36" width="20" height="4" />
        </g>
      ) : null}
      {props.details === "blush" ? (
        <g fill={props.detailsColor ?? "#ff6b91"} opacity=".8">
          <rect x="26" y="68" width="12" height="4" />
          <rect x="90" y="68" width="12" height="4" />
        </g>
      ) : null}
      <PixelAccessory
        accessory={props.accessory}
        color={props.accessoryColor ?? accent}
      />
      <rect x="18" y="106" width="68" height="4" fill={dimAccent} />
      <rect x="90" y="106" width="20" height="4" fill={accent} />
    </ThemeCanvas>
  );
};
