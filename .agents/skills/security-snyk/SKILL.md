---
name: security-snyk
description: Segurança desde o início (Security At Inception). Força a análise de código com Snyk antes de concluir novas implementações.
---

# Snyk Security At Inception

Sempre que adicionar dependências novas ou criar lógicas de componentes principais, você deve:
1. Executar testes de segurança utilizando o Snyk (ex: `npx snyk code test` ou `snyk test`).
2. Caso o Snyk aponte vulnerabilidades, elas devem ser analisadas e corrigidas imediatamente.
3. Se o Snyk retornar erro de autenticação (`SNYK-0005`), informe o usuário para rodar `snyk auth` no terminal.
4. Nenhuma PR ou feature complexa deve ser finalizada sem essa verificação.
