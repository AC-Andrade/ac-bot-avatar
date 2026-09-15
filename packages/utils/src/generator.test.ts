import { describe, expect, it } from "vitest";
import { generateAvatarConfig } from "./generator";

describe("generateAvatarConfig", () => {
  it("mantém fixtures públicas da geração v1", () => {
    expect(generateAvatarConfig("user-123", "female")).toEqual({
      eye: "blink",
      mouth: "surprised",
      color: "#ec4899",
      variant: "robot",
    });
    expect(generateAvatarConfig("user-999")).toEqual({
      eye: "music",
      mouth: "wave",
      color: "#ffffff",
      variant: "robot",
    });
    expect(generateAvatarConfig("Ada")).toEqual({
      eye: "laugh",
      mouth: "surprised",
      color: "#ef4444",
      variant: "face",
    });
  });

  it("gera configurações determinísticas para zero e string vazia", () => {
    expect(generateAvatarConfig("0")).toEqual(generateAvatarConfig("0"));
    expect(generateAvatarConfig("")).toEqual(generateAvatarConfig(""));
  });

  it("mantém a assinatura legada de gênero", () => {
    expect(generateAvatarConfig("user-123", "female")).toEqual(
      generateAvatarConfig("user-123", { gender: "female" })
    );
  });

  it("expande detalhes somente quando a geração v2 é solicitada", () => {
    const legacy = generateAvatarConfig("user-123");
    const expanded = generateAvatarConfig("user-123", {
      generationVersion: "v2",
      palette: "warm",
    });

    expect(legacy).not.toHaveProperty("accessory");
    expect(expanded).toMatchObject({
      eye: expect.any(String),
      mouth: expect.any(String),
      eyebrows: expect.any(String),
      details: expect.any(String),
      accessory: expect.any(String),
      backgroundPattern: expect.any(String),
      color: expect.any(String),
      variant: expect.any(String),
    });
  });

  it("aceita paleta personalizada sem alterar as demais escolhas", () => {
    const result = generateAvatarConfig("palette-test", {
      palette: ["#123456"],
    });
    expect(result.color).toBe("#123456");
  });

  it("adiciona a composição completa somente na geração v3", () => {
    const input = {
      generationVersion: "v3" as const,
      composition: {
        theme: "robot",
        background: true,
        backgroundType: "gradientLinear" as const,
      },
    };
    const intelligent = generateAvatarConfig("atlas-9823", input);

    expect(intelligent).toEqual(generateAvatarConfig("atlas-9823", input));
    expect(intelligent).toMatchObject({
      color: expect.stringMatching(/^#[0-9a-f]{6}$/),
      eyeColor: expect.stringMatching(/^#[0-9a-f]{6}$/),
      mouthColor: expect.stringMatching(/^#[0-9a-f]{6}$/),
      accessoryColor: expect.stringMatching(/^#[0-9a-f]{6}$/),
      background: true,
      backgroundType: "gradientLinear",
      backgroundColors: [
        expect.stringMatching(/^#[0-9a-f]{6}$/),
        expect.stringMatching(/^#[0-9a-f]{6}$/),
      ],
    });
    expect(
      generateAvatarConfig("atlas-9823", { generationVersion: "v2" })
    ).not.toHaveProperty("eyeColor");
  });

  it("mantém a cor semântica de Fruit Bots na geração v3", () => {
    const fruit = generateAvatarConfig("semantic-fruit", {
      generationVersion: "v3",
      composition: {
        theme: "fruit",
        themeVariant: "banana",
        color: "#ff00ff",
      },
    });
    expect(fruit.color).toBe("#f7ce18");
  });
});
