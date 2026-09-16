import type { ACBotShapeProps } from "../types";
import { resolveThemeTone, ThemeShapeFrame } from "./shared";

const TERMINAL_COLOR = [156, 91, 65] as const;

export const TerminalBotShape = (props: ACBotShapeProps) => {
  const color = resolveThemeTone(props, TERMINAL_COLOR);
  const shell = resolveThemeTone(props, TERMINAL_COLOR, -31, -12);
  const shade = resolveThemeTone(props, TERMINAL_COLOR, -45, -18);
  const highlight = resolveThemeTone(props, TERMINAL_COLOR, 17, -8);

  return (
    <ThemeShapeFrame
      name="terminal"
      shapeProps={props}
      accessoryTransform="translate(6, 40)"
      accessoryFallbackColor="#ffffff"
    >
      <rect
        x="25"
        y="40"
        width="250"
        height="222"
        rx="30"
        fill={shell}
        stroke={color}
        strokeWidth="6"
      />
      <rect
        data-ac-bot-visor=""
        x="43"
        y="60"
        width="214"
        height="156"
        rx="18"
        fill="#050b12"
        stroke={shade}
        strokeWidth="5"
      />
      <path
        d="M53 86h194M53 112h194M53 138h194M53 164h194M53 190h194"
        stroke={color}
        strokeWidth="1"
        opacity=".09"
      />
      <circle cx="58" cy="238" r="7" fill={color} />
      <circle cx="82" cy="238" r="7" fill={highlight} opacity=".65" />
      <rect x="111" y="232" width="129" height="12" rx="6" fill="#050b12" />
      <path
        d="M96 263h108l18 20H78Z"
        fill={shade}
        stroke={color}
        strokeWidth="4"
      />
    </ThemeShapeFrame>
  );
};
