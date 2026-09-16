import React from "react";

export const AntennaAccessory = (props: React.SVGProps<SVGGElement>) => (
  <g {...props} stroke="currentColor">
    {/* Base */}
    <path
      d="M 144 15 L 134 30 L 154 30 Z"
      fill="currentColor"
      strokeWidth="0"
    />
    {/* Rod */}
    <line x1="144" y1="15" x2="144" y2="-20" strokeWidth="4" />
    {/* Ball */}
    <circle cx="144" cy="-25" r="8" fill="currentColor" strokeWidth="0" />
  </g>
);
