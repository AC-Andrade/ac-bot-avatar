# Color Composition Engine

O Color Composition Engine é a geração de cores opt-in de
`generationVersion="v3"`. As gerações `v1` e `v2` não passam pelo engine e
mantêm a sequência de PRNG, os catálogos e as cores legadas.

## Fluxo

```text
seed
  → configuração estrutural determinística
  → perfil da família e variante
  → paleta semântica
  → composição inicial de todas as partes
  → validação de contraste, distância e identidade
  → reparos determinísticos por prioridade
  → ColorCompositionResult
  → SVG React
```

O resultado de cor é calculado uma vez pelo `HashedACBotAvatar` e encaminhado
ao renderizador. O re-render e qualquer rasterização posterior do SVG usam a
mesma composição; o repositório não possui um segundo gerador para PNG, JPEG,
WebP ou AVIF.

## Métricas

O pacote `@acandrade/ac-bot-avatar-utils` exporta:

- `getRelativeLuminance`, conforme a luminância relativa WCAG;
- `getContrastRatio`, na escala 1:1 a 21:1;
- `getColorDistance`, com distância euclidiana em OKLab;
- `isTooSimilar`, `isColorCollision` e `hasEnoughContrast`;
- `sampleGradientColors` e `getWorstGradientContrast`.

Os limites padrão são configuráveis por `ColorCompositionInput.thresholds`:

| Nível      | Contraste padrão | Uso                                      |
| ---------- | ---------------- | ---------------------------------------- |
| Critical   | 4.5              | olhos, boca e silhueta contra o fundo    |
| Secondary  | 3.0              | visor/corpo, sobrancelha e acessórios    |
| Decorative | 2.25             | detalhes e adornos maiores               |
| Similarity | 8.0 em OKLab     | colisão perceptual entre partes próximas |

Gradientes são amostrados em todos os segmentos, inclusive pontos
intermediários. O modo `glass` avalia a base e os blobs após composição alfa.
No modo `transparent`, não existe amostra de fundo nem regra de contraste
contra uma cor fictícia.

## Paletas e identidade

As paletas semânticas `cyan`, `purple`, `blue`, `green`, `orange`, `red`,
`yellow`, `pink` e `neutral` contêm `primary`, `secondary`, `accent`, `dark`,
`light`, `background` e `contrastText`.

| Família      | Regra principal                                                |
| ------------ | -------------------------------------------------------------- |
| robot        | cyan/azul/neutro, carcaça legível sobre visor navy             |
| face-minimal | traços críticos contra toda a superfície de fundo              |
| terminal     | verdes de terminal preservados sobre visor quase preto         |
| capsule      | família roxa; visor canônico fixo por variante                 |
| fruit        | cor natural bloqueada por fruta; fundo e rosto são reparáveis  |
| emoji        | amarelo/laranja com traços faciais de alto contraste           |
| pixel        | verde/cyan, frame escuro e desenho `crispEdges`                |
| arcade       | vermelho/laranja retrô e visor azul canônico                   |
| neko         | roxo/pink com visor escuro                                     |
| square       | azul/cyan; olhos e boca contrastam diretamente com a cabeça    |
| initial      | paleta tipográfica ampla; monograma e expressão usam o feature |

As 18 cores de Fruit Bot são invariantes. Se uma composição de fruta colidir,
o engine altera primeiro o fundo e as partes secundárias; nunca a fruta.

## Validação e reparo

`validateColorComposition` retorna score de 0 a 100 e issues estruturadas com
papéis, importância, valor medido e mínimo exigido. O resultado passa quando
tem score mínimo 75 e nenhuma falha crítica.

Uma composição inválida é reparada nesta ordem:

1. fundo sólido, stops do gradiente ou superfícies de vidro;
2. corpo secundário;
3. acessório;
4. detalhe e sobrancelha;
5. olhos;
6. boca;
7. cor principal, somente quando não é semanticamente bloqueada;
8. estabilização conjunta de corpo, fundo e face para resolver mínimos locais.

Cada lista de candidatos é ordenada por um PRNG Mulberry32 derivado da seed e
da categoria. Não há `Math.random`, relógio ou estado global. A mesma seed e as
mesmas opções sempre retornam o mesmo objeto.

## Uso

```tsx
<HashedACBotAvatar
  seed="atlas-9823"
  theme="robot"
  generationVersion="v3"
  background
  backgroundType="gradientLinear"
/>
```

Cores explícitas em `HashedACBotAvatar` v3 são preferências de entrada e podem
ser reparadas quando causam colisão. Para controle literal, sem composição,
use `ACBotAvatar` diretamente ou mantenha `generationVersion="v1" | "v2"`.

Também é possível usar o engine sem React:

```ts
import {
  composeAvatarColors,
  validateColorComposition,
} from "@acandrade/ac-bot-avatar-utils";

const result = composeAvatarColors("atlas-9823", {
  theme: "robot",
  background: true,
  backgroundType: "solid",
  hasMouth: true,
});

validateColorComposition(result.colors, {
  theme: "robot",
  background: true,
  backgroundType: result.backgroundType,
});
```

## Qualidade e auditoria

O Vitest cobre métricas, colisões, determinismo, transparência, gradientes,
cores semânticas de todas as frutas e 100 seeds por cada uma das 11 famílias.
A galeria Playwright acrescenta quatro composições v3 por família em 32, 64 e
128 px.

Para uma auditoria maior:

```bash
npm run build
npm run color:audit -- --seeds=1000
```

O argumento é a quantidade por família e nunca aceita menos de 100. O comando
relata aprovações sem reparo, reparos, falhas, score médio, papéis reparados,
média e p95 do tempo de composição; retorna código diferente de zero se houver
qualquer falha.
