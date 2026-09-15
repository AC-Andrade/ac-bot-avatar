import { createPatternId } from "./stableId";
import type { PatternProps } from "./types";

export const LinesPattern = ({
  idPrefix,
  color = "var(--text-color, #000)",
  opacity = 0.1,
}: PatternProps) => {
  const id = createPatternId("lines", `${color}:${opacity}`, idPrefix);
  return (
    <>
      <defs>
        <pattern
          id={id}
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="10"
            stroke={color}
            strokeWidth="2"
            opacity={opacity}
          />
        </pattern>
      </defs>
      <rect x="-50%" y="-50%" width="200%" height="200%" fill={`url(#${id})`} />
    </>
  );
};
