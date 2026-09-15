import { describe, it, expect } from "vitest";
import {
  getColorDistance,
  getContrastRatio,
  getRelativeLuminance,
  getWorstGradientContrast,
  hasEnoughContrast,
  hexToHsl,
  isColorCollision,
  isTooSimilar,
  parseColor,
  sampleGradientColors,
} from "./color";

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

  it("aceita hexadecimal curto e rejeita cores CSS não hexadecimais", () => {
    expect(hexToHsl("#0f0")).toEqual([120, 100, 50]);
    expect(hexToHsl("rebeccapurple")).toBeUndefined();
  });
});

describe("perceptual color metrics", () => {
  it("calcula luminância e contraste WCAG", () => {
    expect(getRelativeLuminance("#000000")).toBe(0);
    expect(getRelativeLuminance("#ffffff")).toBe(1);
    expect(getContrastRatio("#000000", "#ffffff")).toBe(21);
    expect(hasEnoughContrast("#111827", "#ffffff", 4.5)).toBe(true);
  });

  it("detecta proximidade perceptual em OKLab", () => {
    const nearDistance = getColorDistance("#00d9ff", "#04d5f7");
    const farDistance = getColorDistance("#00d9ff", "#7c3aed");

    expect(nearDistance).toBeDefined();
    expect(farDistance).toBeDefined();
    expect(nearDistance!).toBeLessThan(farDistance!);
    expect(isTooSimilar("#00d9ff", "#04d5f7")).toBe(true);
    expect(isColorCollision("#fff", "#ffffff")).toBe(true);
  });

  it("avalia todos os trechos de um gradiente", () => {
    const samples = sampleGradientColors(["#000000", "#ffffff"], 4);
    expect(samples).toHaveLength(5);
    expect(samples).toContain("#808080");
    expect(getWorstGradientContrast("#ffffff", ["#000000", "#ffffff"])).toBe(1);
  });

  it("aceita HSL e rejeita formatos que não podem ser medidos", () => {
    expect(parseColor("hsl(120, 100%, 50%)")).toEqual({
      r: 0,
      g: 255,
      b: 0,
    });
    expect(getContrastRatio("currentColor", "#ffffff")).toBeUndefined();
    expect(hasEnoughContrast("invalid", "#ffffff")).toBe(false);
  });
});
