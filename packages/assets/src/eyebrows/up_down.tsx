import React from "react";

export const UpDownEyebrows = (props: React.SVGProps<SVGGElement>) => (
  <g {...props}>
    {/* Left (Raised) */}
    <path
      d="M 800 500 Q 1100 450 1400 500"
      fill="none"
      stroke="currentColor"
      strokeWidth="220"
      strokeLinecap="round"
      opacity="0.8"
    />
    {/* Right (Lowered) */}
    <path
      d="M 1920 650 Q 2220 700 2520 650"
      fill="none"
      stroke="currentColor"
      strokeWidth="220"
      strokeLinecap="round"
      opacity="0.8"
    />
  </g>
);
