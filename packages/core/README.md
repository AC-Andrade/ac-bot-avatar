# @acandrade/ac-bot-avatar-core

Contratos de domínio e catálogos readonly do AC Bot Avatar, sem dependência de React.

```bash
yarn add @acandrade/ac-bot-avatar-core
```

```ts
import { EYE_TYPES, ACCESSORY_TYPES } from "@acandrade/ac-bot-avatar-core";
import type { AvatarConfig, EyeType } from "@acandrade/ac-bot-avatar-core";

const eye: EyeType = "sunglasses";
const config: AvatarConfig = { eye, accessory: "stars", variant: "robot" };
```

Props de componentes React devem ser importadas de `@acandrade/ac-bot-avatar-react`. Os aliases históricos permanecem depreciados durante a série 1.x.

[MIT](./LICENSE)
