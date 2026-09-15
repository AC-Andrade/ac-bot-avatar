import type { ComponentType, SVGProps } from "react";
import type { MouthType } from "@acandrade/ac-bot-avatar-core";
import { BigSmileOpenTongueMouth } from "./big_smile_open_tongue";
import { BigSmileMouth } from "./big_smile";
import { DisbeliefMouth } from "./disbelief";
import { EatingMouth } from "./eating";
import { FlatMouth } from "./flat";
import { LaughOpenMouth } from "./laugh_open";
import { MischiefMouth } from "./mischief";
import { OpenHappyMouth } from "./open_happy";
import { OpenTongueMouth } from "./open_tongue";
import { OpenMouth } from "./open";
import { SadMouth } from "./sad";
import { SideSmileMouth } from "./side_smile";
import { SmileMouth } from "./smile";
import { SoftSmileMouth } from "./soft_smile";
import { SurprisedMouth } from "./surprised";
import { TalkingMouth } from "./talking";
import { TongueMouth } from "./tongue";
import { VomitMouth } from "./vomit";
import { WaveSmallMouth } from "./wave_small";
import { WaveMouth } from "./wave";

export const mouthsMap: Record<
  MouthType,
  ComponentType<SVGProps<SVGGElement>>
> = {
  big_smile_open_tongue: BigSmileOpenTongueMouth,
  big_smile: BigSmileMouth,
  disbelief: DisbeliefMouth,
  eating: EatingMouth,
  flat: FlatMouth,
  laugh_open: LaughOpenMouth,
  mischief: MischiefMouth,
  open_happy: OpenHappyMouth,
  open_tongue: OpenTongueMouth,
  open: OpenMouth,
  sad: SadMouth,
  side_smile: SideSmileMouth,
  smile: SmileMouth,
  soft_smile: SoftSmileMouth,
  surprised: SurprisedMouth,
  talking: TalkingMouth,
  tongue: TongueMouth,
  vomit: VomitMouth,
  wave_small: WaveSmallMouth,
  wave: WaveMouth,
  none: () => null,
};
