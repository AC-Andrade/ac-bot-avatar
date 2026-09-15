import React from "react";
import { describe, it, expect } from "vitest";
import { mouthsMap } from "./all";

const mouthKeys = [
  "big_smile",
  "big_smile_open_tongue",
  "disbelief",
  "eating",
  "flat",
  "laugh_open",
  "mischief",
  "open",
  "open_happy",
  "open_tongue",
  "sad",
  "side_smile",
  "smile",
  "soft_smile",
  "surprised",
  "talking",
  "tongue",
  "vomit",
  "wave",
  "wave_small",
  "none",
];

describe("mouthsMap", () => {
  it("expõe todas as bocas esperadas", () => {
    expect(Object.keys(mouthsMap).sort()).toEqual(mouthKeys.sort());
  });

  it("retorna componentes renderizáveis", () => {
    mouthKeys.forEach((key) => {
      const Component = mouthsMap[key as keyof typeof mouthsMap];
      const element = React.createElement(Component);
      expect(React.isValidElement(element)).toBe(true);
    });
  });
});
