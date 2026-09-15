import React from "react";

interface StarProps {
  cx: number;
  cy: number;
  scale?: number;
  opacity?: number;
}

const Star = ({ cx, cy, scale = 1, opacity = 1 }: StarProps) => (
  <polygon
    points="0,-12 3,-4 11,-4 4,2 7,10 0,5 -7,10 -4,2 -11,-4 -3,-4"
    transform={`translate(${cx}, ${cy}) scale(${scale})`}
    fill="currentColor"
    opacity={opacity}
  />
);

export const StarsAccessory = (props: React.SVGProps<SVGGElement>) => (
  <g {...props}>
    <Star cx={144} cy={-15} scale={1.5} />
    <Star cx={90} cy={5} scale={1} opacity={0.8} />
    <Star cx={205} cy={-5} scale={1.2} opacity={0.9} />
    <Star cx={50} cy={35} scale={0.7} opacity={0.6} />
    <Star cx={240} cy={25} scale={0.8} opacity={0.7} />
  </g>
);
