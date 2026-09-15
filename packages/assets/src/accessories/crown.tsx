import React from "react";

export const CrownAccessory = (props: React.SVGProps<SVGGElement>) => (
  <g {...props}>
    {/* Crown Base */}
    <path
      d="M 100 20 L 110 -30 L 144 -10 L 178 -30 L 188 20 Z"
      fill="#fbbf24"
    />
    {/* Jewels */}
    <circle cx="110" cy="-30" r="5" fill="#ef4444" />
    <circle cx="144" cy="-10" r="6" fill="#3b82f6" />
    <circle cx="178" cy="-30" r="5" fill="#ef4444" />
    <ellipse cx="144" cy="15" rx="40" ry="5" fill="#f59e0b" />
  </g>
);
