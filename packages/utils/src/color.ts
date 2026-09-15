export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(maximum, Math.max(minimum, value));

const parseHexColor = (color: string): RgbColor | undefined => {
  const normalized = color.trim().replace(/^#/, "");
  const expanded = /^[a-f\d]{3}$/i.test(normalized)
    ? normalized
        .split("")
        .map((character) => character + character)
        .join("")
    : normalized;

  if (!/^[a-f\d]{6}$/i.test(expanded)) return undefined;

  return {
    r: parseInt(expanded.slice(0, 2), 16),
    g: parseInt(expanded.slice(2, 4), 16),
    b: parseInt(expanded.slice(4, 6), 16),
  };
};

const hslToRgb = (
  hue: number,
  saturation: number,
  lightness: number
): RgbColor => {
  const h = ((hue % 360) + 360) % 360;
  const s = clamp(saturation, 0, 100) / 100;
  const l = clamp(lightness, 0, 100) / 100;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const segment = h / 60;
  const secondary = chroma * (1 - Math.abs((segment % 2) - 1));
  let red = 0;
  let green = 0;
  let blue = 0;

  if (segment < 1) [red, green] = [chroma, secondary];
  else if (segment < 2) [red, green] = [secondary, chroma];
  else if (segment < 3) [green, blue] = [chroma, secondary];
  else if (segment < 4) [green, blue] = [secondary, chroma];
  else if (segment < 5) [red, blue] = [secondary, chroma];
  else [red, blue] = [chroma, secondary];

  const match = l - chroma / 2;
  return {
    r: Math.round((red + match) * 255),
    g: Math.round((green + match) * 255),
    b: Math.round((blue + match) * 255),
  };
};

/** Parses the hexadecimal and HSL formats accepted by the avatar packages. */
export const parseColor = (color: string): RgbColor | undefined => {
  const hex = parseHexColor(color);
  if (hex) return hex;

  const hsl =
    /^hsla?\(\s*(-?[\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%(?:[\s,/]+[\d.]+%?)?\s*\)$/i.exec(
      color.trim()
    );
  if (!hsl) return undefined;

  return hslToRgb(Number(hsl[1]), Number(hsl[2]), Number(hsl[3]));
};

export const rgbToHex = ({ r, g, b }: RgbColor): string =>
  `#${[r, g, b]
    .map((channel) =>
      clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0")
    )
    .join("")}`;

export const hexToHsl = (hex: string): [number, number, number] | undefined => {
  const rgb = parseHexColor(hex);
  if (!rgb) return undefined;
  let { r, g, b } = rgb;
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const difference = max - min;
    s = l > 0.5 ? difference / (2 - max - min) : difference / (max + min);
    switch (max) {
      case r:
        h = (g - b) / difference + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / difference + 2;
        break;
      case b:
        h = (r - g) / difference + 4;
        break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

const linearizeSrgb = (channel: number): number => {
  const normalized = channel / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
};

/** WCAG relative luminance in the range 0..1. */
export const getRelativeLuminance = (color: string): number | undefined => {
  const rgb = parseColor(color);
  if (!rgb) return undefined;
  return (
    0.2126 * linearizeSrgb(rgb.r) +
    0.7152 * linearizeSrgb(rgb.g) +
    0.0722 * linearizeSrgb(rgb.b)
  );
};

/** WCAG contrast ratio in the range 1..21. */
export const getContrastRatio = (
  colorA: string,
  colorB: string
): number | undefined => {
  const luminanceA = getRelativeLuminance(colorA);
  const luminanceB = getRelativeLuminance(colorB);
  if (luminanceA === undefined || luminanceB === undefined) return undefined;
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);
  return (lighter + 0.05) / (darker + 0.05);
};

interface OklabColor {
  l: number;
  a: number;
  b: number;
}

const rgbToOklab = (rgb: RgbColor): OklabColor => {
  const red = linearizeSrgb(rgb.r);
  const green = linearizeSrgb(rgb.g);
  const blue = linearizeSrgb(rgb.b);
  const l = Math.cbrt(
    0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue
  );
  const m = Math.cbrt(
    0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue
  );
  const s = Math.cbrt(
    0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue
  );

  return {
    l: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
};

/** Perceptual Euclidean distance in OKLab, scaled to a convenient 0..100 range. */
export const getColorDistance = (
  colorA: string,
  colorB: string
): number | undefined => {
  const rgbA = parseColor(colorA);
  const rgbB = parseColor(colorB);
  if (!rgbA || !rgbB) return undefined;
  const a = rgbToOklab(rgbA);
  const b = rgbToOklab(rgbB);
  return Math.hypot(a.l - b.l, a.a - b.a, a.b - b.b) * 100;
};

export const isTooSimilar = (
  colorA: string,
  colorB: string,
  threshold = 8
): boolean => {
  const distance = getColorDistance(colorA, colorB);
  return distance !== undefined && distance < threshold;
};

export const hasEnoughContrast = (
  colorA: string,
  colorB: string,
  minimum = 4.5
): boolean => {
  const ratio = getContrastRatio(colorA, colorB);
  return ratio !== undefined && ratio >= minimum;
};

export const isColorCollision = (
  colorA: string,
  colorB: string,
  similarityThreshold = 8
): boolean =>
  colorA.trim().toLowerCase() === colorB.trim().toLowerCase() ||
  isTooSimilar(colorA, colorB, similarityThreshold);

export const mixColors = (
  colorA: string,
  colorB: string,
  amount: number
): string | undefined => {
  const a = parseColor(colorA);
  const b = parseColor(colorB);
  if (!a || !b) return undefined;
  const ratio = clamp(amount, 0, 1);
  return rgbToHex({
    r: a.r + (b.r - a.r) * ratio,
    g: a.g + (b.g - a.g) * ratio,
    b: a.b + (b.b - a.b) * ratio,
  });
};

/** Samples every gradient segment, including both ends. */
export const sampleGradientColors = (
  colors: readonly string[],
  samplesPerSegment = 4
): string[] => {
  if (colors.length < 2) return [...colors];
  const samples: string[] = [];
  const count = Math.max(1, Math.floor(samplesPerSegment));

  for (let index = 0; index < colors.length - 1; index += 1) {
    for (let sample = 0; sample < count; sample += 1) {
      const color = mixColors(colors[index], colors[index + 1], sample / count);
      if (color) samples.push(color);
    }
  }
  samples.push(colors[colors.length - 1]);
  return samples;
};

export const getWorstGradientContrast = (
  foreground: string,
  gradientColors: readonly string[],
  samplesPerSegment = 4
): number | undefined => {
  const ratios = sampleGradientColors(gradientColors, samplesPerSegment)
    .map((color) => getContrastRatio(foreground, color))
    .filter((ratio): ratio is number => ratio !== undefined);
  return ratios.length > 0 ? Math.min(...ratios) : undefined;
};
