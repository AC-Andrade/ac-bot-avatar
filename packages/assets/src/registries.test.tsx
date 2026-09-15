import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ACCESSORY_TYPES,
  DETAILS_TYPES,
  EYEBROWS_TYPES,
  PATTERN_TYPES,
} from "@acandrade/ac-bot-avatar-core";
import { describe, expect, it } from "vitest";
import {
  accessories,
  CAPSULE_ASSET_NAMES,
  capsules,
  details,
  eyebrows,
  FRUIT_ASSET_NAMES,
  fruits,
  mouths,
  patterns,
  RobotArcade,
} from "./index";

describe("registros de assets", () => {
  it("corresponde aos catálogos centrais", () => {
    expect(Object.keys(accessories).sort()).toEqual(
      [...ACCESSORY_TYPES].sort()
    );
    expect(Object.keys(details).sort()).toEqual([...DETAILS_TYPES].sort());
    expect(Object.keys(eyebrows).sort()).toEqual([...EYEBROWS_TYPES].sort());
    expect(Object.keys(patterns).sort()).toEqual([...PATTERN_TYPES].sort());
    expect(Object.keys(fruits)).toEqual([...FRUIT_ASSET_NAMES]);
    expect(FRUIT_ASSET_NAMES).toHaveLength(18);
    expect(Object.keys(capsules)).toEqual([...CAPSULE_ASSET_NAMES]);
    expect(CAPSULE_ASSET_NAMES).toEqual([
      "default",
      "antenna",
      "mohawk",
      "satellite",
    ]);
  });

  it("renderiza todos os registros em marcação SVG", () => {
    for (const registry of [accessories, details, eyebrows, patterns, fruits]) {
      for (const Component of Object.values(registry)) {
        expect(
          renderToStaticMarkup(
            createElement("svg", null, createElement(Component))
          )
        ).toBeTypeOf("string");
      }
    }
  });

  it.each(FRUIT_ASSET_NAMES)(
    "mantém a base canônica %s sem expressão facial embutida",
    (fruit) => {
      const markup = renderToStaticMarkup(
        createElement("svg", null, createElement(fruits[fruit]))
      );

      expect(markup).not.toMatch(/#(?:5fbdd2|60bed4)/i);
      expect(markup).not.toContain("currentColor");
    }
  );

  it("mantém IDs de padrões estáveis", () => {
    const first = renderToStaticMarkup(<patterns.dots opacity={0.2} />);
    const second = renderToStaticMarkup(<patterns.dots opacity={0.2} />);
    expect(first).toBe(second);
  });

  it("gera a base Arcade recolorível e sem rosto embutido", () => {
    const markup = renderToStaticMarkup(
      <svg>
        <RobotArcade />
      </svg>
    );

    expect(markup).toContain("fill:currentColor");
    expect(markup).not.toContain('x="102.92"');
    expect(markup).not.toContain("145.89 117.63");
    expect(markup).not.toContain("162.16 104.49");
  });

  it("normaliza a boca big smile open tongue no espaÃ§o facial canÃ´nico", () => {
    const markup = renderToStaticMarkup(
      <svg>{createElement(mouths.big_smile_open_tongue)}</svg>
    );

    expect(markup).toContain('transform="translate(1303 1326) scale(6)"');
    expect(markup).toContain("fill:currentColor");
    expect(markup).toContain("fill:#f07b9a");
  });

  it.each([
    ["default", "M463.27,672.32"],
    ["antenna", "M516.1,803.19"],
    ["mohawk", "M516.1,814.92"],
    ["satellite", "M516.1,843.67"],
  ] as const)(
    "gera a base Capsule %s recolorível e sem rosto embutido",
    (kind, faceMarker) => {
      const Capsule = capsules[kind];
      const markup = renderToStaticMarkup(
        <svg>
          <Capsule />
        </svg>
      );

      expect(markup).toContain("--ac-capsule-body");
      expect(markup).toContain("data-capsule-visor");
      expect(markup).not.toContain(faceMarker);
    }
  );
});
