import type { DetailsType } from "@acandrade/ac-bot-avatar-core";
import React from "react";
import { BlushDetails } from "./blush";
import { FrecklesDetails } from "./freckles";

export const detailsMap: Record<
  DetailsType,
  React.ComponentType<React.SVGProps<SVGGElement>>
> = {
  blush: BlushDetails,
  freckles: FrecklesDetails,
  none: () => null,
};
