# @acandrade/ac-bot-avatar-utils

Hash, cores e geração determinística versionada para AC Bot Avatar.

```bash
yarn add @acandrade/ac-bot-avatar-utils @acandrade/ac-bot-avatar-core
```

```ts
import { generateAvatarConfig } from "@acandrade/ac-bot-avatar-utils";

const stable = generateAvatarConfig("user-123"); // geração v1 por padrão
const expanded = generateAvatarConfig("user-123", {
  generationVersion: "v2",
  palette: "warm",
});
const composed = generateAvatarConfig("atlas-9823", {
  generationVersion: "v3",
  composition: {
    theme: "robot",
    background: true,
    backgroundType: "gradientLinear",
  },
});
```

`v1` mantém a sequência da versão 1.0.3. `v2` pode sortear sobrancelhas, detalhes, padrões e acessórios novos. `v3` preserva ambas e adiciona composição semântica, contraste WCAG, distância OKLab, validação e reparo determinístico. Uma paleta também pode ser um array readonly de cores CSS.

As funções públicas incluem `composeAvatarColors`, `validateColorComposition`, `getRelativeLuminance`, `getContrastRatio`, `getColorDistance`, `isColorCollision` e utilitários para gradientes. Veja [a documentação completa](../../docs/COLOR_COMPOSITION.md).

[MIT](./LICENSE)
