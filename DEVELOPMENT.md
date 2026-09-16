# Desenvolvimento

## Preparação

```bash
yarn install --frozen-lockfile
```

O projeto usa Yarn 1 Workspaces e Turborepo. TypeScript, ferramentas de teste e lint são dependências declaradas na raiz; nenhuma instalação global é necessária.

## Comandos

| Comando                | Finalidade                                                 |
| ---------------------- | ---------------------------------------------------------- |
| `yarn clean`           | Remove `dist` e estado incremental de todos os pacotes     |
| `yarn build`           | Faz build limpo em ESM, CommonJS, tipos e source maps      |
| `yarn typecheck`       | Verifica pacotes e arquivos de teste                       |
| `yarn lint`            | Executa ESLint para TypeScript e React                     |
| `yarn format:check`    | Confere Prettier sem alterar arquivos                      |
| `yarn test`            | Executa Vitest nos quatro pacotes                          |
| `yarn generate:assets` | Regenera componentes a partir dos SVGs canônicos           |
| `yarn check:assets`    | Falha se os arquivos gerados estiverem desatualizados      |
| `yarn gallery`         | Gera `docs/gallery/index.html` em 32, 64 e 128 px          |
| `yarn test:visual`     | Gera a galeria e executa a regressão visual com Playwright |
| `yarn pack:check`      | Valida e consome os quatro tarballs em ESM e CommonJS      |
| `yarn size:check`      | Bloqueia aumento superior a 10% da linha de base           |
| `yarn quality`         | Executa todos os checks publicáveis                        |

## Assets

Os SVGs em `packages/assets/svgs` são a fonte canônica versionada. O gerador único remove metadados, IDs estáticos e formas invisíveis, e atualiza componentes, índices e registros de forma determinística. Nas frutas, ele também garante que a base termine no visor escuro e não carregue olhos ou boca embutidos. Depois de alterar um SVG:

```bash
yarn generate:assets
yarn check:assets
```

Não edite manualmente os arquivos de olhos, bocas e frutas gerados; alterações manuais serão detectadas pelo check.

## Compatibilidade determinística

`generationVersion="v1"` congela o algoritmo publicado na 1.0.3. Mudanças em arrays, ordem de chamadas do PRNG ou paletas alteram avatares persistidos e exigem uma nova `generationVersion`. Novos assets podem ser selecionados explicitamente sem entrar no sorteio v1.

## Publicação

A publicação é acionada somente por uma tag `vX.Y.Z`. A versão da tag deve ser idêntica à versão dos quatro `package.json`. O workflow executa todos os checks e publica, nesta ordem:

1. `core`
2. `utils` e `assets`
3. `react`

Os tarballs são validados antes do `npm publish --provenance`. Não publique manualmente com `npm publish --workspaces`, pois isso não garante a ordem das dependências internas.
