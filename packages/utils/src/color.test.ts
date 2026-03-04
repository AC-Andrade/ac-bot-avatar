import { describe, it, expect } from "vitest";
import { hexToHsl } from "./color";

describe("hexToHsl", () => {
  it("converte branco corretamente", () => {
    expect(hexToHsl("#ffffff")).toEqual([0, 0, 100]);
  });

  it("converte preto corretamente", () => {
    expect(hexToHsl("#000000")).toEqual([0, 0, 0]);
  });

  it("converte vermelho corretamente", () => {
    expect(hexToHsl("#ff0000")).toEqual([0, 100, 50]);
  });
});
