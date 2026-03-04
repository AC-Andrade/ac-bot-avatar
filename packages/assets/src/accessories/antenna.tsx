import React from "react";

export const AntennaAccessory = (props: React.SVGProps<SVGGElement>) => (
  <g {...props}>
    {/* Base */}
    <path d="M 130 50 Q 150 20 170 50 Z" fill="currentColor" />
    {/* Stick */}
    <line
      x1="150"
      y1="50"
      x2="150"
      y2="-20"
      stroke="currentColor"
      strokeWidth="8"
    />
    {/* Ball */}
    <circle cx="150" cy="-30" r="16" fill="currentColor" />
  </g>
);
