# @acandrade/ac-bot-avatar-assets

SVG components and raw asset maps for AC Bot Avatars. This package contains the visual building blocks used to construct bot faces.

[**Explore Assets in Playground**](https://acbot.dev/playground)

## Installation

```bash
yarn add @acandrade/ac-bot-avatar-assets
```

# or

```bash
npm i @acandrade/ac-bot-avatar-assets
```

## Import Assets

```tsx
import { eyes, mouths } from "@acandrade/ac-bot-avatar-assets";
```

## Usage

### Rendering a specific eye component

Individual assets are exported as React components.

```tsx
import { SunglassesEye } from "@acandrade/ac-bot-avatar-assets/dist/eyes/sunglasses";

function MyFace() {
  return (
    <svg viewBox="0 0 3325 2563">
      <SunglassesEye style={{ color: "blue" }} />
    </svg>
  );
}
```

### Accessing via Map

You can access all eyes or mouths programmatically using the maps.

```tsx
const EyeComponent = eyes["wink"];
return <EyeComponent />;
```

## Features

- **Componentized SVGs**: Every eye and mouth is a standalone React component.
- **Color Injection**: Uses `currentColor` so you can style them via CSS or inline styles.
- **Raw Maps**: Easy to build your own avatar generator on top of these assets.

## Keywords

- svg
- assets
- icons
- react
- avatar-parts
- illustrations
