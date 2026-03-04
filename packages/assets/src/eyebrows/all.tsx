import type { EyebrowsType } from "@acandrade/ac-bot-avatar-core";
import React from "react";
import { NeutralEyebrows } from "./neutral";
import { AngryEyebrows } from "./angry";
import { SadEyebrows } from "./sad";
import { WorriedEyebrows } from "./worried";
import { RaisedEyebrows } from "./raised";

export const eyebrowsMap: Record<
  EyebrowsType,
  React.ComponentType<React.SVGProps<SVGGElement>>
> = {
  normal: NeutralEyebrows,
  angry: AngryEyebrows,
  sad: SadEyebrows,
  worried: WorriedEyebrows,
  raised: RaisedEyebrows,
  none: () => null,
};
