import React from "react";

export const PirateAccessory = (props: React.SVGProps<SVGGElement>) => (
  <g {...props}>
    {/* Hat Base */}
    <path
      d="M 50 20 Q 144 -40 238 20 Q 260 0 260 -10 Q 144 -60 28 -10 Q 28 0 50 20 Z"
      fill="#1f2937"
    />
    <path d="M 70 10 Q 144 -30 218 10 Z" fill="#111827" />

    {/* Skull and Crossbones */}
    <g transform="translate(144, -15) scale(0.6)">
      {/* Crossbones */}
      <path
        d="M -15 -15 L 15 15 M -15 15 L 15 -15"
        stroke="#f3f4f6"
        strokeWidth="4"
      />
      {/* Skull */}
      <circle cx="0" cy="0" r="10" fill="#f3f4f6" />
      <rect x="-6" y="5" width="12" height="8" fill="#f3f4f6" />
      {/* Eyes */}
      <circle cx="-4" cy="0" r="2" fill="#111827" />
      <circle cx="4" cy="0" r="2" fill="#111827" />
    </g>
  </g>
);
