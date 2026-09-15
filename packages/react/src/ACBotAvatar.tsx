import { forwardRef } from "react";
import { createStableSvgId, hexToHsl } from "@acandrade/ac-bot-avatar-utils";
import { ACBotFace } from "./ACBotFace";
import { ACBotShape } from "./ACBotShape";
import { resolveAvatarTheme } from "./theme";
import type { ACBotAvatarProps } from "./types";

const serializeColor = (color: ACBotAvatarProps["color"]): string =>
  Array.isArray(color) ? color.join(",") : color ?? "default";

export const ACBotAvatar = forwardRef<SVGSVGElement, ACBotAvatarProps>(
  (
    {
      background,
      backgroundType,
      backgroundColors,
      backgroundRotation,
      backgroundPattern,
      maxSize,
      color,
      face,
      eye,
      mouth,
      eyebrows,
      details,
      eyeColor,
      mouthColor,
      eyebrowsColor,
      detailsColor,
      accessory,
      accessoryColor,
      size,
      style,
      title,
      theme,
      themeSeed,
      themeVariant,
      monogram,
      variant = "robot",
      id,
      role,
      focusable,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-hidden": ariaHidden,
      ...svgProps
    },
    ref
  ) => {
    const resolvedTheme = resolveAvatarTheme(theme);
    const resolvedVariant = resolvedTheme.avatarVariant ?? variant;
    const hslColor = resolvedTheme.lockPalette
      ? undefined
      : Array.isArray(color)
      ? color
      : typeof color === "string"
      ? hexToHsl(color)
      : undefined;
    let finalSize = size === "inherit" ? "100%" : size ?? 200;

    if (
      typeof finalSize === "number" &&
      maxSize !== undefined &&
      finalSize > maxSize
    ) {
      finalSize = maxSize;
    }

    const definitionKey = JSON.stringify({
      id,
      title,
      theme: resolvedTheme.id,
      themeSeed,
      themeVariant,
      monogram,
      variant: resolvedVariant,
      color: resolvedTheme.lockPalette ? "theme-locked" : serializeColor(color),
      background,
      backgroundType,
      backgroundColors,
      backgroundRotation,
      backgroundPattern,
      accessory,
    });
    const idPrefix = createStableSvgId("ac-bot", definitionKey);
    const titleId = `${idPrefix}-title`;
    const hasAccessibleName = Boolean(ariaLabel || ariaLabelledBy || title);
    const Shape = resolvedTheme.shape ?? ACBotShape;
    const Renderer = resolvedTheme.renderer;
    const resolvedMonogram =
      monogram ??
      Array.from(String(themeSeed ?? "A").trim())[0]?.toUpperCase() ??
      "A";

    return (
      <svg
        {...svgProps}
        ref={ref}
        id={id}
        version="1.1"
        x="0"
        y="0"
        viewBox={resolvedTheme.viewBox ?? "-25 -25 350 350"}
        width={finalSize}
        height={finalSize}
        style={{
          ...style,
          color: hslColor
            ? `hsl(${hslColor[0]}, ${hslColor[1]}%, ${hslColor[2]}%)`
            : typeof color === "string" && !resolvedTheme.lockPalette
            ? color
            : resolvedTheme.defaultColor
            ? resolvedTheme.defaultColor
            : resolvedVariant === "robot"
            ? "#ffffff"
            : "inherit",
        }}
        role={role ?? (hasAccessibleName ? "img" : undefined)}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy ?? (title ? titleId : undefined)}
        aria-hidden={ariaHidden ?? (hasAccessibleName ? undefined : true)}
        focusable={focusable ?? false}
        preserveAspectRatio="xMidYMid meet"
        shapeRendering={resolvedTheme.shapeRendering ?? "geometricPrecision"}
      >
        {title && <title id={titleId}>{title}</title>}
        {Renderer ? (
          <Renderer
            h={hslColor?.[0]}
            s={hslColor?.[1]}
            l={hslColor?.[2]}
            background={background}
            backgroundType={backgroundType}
            backgroundColors={backgroundColors}
            backgroundRotation={backgroundRotation}
            backgroundPattern={backgroundPattern}
            themeSeed={themeSeed}
            themeVariant={themeVariant}
            monogram={resolvedMonogram}
            variant={resolvedVariant}
            accessory={accessory}
            accessoryColor={
              resolvedTheme.lockPalette ? undefined : accessoryColor
            }
            idPrefix={idPrefix}
            accessoryRegistry={resolvedTheme.accessories}
            patternRegistry={resolvedTheme.patterns}
            face={face}
            eye={eye}
            mouth={mouth}
            eyebrows={eyebrows}
            details={details}
            eyeColor={eyeColor}
            mouthColor={mouthColor}
            eyebrowsColor={
              resolvedTheme.lockPalette ? undefined : eyebrowsColor
            }
            detailsColor={resolvedTheme.lockPalette ? undefined : detailsColor}
          />
        ) : (
          <>
            <Shape
              h={hslColor?.[0]}
              s={hslColor?.[1]}
              l={hslColor?.[2]}
              background={background}
              backgroundType={backgroundType}
              backgroundColors={backgroundColors}
              backgroundRotation={backgroundRotation}
              backgroundPattern={backgroundPattern}
              themeSeed={themeSeed}
              themeVariant={themeVariant}
              variant={resolvedVariant}
              accessory={accessory}
              accessoryColor={
                resolvedTheme.lockPalette ? undefined : accessoryColor
              }
              idPrefix={idPrefix}
              accessoryRegistry={resolvedTheme.accessories}
              patternRegistry={resolvedTheme.patterns}
            />
            <ACBotFace
              face={face}
              eye={eye}
              mouth={mouth}
              eyebrows={eyebrows}
              details={details}
              eyeColor={eyeColor}
              mouthColor={mouthColor}
              eyebrowsColor={
                resolvedTheme.lockPalette ? undefined : eyebrowsColor
              }
              detailsColor={
                resolvedTheme.lockPalette ? undefined : detailsColor
              }
              variant={resolvedVariant}
              theme={resolvedTheme}
              themeSeed={themeSeed}
              themeVariant={themeVariant}
            />
          </>
        )}
      </svg>
    );
  }
);

ACBotAvatar.displayName = "ACBotAvatar";

export default ACBotAvatar;
