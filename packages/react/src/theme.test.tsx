import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ACBotAvatar } from "./ACBotAvatar";
import { HashedACBotAvatar } from "./HashedACBotAvatar";
import {
  arcadeTheme,
  avatarThemes,
  BUILT_IN_AVATAR_THEME_IDS,
  capsuleTheme,
  classicTheme,
  emojiTheme,
  faceMinimalTheme,
  fruitTheme,
  getAvatarTheme,
  initialTheme,
  nekoTheme,
  pixelTheme,
  robotTheme,
  squareTheme,
  terminalTheme,
} from "./theme";
import { CAPSULE_BOT_KINDS, FRUIT_BOT_KINDS } from "./themes";
import type { BuiltInAvatarThemeId } from "./types";

describe("built-in avatar themes", () => {
  it.each([
    ["robot", robotTheme],
    ["face-minimal", faceMinimalTheme],
    ["fruit", fruitTheme],
    ["terminal", terminalTheme],
    ["emoji", emojiTheme],
    ["capsule", capsuleTheme],
    ["arcade", arcadeTheme],
    ["neko", nekoTheme],
    ["square", squareTheme],
  ] as const)(
    "renderiza a base %s reutilizando o compositor facial",
    (id, theme) => {
      const markup = renderToStaticMarkup(
        <ACBotAvatar theme={theme} eye="normal" mouth="smile" />
      );

      expect(markup).toContain(`data-ac-bot-theme-shell="${id}"`);
      expect(markup).toContain('data-ac-bot-part="face"');
    }
  );

  it("expÃµe um registro pÃºblico estÃ¡vel de temas", () => {
    expect(Object.keys(avatarThemes)).toEqual([
      "robot",
      "face-minimal",
      "fruit",
      "terminal",
      "emoji",
      "capsule",
      "pixel",
      "arcade",
      "initial",
      "neko",
      "square",
    ]);
    expect(avatarThemes.classic).toBe(classicTheme);
    expect(BUILT_IN_AVATAR_THEME_IDS).toEqual(Object.keys(avatarThemes));
    expect(BUILT_IN_AVATAR_THEME_IDS).not.toContain("classic");
    expect(getAvatarTheme("classic")).toBe(classicTheme);
    expect(getAvatarTheme("robot")).toBe(robotTheme);
    expect(getAvatarTheme("face-minimal")).toBe(faceMinimalTheme);
    expect(getAvatarTheme("fruit")).toBe(fruitTheme);
    expect(getAvatarTheme("unknown")).toBeUndefined();
  });

  it("separa o clÃ¡ssico em Face Minimal e RobÃ´ sem quebrar o alias legado", () => {
    const robot = renderToStaticMarkup(
      <ACBotAvatar theme="robot" variant="face" accessory="none" />
    );
    const faceMinimal = renderToStaticMarkup(
      <ACBotAvatar
        theme="face-minimal"
        variant="robot"
        accessory="hat"
        eyeColor="#67e8f9"
        mouthColor="#f9a8d4"
      />
    );
    const legacyFace = renderToStaticMarkup(
      <ACBotAvatar theme="classic" variant="face" />
    );
    const robotCowboy = renderToStaticMarkup(
      <ACBotAvatar theme="robot" accessory="cowboy" />
    );
    const legacyCowboy = renderToStaticMarkup(
      <ACBotAvatar theme="classic" accessory="cowboy" />
    );

    expect(robot).toContain('data-ac-bot-theme-shell="robot"');
    expect(robot).toContain('data-ac-bot-visor=""');
    expect(robot).toContain("M3041.667,869.251");
    expect(robotCowboy).toContain('transform="translate(0, 36)"');
    expect(legacyCowboy).not.toContain('transform="translate(0, 36)"');
    expect(robot).toContain('transform="translate(0, -155)"');
    expect(robot).toContain('transform="translate(0, 195)"');
    expect(faceMinimal).toContain('data-ac-bot-theme-shell="face-minimal"');
    expect(faceMinimal).not.toContain("M3041.667,869.251");
    expect(faceMinimal).not.toContain("ac-bot-accessory");
    expect(faceMinimal).toContain("color:#67e8f9");
    expect(faceMinimal).toContain("color:#f9a8d4");
    expect(faceMinimal).toContain("drop-shadow(0px 2px 2px");
    expect(legacyFace).not.toContain("M3041.667,869.251");
  });

  it("encaminha a seed determinÃ­stica para variaÃ§Ãµes da base", () => {
    const neko = renderToStaticMarkup(
      <ACBotAvatar theme="neko" eye="surprised" mouth="smile" />
    );
    const square = renderToStaticMarkup(
      <ACBotAvatar theme="square" eye="surprised" mouth="smile" />
    );

    expect(neko).toContain('transform="translate(50, 55) scale(0.06)"');
    expect(square).toContain('transform="translate(0, 30) scale(0.09)"');
    expect(square).toContain('data-ac-bot-square-ear="left"');
    expect(square).toContain('data-ac-bot-square-ear="right"');
  });

  it("mantém Neko e Square com identidade frontal no core", () => {
    const apple = renderToStaticMarkup(
      <HashedACBotAvatar seed="apple" theme={fruitTheme} />
    );
    const grape = renderToStaticMarkup(
      <HashedACBotAvatar seed="berry" theme={fruitTheme} />
    );

    expect(apple).toContain('data-fruit-kind="apple"');
    expect(grape).toContain('data-fruit-kind="grape"');
    expect(apple).not.toContain("themeSeed");
    expect(apple).toBe(
      renderToStaticMarkup(
        <HashedACBotAvatar seed="apple" theme={fruitTheme} />
      )
    );
  });

  it("permite escolher explicitamente o tipo de Fruit Bot", () => {
    const pear = renderToStaticMarkup(
      <HashedACBotAvatar
        seed="a-seed-that-would-vary"
        theme={fruitTheme}
        themeVariant="pear"
      />
    );

    expect(fruitTheme.variants).toEqual(FRUIT_BOT_KINDS);
    expect(fruitTheme.variants).toHaveLength(18);
    expect(pear).toContain('data-fruit-kind="pear"');
    expect(pear).not.toContain("themeVariant");
  });

  it.each(CAPSULE_BOT_KINDS)(
    "renderiza a nova base Capsule %s sem rosto embutido",
    (kind) => {
      const markup = renderToStaticMarkup(
        <ACBotAvatar
          theme="capsule"
          themeVariant={kind}
          eye="glasses"
          mouth="talking"
        />
      );

      expect(capsuleTheme.variants).toEqual(CAPSULE_BOT_KINDS);
      expect(markup).toContain(`data-capsule-kind="${kind}"`);
      expect(markup).toContain('data-capsule-source="canonical-svg"');
      expect(markup).toContain('data-ac-bot-part="face"');
    }
  );

  it("aceita nomes Capsule em português e mantém a escolha determinística", () => {
    const defaultCapsule = renderToStaticMarkup(
      <ACBotAvatar theme="capsule" />
    );
    const satellite = renderToStaticMarkup(
      <ACBotAvatar theme="capsule" themeVariant="parabólica" />
    );
    const seeded = renderToStaticMarkup(
      <HashedACBotAvatar seed="capsule-user" theme="capsule" />
    );

    expect(defaultCapsule).toContain('data-capsule-kind="default"');
    expect(satellite).toContain('data-capsule-kind="satellite"');
    expect(seeded).toBe(
      renderToStaticMarkup(
        <HashedACBotAvatar seed="capsule-user" theme="capsule" />
      )
    );
  });

  it("permite mudar separadamente o corpo e o rosto do Capsule", () => {
    const customized = renderToStaticMarkup(
      <ACBotAvatar
        theme="capsule"
        themeVariant="antenna"
        color="#2563eb"
        eye="love"
        mouth="big_smile"
        eyeColor="#67e8f9"
        mouthColor="#f9a8d4"
      />
    );

    expect(customized).toContain("--ac-capsule-body:hsl(221, 83%, 53%)");
    expect(customized).toContain("--ac-capsule-body-shade:hsl(221, 91%, 35%)");
    expect(customized).toContain(
      "--ac-capsule-body-highlight:hsl(221, 73%, 78%)"
    );
    expect(customized).toContain("color:#67e8f9");
    expect(customized).toContain("color:#f9a8d4");
  });

  it.each([
    ["default", "translate(156, 349) scale(0.29)"],
    ["antenna", "translate(156, 438) scale(0.29)"],
    ["mohawk", "translate(156, 450) scale(0.29)"],
    ["satellite", "translate(156, 479) scale(0.29)"],
  ] as const)("ajusta o rosto ao visor Capsule %s", (kind, transform) => {
    const markup = renderToStaticMarkup(
      <ACBotAvatar theme="capsule" themeVariant={kind} />
    );

    expect(markup).toContain(`transform="${transform}"`);
    expect(markup).toContain('transform="translate(0, -345)"');
    expect(markup).toContain('transform="translate(0, 5)"');
  });

  it.each(FRUIT_BOT_KINDS)("renderiza a fruta canônica %s", (kind) => {
    const markup = renderToStaticMarkup(
      <ACBotAvatar theme="fruit" themeVariant={kind} />
    );

    expect(markup).toContain(`data-fruit-kind="${kind}"`);
    expect(markup).toMatch(/data-fruit-body-color="#[0-9a-f]{6}"/);
  });

  it("mantém a paleta da fruta e permite alterar apenas fundo, olhos e boca", () => {
    const lockedRed = renderToStaticMarkup(
      <ACBotAvatar theme="fruit" themeVariant="apple" color="#ff0000" />
    );
    const lockedBlue = renderToStaticMarkup(
      <ACBotAvatar theme="fruit" themeVariant="apple" color="#0000ff" />
    );
    const customized = renderToStaticMarkup(
      <ACBotAvatar
        theme="fruit"
        themeVariant="apple"
        background
        backgroundColors={["#112233"]}
        eyeColor="#63e6ff"
        mouthColor="#ff8fab"
      />
    );
    const lockedDecorA = renderToStaticMarkup(
      <ACBotAvatar
        theme="fruit"
        themeVariant="apple"
        accessory="hat"
        accessoryColor="#ff0000"
        eyebrows="normal"
        eyebrowsColor="#00ff00"
        details="blush"
        detailsColor="#0000ff"
      />
    );
    const lockedDecorB = renderToStaticMarkup(
      <ACBotAvatar
        theme="fruit"
        themeVariant="apple"
        accessory="hat"
        accessoryColor="#00ffff"
        eyebrows="normal"
        eyebrowsColor="#ff00ff"
        details="blush"
        detailsColor="#ffff00"
      />
    );

    expect(lockedRed).toBe(lockedBlue);
    expect(lockedDecorA).toBe(lockedDecorB);
    expect(lockedRed).toContain('data-fruit-body-color="#d72438"');
    expect(lockedRed).toContain('data-fruit-source="canonical-svg"');
    expect(customized).toContain('fill="#112233"');
    expect(customized).toContain("color:#63e6ff");
    expect(customized).toContain("color:#ff8fab");
  });

  it("aceita nomes de frutas em português", () => {
    const markup = renderToStaticMarkup(
      <ACBotAvatar theme="fruit" themeVariant="maracujá" />
    );

    expect(markup).toContain('data-fruit-kind="passionfruit"');
    expect(markup).toContain('data-fruit-label="Maracujá"');
  });

  it("compõe olhos e boca selecionáveis sobre o visor sem rosto", () => {
    const normal = renderToStaticMarkup(
      <ACBotAvatar
        theme="fruit"
        themeVariant="apple"
        eye="normal"
        mouth="smile"
      />
    );
    const alternate = renderToStaticMarkup(
      <ACBotAvatar
        theme="fruit"
        themeVariant="apple"
        eye="blink"
        mouth="big_smile"
      />
    );

    expect(normal).not.toBe(alternate);
    expect(normal).toContain('data-ac-bot-part="face"');
    expect(normal).toContain('transform="translate(19.9, 106.6) scale(0.066)"');
    expect(normal).toContain('transform="translate(0, -295)"');
    expect(normal).toContain('transform="translate(0, 55)"');
  });

  it.each([
    ["apple", "translate(19.9, 106.6) scale(0.066)"],
    ["pear", "translate(29.4, 117.8) scale(0.0605)"],
    ["banana", "translate(24.5, 98.1) scale(0.064)"],
    ["grape", "translate(25.4, 108.5) scale(0.0639)"],
    ["orange", "translate(22, 106.8) scale(0.0655)"],
    ["strawberry", "translate(26.7, 97.9) scale(0.0622)"],
    ["pineapple", "translate(37, 128.8) scale(0.0555)"],
    ["watermelon", "translate(25.1, 107.9) scale(0.0639)"],
    ["lemon", "translate(26.9, 102.6) scale(0.0627)"],
    ["mango", "translate(26.6, 108) scale(0.0626)"],
    ["cherry", "translate(21.5, 113) scale(0.0625)"],
    ["peach", "translate(22.4, 102.4) scale(0.0649)"],
    ["kiwi", "translate(20.9, 83.6) scale(0.066)"],
    ["coconut", "translate(25, 92) scale(0.064)"],
    ["papaya", "translate(32.3, 98.5) scale(0.0592)"],
    ["guava", "translate(23.2, 90.9) scale(0.0643)"],
    ["passionfruit", "translate(21.2, 95.5) scale(0.0657)"],
    ["acai", "translate(21.8, 95.4) scale(0.0653)"],
  ] as const)("ajusta o rosto ao visor de %s", (kind, transform) => {
    const markup = renderToStaticMarkup(
      <ACBotAvatar
        theme="fruit"
        themeVariant={kind}
        eye="glasses"
        mouth="talking"
      />
    );

    expect(markup).toContain(`transform="${transform}"`);
  });

  it("realça a paleta canônica e o rosto do Fruit Bot", () => {
    const markup = renderToStaticMarkup(
      <ACBotAvatar theme="fruit" themeVariant="guava" />
    );

    expect(markup).toContain("saturate(1.28) brightness(1.08)");
    expect(markup).toContain("color:#8eeeff");
    expect(markup).toContain("drop-shadow(0 0 5px currentColor)");
  });

  it.each([
    ["pixel", pixelTheme],
    ["initial", initialTheme],
  ] as const)("renderiza a composição completa %s", (id, theme) => {
    const markup = renderToStaticMarkup(
      <ACBotAvatar theme={theme} themeSeed="Ada" eye="love" mouth="big_smile" />
    );

    expect(markup).toContain(`data-ac-bot-theme="${id}"`);
    expect(markup).not.toContain('data-ac-bot-part="face"');
  });

  it("aceita o nome de um tema e usa fallback clássico para nomes inválidos", () => {
    const named = renderToStaticMarkup(<ACBotAvatar theme="pixel" />);
    const invalid = renderToStaticMarkup(
      <ACBotAvatar theme={"not-a-theme" as BuiltInAvatarThemeId} />
    );

    expect(named).toContain('data-ac-bot-theme="pixel"');
    expect(invalid).toContain('data-ac-bot-part="face"');
  });

  it("deriva a inicial da seed e respeita monograma explícito", () => {
    const generated = renderToStaticMarkup(
      <HashedACBotAvatar seed="ada" theme="initial" />
    );
    const overridden = renderToStaticMarkup(
      <HashedACBotAvatar seed="ada" theme="initial" monogram="Zelda" />
    );

    expect(generated).toContain('data-monogram="A"');
    expect(overridden).toContain('data-monogram="Z"');
    expect(generated).toBe(
      renderToStaticMarkup(<HashedACBotAvatar seed="ada" theme="initial" />)
    );
  });

  it("serializa folhas espelhadas sem números SVG com sinal duplicado", () => {
    const malformedPaths = FRUIT_BOT_KINDS.flatMap((kind) => {
      const markup = renderToStaticMarkup(
        <ACBotAvatar theme="fruit" themeVariant={kind} />
      );

      return [...markup.matchAll(/<path[^>]* d="([^"]+)"/g)]
        .map((match) => match[1])
        .filter((pathData) => pathData.includes("--"));
    });

    expect(malformedPaths).toEqual([]);
  });

  it("usa a base Arcade sem variações de modelo", () => {
    const arcade = renderToStaticMarkup(
      <ACBotAvatar theme="arcade" themeVariant="dish" />
    );
    const initial = renderToStaticMarkup(
      <ACBotAvatar theme="initial" themeVariant="outline" />
    );

    expect(arcadeTheme.variants).toBeUndefined();
    expect(initialTheme.variants).toEqual(["soft", "poster", "outline"]);
    expect(arcade).toContain('data-arcade-source="canonical-svg"');
    expect(arcade).not.toContain("data-voxel");
    expect(initial).toContain('data-initial-layout="outline"');
  });

  it("permite mudar separadamente o corpo e o rosto do Arcade", () => {
    const red = renderToStaticMarkup(
      <ACBotAvatar theme="arcade" color="#d72435" />
    );
    const customized = renderToStaticMarkup(
      <ACBotAvatar
        theme="arcade"
        color="#2563eb"
        eyeColor="#67e8f9"
        mouthColor="#f9a8d4"
      />
    );

    expect(red).not.toBe(customized);
    expect(customized).toContain("color:hsl(221, 83%, 53%)");
    expect(customized).toContain("fill:currentColor");
    expect(customized).toContain("color:#67e8f9");
    expect(customized).toContain("color:#f9a8d4");
    expect(customized).toContain('transform="translate(0, -295)"');
    expect(customized).toContain('transform="translate(0, 55)"');
  });

  it("declara apenas opções que os renderizadores completos exibem", () => {
    expect(pixelTheme.supportedOptions?.details).toEqual(["blush", "none"]);
    expect(capsuleTheme.supportedOptions?.accessories).toEqual(["none"]);
    expect(arcadeTheme.supportedOptions?.accessories).toEqual(["none"]);
    expect(faceMinimalTheme.supportedOptions?.accessories).toEqual(["none"]);
    expect(robotTheme.supportedOptions).toBeUndefined();
    expect(initialTheme.supportedOptions?.details).toEqual([
      "blush",
      "freckles",
      "none",
    ]);
    expect(classicTheme.supportedOptions).toBeUndefined();
  });

  it("mantém definições SVG locais e estáveis nas composições completas", () => {
    const props = {
      theme: "pixel" as const,
      background: true,
      backgroundType: "gradientLinear" as const,
      backgroundColors: ["#06121f", "#183c62"],
      backgroundPattern: "dots" as const,
      themeSeed: "stable-pixel",
    };
    const markup = renderToStaticMarkup(<ACBotAvatar {...props} />);
    const ids = new Set(
      [...markup.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])
    );
    const references = [...markup.matchAll(/url\(#([^)]+)\)/g)].map(
      (match) => match[1]
    );

    expect(references.length).toBeGreaterThan(1);
    expect(references.every((reference) => ids.has(reference))).toBe(true);
    expect(markup).toBe(renderToStaticMarkup(<ACBotAvatar {...props} />));
    expect(markup).toContain('shape-rendering="crispEdges"');
  });
});
