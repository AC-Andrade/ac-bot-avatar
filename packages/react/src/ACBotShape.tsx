import React, { useMemo } from "react";
import {
  accessories as accessoriesMap,
  patterns as patternsMap,
} from "@acandrade/ac-bot-avatar-assets";
import type { AccessoryType, PatternType } from "@acandrade/ac-bot-avatar-core";

interface ACBotShapeProps {
  h?: number;
  s?: number;
  l?: number;
  background?: boolean;
  backgroundType?: "solid" | "gradientLinear" | "glass";
  backgroundColors?: (string | [number, number, number])[];
  backgroundRotation?: number;
  backgroundPattern?: PatternType;
  variant?: "robot" | "face" | "emoji";
  accessory?: AccessoryType;
  accessoryColor?: string;
}

const ACBotShape = ({
  h,
  s,
  l,
  background = false,
  backgroundType = "solid",
  backgroundColors,
  backgroundRotation = 0,
  backgroundPattern = "none",
  variant = "robot",
  accessory = "none",
  accessoryColor,
}: ACBotShapeProps) => {
  const innerShadowId = useMemo(
    () => `inner-shadow-${Math.random().toString(36).substr(2, 9)}`,
    []
  );
  const isCustom = h !== undefined && s !== undefined && l !== undefined;

  const getFill = (color?: string | [number, number, number]) => {
    if (!color) {
      if (!isCustom) return "#f3f8fb"; // Original base
      return `hsl(${h}, ${s}%, ${l}%)`;
    }
    if (Array.isArray(color))
      return `hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`;
    return color;
  };

  const renderBackground = () => {
    if (!background) return null;

    // Default: solid
    let bgElement = (
      <rect
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
        fill={getFill(backgroundColors?.[0])}
      />
    );

    if (
      backgroundType === "gradientLinear" &&
      backgroundColors &&
      backgroundColors.length >= 2
    ) {
      const gradientId = `grad-${Math.random().toString(36).substr(2, 9)}`;
      bgElement = (
        <>
          <defs>
            <linearGradient
              id={gradientId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
              gradientTransform={`rotate(${backgroundRotation})`}
            >
              {backgroundColors.map((color, i) => (
                <stop
                  key={i}
                  offset={`${(i / (backgroundColors.length - 1)) * 100}%`}
                  stopColor={getFill(color)}
                />
              ))}
            </linearGradient>
          </defs>
          <rect
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            fill={`url(#${gradientId})`}
          />
        </>
      );
    }

    if (backgroundType === "glass") {
      const filterId = `blur-${Math.random().toString(36).substr(2, 9)}`;
      const colors =
        backgroundColors && backgroundColors.length >= 2
          ? backgroundColors
          : ["#6366f1", "#a855f7"];

      bgElement = (
        <g id="glass-background">
          <defs>
            <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="40"
                result="blur"
              />
            </filter>
          </defs>
          <rect x="-50%" y="-50%" width="200%" height="200%" fill="#0a0a0a" />
          <g filter={`url(#${filterId})`} opacity="0.6">
            <circle cx="50" cy="50" r="150" fill={getFill(colors[0])} />
            <circle cx="250" cy="250" r="120" fill={getFill(colors[1])} />
            {colors[2] && (
              <circle cx="150" cy="300" r="100" fill={getFill(colors[2])} />
            )}
          </g>
          <rect
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            fill="rgba(255,255,255,0.02)"
          />
        </g>
      );
    }

    const PatternComponent =
      backgroundPattern && backgroundPattern !== "none"
        ? patternsMap[backgroundPattern]
        : null;

    return (
      <>
        {bgElement}
        {PatternComponent && React.createElement(PatternComponent as any)}
      </>
    );
  };

  const EmojiFilter = () => (
    <filter
      id={innerShadowId}
      x="0"
      y="0"
      width="128"
      height="128"
      filterUnits="userSpaceOnUse"
      colorInterpolationFilters="sRGB"
    >
      <feFlood floodOpacity="0" result="BackgroundImageFix" />
      <feBlend
        mode="normal"
        in="SourceGraphic"
        in2="BackgroundImageFix"
        result="shape"
      />
      <feColorMatrix
        in="SourceAlpha"
        type="matrix"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        result="hardAlpha"
      />
      <feColorMatrix
        type="matrix"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"
      />
      <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
    </filter>
  );

  return (
    <g id="robotShape">
      <defs>
        <EmojiFilter />
      </defs>
      {renderBackground()}
      {variant === "robot" && (
        <g transform="translate(-5, 34) scale(0.0929)">
          <g>
            <path
              d="M3041.667,869.251c0,0 -52.695,-502.721 -81.862,-620.777c-10.22,-41.367 -25.657,-88.833 -93.138,-87.557c-24.866,0.47 -57.108,13.916 -72.362,53.277c-36.224,93.472 -40.138,284.223 -40.138,284.223l-8.333,191.667l283.333,233.333l12.5,-54.167Z"
              fill={isCustom ? `hsl(${h}, ${s}%, ${l}%)` : "#b6aef1"}
            />
            <path
              d="M179.167,869.251c0,0 52.695,-502.721 81.862,-620.777c10.22,-41.367 25.657,-88.833 93.138,-87.557c24.866,0.47 57.108,13.916 72.362,53.277c36.224,93.472 40.138,284.223 40.138,284.223l8.333,191.667l-283.333,233.333l-12.5,-54.167Z"
              fill={isCustom ? `hsl(${h}, ${s}%, ${l}%)` : "#b6aef1"}
            />
            <path
              d="M1603.034,27.584c815.224,0 1456.25,552.274 1456.25,1247.917c0,450.268 -693.98,1068.653 -693.98,1068.653c0,0 -233.517,128.437 -670.604,150.097c-394.099,19.529 -854.571,-131.259 -854.571,-131.259c0,0 -735.013,-615.29 -735.013,-1087.491c0,-695.643 682.692,-1247.917 1497.917,-1247.917Z"
              fill={isCustom ? `hsl(${h}, ${s}%, ${l}%)` : "#f3f8fb"}
            />
            <path
              d="M242.617,856.751c0,0 57.983,-176.277 285.193,-368.957c158.149,-134.114 412.984,-274.545 589.807,-331.043c308.261,-98.494 702.778,-84.028 979.167,-4.167c175.989,50.851 384.287,175.863 532.766,292.406c166.319,130.547 263.256,311.448 304.734,365.927c24.224,31.817 29.167,25 29.167,25c0,0 36.007,16.768 25,-4.167c-247.917,-471.528 -562.5,-618.75 -879.167,-741.667c-316.667,-122.917 -715.905,-104.207 -1020.833,4.167c-103.576,36.812 -298.859,114.052 -455.809,218.905c-342.096,228.544 -460.858,585.262 -460.858,585.262l70.833,-41.667Z"
              fill={
                isCustom
                  ? `hsl(${h}, ${s}%, ${Math.max(0, l - 15)}%)`
                  : "#7ca2ce"
              }
            />
            <path
              d="M1155.117,106.751c0,0 92.682,100.61 116.042,163.114c25.694,68.75 38.125,249.386 38.125,249.386l641.667,16.667c0,0 -2.945,-158.789 17.194,-226.844c19.768,-66.802 103.64,-181.489 103.64,-181.489l2.783,-50.238c0,0 -210.965,-80.93 -461.095,-77.222c-250.264,3.709 -457.308,68.46 -457.308,68.46l-1.046,38.167Z"
              fill={
                isCustom
                  ? `hsl(${h}, ${s}%, ${Math.min(100, l + 20)}%)`
                  : "#dbdfea"
              }
            />
            <path
              d="M2869.298,1710.918c0,0 -92.361,166.667 -250,245.833c-68.815,34.559 -123.351,105.517 -145.833,179.167c-40.278,131.944 -120.833,212.5 -120.833,212.5c0,0 185.891,-26.051 399.584,-253.519c217.987,-232.039 117.083,-383.981 117.083,-383.981Z"
              fill={
                isCustom
                  ? `hsl(${h}, ${s}%, ${Math.max(0, l - 25)}%)`
                  : "#3b61a1"
              }
            />
            <path
              d="M364.336,1742.651c0,0 94.079,165.703 252.527,243.236c69.168,33.846 124.435,104.236 147.677,177.65c41.639,131.521 123.023,211.24 123.023,211.24c0,0 -186.151,-24.129 -402.183,-249.376c-220.374,-229.774 -121.045,-382.75 -121.045,-382.75Z"
              fill={
                isCustom
                  ? `hsl(${h}, ${s}%, ${Math.max(0, l - 25)}%)`
                  : "#3b61a1"
              }
            />
            <path
              d="M366.728,1844.251c30.261,-50.314 51.193,-374.788 53.311,-551.177c2.036,-169.563 2.893,-441.138 -40.602,-507.156c-30.067,-45.637 -205.321,49.994 -207.583,104.167c-0.822,19.68 14.09,246.827 17.341,417.971c4.091,215.386 -18.203,377.395 -21.577,461.196c-0.29,7.211 163.546,134.131 199.11,75Z"
              fill={
                isCustom
                  ? `hsl(${h}, ${Math.max(0, s - 30)}%, ${Math.min(
                      100,
                      l + 10
                    )}%)`
                  : "#b1b7cd"
              }
            />
            <path
              d="M71.784,977.584c32.476,222.835 46.936,446.871 0,675c0,0 -81.426,-122.452 -70.833,-337.5c13.111,-266.171 70.833,-337.5 70.833,-337.5Z"
              fill={
                isCustom
                  ? `hsl(${h}, ${s}%, ${Math.max(0, l - 30)}%)`
                  : "#406198"
              }
            />
            <path
              d="M59.299,1640.084c21.585,-36.895 53.734,-388.889 8.597,-654.167c-7.613,-44.742 107.468,-87.5 107.468,-87.5c18.979,3.504 32.948,699.106 -4.299,829.167c-5.445,19.012 -41.996,-6.618 -57.832,-19.015c-18.628,-14.583 -59.285,-59.341 -53.935,-68.485Z"
              fill={
                isCustom
                  ? `hsl(${h}, ${s}%, ${Math.max(0, l - 40)}%)`
                  : "#27387d"
              }
            />
            <path
              d="M2862.381,1852.584c-30.261,-50.314 -51.193,-374.788 -53.311,-551.177c-2.036,-169.563 -2.893,-441.138 40.602,-507.156c30.067,-45.637 205.321,49.994 207.583,104.167c0.822,19.68 -14.09,246.827 -17.341,417.971c-4.091,215.386 18.203,377.395 21.577,461.196c0.29,7.211 -163.546,134.131 -199.11,75Z"
              fill={
                isCustom
                  ? `hsl(${h}, ${Math.max(0, s - 30)}%, ${Math.min(
                      100,
                      l + 10
                    )}%)`
                  : "#b1b7cd"
              }
            />
            <path
              d="M3157.325,985.918c-32.476,222.835 -46.936,446.871 0,675c0,0 81.426,-122.452 70.833,-337.5c-13.111,-266.171 -70.833,-337.5 -70.833,-337.5Z"
              fill={
                isCustom
                  ? `hsl(${h}, ${s}%, ${Math.max(0, l - 30)}%)`
                  : "#406198"
              }
            />
            <path
              d="M3169.81,1648.418c-21.585,-36.895 -53.734,-388.889 -8.597,-654.167c7.613,-44.742 -107.468,-87.5 -107.468,-87.5c-18.979,3.504 -32.948,699.106 4.299,829.167c5.445,19.012 41.996,-6.618 57.832,-19.015c18.628,-14.583 59.285,-59.341 53.935,-68.485Z"
              fill={
                isCustom
                  ? `hsl(${h}, ${s}%, ${Math.max(0, l - 40)}%)`
                  : "#27387d"
              }
            />
            <path
              d="M1584.284,477.584c336.533,0 730.244,25.536 954.912,181.164c180.633,125.125 240.921,362.084 240.921,554.252c0,176.862 -7.927,460.909 -147.648,591.915c-200.915,188.383 -698.433,235.168 -1056.519,235.168c-295.781,0 -697.364,-90.647 -903.249,-220.659c-216.705,-136.844 -221.692,-322.851 -217.585,-543.925c4.167,-224.275 -8.539,-437.031 201.615,-573.635c248.033,-161.226 630.358,-224.281 927.551,-224.281Z"
              fill={
                isCustom
                  ? `hsl(${h}, ${Math.max(0, s - 20)}%, ${Math.min(
                      100,
                      l + 20
                    )}%)`
                  : "#b3b8ce"
              }
            />
            <path
              d="M1589.26,586.678c306.991,0 666.14,22.255 871.085,157.887c164.776,109.049 219.772,315.561 219.772,483.039c0,154.137 -7.231,401.689 -134.687,515.862c-183.278,164.178 -637.121,204.952 -963.772,204.952c-269.816,0 -636.146,-79 -823.957,-192.307c-197.681,-119.261 -202.231,-281.369 -198.484,-474.038c3.801,-195.459 -7.789,-380.878 183.916,-499.931c226.259,-140.511 575.022,-195.464 846.126,-195.464Z"
              fill="#202135"
            />
          </g>
        </g>
      )}
      {variant === "emoji" && (
        <g transform="translate(15, 15) scale(2.1)">
          <g filter={`url(#${innerShadowId})`}>
            <path
              d="M128 30.2436V97.7124C128.004 101.688 127.224 105.626 125.705 109.301C124.186 112.975 121.958 116.314 119.148 119.127C116.338 121.94 113.001 124.171 109.328 125.694C105.655 127.216 101.718 128 97.7417 128H30.273C22.2478 127.996 14.5522 124.807 8.87623 119.134C3.20021 113.461 0.00778584 105.767 1.42309e-05 97.7417V30.2729C-0.00384206 26.2976 0.776073 22.3605 2.29515 18.6868C3.81422 15.0132 6.04265 11.675 8.85297 8.86333C11.6633 6.05165 15.0003 3.82161 18.6733 2.30075C22.3462 0.779896 26.2829 -0.00192622 30.2583 3.56376e-06H97.7271C101.701 -0.00192302 105.636 0.778823 109.308 2.29766C112.979 3.81651 116.316 6.0437 119.127 8.85208C121.938 11.6605 124.169 14.995 125.691 18.6654C127.214 22.3358 127.998 26.27 128 30.2436Z"
              fill={getFill()}
            />
          </g>
          <g opacity="0.4" style={{ mixBlendMode: "soft-light" }}>
            <path
              d="M64.3033 49.8949L60.8125 68.2435L64.3033 71.0303V49.8949Z"
              fill="black"
            />
          </g>
          <g opacity="0.4" style={{ mixBlendMode: "soft-light" }}>
            <path
              d="M49 95C53.5044 98.866 74.0437 99.1318 79 95H49Z"
              fill="black"
            />
          </g>
        </g>
      )}

      {accessory !== "none" && accessoriesMap[accessory] && (
        <g transform="translate(0, -10) scale(0.65)">
          {React.createElement(accessoriesMap[accessory] as any, {
            style: accessoryColor ? { color: accessoryColor } : undefined,
          })}
        </g>
      )}
    </g>
  );
};

export default ACBotShape;
