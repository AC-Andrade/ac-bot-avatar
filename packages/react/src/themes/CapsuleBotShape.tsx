import {
  CAPSULE_ASSET_NAMES,
  capsules,
  type CapsuleAssetName,
} from "@acandrade/ac-bot-avatar-assets";
import type { CSSProperties } from "react";
import type {
  ACBotShapeProps,
  AvatarFaceLayout,
  AvatarFaceLayoutContext,
} from "../types";
import {
  createSafeRobotFaceLayout,
  resolveThemeTone,
  stableThemeIndex,
  ThemeShapeFrame,
} from "./shared";

export const CAPSULE_BOT_KINDS = CAPSULE_ASSET_NAMES;
export type CapsuleBotKind = CapsuleAssetName;

export const CAPSULE_BOT_LABELS: Readonly<Record<CapsuleBotKind, string>> =
  Object.freeze({
    default: "Padrão",
    antenna: "Antena",
    mohawk: "Moicano",
    satellite: "Parabólica",
  });

const CAPSULE_ALIASES: ReadonlyArray<
  readonly [CapsuleBotKind, readonly string[]]
> = [
  ["default", ["default", "padrao"]],
  ["antenna", ["antenna", "antena"]],
  ["mohawk", ["mohawk", "moicano"]],
  ["satellite", ["satellite", "dish", "parabolica"]],
];

const normalizeCapsuleName = (value: string | number | undefined): string =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]/g, "");

const findCapsuleKind = (
  value: string | number | undefined
): CapsuleBotKind | undefined => {
  const normalized = normalizeCapsuleName(value);
  return CAPSULE_ALIASES.find(([, aliases]) =>
    aliases.some((alias) => normalized.includes(alias))
  )?.[0];
};

export const resolveCapsuleBotKind = ({
  themeSeed,
  themeVariant,
}: AvatarFaceLayoutContext): CapsuleBotKind => {
  const requestedKind = findCapsuleKind(themeVariant);
  if (requestedKind) return requestedKind;

  const seededKind = findCapsuleKind(themeSeed);
  if (seededKind) return seededKind;
  if (themeSeed === undefined) return "default";

  return CAPSULE_BOT_KINDS[
    stableThemeIndex(themeSeed, "capsule-kind-v1", CAPSULE_BOT_KINDS.length)
  ];
};

const capsuleFaceLayout = (transform: string): AvatarFaceLayout =>
  createSafeRobotFaceLayout(transform, -170);

const CAPSULE_FACE_LAYOUTS: Readonly<Record<CapsuleBotKind, AvatarFaceLayout>> =
  Object.freeze({
    default: capsuleFaceLayout("translate(156, 349) scale(0.29)"),
    antenna: capsuleFaceLayout("translate(156, 438) scale(0.29)"),
    mohawk: capsuleFaceLayout("translate(156, 450) scale(0.29)"),
    satellite: capsuleFaceLayout("translate(156, 479) scale(0.29)"),
  });

export const resolveCapsuleFaceLayout = (
  context: AvatarFaceLayoutContext
): AvatarFaceLayout => CAPSULE_FACE_LAYOUTS[resolveCapsuleBotKind(context)];

const CAPSULE_COLOR = [258, 22, 49] as const;

export const CapsuleBotShape = (props: ACBotShapeProps) => {
  const kind = resolveCapsuleBotKind(props);
  const Capsule = capsules[kind];
  const body = resolveThemeTone(props, CAPSULE_COLOR);
  const shade = resolveThemeTone(props, CAPSULE_COLOR, -18, 8);
  const highlight = resolveThemeTone(props, CAPSULE_COLOR, 25, -10);
  const shapeProps: ACBotShapeProps = {
    ...props,
    accessory: "none",
    accessoryColor: undefined,
  };
  const bodyStyle = {
    "--ac-capsule-body": body,
    "--ac-capsule-body-shade": shade,
    "--ac-capsule-body-highlight": highlight,
  } as CSSProperties;

  return (
    <ThemeShapeFrame name="capsule" shapeProps={shapeProps}>
      <Capsule
        data-capsule-kind={kind}
        data-capsule-label={CAPSULE_BOT_LABELS[kind]}
        data-capsule-source="canonical-svg"
        style={bodyStyle}
      />
    </ThemeShapeFrame>
  );
};
