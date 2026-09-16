# Migração planejada: 1.x → 2.0

A série 1.x já expõe os contratos novos sem remover a API anterior. A 2.0 concluirá a separação estrutural abaixo.

| 1.x                              | 2.0                            | Ação                                                 |
| -------------------------------- | ------------------------------ | ---------------------------------------------------- |
| `identifier="user"`              | `seed="user"`                  | Renomear a prop; strings e números continuam aceitos |
| `gender="female"`                | `palette="warm"`               | Trocar o alias por uma paleta explícita              |
| `gender="male"`                  | `palette="cool"`               | Trocar o alias por uma paleta explícita              |
| geração implícita v1             | `generationVersion` persistida | Salvar a versão junto ao seed                        |
| props React importadas de `core` | props importadas de `react`    | Atualizar imports de tipos                           |
| reexports indiretos              | imports diretos de cada pacote | Declarar a dependência usada                         |

## Antes

```tsx
<HashedACBotAvatar identifier={user.id} gender="female" />
```

## Compatível com 1.x e preparado para 2.0

```tsx
<HashedACBotAvatar seed={user.id} palette="warm" generationVersion="v1" />
```

## Temas

O tema clássico continua como padrão. As famílias `fruit`, `terminal`, `emoji` e `capsule` já são temas nativos e reutilizam os mesmos registros faciais sem alterar a geração clássica.

```tsx
import {
  avatarThemes,
  HashedACBotAvatar,
} from "@acandrade/ac-bot-avatar-react";

<HashedACBotAvatar seed="berry" theme={avatarThemes.fruit} />;
```

Temas externos continuam podendo implementar `AvatarTheme`. A prop interna `themeSeed` é encaminhada automaticamente por `HashedACBotAvatar` para bases com variação determinística de silhueta.

Na 2.0, `seed` será obrigatório no componente determinístico, `identifier` e `gender` serão removidos e os tipos React não serão reexportados por `core`.
