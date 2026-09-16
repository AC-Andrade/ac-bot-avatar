import React from "react";

interface ConfettiProps {
  cx: number;
  cy: number;
  rotation: number;
  fill?: string;
  type?: "circle" | "rect";
}

const Confetti = ({
  cx,
  cy,
  rotation,
  fill = "currentColor",
  type = "rect",
}: ConfettiProps) => {
  if (type === "circle")
    return <circle cx={cx} cy={cy} r={4} fill={fill} opacity={0.8} />;
  return (
    <rect
      x={-3}
      y={-5}
      width={6}
      height={10}
      fill={fill}
      opacity={0.8}
      transform={`translate(${cx}, ${cy}) rotate(${rotation})`}
    />
  );
};

export const CarnivalAccessory = (props: React.SVGProps<SVGGElement>) => (
  <g {...props}>
    {/* Streamers */}
    <path
      d="M 20 -20 Q 50 10 30 40 T 60 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      opacity={0.6}
    />
    <path
      d="M 260 -10 Q 230 20 250 50 T 220 90"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      opacity={0.6}
    />
    <path
      d="M 144 -30 Q 120 0 150 20 T 130 50"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      opacity={0.5}
    />

    {/* Confetti */}
    <Confetti cx={100} cy={-10} rotation={15} />
    <Confetti cx={180} cy={-5} rotation={45} type="circle" />
    <Confetti cx={60} cy={20} rotation={-30} />
    <Confetti cx={210} cy={30} rotation={75} type="circle" />
    <Confetti cx={120} cy={25} rotation={10} />
    <Confetti cx={240} cy={10} rotation={-15} />
    <Confetti cx={80} cy={45} rotation={60} type="circle" />
    <Confetti cx={160} cy={40} rotation={-45} />
    <Confetti cx={40} cy={5} rotation={20} />
  </g>
);
