# Documentação técnica

O fluxo de dados é unidirecional:

```text
seed → utils/generator → AvatarConfig → react/theme → assets SVG
```

- `core` define contratos e catálogos; não importa React.
- `utils` implementa hash, paletas e algoritmos versionados.
- `assets` fornece registros React e preserva imports profundos na série 1.x.
- `react` é o compositor, responsável por acessibilidade, tamanho, IDs SVG, refs e temas.

## Contrato de estabilidade

A saída de `generationVersion="v1"` é protegida por fixtures da versão 1.0.3. Novos itens não entram nesse sorteio. `v2` é um opt-in da série 1.x para validar o catálogo expandido. `v3` adiciona o [Color Composition Engine](./COLOR_COMPOSITION.md) sem alterar o PRNG ou a saída de v1/v2; a futura API 2.0 tornará `seed` obrigatório e removerá aliases depreciados.

## Composição inteligente de cores

`generationVersion="v3"` adiciona composição semântica, contraste WCAG,
distância OKLab e reparo determinístico. Veja
[COLOR_COMPOSITION.md](./COLOR_COMPOSITION.md) para a arquitetura, as regras
por tema e o comando de auditoria em massa.

## Qualidade publicável

O CI exige instalação congelada, assets sincronizados, Prettier, ESLint, TypeScript, Vitest, build limpo, Playwright, smoke tests ESM/CommonJS e orçamento de tarball. A galeria gerada cobre cada item em 32, 64 e 128 px.

Veja [COLOR_COMPOSITION.md](./COLOR_COMPOSITION.md) para contraste, paletas e auditoria, [DEVELOPMENT.md](../DEVELOPMENT.md) para comandos e [MIGRATION_V2.md](./MIGRATION_V2.md) para o contrato futuro.
