import React from "react";

interface HeartProps {
  cx: number;
  cy: number;
  scale?: number;
  rotation?: number;
  opacity?: number;
}

const Heart = ({
  cx,
  cy,
  scale = 1,
  rotation = 0,
  opacity = 1,
}: HeartProps) => (
  <path
    d="M 0 5C 0 5, -10 -5, -10 -10A 5 5 0 0 1 0 -15A 5 5 0 0 1 10 -10C 10 -5, 0 5, 0 5Z"
    transform={`translate(${cx}, ${cy}) scale(${scale}) rotate(${rotation})`}
    fill="currentColor"
    opacity={opacity}
  />
);

export const HeartsAccessory = (props: React.SVGProps<SVGGElement>) => (
  <g {...props}>
    <Heart cx={144} cy={-10} scale={2} rotation={-10} />
    <Heart cx={100} cy={10} scale={1.5} rotation={-25} opacity={0.8} />
    <Heart cx={190} cy={0} scale={1.7} rotation={15} opacity={0.9} />
    <Heart cx={60} cy={40} scale={1} rotation={-40} opacity={0.6} />
    <Heart cx={230} cy={30} scale={1.2} rotation={30} opacity={0.7} />
    <Heart cx={120} cy={-5} scale={0.8} rotation={10} opacity={0.5} />
  </g>
);
