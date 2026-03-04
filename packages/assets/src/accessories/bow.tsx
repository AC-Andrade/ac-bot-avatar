import React from "react";

export const BowAccessory = (props: React.SVGProps<SVGGElement>) => (
  <g {...props} fill="currentColor">
    {/* Left loop */}
    <path d="M 150 40 Q 110 0 90 30 Q 80 60 150 60 Z" />
    {/* Right loop */}
    <path d="M 150 40 Q 190 0 210 30 Q 220 60 150 60 Z" />
    {/* Center knot */}
    <circle cx="150" cy="50" r="12" />
  </g>
);
