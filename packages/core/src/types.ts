import type { CSSProperties } from "react";

export type EyeType =
  | "mischief"
  | "blink"
  | "chords"
  | "closed"
  | "cry_laugh"
  | "glasses"
  | "glow"
  | "heart"
  | "laugh"
  | "love"
  | "music"
  | "normal"
  | "squint"
  | "star"
  | "sunglasses"
  | "surprised"
  | "talking";

export type MouthType =
  | "big_smile"
  | "flat"
  | "laugh_open"
  | "mischief"
  | "open"
  | "open_happy"
  | "open_tongue"
  | "sad"
  | "side_smile"
  | "smile"
  | "soft_smile"
  | "surprised"
  | "talking"
  | "tongue"
  | "wave"
  | "wave_small"
  | "none";

export type Face =
  | "cool"
  | "normal"
  | "wink"
  | "love"
  | "scheming"
  | "grinning"
  | "shiny"
  | "crying"
  | "stars"
  | "speaking"
  | "music"
  | "shocked"
  | "lines";

export interface ACBotFaceProps {
  face?: Face;
  eye?: EyeType;
  mouth?: MouthType;
  eyeColor?: string;
  mouthColor?: string;
  variant?: "robot" | "face";
}

export interface BaseACBotAvatarProps {
  style?: CSSProperties;
  size?: number | "inherit";
  background?: boolean;
  backgroundType?: "solid" | "gradientLinear" | "glass";
  backgroundColors?: (string | [number, number, number])[];
  backgroundRotation?: number;
  maxSize?: number;
  variant?: "robot" | "face";
}

export interface ACBotAvatarProps extends ACBotFaceProps, BaseACBotAvatarProps {
  color?: [number, number, number] | string;
}

export interface HashedACBotAvatarProps extends ACBotAvatarProps {
  identifier?: string | number;
  gender?: string;
}

export interface BaseBotIdenticonProps {
  style?: CSSProperties;
  size?: number | "inherit";
  background?: boolean;
}

export interface BotIdenticonProps
  extends ACBotFaceProps,
    BaseBotIdenticonProps {
  color?: [number, number, number] | string;
}
