import type { ACBotShapeProps } from "../types";
import { resolveThemeTone, stableThemeIndex, ThemeShapeFrame } from "./shared";

const EMOJI_COLOR = [42, 100, 70] as const;

export const EmojiBotShape = (props: ACBotShapeProps) => {
  const color = resolveThemeTone(props, EMOJI_COLOR);

  const radius = 48 + stableThemeIndex(props.themeSeed, "emoji-radius", 28);

  return (
    <ThemeShapeFrame
      name="emoji"
      shapeProps={props}
      accessoryTransform="translate(-3, 18) scale(1.06)"
      accessoryFallbackColor="#111827"
    >
      <rect
        data-ac-bot-visor=""
        x="18"
        y="18"
        width="264"
        height="264"
        rx={radius}
        fill={color}
      />
      <path
        d="M45 75 Q 45 45 75 45"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeWidth="8"
        opacity=".3"
      />
    </ThemeShapeFrame>
  );
};
