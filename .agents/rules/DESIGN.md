# Design System e Guidelines do Avatar

- **Estilo Visual**: Traços fortes ou definidos que sejam visíveis em tamanhos pequenos.
- **Renderização SVG**: Evitar viewBox super complexos; utilizar propriedades como `stroke-width` absolutas/proporcionais para não perder qualidade ao reduzir o tamanho.
- **Arquitetura Modular (DiceBear-like)**:
  - Cada peça (Face, Olhos, Acessórios) deve ser um componente isolado.
  - O sistema principal apenas combina essas partes baseando-se num _seed_ ou seleção.
- **Extensibilidade**: A estrutura deve permitir adicionar "robôs frutas" no futuro sem refatoração profunda.
