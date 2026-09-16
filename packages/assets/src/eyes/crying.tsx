import type { SVGProps } from "react";

export const CryingEye = (props: SVGProps<SVGGElement>) => (
  <g {...props}>
    <path
      d="M 900 1150 Q 1100 950 1300 1150"
      fill="none"
      stroke="currentColor"
      strokeWidth="140"
      strokeLinecap="round"
    />

    <path
      d="M 2000 1150 Q 2200 950 2400 1150"
      fill="none"
      stroke="currentColor"
      strokeWidth="140"
      strokeLinecap="round"
    />

    <path
      d="M 1100 1200 Q 1250 1400 1100 1600 Q 950 1400 1100 1200"
      fill="#4facfe"
      fillOpacity="0.8"
    />

    <path
      d="M 2200 1200 Q 2350 1400 2200 1600 Q 2050 1400 2200 1200"
      fill="#4facfe"
      fillOpacity="0.8"
    />
  </g>
);
