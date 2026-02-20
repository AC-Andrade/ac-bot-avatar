# @acandrade/ac-bot-avatar-utils

Utility functions for the AC Bot Avatar system. Handles deterministic logic, color palettes, and hashing.

[**Full Documentation**](https://acbot.dev/docs/utils)

## Installation

```bash
yarn add @acandrade/ac-bot-avatar-utils
```

# or

```bash
npm i @acandrade/ac-bot-avatar-utils
```

## Usage

### Generating an Avatar Configuration

The main utility is used to transform a string into a valid set of props for the avatar components.

```typescript
import { generateAvatarConfig } from "@acandrade/ac-bot-avatar-utils";

const config = generateAvatarConfig("unique-user-id");

// Output:
// {
//   variant: 'full',
//   color: '#...',
//   eye: 'normal',
//   mouth: 'smile',
//   ...
// }
```

## Features

- **Fast Hashing**: Lightweight hashing to ensure the same input always yields the same avatar.
- **Color Selection**: Intelligent selection of high-contrast, premium colors.
- **Logic decoupling**: Separates the generation logic from the UI components.

## Keywords

- utils
- generator
- hash
- deterministic
- logic
- helper
