# Guia de Desenvolvimento — ac-bot-avatar

Este guia explica como trabalhar no projeto e testar as bibliotecas localmente.

## Scripts Principais (Raiz)

O projeto usa **Turborepo** para gerenciar as tarefas em todos os pacotes simultaneamente.

- `yarn build`: Compila todos os pacotes.
- `yarn test`: Executa os testes de todos os pacotes.
- `yarn dev`: Inicia o modo watch em todos os pacotes.
- `yarn pack`: Gera os arquivos `.tgz` de todos os pacotes em suas respectivas pastas `dist`.

---

## Testando Pacotes Localmente

### 1. Método via Tarball (Recomendado para CI/CD)

Este método é o mais fiel ao que será publicado no NPM.

1.  **Gerar os pacotes**:

    ```bash
    yarn pack
    ```

    Isso criará arquivos `.tgz` dentro de `packages/*/`.

2.  **Instalar no projeto de teste**:
    No seu projeto externo, aponte para o arquivo gerado:
    ```bash
    yarn add ../caminho/para/ac-bot-avatar/packages/react/acandrade-ac-bot-avatar-react-1.0.0.tgz
    ```

### 2. Método via Yalc (Recomendado para Dev)

Para evitar problemas de links simbólicos e depêndencias duplicadas no React, use o [yalc](https://github.com/whitecolor/yalc).

1.  **Instalar yalc globalmente**:

    ```bash
    npm install -g yalc
    ```

2.  **Publicar localmente**:
    Você pode usar o Turbo para publicar todos com yalc (se configurar o script):

    ```bash
    # Manualmente em cada pasta relevante
    cd packages/react && yalc publish
    ```

3.  **Consumir**:
    No seu projeto de teste:
    ```bash
    yalc add @acandrade/ac-bot-avatar-react
    ```

---

## Estrutura do Projeto

- `packages/assets`: SVGs e recursos brutos.
- `packages/utils`: Lógica de cores, hash e geradores.
- `packages/core`: Tipagens e lógica central de dados.
- `packages/react`: Componentes prontos para uso em React.

## Publicação Oficial

A publicação ocorre automaticamente via GitHub Actions quando uma tag `v*` é enviada:

```bash
git tag v1.0.0
git push origin v1.0.0
```
