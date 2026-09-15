import React from "react";

export const ExplosionsAccessory = (props: React.SVGProps<SVGGElement>) => (
  <g {...props} fill="currentColor">
    {/* Central big explosion behind/above head */}
    <path
      d="M144,-40 L160,-15 L190,-30 L175,-5 L210,10 L180,20 L200,45 L170,40 L160,65 L144,45 L128,65 L118,40 L88,45 L108,20 L78,10 L113,-5 L98,-30 L128,-15 Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M230,-10 L240,0 L260,-5 L250,10 L270,20 L250,25 L260,40 L240,35 L230,50 L220,35 L200,40 L210,25 L190,20 L210,10 L200,-5 L220,0 Z"
      transform="scale(0.6) translate(250, -50)"
      opacity={0.8}
    />
    <path
      d="M50,-10 L60,0 L80,-5 L70,10 L90,20 L70,25 L80,40 L60,35 L50,50 L40,35 L20,40 L30,25 L10,20 L30,10 L20,-5 L40,0 Z"
      transform="scale(0.7) translate(-30, -10)"
      opacity={0.7}
    />
  </g>
);
