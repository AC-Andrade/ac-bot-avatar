---
name: vitest-runner
description: Orienta a execução e criação de testes isolados de componentes React usando Vitest.
---

# Testes React com Vitest

Este projeto utiliza Vitest para testes unitários e de integração.
Ao criar novos componentes ou refatorar lógica:
1. Sempre crie um arquivo equivalente `.test.tsx` ou `.spec.tsx` próximo ao arquivo original.
2. Mantenha os testes simples (KISS) garantindo que a renderização básica e as props funcionam.
3. Execute `yarn test` ou `npm run test` (passando o arquivo específico se necessário) para validar o comportamento.
4. Corrija imediatamente problemas de tipagem reportados pelo TypeScript nos testes.
