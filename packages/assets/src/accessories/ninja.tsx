import React from "react";

export const NinjaAccessory = (props: React.SVGProps<SVGGElement>) => (
  <g {...props}>
    {/* Headband across forehead */}
    <rect x="30" y="45" width="240" height="35" fill="currentColor" />
    {/* Knot ties on the right */}
    <path d="M 260 55 Q 290 50 300 70 Q 280 80 260 70 Z" fill="currentColor" />
    <path d="M 260 65 Q 280 80 290 100 Q 270 90 255 75 Z" fill="currentColor" />
  </g>
);
