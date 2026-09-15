import React from "react";

export const BowAccessory = (props: React.SVGProps<SVGGElement>) => (
  <g {...props} fill="currentColor">
    {/* Left loop */}
    <path d="M 200 30 C 160 5, 160 55, 200 30 Z" />
    {/* Right loop */}
    <path d="M 200 30 C 240 5, 240 55, 200 30 Z" />
    {/* Center knot */}
    <circle cx="200" cy="30" r="10" />
  </g>
);
