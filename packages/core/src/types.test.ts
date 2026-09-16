import { describe, expect, it } from "vitest";
import {
  ACCESSORY_TYPES,
  AVATAR_VARIANTS,
  DETAILS_TYPES,
  EYEBROWS_TYPES,
  EYE_TYPES,
  GENERATION_VERSIONS,
  MOUTH_TYPES,
  PALETTE_NAMES,
  PATTERN_TYPES,
} from "./types";

describe("catálogos públicos", () => {
  it("não contém valores duplicados", () => {
    const catalogs = [
      EYE_TYPES,
      MOUTH_TYPES,
      EYEBROWS_TYPES,
      DETAILS_TYPES,
      ACCESSORY_TYPES,
      PATTERN_TYPES,
      AVATAR_VARIANTS,
      PALETTE_NAMES,
      GENERATION_VERSIONS,
    ];

    for (const catalog of catalogs) {
      expect(new Set(catalog).size).toBe(catalog.length);
    }
  });

  it("mantém os sentinelas e versões esperados", () => {
    expect(MOUTH_TYPES).toContain("none");
    expect(ACCESSORY_TYPES).toContain("none");
    expect(GENERATION_VERSIONS).toEqual(["v1", "v2", "v3"]);
  });
});
