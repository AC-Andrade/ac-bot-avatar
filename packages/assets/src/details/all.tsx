import type { ComponentType, SVGProps } from "react";
import type { DetailsType } from "@acandrade/ac-bot-avatar-core";
import { BlushDetails } from "./blush";
import { FrecklesDetails } from "./freckles";

export const detailsMap: Record<
  DetailsType,
  ComponentType<SVGProps<SVGGElement>>
> = {
  blush: BlushDetails,
  freckles: FrecklesDetails,
  none: () => null,
};
