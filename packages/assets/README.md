# @acandrade/ac-bot-avatar-assets

Componentes SVG e registros visuais do AC Bot Avatar.

```bash
yarn add @acandrade/ac-bot-avatar-assets react
```

```tsx
import {
  eyes,
  mouths,
  accessories,
  patterns,
  fruits,
  capsules,
  RobotArcade,
} from "@acandrade/ac-bot-avatar-assets";

const Eye = eyes.normal;
<svg viewBox="0 0 3325 2563">
  <Eye style={{ color: "#38bdf8" }} />
</svg>;

const AppleWithoutFace = fruits.apple;
<svg viewBox="0 0 260 287.94">
  <AppleWithoutFace />
</svg>;

<svg viewBox="0 0 270 270" style={{ color: "#2563eb" }}>
  <RobotArcade />
</svg>;

const CapsuleAntenna = capsules.antenna;
<svg
  viewBox="0 0 1308 1308"
  style={{
    color: "#2563eb",
    "--ac-capsule-body": "#2563eb",
    "--ac-capsule-body-shade": "#172554",
    "--ac-capsule-body-highlight": "#93c5fd",
  }}
>
  <CapsuleAntenna />
</svg>;
```

Imports profundos são preservados temporariamente na série 1.x:

```tsx
import { NormalEye } from "@acandrade/ac-bot-avatar-assets/eyes/normal";
// O caminho histórico /dist/eyes/normal também continua resolvido em 1.x.
```

Os registros incluem `none` onde a ausência de uma parte é válida. O registro `fruits` expõe as 18 bases com visor, mas sem olhos ou boca embutidos, para que a expressão seja composta separadamente. O registro `capsules` oferece `default`, `antenna`, `mohawk` e `satellite`; o gerador remove a expressão original e converte a paleta do corpo nos canais CSS `--ac-capsule-body`, `--ac-capsule-body-shade` e `--ac-capsule-body-highlight`. `RobotArcade` segue o mesmo contrato: o rosto original é removido durante a geração e o vermelho do chassi passa a usar `currentColor`. Os SVGs canônicos vivem no repositório e os componentes gerados não mantêm IDs estáticos ou metadados do editor.

[MIT](./LICENSE)
