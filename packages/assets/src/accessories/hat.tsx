import React from "react";

export const HatAccessory = (props: React.SVGProps<SVGGElement>) => (
  <g {...props} fill="currentColor">
    {/* Brim */}
    <ellipse cx="150" cy="65" rx="70" ry="15" />
    {/* Top part */}
    <path d="M 105 55 L 115 15 Q 150 0 185 15 L 195 55 Z" />
    {/* Ribbon */}
    <path d="M 102 55 L 198 55 L 193 45 L 107 45 Z" fill="rgba(0,0,0,0.3)" />
  </g>
);
