import type { ACBotShapeProps } from "../types";
import { resolveThemeTone, ThemeShapeFrame } from "./shared";

const NEKO_COLOR = [279, 75, 62] as const;

export const NekoBotShape = (props: ACBotShapeProps) => {
  const color = resolveThemeTone(props, NEKO_COLOR);
  const shell = resolveThemeTone(props, NEKO_COLOR, -25, -15);
  const shade = resolveThemeTone(props, NEKO_COLOR, -45, -25);
  const neon = resolveThemeTone(props, NEKO_COLOR, 30, -5);

  return (
    <ThemeShapeFrame
      name="neko"
      shapeProps={props}
      accessoryTransform="translate(25, 45) scale(0.83)"
      accessoryFallbackColor="#ffffff"
    >
      {/* Left Ear */}
      <path
        d="M 55 100 L 70 15 L 110 80 Z"
        fill={shell}
        stroke={color}
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* Right Ear */}
      <path
        d="M 245 100 L 230 15 L 190 80 Z"
        fill={shell}
        stroke={color}
        strokeWidth="6"
        strokeLinejoin="round"
      />

      {/* Inner Ear Neon Glow */}
      <path d="M 67 35 L 90 75 L 63 85 Z" fill={neon} opacity="0.8" />
      <path d="M 233 35 L 210 75 L 237 85 Z" fill={neon} opacity="0.8" />

      {/* Main Head */}
      <rect
        x="45"
        y="70"
        width="210"
        height="180"
        rx="50"
        fill={shell}
        stroke={color}
        strokeWidth="6"
      />

      {/* Visor Glass */}
      <rect
        data-ac-bot-visor=""
        x="65"
        y="95"
        width="170"
        height="115"
        rx="25"
        fill="#0a0512"
        stroke={shade}
        strokeWidth="5"
      />

      {/* Visor Reflection */}
      <path
        d="M75 110 A 15 15 0 0 1 90 95 L 210 95 C 220 95, 220 105, 210 115 L 90 120 C 80 120, 75 115, 75 110 Z"
        fill={color}
        opacity="0.08"
      />

      {/* Whiskers (Left) */}
      <path
        d="M 15 130 L 45 140 M 10 155 L 45 155 M 15 180 L 45 170"
        stroke={neon}
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Whiskers (Right) */}
      <path
        d="M 285 130 L 255 140 M 290 155 L 255 155 M 285 180 L 255 170"
        stroke={neon}
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Chin details */}
      <rect x="135" y="225" width="30" height="8" rx="4" fill={shade} />
    </ThemeShapeFrame>
  );
};
