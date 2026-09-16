import type { ComponentType, SVGProps } from "react";
import { MacaFruit } from "./maca";
import { PeraFruit } from "./pera";
import { BananaFruit } from "./banana";
import { UvaFruit } from "./uva";
import { LaranjaFruit } from "./laranja";
import { MorangoFruit } from "./morango";
import { AbacaxiFruit } from "./abacaxi";
import { MelanciaFruit } from "./melancia";
import { LimaoFruit } from "./limao";
import { MangaFruit } from "./manga";
import { CerejaFruit } from "./cereja";
import { PessegoFruit } from "./pessego";
import { KiwiFruit } from "./kiwi";
import { CocoFruit } from "./coco";
import { MamaoFruit } from "./mamao";
import { GoiabaFruit } from "./goiaba";
import { MaracujaFruit } from "./maracuja";
import { AcaiFruit } from "./acai";

export const FRUIT_ASSET_NAMES = [
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
export type FruitAssetName = (typeof FRUIT_ASSET_NAMES)[number];

export const fruitsMap: Record<
  FruitAssetName,
  ComponentType<SVGProps<SVGGElement>>
> = {
  apple: MacaFruit,
  pear: PeraFruit,
  banana: BananaFruit,
  grape: UvaFruit,
  orange: LaranjaFruit,
  strawberry: MorangoFruit,
  pineapple: AbacaxiFruit,
  watermelon: MelanciaFruit,
  lemon: LimaoFruit,
  mango: MangaFruit,
  cherry: CerejaFruit,
  peach: PessegoFruit,
  kiwi: KiwiFruit,
  coconut: CocoFruit,
  papaya: MamaoFruit,
  guava: GoiabaFruit,
  passionfruit: MaracujaFruit,
  acai: AcaiFruit,
};
