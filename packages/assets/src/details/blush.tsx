import React from "react";

export const BlushDetails = (props: React.SVGProps<SVGGElement>) => (
  <g {...props}>
    {/* Left Blush */}
    <ellipse
      cx="600"
      cy="1500"
      rx="250"
      ry="150"
      fill="#ff8a8a"
      opacity="0.4"
    />
    {/* Right Blush */}
    <ellipse
      cx="2720"
      cy="1500"
      rx="250"
      ry="150"
      fill="#ff8a8a"
      opacity="0.4"
    />
  </g>
);
