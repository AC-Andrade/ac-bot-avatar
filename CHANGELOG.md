# Changelog

Todas as mudanças relevantes são documentadas neste arquivo, seguindo Keep a Changelog e Versionamento Semântico.

## [Unreleased]

### Added

- Builds ESM e CommonJS com exports explícitos, tipos e source maps.
- Testes reais em todos os pacotes, fixtures da geração 1.0.3 e regressão SSR.
- API React acessível com props SVG/ARIA, eventos, `className` e `ref`.
- Geração versionada, paletas, registro `AvatarTheme` e novos acessórios opt-in.
- Temas nativos `fruit`, `terminal`, `emoji` e `capsule`, todos reutilizando os registros faciais existentes.
- Estilos públicos `robot` e `face-minimal`, separando a carcaça completa do rosto clássico minimalista sem remover a compatibilidade com `classic`.
- Composições SVG originais `pixel`, `arcade` e `initial`, seleção de tema por nome, monogramas e variantes determinísticas onde aplicáveis.
- Tema `arcade` baseado no SVG canônico `robot-arcade`, com chassi, olhos e boca recoloríveis separadamente.
- Capsule Bots com quatro bases SVG canônicas (`default`, `antenna`, `mohawk` e `satellite`), corpo tonal recolorível e expressões combináveis.
- Fruit Bots com 18 silhuetas, paletas naturais bloqueadas, aliases em português e customização restrita ao fundo, olhos e boca.
- Prop pública `themeVariant` para selecionar explicitamente as 18 bases canônicas do Fruit Bot.
- Metadado `AvatarTheme.supportedOptions` para interfaces exibirem apenas controles que cada renderizador implementa visualmente.
- Pipeline determinístico de assets, galeria em três resoluções e orçamento de tamanho.
- CI de qualidade, smoke tests de tarballs, auditoria e publicação com proveniência.

### Changed

- `core` não depende mais de React; props específicas de UI vivem no pacote React.
- `seed` é a entrada recomendada; `identifier` e `gender` permanecem depreciados na série 1.x.
- Somente `null` e `undefined` representam ausência de identificador.
- Dependências internas usam faixas compatíveis coordenadas em vez de `*`.
- `HashedACBotAvatar` encaminha a seed ao tema para variações determinísticas da base visual.
- O tema Fruit Bot agora usa diretamente as 18 ilustrações SVG canônicas em vez das silhuetas provisórias.
- As frutas receberam cores mais luminosas e o rosto ganhou brilho ciano, sem liberar a alteração da paleta natural do corpo.
- O tema experimental `voxel` e suas variantes `antenna`, `dish` e `fin` foram substituídos pela base única `arcade`.
- O tema `capsule` provisório foi substituído pelas novas ilustrações canônicas, com seleção explícita ou determinística da base.

### Fixed

- IDs SVG agora são determinísticos durante SSR e hidratação.
- Registros dinâmicos possuem fallback consistente para valores desconhecidos.
- A transformação do rosto voltou à escala correta na base clássica e nos novos temas.
- Builds limpos não incluem artefatos, testes ou logs antigos nos tarballs.
- Folhas espelhadas dos Fruit Bots agora geram comandos `path` SVG válidos no navegador.
- Olhos, pupilas, bocas e línguas embutidos foram removidos das bases Fruit Bot; o rosto passou a ser totalmente combinável pelos registros públicos.
- Cada uma das 18 frutas agora possui escala e posicionamento facial próprios, com margem de segurança para olhos e boca dentro do formato do seu visor.
- Olhos e bocas dos temas robóticos agora ocupam zonas verticais separadas e respeitam uma área segura de 4% do visor nas quatro bordas, com ajustes próprios por silhueta.
- A expressão embutida no SVG Arcade é removida pelo gerador para evitar sobreposição com o compositor facial.
- As expressões e contornos faciais embutidos nos quatro SVGs Capsule são removidos pelo gerador; cada visor possui posicionamento independente para o novo rosto.
- Lockfile portátil e tarefas reais de lint, tipos e testes.

## [1.0.3] - 2026-02-20

### Changed

- Atualização da versão coordenada dos quatro pacotes e dos links oficiais do projeto.

## [1.0.0] - 2026-02-20

### Added

- Monorepo inicial com os pacotes `core`, `utils`, `assets` e `react`.
- Geração determinística por hash e componentes SVG modulares.
- Estrutura de desenvolvimento com Yarn Workspaces e Turborepo.
