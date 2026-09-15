import {
  ACCESSORY_TYPES,
  type BackgroundType,
  type ColorCompositionInput,
} from "@acandrade/ac-bot-avatar-core";
import { describe, expect, it } from "vitest";
import {
  COLOR_PALETTES,
  composeAvatarColors,
  validateColorComposition,
} from "./colorComposition";

const THEMES = [
  "robot",
  "face-minimal",
  "terminal",
  "capsule",
  "fruit",
  "emoji",
  "pixel",
  "arcade",
  "neko",
  "square",
  "initial",
] as const;

const FRUITS = [
  "apple",
  "pear",
  "banana",
  "grape",
  "orange",
  "strawberry",
  "pineapple",
  "watermelon",
  "lemon",
  "mango",
  "cherry",
  "peach",
  "kiwi",
  "coconut",
  "papaya",
  "guava",
  "passionfruit",
  "acai",
] as const;

const FIXED_FRUIT_COLORS: Readonly<Record<(typeof FRUITS)[number], string>> = {
  apple: "#d72438",
  pear: "#aec947",
  banana: "#f7ce18",
  grape: "#744e89",
  orange: "#e1772b",
  strawberry: "#d72438",
  pineapple: "#f7ce18",
  watermelon: "#4daa46",
  lemon: "#f7ce18",
  mango: "#eca523",
  cherry: "#d72334",
  peach: "#e58469",
  kiwi: "#b96d32",
  coconut: "#8a422d",
  papaya: "#e1772b",
  guava: "#aec947",
  passionfruit: "#f7ce18",
  acai: "#744e89",
};

const backgroundTypes: readonly BackgroundType[] = [
  "transparent",
  "solid",
  "gradientLinear",
  "glass",
];

const withoutExternalAccessories = new Set([
  "face-minimal",
  "fruit",
  "capsule",
  "arcade",
]);

const inputFor = (
  theme: (typeof THEMES)[number],
  index: number
): ColorCompositionInput => {
  const backgroundType = backgroundTypes[index % backgroundTypes.length];
  const accessory = ACCESSORY_TYPES[index % ACCESSORY_TYPES.length];
  const hasAccessory =
    !withoutExternalAccessories.has(theme) && accessory !== "none";
  return {
    theme,
    themeVariant:
      theme === "fruit"
        ? FRUITS[index % FRUITS.length]
        : theme === "capsule"
        ? ["default", "antenna", "mohawk", "satellite"][index % 4]
        : undefined,
    variant: theme === "face-minimal" ? "face" : "robot",
    background: backgroundType !== "transparent",
    backgroundType,
    eye: index % 7 === 0 ? "heart" : "normal",
    mouth: index % 9 === 0 ? "big_smile_open_tongue" : "smile",
    eyebrows: index % 3 === 0 ? "normal" : "none",
    details: index % 2 === 0 ? "blush" : "freckles",
    accessory,
    hasMouth: true,
    hasEyebrows: index % 3 === 0 && theme !== "capsule",
    hasDetails: theme !== "capsule",
    hasAccessory,
  };
};

describe("Color Composition Engine", () => {
  it("expõe paletas semânticas completas", () => {
    expect(Object.keys(COLOR_PALETTES)).toEqual([
      "cyan",
      "purple",
      "blue",
      "green",
      "orange",
      "red",
      "yellow",
      "pink",
      "neutral",
    ]);
    for (const palette of Object.values(COLOR_PALETTES)) {
      expect(palette).toMatchObject({
        primary: expect.stringMatching(/^#[0-9a-f]{6}$/),
        secondary: expect.stringMatching(/^#[0-9a-f]{6}$/),
        accent: expect.stringMatching(/^#[0-9a-f]{6}$/),
        dark: expect.stringMatching(/^#[0-9a-f]{6}$/),
        light: expect.stringMatching(/^#[0-9a-f]{6}$/),
        background: expect.stringMatching(/^#[0-9a-f]{6}$/),
        contrastText: expect.stringMatching(/^#[0-9a-f]{6}$/),
      });
    }
  });

  it("é totalmente determinístico", () => {
    const input = inputFor("robot", 3);
    expect(composeAvatarColors("atlas-9823", input)).toEqual(
      composeAvatarColors("atlas-9823", input)
    );
  });

  it("mantém transparência sem inventar uma superfície", () => {
    const result = composeAvatarColors("transparent", {
      theme: "face-minimal",
      background: true,
      backgroundType: "transparent",
    });
    expect(result.backgroundType).toBe("transparent");
    expect(result.colors.background).toEqual([]);
    expect(result.validation.passed).toBe(true);
  });

  it.each(FRUITS)("preserva a cor semântica da fruta %s", (fruit) => {
    const result = composeAvatarColors(`fruit-${fruit}`, {
      theme: "fruit",
      themeVariant: fruit,
      background: true,
      backgroundType: "solid",
      color: "#00ff00",
      hasMouth: true,
    });
    expect(result.colors.body).toBe(FIXED_FRUIT_COLORS[fruit]);
    expect(result.validation.passed).toBe(true);
  });

  it("detecta colisões mesmo quando os hexadecimais não são idênticos", () => {
    const validation = validateColorComposition(
      {
        background: ["#04d5f7"],
        body: "#00d9ff",
        secondaryBody: "#00d9ff",
        face: "#00d9ff",
        eyes: "#ffffff",
        mouth: "#ffffff",
        eyebrows: "#ffffff",
        details: "#ffffff",
        accessory: "#00d9ff",
        accent: "#00d9ff",
      },
      {
        theme: "square",
        background: true,
        backgroundType: "solid",
        hasMouth: true,
        hasAccessory: true,
      }
    );
    expect(validation.passed).toBe(false);
    expect(validation.issues.some((issue) => issue.code === "collision")).toBe(
      true
    );
  });

  it("produz variação possível para seeds diferentes", () => {
    const colors = new Set(
      Array.from({ length: 32 }, (_, index) =>
        JSON.stringify(
          composeAvatarColors(`variation-${index}`, inputFor("robot", index))
            .colors
        )
      )
    );
    expect(colors.size).toBeGreaterThan(4);
  });

  it.each(THEMES)(
    "valida 100 seeds e os quatro modos de fundo em %s",
    (theme) => {
      for (let index = 0; index < 100; index += 1) {
        const result = composeAvatarColors(
          `${theme}-mass-${index}`,
          inputFor(theme, index)
        );
        expect(
          result.validation.passed,
          `${theme}:${index}:${JSON.stringify(result)}`
        ).toBe(true);
        expect(result.validation.score).toBeGreaterThanOrEqual(75);
        expect(
          Object.values(result.colors)
            .flat()
            .every((color) => /^#[0-9a-f]{6}$/.test(color))
        ).toBe(true);
      }
    }
  );
});
