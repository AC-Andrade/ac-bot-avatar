# @acandrade/ac-bot-avatar-react

React components for rendering official AC Bot Avatars. This package provides high-level components to easily integrate avatars into your React application.

[**Live Documentation & Playground**](https://acbot.dev)

## Installation

```bash
yarn add @acandrade/ac-bot-avatar-react
```

# or

```bash
npm i @acandrade/ac-bot-avatar-react
```

## Import components

```tsx
import { ACBotAvatar, HashedACBotAvatar } from "@acandrade/ac-bot-avatar-react";
```

## Basic Usage

### Simple Avatar

The `ACBotAvatar` is the base component. You can pass specific variants, eyes, and mouths.

```tsx
<ACBotAvatar
  size={128}
  variant="full"
  eye="sunglasses"
  mouth="smile"
  color="#6366f1"
/>
```

### Deterministic (Hashed) Avatar

Use `HashedACBotAvatar` when you want a unique avatar based on a user ID, email, or any unique string. It will always return the same avatar for the same hash.

```tsx
<HashedACBotAvatar hash="user@example.com" size={64} />
```

## Features

- **Deterministic Generation**: Generate unique, consistent avatars from any string.
- **Customizable**: Control colors, facial expressions, and scaling.
- **SVG Driven**: Crystal clear at any size, weighs almost nothing.
- **TypeScript**: First-class support for types.

## Keywords

- component
- react
- avatar
- profile-image
- bot
- generator
- deterministic
- svg
