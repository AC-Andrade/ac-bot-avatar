import React from "react";

export const HeadphonesAccessory = (props: React.SVGProps<SVGGElement>) => (
  <g {...props} stroke="currentColor">
    {/* Headband */}
    <path
      d="M 50 120 A 100 100 0 0 1 250 120"
      fill="none"
      strokeWidth="16"
      strokeLinecap="round"
    />
    {/* Left Earcup */}
    <rect
      x="35"
      y="100"
      width="25"
      height="50"
      rx="10"
      fill="currentColor"
      strokeWidth="0"
    />
    {/* Right Earcup */}
    <rect
      x="240"
      y="100"
      width="25"
      height="50"
      rx="10"
      fill="currentColor"
      strokeWidth="0"
    />
  </g>
);
