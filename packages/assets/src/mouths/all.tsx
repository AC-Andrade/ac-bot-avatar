import type { MouthType } from "@acandrade/ac-bot-avatar-core";
import React from "react";
import { BigSmileMouth } from "./big_smile";
import { FlatMouth } from "./flat";
import { LaughOpenMouth } from "./laugh_open";
import { MischiefMouth } from "./mischief";
import { OpenMouth } from "./open";
import { OpenHappyMouth } from "./open_happy";
import { OpenTongueMouth } from "./open_tongue";
import { SadMouth } from "./sad";
import { SideSmileMouth } from "./side_smile";
import { SmileMouth } from "./smile";
import { SoftSmileMouth } from "./soft_smile";
import { SurprisedMouth } from "./surprised";
import { TalkingMouth } from "./talking";
import { TongueMouth } from "./tongue";
import { WaveMouth } from "./wave";
import { WaveSmallMouth } from "./wave_small";

export const mouthsMap: Record<
  MouthType,
  React.ComponentType<React.SVGProps<SVGGElement>>
> = {
  big_smile: BigSmileMouth,
  flat: FlatMouth,
  laugh_open: LaughOpenMouth,
  mischief: MischiefMouth,
  open: OpenMouth,
  open_happy: OpenHappyMouth,
  open_tongue: OpenTongueMouth,
  sad: SadMouth,
  side_smile: SideSmileMouth,
  smile: SmileMouth,
  soft_smile: SoftSmileMouth,
  surprised: SurprisedMouth,
  talking: TalkingMouth,
  tongue: TongueMouth,
  wave: WaveMouth,
  wave_small: WaveSmallMouth,
  none: () => null,
};
