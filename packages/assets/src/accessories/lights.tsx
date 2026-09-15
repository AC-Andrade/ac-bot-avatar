import React from "react";

export const LightsAccessory = (props: React.SVGProps<SVGGElement>) => (
  <g {...props}>
    {/* Left beam */}
    <polygon
      points="-20,-50 30,-50 120,40 50,60"
      fill="currentColor"
      opacity={0.2}
    />
    {/* Right beam */}
    <polygon
      points="300,-50 250,-50 160,40 230,60"
      fill="currentColor"
      opacity={0.2}
    />
    {/* Center beam */}
    <polygon
      points="120,-60 160,-60 170,20 110,20"
      fill="currentColor"
      opacity={0.15}
    />

    {/* Disco ball on top */}
    <circle cx="144" cy="-20" r="15" fill="currentColor" opacity={0.9} />
    <path
      d="M 144 -35 v 30 M 134 -28 a 10 15 0 0 0 20 0 M 134 -12 a 10 15 0 0 1 20 0"
      fill="none"
      stroke="rgba(255,255,255,0.5)"
      strokeWidth="1"
    />
  </g>
);
