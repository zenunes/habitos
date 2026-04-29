# Atualizações V4

## Login e Cadastro
- A tela de login/cadastro foi reestilizada para manter o padrão visual do System (dark UI), aumentando contraste, legibilidade e consistência com o restante do app.
- O formulário de cadastro passou a solicitar:
  - Codinome (nome)
  - Foco inicial
- Esses dados são gravados em `public.profiles` automaticamente no momento do cadastro via `auth.users.raw_user_meta_data` (trigger `handle_new_user`).

## Perfil
- O perfil agora suporta o campo `focus` além do `name`.
- A tela `/perfil` permite atualizar o foco atual junto do codinome.

## Missões Semanais (X dias por semana)
- Foi adicionada uma nova frequência de missão: `weekly`.
- Ao criar uma quest semanal, o usuário define uma meta de `1–7` dias por semana (ex: “Correr 3 dias por semana”).
- A quest semanal aparece como pendente nos dias em que ainda não foi registrada, até atingir a meta semanal.
- Depois que a meta semanal é atingida, o sistema bloqueia novos check-ins para aquela quest na semana.

## Migrações
- `0012_add_profile_focus.sql`: adiciona `focus` em `profiles` e atualiza o trigger `handle_new_user` para usar `raw_user_meta_data`.
- `0013_add_weekly_habits.sql`: adiciona `target_per_week` e validação para `frequency='weekly'`.

