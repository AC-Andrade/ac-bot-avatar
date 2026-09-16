import type { SVGProps } from "react";

export const SideEye = (props: SVGProps<SVGGElement>) => (
  <g {...props}>
    <circle cx="1100" cy="1100" r="180" fill="currentColor" fillOpacity="0.2" />

    <circle cx="1180" cy="1100" r="100" fill="currentColor" />

    <circle cx="2200" cy="1100" r="180" fill="currentColor" fillOpacity="0.2" />

    <circle cx="2280" cy="1100" r="100" fill="currentColor" />
  </g>
);
