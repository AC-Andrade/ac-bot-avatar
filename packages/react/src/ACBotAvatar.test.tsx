import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type {
  AccessoryType,
  DetailsType,
  EyeType,
  EyebrowsType,
  MouthType,
  PatternType,
} from "@acandrade/ac-bot-avatar-core";
import { ACBotAvatar } from "./ACBotAvatar";

const render = (props: Parameters<typeof ACBotAvatar>[0]) =>
  renderToStaticMarkup(createElement(ACBotAvatar, props));

describe("ACBotAvatar", () => {
  it("renderiza um SVG decorativo por padrão e encaminha props nativas", () => {
    const markup = render({
      className: "profile-avatar",
      "data-testid": "avatar",
      size: 64,
    });

    expect(markup).toContain("<svg");
    expect(markup).toContain('width="64"');
    expect(markup).toContain('height="64"');
    expect(markup).toContain('class="profile-avatar"');
    expect(markup).toContain('data-testid="avatar"');
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain('focusable="false"');
  });

  it("usa título como nome acessível", () => {
    const markup = render({ title: "Avatar de Ada", size: 32 });
    const titleId = markup.match(/<title id="([^"]+)"/)?.[1];

    expect(titleId).toBeDefined();
    expect(markup).toContain('role="img"');
    expect(markup).toContain(`aria-labelledby="${titleId}"`);
    expect(markup).not.toContain('aria-hidden="true"');
  });

  it("produz IDs e marcação estáveis em SSR", () => {
    const props = {
      background: true,
      backgroundType: "gradientLinear" as const,
      backgroundColors: ["#112233", "#445566"],
      backgroundPattern: "dots" as const,
      color: "#61f3f7",
      accessory: "stars" as const,
    };

    expect(render(props)).toBe(render(props));
  });

  it("mantém referências SVG locais válidas em múltiplos avatares", () => {
    const markup = renderToStaticMarkup(
      <>
        <ACBotAvatar
          background
          backgroundType="gradientLinear"
          backgroundColors={["#111111", "#222222"]}
        />
        <ACBotAvatar
          background
          backgroundType="gradientLinear"
          backgroundColors={["#333333", "#444444"]}
        />
      </>
    );
    const ids = new Set(
      [...markup.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])
    );
    const references = [...markup.matchAll(/url\(#([^)]+)\)/g)].map(
      (match) => match[1]
    );

    expect(references.length).toBeGreaterThan(0);
    expect(references.every((reference) => ids.has(reference))).toBe(true);
  });

  it("limita o tamanho e aceita cores hexadecimais curtas", () => {
    const markup = render({ color: "#0f0", maxSize: 80, size: 200 });
    expect(markup).toContain('width="80"');
    expect(markup).toContain("color:hsl(120, 100%, 50%)");
  });

  it("é um forwardRef e aceita eventos e nomes ARIA", () => {
    expect(ACBotAvatar).toHaveProperty(
      "$$typeof",
      Symbol.for("react.forward_ref")
    );
    const markup = render({
      "aria-label": "Avatar interativo",
      className: "clickable",
      onClick: () => undefined,
    });
    expect(markup).toContain('aria-label="Avatar interativo"');
    expect(markup).toContain('class="clickable"');
    expect(markup).not.toContain("aria-hidden");
  });

  it("aplica fallback seguro a todos os registros dinâmicos inválidos", () => {
    const markup = render({
      eye: "unknown" as EyeType,
      mouth: "unknown" as MouthType,
      eyebrows: "unknown" as EyebrowsType,
      details: "unknown" as DetailsType,
      accessory: "unknown" as AccessoryType,
      background: true,
      backgroundPattern: "unknown" as PatternType,
    });

    expect(markup).toContain("<svg");
    expect(markup).toContain('data-ac-bot-part="face"');
    expect(markup).not.toContain("undefined");
  });

  it.each([
    { backgroundType: "solid" as const, variant: "robot" as const },
    {
      backgroundType: "gradientLinear" as const,
      variant: "face" as const,
    },
    { backgroundType: "glass" as const, variant: "robot" as const },
  ])("renderiza fundos e variantes: %o", (props) => {
    const markup = render({
      ...props,
      background: true,
      backgroundColors: ["#112233", "#445566"],
      backgroundPattern: "lines",
      accessory: "carnival",
    });
    expect(markup).toContain("<svg");
    expect(markup).toContain('class="ac-bot-accessory"');
  });
});
