import type { SVGProps } from "react";

export const EyerollEye = (props: SVGProps<SVGGElement>) => (
  <g {...props}>
    <path
      d="M 920 1100 A 180 180 0 0 0 1280 1100 Z"
      fill="currentColor"
      fillOpacity="0.2"
    />

    <circle cx="1100" cy="1000" r="100" fill="currentColor" />

    <path
      d="M 2020 1100 A 180 180 0 0 0 2380 1100 Z"
      fill="currentColor"
      fillOpacity="0.2"
    />

    <circle cx="2200" cy="1000" r="100" fill="currentColor" />
  </g>
);
