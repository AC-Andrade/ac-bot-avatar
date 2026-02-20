# ac-bot-avatar

[![GitHub](https://img.shields.io/badge/GitHub-AC--Andrade%2Fac--bot--avatar-181717?logo=github)](https://github.com/AC-Andrade/ac-bot-avatar)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Docs](https://img.shields.io/badge/Docs-docs.acbot.dev-6366f1?logo=readthedocs&logoColor=white)](https://docs.acbot.dev)
[![Playground](https://img.shields.io/badge/Playground-play.acbot.dev-10b981?logo=codepen&logoColor=white)](https://play.acbot.dev)
[![API](https://img.shields.io/badge/API-api.acbot.dev-0ea5e9?logo=fastapi&logoColor=white)](https://api.acbot.dev)

> **ac-bot-avatar** is an open-source monorepo for generating deterministic bot identicon avatars.  
> Given any string (e.g. a username or email), it produces a unique, reproducible bot-face avatar using a hash-based pipeline — no external API required.

---

## Live

| Service       | Domain                                               | Route         |
| ------------- | ---------------------------------------------------- | ------------- |
| 🏠 Home       | [acbot.dev](https://docs.acbot.dev)                  | `/`           |
| 📚 Docs       | [docs.acbot.dev](https://docs.acbot.dev)             | `/docs`       |
| 🎮 Playground | [play.acbot.dev](https://play.acbot.dev)             | `/playground` |
| ⚡ REST API   | [api.acbot.dev/avatar](https://api.acbot.dev/avatar) | `/api/avatar` |

---

## Preview

![ac-bot-avatar preview](./preview.png)

> Each avatar is **deterministic**: the same seed always produces the same avatar.

---

## Architecture

This is a **Yarn Workspaces + Turbo** monorepo with four packages:

| Package                                                | Description                           |
| ------------------------------------------------------ | ------------------------------------- |
| [`@acandrade/ac-bot-avatar-core`](./packages/core)     | Core types and state definitions      |
| [`@acandrade/ac-bot-avatar-assets`](./packages/assets) | SVG assets (eyes, mouths, body parts) |
| [`@acandrade/ac-bot-avatar-utils`](./packages/utils)   | Hashing and avatar generator logic    |
| [`@acandrade/ac-bot-avatar-react`](./packages/react)   | React component ready to use          |

```
ac-bot-avatar/
├── packages/
│   ├── core/     → types & state
│   ├── assets/   → SVG parts
│   ├── utils/    → hash + generator
│   └── react/    → <ACBotAvatar /> component
├── turbo.json
└── package.json  (workspace root)
```

---

## Getting Started

### Install dependencies

```bash
yarn install
```

### Build all packages

```bash
yarn build
```

### Run tests

```bash
yarn test
```

---

## Usage

```tsx
import { ACBotAvatar } from "@acandrade/ac-bot-avatar-react";

export default function App() {
  return <ACBotAvatar seed="my-username" size={128} />;
}
```

---

## Publishing to NPM

Build and publish all public packages:

```bash
yarn build
npm publish --workspaces --access public
```

---

## Repository

```bash
git remote add origin https://github.com/AC-Andrade/ac-bot-avatar.git
git branch -M main
git push -u origin main
```

---

## Contributing

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) and [Security Policy](./SECURITY.md) before contributing.

Pull requests are welcome!

---

## License

[MIT](./LICENSE) © AC-Andrade
