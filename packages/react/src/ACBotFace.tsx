import React, { useMemo } from "react";
import {
  eyes,
  mouths,
  eyebrows as eyebrowsAssets,
  details as detailsAssets,
} from "@acandrade/ac-bot-avatar-assets";
import type { ACBotFaceProps, Face } from "@acandrade/ac-bot-avatar-core";

const legacyFaceMap = {
  cool: { eye: "sunglasses", mouth: "side_smile" },
  normal: { eye: "normal", mouth: "smile" },
  wink: { eye: "blink", mouth: "smile" },
  love: { eye: "love", mouth: "smile" },
  scheming: { eye: "mischief", mouth: "mischief" },
  grinning: { eye: "laugh", mouth: "big_smile" },
  shiny: { eye: "star", mouth: "smile" },
  crying: { eye: "cry_laugh", mouth: "sad" },
  stars: { eye: "star", mouth: "laugh_open" },
  speaking: { eye: "talking", mouth: "talking" },
  music: { eye: "music", mouth: "smile" },
  shocked: { eye: "surprised", mouth: "surprised" },
  lines: { eye: "squint", mouth: "flat" },
};

const ACBotFace = ({
  face,
  eye,
  mouth,
  eyebrows,
  details,
  eyeColor,
  mouthColor,
  eyebrowsColor,
  detailsColor,
  variant,
}: ACBotFaceProps) => {
  const { finalEye, finalMouth, finalEyebrows, finalDetails } = useMemo(() => {
    const legacy = face
      ? (legacyFaceMap as Record<Face, any>)[face]
      : undefined;
    const selectedEye = eye || legacy?.eye || "normal";
    const selectedMouth = mouth || legacy?.mouth || "smile";

    return {
      finalEye: (eyes as any)[selectedEye] ? selectedEye : "normal",
      finalMouth: selectedMouth,
      finalEyebrows: eyebrows || "none",
      finalDetails: details || "none",
    };
  }, [face, eye, mouth, eyebrows, details]);

  return (
    <g
      id="bot-face"
      transform="translate(9, 40) scale(0.085)"
      style={
        variant === "face"
          ? { filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.15))" }
          : undefined
      }
    >
      <g transform="translate(0, -120)">
        {Boolean((detailsAssets as any)[finalDetails]) &&
          React.createElement((detailsAssets as any)[finalDetails], {
            style: detailsColor ? { color: detailsColor } : undefined,
          })}
      </g>
      <g transform="translate(0, -120)">
        {Boolean((eyes as any)[finalEye]) &&
          React.createElement((eyes as any)[finalEye], {
            style: eyeColor ? { color: eyeColor } : undefined,
          })}
      </g>
      <g transform="translate(0, -120)">
        {Boolean((eyebrowsAssets as any)[finalEyebrows]) &&
          React.createElement((eyebrowsAssets as any)[finalEyebrows], {
            style: eyebrowsColor ? { color: eyebrowsColor } : undefined,
          })}
      </g>
      <g transform="translate(0, 160)">
        {Boolean((mouths as any)[finalMouth]) &&
          React.createElement((mouths as any)[finalMouth], {
            style: mouthColor ? { color: mouthColor } : undefined,
          })}
      </g>
    </g>
  );
};

export default ACBotFace;
