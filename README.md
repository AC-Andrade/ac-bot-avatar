# AC Bot Avatar

Avatares SVG modulares e determinísticos para React. O monorepo mantém separados os contratos de domínio, a geração, os assets e a camada de apresentação.

![AC Bot Avatar preview](./preview.png)

## Pacotes

| Pacote                            | Responsabilidade                                                  |
| --------------------------------- | ----------------------------------------------------------------- |
| `@acandrade/ac-bot-avatar-core`   | Tipos, catálogos readonly e contratos sem dependência de React    |
| `@acandrade/ac-bot-avatar-utils`  | Hash, cores e geração determinística versionada                   |
| `@acandrade/ac-bot-avatar-assets` | Componentes SVG, registros e imports profundos de compatibilidade |
| `@acandrade/ac-bot-avatar-react`  | Componentes React acessíveis e temas de composição                |

## Instalação

```bash
yarn add @acandrade/ac-bot-avatar-react react
```

## Uso

Para um avatar determinístico, use `seed`. `identifier` continua aceito na série 1.x para compatibilidade.

```tsx
import { HashedACBotAvatar } from "@acandrade/ac-bot-avatar-react";

export function UserAvatar() {
  return (
    <HashedACBotAvatar
      seed="user@example.com"
      size={96}
      title="Avatar de User"
    />
  );
}
```

Também é possível escolher cada parte explicitamente:

```tsx
import { ACBotAvatar } from "@acandrade/ac-bot-avatar-react";

<ACBotAvatar
  theme="robot"
  eye="sunglasses"
  mouth="smile"
  eyebrows="raised"
  accessory="stars"
  background
  backgroundType="gradientLinear"
  backgroundColors={["#312e81", "#0f766e"]}
  backgroundPattern="dots"
  size={128}
  aria-label="Robô sorridente"
/>;
```

`identifier={0}` e `identifier=""` são seeds válidas. Somente `null` ou `undefined` representam ausência de identificador. A geração 1.x usa `generationVersion="v1"` por padrão para preservar avatares existentes; os catálogos expandidos são opt-in com `generationVersion="v2"`. A composição inteligente e determinística de cores é opt-in com `generationVersion="v3"`.

```tsx
<HashedACBotAvatar
  seed="atlas-9823"
  theme="robot"
  generationVersion="v3"
  background
  backgroundType="gradientLinear"
/>
```

Sem `title`, `aria-label` ou `aria-labelledby`, o SVG é decorativo (`aria-hidden="true"`). O componente principal encaminha `ref`, eventos, `className`, atributos `data-*`, SVG e ARIA.

Os valores aceitos são expostos como constantes readonly pelo pacote `core`, incluindo `EYE_TYPES`, `MOUTH_TYPES`, `ACCESSORY_TYPES`, `PATTERN_TYPES` e `AVATAR_VARIANTS`.

O pacote React também exporta temas completos. Eles mudam a base visual, enquanto olhos, bocas, detalhes e acessórios continuam usando o mesmo compositor:

```tsx
import {
  ACBotAvatar,
  avatarThemes,
  HashedACBotAvatar,
} from "@acandrade/ac-bot-avatar-react";

<ACBotAvatar theme="robot" eye="normal" mouth="smile" size={128} />;
<ACBotAvatar
  theme={avatarThemes["face-minimal"]}
  eye="love"
  mouth="big_smile"
  eyeColor="#67e8f9"
  mouthColor="#f9a8d4"
  size={128}
/>;

<HashedACBotAvatar
  seed="apple"
  theme="fruit"
  themeVariant="strawberry"
  background
  backgroundType="solid"
  backgroundColors={["#fff7ed"]}
  eyeColor="#4fdcff"
  mouthColor="#ff8fab"
  size={128}
/>;
```

Fruit Bots possuem paleta canônica bloqueada: `color` não recolore a fruta. Somente `backgroundColors`, `eyeColor` e `mouthColor` alteram cores nesse tema. As 18 variantes são `apple`, `pear`, `banana`, `grape`, `orange`, `strawberry`, `pineapple`, `watermelon`, `lemon`, `mango`, `cherry`, `peach`, `kiwi`, `coconut`, `papaya`, `guava`, `passionfruit` e `acai`. Nomes em português como `maçã`, `uva`, `maracujá` e `açaí` também são reconhecidos.

Os temas robóticos mantêm uma área facial segura: olhos e boca preservam no mínimo 4% de margem nas quatro bordas do visor e 4% de separação vertical entre si. Esse é um limite comum, não um posicionamento único; frutas e variantes Capsule continuam usando escala e centro próprios para respeitar o formato de cada visor.

O nome pode ser usado diretamente (`theme="pixel"`) ou pelo registro (`theme={avatarThemes.pixel}`). Os estilos clássicos públicos agora são `robot`, com a carcaça completa, e `face-minimal`, somente com olhos, boca, detalhes e fundo. Os demais temas incluídos são `fruit`, `terminal`, `emoji`, `capsule`, `pixel`, `arcade` e `initial`. O nome legado `classic` continua aceito na série 1.x e permanece como fallback para preservar avatares existentes, mas não aparece em `BUILT_IN_AVATAR_THEME_IDS`. `capsule` oferece as bases `default | antenna | mohawk | satellite`, cada uma com encaixe facial próprio; `color` recolore o corpo preservando sombras e brilhos, enquanto `eyeColor` e `mouthColor` controlam o rosto. `pixel` usa uma matriz nítida, `arcade` usa um robô retrô canônico e `initial` combina expressão com monograma. O tema `arcade` não possui variantes de modelo. Em `initial`, `themeVariant` permite escolher `soft | poster | outline`.

```tsx
<HashedACBotAvatar seed="Ada Lovelace" theme="pixel" size={96} />;
<HashedACBotAvatar
  seed="Ada Lovelace"
  theme="capsule"
  themeVariant="satellite"
  color="#059669"
  eye="love"
  mouth="big_smile"
  eyeColor="#a7f3d0"
  mouthColor="#fde68a"
/>;
<HashedACBotAvatar
  seed="Ada Lovelace"
  theme="arcade"
  color="#2563eb"
  eyeColor="#67e8f9"
  mouthColor="#f9a8d4"
/>;
<HashedACBotAvatar seed="Ada Lovelace" theme="initial" monogram="A" />;
```

## Desenvolvimento

Requer Node.js 20+, npm 9+ e Yarn 1.22.22 para desenvolvimento. Os pacotes publicados mantêm compatibilidade de runtime com Node.js 18+.

```bash
yarn install --frozen-lockfile
yarn quality
yarn test:visual
```

`yarn quality` verifica formatação, lint, tipos, testes reais em todos os pacotes, build dual ESM/CommonJS, conteúdo dos tarballs e orçamento de tamanho. `yarn check:assets` confirma que os componentes gerados correspondem aos SVGs canônicos em `packages/assets/svgs`.

Consulte [DEVELOPMENT.md](./DEVELOPMENT.md), [a documentação técnica](./docs/README.md), [o Color Composition Engine](./docs/COLOR_COMPOSITION.md), [a migração planejada para 2.0](./docs/MIGRATION_V2.md) e [SECURITY.md](./SECURITY.md).

## Licença

[MIT](./LICENSE)
