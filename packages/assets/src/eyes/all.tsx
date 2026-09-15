import type { ComponentType, SVGProps } from "react";
import type { EyeType } from "@acandrade/ac-bot-avatar-core";
import { BlinkEye } from "./blink";
import { ChordsEye } from "./chords";
import { ClosedEye } from "./closed";
import { CryLaughEye } from "./cry_laugh";
import { CryingEye } from "./crying";
import { EyerollEye } from "./eyeroll";
import { GlassesEye } from "./glasses";
import { GlowEye } from "./glow";
import { HeartEye } from "./heart";
import { LaughEye } from "./laugh";
import { LoveEye } from "./love";
import { MischiefEye } from "./mischief";
import { MusicEye } from "./music";
import { NormalEye } from "./normal";
import { SideEye } from "./side";
import { SquintEye } from "./squint";
import { StarEye } from "./star";
import { SunglassesEye } from "./sunglasses";
import { SurprisedEye } from "./surprised";
import { TalkingEye } from "./talking";

export const eyesMap: Record<EyeType, ComponentType<SVGProps<SVGGElement>>> = {
  blink: BlinkEye,
  chords: ChordsEye,
  closed: ClosedEye,
  cry_laugh: CryLaughEye,
  crying: CryingEye,
  eyeroll: EyerollEye,
  glasses: GlassesEye,
  glow: GlowEye,
  heart: HeartEye,
  laugh: LaughEye,
  love: LoveEye,
  mischief: MischiefEye,
  music: MusicEye,
  normal: NormalEye,
  side: SideEye,
  squint: SquintEye,
  star: StarEye,
  sunglasses: SunglassesEye,
  surprised: SurprisedEye,
  talking: TalkingEye,
};
