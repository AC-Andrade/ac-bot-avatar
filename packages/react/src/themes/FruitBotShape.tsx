import {
  FRUIT_ASSET_NAMES,
  fruits,
  type FruitAssetName,
} from "@acandrade/ac-bot-avatar-assets";
import type {
  ACBotShapeProps,
  AvatarFaceLayout,
  AvatarFaceLayoutContext,
} from "../types";
import {
  createSafeRobotFaceLayout,
  stableThemeIndex,
  ThemeShapeFrame,
} from "./shared";

export const FRUIT_BOT_KINDS = FRUIT_ASSET_NAMES;
export type FruitBotKind = FruitAssetName;

export const FRUIT_BOT_LABELS: Readonly<Record<FruitBotKind, string>> =
  Object.freeze({
    apple: "Maçã",
    pear: "Pera",
    banana: "Banana",
    grape: "Uva",
    orange: "Laranja",
    strawberry: "Morango",
    pineapple: "Abacaxi",
    watermelon: "Melancia",
    lemon: "Limão",
    mango: "Manga",
    cherry: "Cereja",
    peach: "Pêssego",
    kiwi: "Kiwi",
    coconut: "Coco",
    papaya: "Mamão",
    guava: "Goiaba",
    passionfruit: "Maracujá",
    acai: "Açaí",
  });

const FRUIT_BODY_COLORS: Readonly<Record<FruitBotKind, string>> = Object.freeze(
  {
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
  }
);

const FRUIT_ALIASES: ReadonlyArray<readonly [FruitBotKind, readonly string[]]> =
  [
    ["passionfruit", ["passionfruit", "maracuja"]],
    ["strawberry", ["strawberry", "morango"]],
    ["watermelon", ["watermelon", "melancia"]],
    ["pineapple", ["pineapple", "abacaxi"]],
    ["coconut", ["coconut", "coco"]],
    ["banana", ["banana"]],
    ["cherry", ["cherry", "cereja"]],
    ["orange", ["orange", "laranja"]],
    ["papaya", ["papaya", "mamao"]],
    ["peach", ["peach", "pessego"]],
    ["apple", ["apple", "maca"]],
    ["pear", ["pear", "pera"]],
    ["grape", ["grape", "berry", "uva"]],
    ["lemon", ["lemon", "limao"]],
    ["mango", ["mango", "manga"]],
    ["guava", ["guava", "goiaba"]],
    ["kiwi", ["kiwi"]],
    ["acai", ["acai"]],
  ];

const normalizeFruitName = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]/g, "");

const findFruitName = (
  value: string | number | undefined
): FruitBotKind | undefined => {
  const normalized = normalizeFruitName(String(value ?? ""));
  if (!normalized) return undefined;
  return FRUIT_ALIASES.find(([, aliases]) =>
    aliases.some((alias) => normalized.includes(alias))
  )?.[0];
};

export const resolveFruitBotKind = ({
  themeSeed,
  themeVariant,
}: AvatarFaceLayoutContext): FruitBotKind => {
  const requestedKind = findFruitName(themeVariant);
  const seededKind = findFruitName(themeSeed);
  return (
    requestedKind ??
    seededKind ??
    FRUIT_BOT_KINDS[
      stableThemeIndex(themeSeed, "fruit-kind-v2", FRUIT_BOT_KINDS.length)
    ]
  );
};

const fruitFaceLayout = (transform: string): AvatarFaceLayout =>
  createSafeRobotFaceLayout(transform, -120);

// Every transform is fitted to the canonical visor path of that fruit. Keeping
// the complete table explicit lets one illustration be tuned without moving
// the face of any other Fruit Bot.
const FRUIT_FACE_LAYOUTS: Readonly<Record<FruitBotKind, AvatarFaceLayout>> =
  Object.freeze({
    apple: fruitFaceLayout("translate(19.9, 106.6) scale(0.066)"),
    pear: fruitFaceLayout("translate(29.4, 117.8) scale(0.0605)"),
    banana: fruitFaceLayout("translate(24.5, 98.1) scale(0.064)"),
    grape: fruitFaceLayout("translate(25.4, 108.5) scale(0.0639)"),
    orange: fruitFaceLayout("translate(22, 106.8) scale(0.0655)"),
    strawberry: fruitFaceLayout("translate(26.7, 97.9) scale(0.0622)"),
    pineapple: fruitFaceLayout("translate(37, 128.8) scale(0.0555)"),
    watermelon: fruitFaceLayout("translate(25.1, 107.9) scale(0.0639)"),
    lemon: fruitFaceLayout("translate(26.9, 102.6) scale(0.0627)"),
    mango: fruitFaceLayout("translate(26.6, 108) scale(0.0626)"),
    cherry: fruitFaceLayout("translate(21.5, 113) scale(0.0625)"),
    peach: fruitFaceLayout("translate(22.4, 102.4) scale(0.0649)"),
    kiwi: fruitFaceLayout("translate(20.9, 83.6) scale(0.066)"),
    coconut: fruitFaceLayout("translate(25, 92) scale(0.064)"),
    papaya: fruitFaceLayout("translate(32.3, 98.5) scale(0.0592)"),
    guava: fruitFaceLayout("translate(23.2, 90.9) scale(0.0643)"),
    passionfruit: fruitFaceLayout("translate(21.2, 95.5) scale(0.0657)"),
    acai: fruitFaceLayout("translate(21.8, 95.4) scale(0.0653)"),
  });

export const resolveFruitFaceLayout = (
  context: AvatarFaceLayoutContext
): AvatarFaceLayout => FRUIT_FACE_LAYOUTS[resolveFruitBotKind(context)];

export const FruitBotShape = (props: ACBotShapeProps) => {
  const kind = resolveFruitBotKind(props);
  const Fruit = fruits[kind];
  const fixedPaletteProps: ACBotShapeProps = {
    ...props,
    h: undefined,
    s: undefined,
    l: undefined,
    accessory: "none",
    accessoryColor: undefined,
  };

  return (
    <ThemeShapeFrame name="fruit" shapeProps={fixedPaletteProps}>
      <g
        data-fruit-kind={kind}
        data-fruit-label={FRUIT_BOT_LABELS[kind]}
        data-fruit-body-color={FRUIT_BODY_COLORS[kind]}
        data-fruit-source="canonical-svg"
        style={{ filter: "saturate(1.28) brightness(1.08)" }}
      >
        <Fruit />
      </g>
    </ThemeShapeFrame>
  );
};
