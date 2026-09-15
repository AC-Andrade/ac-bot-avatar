# @acandrade/ac-bot-avatar-react

Componentes React acessíveis para avatares SVG explícitos ou determinísticos.

```bash
yarn add @acandrade/ac-bot-avatar-react react
```

```tsx
import { ACBotAvatar, HashedACBotAvatar } from "@acandrade/ac-bot-avatar-react";

<HashedACBotAvatar
  seed="user@example.com"
  size={64}
  title="Avatar do usuário"
/>;

<ACBotAvatar
  theme="robot"
  eye="sunglasses"
  mouth="smile"
  accessory="stars"
  background
  backgroundPattern="dots"
  size={128}
  aria-label="Robô sorridente"
/>;

<ACBotAvatar
  theme="face-minimal"
  eye="love"
  mouth="big_smile"
  eyeColor="#67e8f9"
  mouthColor="#f9a8d4"
  background
  backgroundColors={["#111827"]}
  size={128}
/>;
```

Para gerar todas as cores como uma composição validada, habilite a v3:

```tsx
<HashedACBotAvatar
  seed="atlas-9823"
  theme="robot"
  generationVersion="v3"
  background
  backgroundType="gradientLinear"
  size={128}
/>
```

Na v3, cores explícitas são preferências e podem ser reparadas se ocultarem
uma parte. `v1` e `v2` continuam literais e compatíveis.
`backgroundType="transparent"` remove o fundo mesmo quando `background` está
habilitado.

Famílias visuais completas são temas do core React. A seed também varia deterministicamente a silhueta quando o tema oferece variações, como as 18 frutas de `fruit`.

```tsx
import {
  avatarThemes,
  HashedACBotAvatar,
} from "@acandrade/ac-bot-avatar-react";

<HashedACBotAvatar
  seed="pear"
  theme="fruit"
  themeVariant="pear"
  background
  backgroundColors={["#ecfeff"]}
  eyeColor="#38bdf8"
  mouthColor="#fb7185"
  backgroundType="solid"
  size={128}
/>;
```

Em `fruit`, cada variante mantém sua cor natural e luminosa mesmo que `color` seja informado. As únicas cores customizáveis são o fundo (`backgroundColors`), os olhos (`eyeColor`) e a boca (`mouthColor`); ambas as partes faciais preservam o efeito de brilho. O catálogo exportado `FRUIT_BOT_KINDS` contém `apple`, `pear`, `banana`, `grape`, `orange`, `strawberry`, `pineapple`, `watermelon`, `lemon`, `mango`, `cherry`, `peach`, `kiwi`, `coconut`, `papaya`, `guava`, `passionfruit` e `acai`.

Cada entrada de `FRUIT_BOT_KINDS` possui um layout facial independente, ajustado ao visor da ilustração correspondente. Assim, alterar o encaixe de uma fruta não reposiciona olhos ou boca nas demais.

Todos os temas robóticos seguem o mesmo contrato de segurança visual: margem mínima de 4% nas laterais, no topo e na base do visor, além de 4% de distância vertical entre olhos e boca. O contrato é validado em 32, 64 e 128 px, mas cada silhueta mantém seu próprio encaixe óptico.

Temas também podem ser selecionados pelo nome. `robot` fixa a carcaça completa do robô clássico; `face-minimal` mostra somente o rosto e não renderiza acessórios. O nome legado `classic` continua disponível na série 1.x com o comportamento anterior de `variant`, mas fica fora de `BUILT_IN_AVATAR_THEME_IDS`. `capsule` utiliza as bases canônicas `default`, `antenna`, `mohawk` e `satellite`, com encaixes faciais independentes. Sua propriedade `color` altera corpo, sombra e brilho de forma coordenada; `eye`, `mouth`, `eyeColor` e `mouthColor` permitem trocar e recolorir a expressão. As composições `pixel`, `arcade` e `initial` também possuem desenho SVG próprio e continuam determinísticas. `arcade` utiliza uma única base retrô, sem variantes de modelo.

```tsx
<HashedACBotAvatar seed="user@example.com" theme="pixel" />;
<HashedACBotAvatar
  seed="user@example.com"
  theme="capsule"
  themeVariant="mohawk"
  color="#dc2626"
  eye="love"
  mouth="smile"
  eyeColor="#ffffff"
  mouthColor="#fb7185"
/>;
<HashedACBotAvatar
  seed="user@example.com"
  theme="arcade"
  color="#7c3aed"
  eyeColor="#f0abfc"
  mouthColor="#5eead4"
/>;
<HashedACBotAvatar seed="user@example.com" theme="initial" monogram="U" />;
```

Na série 1.x, `identifier` é um alias depreciado de `seed`; zero e string vazia são válidos. `gender` também permanece como adaptador depreciado para `palette`. Sem nome acessível, o SVG é decorativo. Props SVG/ARIA, eventos, `className`, `style`, atributos `data-*` e `ref` são encaminhados ao elemento raiz.

O pacote exporta `avatarThemes`, os nove temas públicos individuais e os contratos `AvatarTheme` e `AvatarThemeRendererProps` para extensões. `AvatarTheme.supportedOptions` descreve os olhos, bocas, sobrancelhas, detalhes, acessórios e padrões que produzem resultados visuais distintos em cada renderizador. Em Fruit Bots, `themeVariant` aceita as 18 entradas de `FRUIT_BOT_KINDS`; em Capsule, as quatro entradas de `CAPSULE_BOT_KINDS`; em Initial Face, `soft`, `poster` ou `outline`; Arcade não declara variantes nem acessórios externos. Sem uma variante, os temas que oferecem alternativas continuam escolhendo uma de forma determinística pela seed.

[MIT](./LICENSE)
