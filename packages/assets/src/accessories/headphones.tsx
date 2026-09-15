import React from "react";

export const HeadphonesAccessory = (props: React.SVGProps<SVGGElement>) => (
  <g {...props} fill="currentColor">
    {/* Headband */}
    <path
      d="M 12 110 A 132 110 0 0 1 276 110"
      fill="none"
      stroke="currentColor"
      strokeWidth="12"
      strokeLinecap="round"
    />
    {/* Left Earcup */}
    <rect x="-5" y="80" width="25" height="70" rx="12" />
    {/* Right Earcup */}
    <rect x="268" y="80" width="25" height="70" rx="12" />
  </g>
);
