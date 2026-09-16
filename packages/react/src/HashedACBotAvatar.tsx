import { useMemo } from "react";
import type { GeneratedAvatarConfig } from "@acandrade/ac-bot-avatar-core";
import { ACBotAvatar } from "./ACBotAvatar";
import { generateAvatarConfig } from "@acandrade/ac-bot-avatar-utils";
import { resolveAvatarTheme } from "./theme";
import { resolveCapsuleBotKind, resolveFruitBotKind } from "./themes";
import type { HashedACBotAvatarProps } from "./types";

/**
 * A wrapper around ACBotAvatar that generates its configuration deterministically
 * based on an identifier and optional gender.
 */
export const HashedACBotAvatar = ({
  seed,
  identifier,
  gender,
  palette,
  generationVersion,
  ...props
}: HashedACBotAvatarProps) => {
  const resolvedSeed = seed ?? identifier;
  const resolvedTheme = resolveAvatarTheme(props.theme);
  const resolvedThemeVariant =
    resolvedTheme.id === "fruit"
      ? resolveFruitBotKind({
          themeSeed: props.themeSeed ?? resolvedSeed ?? undefined,
          themeVariant: props.themeVariant,
        })
      : resolvedTheme.id === "capsule"
      ? resolveCapsuleBotKind({
          themeSeed: props.themeSeed ?? resolvedSeed ?? undefined,
          themeVariant: props.themeVariant,
        })
      : props.themeVariant;
  const generatedProps = useMemo<Partial<GeneratedAvatarConfig>>(() => {
    if (resolvedSeed === null || resolvedSeed === undefined) return {};
    return generateAvatarConfig(resolvedSeed.toString(), {
      gender,
      palette,
      generationVersion,
      composition: {
        theme: resolvedTheme.id,
        themeVariant: resolvedThemeVariant,
        variant: resolvedTheme.avatarVariant ?? props.variant,
        eye: props.eye,
        mouth: props.mouth,
        eyebrows: props.eyebrows,
        details: props.details,
        accessory: props.accessory,
        background: props.background ?? false,
        backgroundType: props.backgroundType,
        backgroundColors: props.backgroundColors,
        color: props.color,
        eyeColor: props.eyeColor,
        mouthColor: props.mouthColor,
        eyebrowsColor: props.eyebrowsColor,
        detailsColor: props.detailsColor,
        accessoryColor: props.accessoryColor,
      },
    });
  }, [
    resolvedSeed,
    gender,
    palette,
    generationVersion,
    resolvedTheme.id,
    resolvedTheme.avatarVariant,
    resolvedThemeVariant,
    props.variant,
    props.eye,
    props.mouth,
    props.eyebrows,
    props.details,
    props.accessory,
    props.background,
    props.backgroundType,
    props.backgroundColors,
    props.color,
    props.eyeColor,
    props.mouthColor,
    props.eyebrowsColor,
    props.detailsColor,
    props.accessoryColor,
  ]);
  const composedProps =
    generationVersion === "v3" &&
    resolvedSeed !== null &&
    resolvedSeed !== undefined
      ? {
          color: generatedProps.color,
          eyeColor: generatedProps.eyeColor,
          mouthColor: generatedProps.mouthColor,
          eyebrowsColor: generatedProps.eyebrowsColor,
          detailsColor: generatedProps.detailsColor,
          accessoryColor: generatedProps.accessoryColor,
          background: generatedProps.background,
          backgroundType: generatedProps.backgroundType,
          backgroundColors: generatedProps.backgroundColors,
        }
      : {};

  return (
    <ACBotAvatar
      {...generatedProps}
      {...props}
      themeSeed={props.themeSeed ?? resolvedSeed ?? undefined}
      {...composedProps}
    />
  );
};

export default HashedACBotAvatar;
