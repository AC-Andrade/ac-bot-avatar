import type {
  DetailsType,
  EyeType,
  EyebrowsType,
  Face,
  MouthType,
} from "@acandrade/ac-bot-avatar-core";
import { createElement, type CSSProperties } from "react";
import { classicTheme } from "./theme";
import type { ACBotFaceProps, AvatarPartComponent } from "./types";

const legacyFaceMap: Record<Face, { eye: EyeType; mouth: MouthType }> = {
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

const resolvePart = <T extends string>(
  registry: Partial<Record<T, AvatarPartComponent>>,
  selected: T,
  fallback: T
): AvatarPartComponent | undefined => registry[selected] ?? registry[fallback];

export const ACBotFace = ({
  face,
  eye,
  mouth,
  eyebrows,
  details,
  eyeColor,
  mouthColor,
  eyebrowsColor,
  detailsColor,
  variant = "robot",
  theme = classicTheme,
  themeSeed,
  themeVariant,
}: ACBotFaceProps) => {
  const legacy = face ? legacyFaceMap[face] : undefined;
  const selectedEye: EyeType = eye ?? legacy?.eye ?? "normal";
  const selectedMouth: MouthType = mouth ?? legacy?.mouth ?? "smile";
  const selectedEyebrows: EyebrowsType = eyebrows ?? "none";
  const selectedDetails: DetailsType = details ?? "none";
  const Eye = resolvePart(theme.eyes, selectedEye, "normal");
  const Mouth = resolvePart(theme.mouths, selectedMouth, "smile");
  const Eyebrows = resolvePart(theme.eyebrows, selectedEyebrows, "none");
  const Details = resolvePart(theme.details, selectedDetails, "none");
  const defaultColor =
    theme.faceColor ?? (variant === "robot" ? "#ffffff" : "currentColor");
  const faceLayout =
    theme.resolveFaceLayout?.({ themeSeed, themeVariant }) ?? theme.faceLayout;
  const partStyle = (color: string, setFeatureColor = false): CSSProperties =>
    ({
      color,
      ...(setFeatureColor ? { "--ac-feature-color": color } : {}),
      ...(theme.faceFilter ? { filter: theme.faceFilter } : {}),
    } as CSSProperties);

  return (
    <g
      data-ac-bot-part="face"
      transform={faceLayout?.transform ?? "translate(9, 40) scale(0.085)"}
      style={
        variant === "face"
          ? { filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.15))" }
          : undefined
      }
    >
      <g
        data-ac-bot-face-part="details"
        transform={faceLayout?.detailsTransform ?? "translate(0, -120)"}
      >
        {Details &&
          createElement(Details, {
            style: partStyle(
              detailsColor ?? defaultColor,
              detailsColor !== undefined
            ),
          })}
      </g>
      <g
        data-ac-bot-face-part="eyes"
        transform={faceLayout?.eyesTransform ?? "translate(0, -120)"}
      >
        {Eye &&
          createElement(Eye, {
            style: partStyle(eyeColor ?? defaultColor, eyeColor !== undefined),
          })}
      </g>
      <g
        data-ac-bot-face-part="eyebrows"
        transform={faceLayout?.eyebrowsTransform ?? "translate(0, -120)"}
      >
        {Eyebrows &&
          createElement(Eyebrows, {
            style: partStyle(eyebrowsColor ?? defaultColor),
          })}
      </g>
      <g
        data-ac-bot-face-part="mouth"
        transform={faceLayout?.mouthTransform ?? "translate(0, 160)"}
      >
        {Mouth &&
          createElement(Mouth, {
            style: partStyle(mouthColor ?? defaultColor),
          })}
      </g>
    </g>
  );
};

export default ACBotFace;
