import type { ComponentType, SVGProps } from "react";
import { RobotCapsuleDefault } from "./default";
import { RobotCapsuleAntenna } from "./antenna";
import { RobotCapsuleMohawk } from "./mohawk";
import { RobotCapsuleSatellite } from "./satellite";

export const CAPSULE_ASSET_NAMES = [
  "default",
  "antenna",
  "mohawk",
  "satellite",
] as const;
export type CapsuleAssetName = (typeof CAPSULE_ASSET_NAMES)[number];

export const capsules: Record<
  CapsuleAssetName,
  ComponentType<SVGProps<SVGGElement>>
> = {
  default: RobotCapsuleDefault,
  antenna: RobotCapsuleAntenna,
  mohawk: RobotCapsuleMohawk,
  satellite: RobotCapsuleSatellite,
};
