import type { ComponentType } from "react";
import type { PatternProps } from "./types";
import type { PatternType } from "@acandrade/ac-bot-avatar-core";
import { DotsPattern } from "./dots";
import { LinesPattern } from "./lines";
import { NoisePattern } from "./noise";

export const patternsMap: Record<PatternType, ComponentType<PatternProps>> = {
  dots: DotsPattern,
  lines: LinesPattern,
  noise: NoisePattern,
  none: () => null,
};
