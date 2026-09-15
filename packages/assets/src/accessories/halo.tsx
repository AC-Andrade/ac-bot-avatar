import React from "react";

export const HaloAccessory = (props: React.SVGProps<SVGGElement>) => (
  <g {...props}>
    <ellipse
      cx="144"
      cy="-25"
      rx="60"
      ry="15"
      fill="none"
      stroke="#fef08a"
      strokeWidth="8"
      opacity="0.9"
    />
    {/* Glow effect */}
    <ellipse
      cx="144"
      cy="-25"
      rx="60"
      ry="15"
      fill="none"
      stroke="#fef08a"
      strokeWidth="16"
      opacity="0.3"
      filter="blur(2px)"
    />
  </g>
);
