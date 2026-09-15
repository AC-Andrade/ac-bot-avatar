import React from "react";

export const CowboyAccessory = (props: React.SVGProps<SVGGElement>) => (
  <g {...props}>
    {/* Brim */}
    <path
      d="M 20 25 Q 144 40 268 25 Q 288 15 288 5 Q 144 20 0 5 Q 0 15 20 25 Z"
      fill="#92400e"
    />
    {/* Top Crown */}
    <path d="M 80 15 L 95 -35 Q 144 -50 193 -35 L 208 15 Z" fill="#b45309" />
    {/* Band */}
    <path d="M 83 5 L 205 5 L 208 15 L 80 15 Z" fill="#1e40af" />
    {/* Star / Sheriff Badge */}
    <polygon
      points="144,-10 146,-16 152,-16 147,-20 149,-26 144,-22 139,-26 141,-20 136,-16 142,-16"
      fill="#fbbf24"
    />
  </g>
);
