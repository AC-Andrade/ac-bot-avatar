import React from "react";

export const FrecklesDetails = (props: React.SVGProps<SVGGElement>) => (
  <g {...props} fill="var(--ac-feature-color, #b08d6a)" opacity="0.6">
    {/* Left Freckles */}
    <circle cx="550" cy="1400" r="40" />
    <circle cx="700" cy="1450" r="35" />
    <circle cx="620" cy="1550" r="45" />
    <circle cx="480" cy="1500" r="30" />

    {/* Right Freckles */}
    <circle cx="2770" cy="1400" r="40" />
    <circle cx="2620" cy="1450" r="35" />
    <circle cx="2700" cy="1550" r="45" />
    <circle cx="2840" cy="1500" r="30" />
  </g>
);
