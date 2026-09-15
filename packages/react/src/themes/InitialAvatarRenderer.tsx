import type { AvatarThemeRendererProps } from "../types";
import {
  resolveThemeExpression,
  resolveThemeTone,
  stableThemeIndex,
  ThemeCanvas,
} from "./shared";

export const INITIAL_FACE_VARIANTS = ["soft", "poster", "outline"] as const;
export type InitialFaceVariant = (typeof INITIAL_FACE_VARIANTS)[number];

const isInitialFaceVariant = (
  value: string | undefined
): value is InitialFaceVariant =>
  INITIAL_FACE_VARIANTS.includes(value as InitialFaceVariant);

const InitialEyes = ({
  eye,
  color,
}: {
  eye: ReturnType<typeof resolveThemeExpression>["eye"];
  color: string;
}) => {
  if (eye === "love" || eye === "heart") {
    return (
      <g fill={color}>
        <path d="M38 36c-8-8-19 5 0 20 19-15 8-28 0-20Z" />
        <path d="M88 36c-8-8-19 5 0 20 19-15 8-28 0-20Z" />
      </g>
    );
  }
  if (eye === "closed" || eye === "squint" || eye === "chords") {
    return (
      <g fill="none" stroke={color} strokeLinecap="round" strokeWidth="4">
        <path d="m29 47 9 5 9-5" />
        <path d="m79 47 9 5 9-5" />
      </g>
    );
  }
  if (eye === "blink") {
    return (
      <g fill={color} stroke={color} strokeLinecap="round" strokeWidth="4">
        <path d="m29 48 9 5 9-5" fill="none" />
        <ellipse cx="88" cy="48" rx="4" ry="8" stroke="none" />
      </g>
    );
  }
  if (eye === "mischief") {
    return (
      <g fill="none" stroke={color} strokeLinecap="round" strokeWidth="4">
        <path d="m28 42 18 8-13 5" />
        <path d="m98 42-18 8 13 5" />
      </g>
    );
  }
  if (eye === "surprised" || eye === "talking") {
    return (
      <g fill={color}>
        <ellipse cx="38" cy="48" rx="4" ry="9" />
        <ellipse cx="88" cy="48" rx="4" ry="9" />
      </g>
    );
  }
  return (
    <g fill={color}>
      <ellipse cx="38" cy="48" rx="5" ry="8" />
      <ellipse cx="88" cy="48" rx="5" ry="8" />
    </g>
  );
};

const InitialBadge = ({
  accessory,
  color,
}: Pick<AvatarThemeRendererProps, "accessory"> & { color: string }) => {
  if (!accessory || accessory === "none") return null;
  if (accessory === "hearts") {
    return <path d="M104 14c-7-7-15 5 0 17 15-12 7-24 0-17Z" fill={color} />;
  }
  if (accessory === "stars") {
    return <path d="m104 11 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" fill={color} />;
  }
  if (accessory === "bow") {
    return <path d="m92 16 11 6 11-6v16l-11-6-11 6Z" fill={color} />;
  }
  return <circle cx="105" cy="22" r="8" fill={color} opacity=".8" />;
};

export const InitialAvatarRenderer = (props: AvatarThemeRendererProps) => {
  const expression = resolveThemeExpression(props);
  const shell = resolveThemeTone(props, [174, 56, 69]);
  const shade = resolveThemeTone(props, [174, 56, 69], -24, -10);
  const feature = props.eyeColor ?? "#111827";
  const requestedVariant = isInitialFaceVariant(props.themeVariant)
    ? props.themeVariant
    : undefined;
  const layout =
    requestedVariant ??
    INITIAL_FACE_VARIANTS[
      stableThemeIndex(
        props.themeSeed,
        "initial-layout",
        INITIAL_FACE_VARIANTS.length
      )
    ];
  const monogram = Array.from(props.monogram?.trim() || "A")[0].toUpperCase();
  const radius = layout === "poster" ? 8 : layout === "outline" ? 32 : 22;

  return (
    <ThemeCanvas name="initial" shapeProps={props} fallback="transparent">
      <g data-initial-layout={layout}>
        <rect
          x="5"
          y="5"
          width="118"
          height="118"
          rx={radius}
          fill={shell}
          stroke={layout === "outline" ? feature : "#ffffff"}
          strokeWidth={layout === "outline" ? 4 : 2}
          strokeOpacity={layout === "outline" ? 0.8 : 0.24}
        />
        {layout === "poster" ? (
          <>
            <path d="M5 28V5h23" fill="none" stroke={shade} strokeWidth="6" />
            <path
              d="M100 123h23v-23"
              fill="none"
              stroke={shade}
              strokeWidth="6"
            />
          </>
        ) : null}
        {props.eyebrows && props.eyebrows !== "none" ? (
          <g
            fill="none"
            stroke={props.eyebrowsColor ?? feature}
            strokeLinecap="round"
            strokeWidth="3"
          >
            <path d="m29 35 17-3" />
            <path d="m80 32 17 3" />
          </g>
        ) : null}
        <g data-initial-expression={expression.eye}>
          <InitialEyes eye={expression.eye} color={feature} />
        </g>
        {props.details === "blush" ? (
          <g fill={props.detailsColor ?? "#ec5578"} opacity=".55">
            <ellipse cx="28" cy="66" rx="9" ry="4" />
            <ellipse cx="100" cy="66" rx="9" ry="4" />
          </g>
        ) : null}
        {props.details === "freckles" ? (
          <g fill={props.detailsColor ?? feature} opacity=".38">
            <circle cx="43" cy="64" r="1.5" />
            <circle cx="48" cy="67" r="1.5" />
            <circle cx="80" cy="67" r="1.5" />
            <circle cx="85" cy="64" r="1.5" />
          </g>
        ) : null}
        <text
          x="64"
          y="82"
          fill={feature}
          fontFamily="ui-rounded, system-ui, sans-serif"
          fontSize="40"
          fontWeight="800"
          textAnchor="middle"
          data-monogram={monogram}
        >
          {monogram}
        </text>
        <InitialBadge
          accessory={props.accessory}
          color={props.accessoryColor ?? feature}
        />
      </g>
    </ThemeCanvas>
  );
};
