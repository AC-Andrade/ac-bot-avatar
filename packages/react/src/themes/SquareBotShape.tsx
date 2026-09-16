import type { ACBotShapeProps } from "../types";
import { resolveThemeTone, ThemeShapeFrame } from "./shared";

const SQUARE_COLOR = [198, 70, 75] as const; // Default light blue

export const SquareBotShape = (props: ACBotShapeProps) => {
  const color = resolveThemeTone(props, SQUARE_COLOR);
  const side = resolveThemeTone(props, SQUARE_COLOR, -18, -8);
  const sideHighlight = resolveThemeTone(props, SQUARE_COLOR, 18, -4);

  return (
    <ThemeShapeFrame
      name="square"
      shapeProps={props}
      accessoryTransform="translate(0, 25) scale(1.05)"
      accessoryFallbackColor="#111827"
    >
      {/* Antenna */}
      <rect x="142" y="10" width="16" height="30" rx="4" fill={color} />

      {/* Robot side ears */}
      <g data-ac-bot-square-ear="left">
        <rect x="8" y="112" width="38" height="76" rx="19" fill={side} />
        <rect
          x="19"
          y="128"
          width="10"
          height="44"
          rx="5"
          fill={sideHighlight}
          opacity=".72"
        />
      </g>
      <g data-ac-bot-square-ear="right">
        <rect x="254" y="112" width="38" height="76" rx="19" fill={side} />
        <rect
          x="271"
          y="128"
          width="10"
          height="44"
          rx="5"
          fill={sideHighlight}
          opacity=".72"
        />
      </g>

      {/* Head */}
      <rect
        data-ac-bot-visor=""
        x="35"
        y="35"
        width="230"
        height="230"
        rx="64"
        fill={color}
      />

      {/* Subtle shine/highlight */}
      <path
        d="M 60 80 Q 60 60 80 60"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeWidth="8"
        opacity=".2"
      />
    </ThemeShapeFrame>
  );
};
