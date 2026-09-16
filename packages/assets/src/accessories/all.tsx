import type { ComponentType, SVGProps } from "react";
import type { AccessoryType } from "@acandrade/ac-bot-avatar-core";
import { AntennaAccessory } from "./antenna";
import { BowAccessory } from "./bow";
import { CarnivalAccessory } from "./carnival";
import { CowboyAccessory } from "./cowboy";
import { CrownAccessory } from "./crown";
import { ExplosionsAccessory } from "./explosions";
import { HaloAccessory } from "./halo";
import { HatAccessory } from "./hat";
import { HeadphonesAccessory } from "./headphones";
import { HeartsAccessory } from "./hearts";
import { LightsAccessory } from "./lights";
import { NinjaAccessory } from "./ninja";
import { PirateAccessory } from "./pirate";
import { StarsAccessory } from "./stars";

export const accessoriesMap: Record<
  AccessoryType,
  ComponentType<SVGProps<SVGGElement>>
> = {
  antenna: AntennaAccessory,
  bow: BowAccessory,
  carnival: CarnivalAccessory,
  cowboy: CowboyAccessory,
  crown: CrownAccessory,
  explosions: ExplosionsAccessory,
  halo: HaloAccessory,
  hat: HatAccessory,
  headphones: HeadphonesAccessory,
  hearts: HeartsAccessory,
  lights: LightsAccessory,
  ninja: NinjaAccessory,
  pirate: PirateAccessory,
  stars: StarsAccessory,
  none: () => null,
};
