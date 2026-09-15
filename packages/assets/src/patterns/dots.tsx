import { createPatternId } from "./stableId";
import type { PatternProps } from "./types";

export const DotsPattern = ({
  idPrefix,
  color = "var(--text-color, #000)",
  opacity = 0.1,
}: PatternProps) => {
  const id = createPatternId("dots", `${color}:${opacity}`, idPrefix);
  return (
    <>
      <defs>
        <pattern
          id={id}
          x="0"
          y="0"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="2" fill={color} opacity={opacity} />
          <circle cx="12" cy="12" r="2" fill={color} opacity={opacity} />
        </pattern>
      </defs>
      <rect x="-50%" y="-50%" width="200%" height="200%" fill={`url(#${id})`} />
    </>
  );
};
