import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HashedACBotAvatar } from "./HashedACBotAvatar";

const render = (props: Parameters<typeof HashedACBotAvatar>[0]) =>
  renderToStaticMarkup(<HashedACBotAvatar {...props} />);

describe("HashedACBotAvatar", () => {
  it("trata zero e string vazia como seeds válidos", () => {
    expect(render({ identifier: 0 })).toBe(render({ seed: 0 }));
    expect(render({ identifier: "" })).toBe(render({ seed: "" }));
  });

  it("trata null e undefined como ausência de seed", () => {
    expect(render({ identifier: null })).toBe(render({}));
    expect(render({ seed: null })).toBe(render({ identifier: undefined }));
  });

  it("prioriza seed quando os dois aliases são informados", () => {
    expect(render({ seed: "preferred", identifier: "legacy" })).toBe(
      render({ seed: "preferred" })
    );
  });

  it("permite sobrescrever qualquer valor gerado", () => {
    const markup = render({
      seed: "override",
      color: "#000000",
      eye: "normal",
      mouth: "none",
    });

    expect(markup).toContain("color:hsl(0, 0%, 0%)");
  });

  it("habilita o catálogo expandido apenas na geração v2", () => {
    const legacy = render({ seed: "expanded", generationVersion: "v1" });
    const expanded = render({ seed: "expanded", generationVersion: "v2" });
    expect(expanded).not.toBe(legacy);
  });

  it("aplica a composição v3 uma única vez antes da renderização", () => {
    const props = {
      seed: "atlas-9823",
      generationVersion: "v3" as const,
      theme: "robot" as const,
      background: true,
      backgroundType: "gradientLinear" as const,
      backgroundColors: ["#2563eb", "#2564eb"],
      color: "#2563eb",
      eyeColor: "#202135",
      mouthColor: "#202135",
    };
    const first = render(props);

    expect(first).toBe(render(props));
    expect(first).toContain("linearGradient");
    expect(first).not.toContain('stop-color="#2564eb"');
    expect(first).not.toContain("color:#202135");
  });

  it("preserva transparência explícita na geração v3", () => {
    const markup = render({
      seed: "transparent-v3",
      generationVersion: "v3",
      theme: "face-minimal",
      background: true,
      backgroundType: "transparent",
    });
    expect(markup).not.toContain('width="200%"');
    expect(markup).not.toContain("linearGradient");
  });
});
