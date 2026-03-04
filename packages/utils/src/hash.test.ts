import { describe, it, expect } from "vitest";
import { createPRNG, pickItem, randomInt, stringToHash } from "./hash";

describe("hash utils", () => {
  it("stringToHash é determinístico", () => {
    expect(stringToHash("abc")).toBe(stringToHash("abc"));
    expect(stringToHash("abc")).not.toBe(stringToHash("abcd"));
  });

  it("createPRNG gera sequência determinística", () => {
    const prngA = createPRNG(123);
    const prngB = createPRNG(123);
    const seqA = [prngA(), prngA(), prngA()];
    const seqB = [prngB(), prngB(), prngB()];
    expect(seqA).toEqual(seqB);
  });

  it("randomInt respeita limites", () => {
    const prngMin = () => 0;
    const prngMax = () => 0.999999;
    expect(randomInt(prngMin, 5, 10)).toBe(5);
    const value = randomInt(prngMax, 5, 10);
    expect(value).toBeGreaterThanOrEqual(5);
    expect(value).toBeLessThan(10);
  });

  it("pickItem retorna itens da lista", () => {
    const prng = () => 0;
    expect(pickItem(prng, ["a", "b", "c"])).toBe("a");
  });
});
