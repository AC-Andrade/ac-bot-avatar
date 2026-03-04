import type { AccessoryType } from "@acandrade/ac-bot-avatar-core";
import React from "react";
import { AntennaAccessory } from "./antenna";
import { HeadphonesAccessory } from "./headphones";
import { BowAccessory } from "./bow";
import { HatAccessory } from "./hat";

export const accessoriesMap: Record<
  AccessoryType,
  React.ComponentType<React.SVGProps<SVGGElement>>
> = {
  antenna: AntennaAccessory,
  headphones: HeadphonesAccessory,
  bow: BowAccessory,
  hat: HatAccessory,
  none: () => null,
};
