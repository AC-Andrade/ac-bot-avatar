# @acandrade/ac-bot-avatar-core

Core type definitions and centralized constants for the AC Bot Avatar library.

## Installation

```bash
yarn add @acandrade/ac-bot-avatar-core
```

# or

```bash
npm i @acandrade/ac-bot-avatar-core
```

## Usage

### Using Types

Ideal for building wrappers or custom implementations using the official types.

```typescript
import type {
  ACBotAvatarProps,
  EyeType,
  MouthType,
} from "@acandrade/ac-bot-avatar-core";

const myProps: ACBotAvatarProps = {
  size: 40,
  variant: "face",
};
```

## Features

- **Strict Typing**: Full TypeScript support for all avatar variations.
- **Centralized Specs**: The single source of truth for eye and mouth types.
- **Zero Dependencies**: Purely type definitions and constants.

## Keywords

- types
- typescript
- core
- interfaces
- definitions
- types-package
