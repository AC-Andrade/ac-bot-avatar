import React from "react";

export const HatAccessory = (props: React.SVGProps<SVGGElement>) => (
  <g {...props} fill="currentColor">
    {/* Brim */}
    <ellipse cx="144" cy="20" rx="55" ry="12" />
    {/* Top part */}
    <path d="M 105 15 L 115 -25 Q 144 -35 173 -25 L 183 15 Z" />
    {/* Ribbon */}
    <path d="M 103 15 L 185 15 L 180 5 L 108 5 Z" fill="rgba(0,0,0,0.3)" />
  </g>
);
