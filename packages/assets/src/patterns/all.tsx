import type { PatternType } from "@acandrade/ac-bot-avatar-core";
import React from "react";
import { DotsPattern } from "./dots";
import { LinesPattern } from "./lines";
import { NoisePattern } from "./noise";

// As patterns work slightly differently (pattern/filter elements), we provide them this way
export const patternsMap: Record<PatternType, React.ComponentType<any>> = {
  dots: DotsPattern,
  lines: LinesPattern,
  noise: NoisePattern,
  none: () => null,
};
