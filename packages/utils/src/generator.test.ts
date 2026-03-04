import { describe, it, expect } from "vitest";
import { generateAvatarConfig } from "./generator";

const EYES = [
  "normal",
  "blink",
  "chords",
  "closed",
  "cry_laugh",
  "glasses",
  "glow",
  "heart",
  "laugh",
  "love",
  "mischief",
  "music",
  "squint",
  "star",
  "sunglasses",
  "surprised",
  "talking",
];

const MOUTHS = [
  "smile",
  "big_smile",
  "flat",
  "laugh_open",
  "mischief",
  "open",
  "open_happy",
  "open_tongue",
  "sad",
  "side_smile",
  "soft_smile",
  "surprised",
  "talking",
  "tongue",
  "wave",
  "wave_small",
  "none",
];

describe("generateAvatarConfig", () => {
  it("gera configurações determinísticas por identificador e gênero", () => {
    const first = generateAvatarConfig("user-123", "female");
    const second = generateAvatarConfig("user-123", "female");
    expect(first).toEqual(second);
  });

  it("gera valores válidos para olhos, boca e variante", () => {
    const result = generateAvatarConfig("user-999");
    expect(EYES).toContain(result.eye);
    expect(MOUTHS).toContain(result.mouth);
    expect(["robot", "face"]).toContain(result.variant);
  });
});
