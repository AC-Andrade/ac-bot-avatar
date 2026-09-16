import type { ComponentType, SVGProps } from "react";
import type { EyebrowsType } from "@acandrade/ac-bot-avatar-core";
import { AngryEyebrows } from "./angry";
import { ConcernedEyebrows } from "./concerned";
import { NeutralEyebrows } from "./neutral";
import { RaisedEyebrows } from "./raised";
import { SadEyebrows } from "./sad";
import { UnibrowEyebrows } from "./unibrow";
import { UpDownEyebrows } from "./up_down";
import { WorriedEyebrows } from "./worried";

export const eyebrowsMap: Record<
  EyebrowsType,
  ComponentType<SVGProps<SVGGElement>>
> = {
  angry: AngryEyebrows,
  concerned: ConcernedEyebrows,
  normal: NeutralEyebrows,
  raised: RaisedEyebrows,
  sad: SadEyebrows,
  unibrow: UnibrowEyebrows,
  up_down: UpDownEyebrows,
  worried: WorriedEyebrows,
  none: () => null,
};
