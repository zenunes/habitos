# Checklist V4

## 1) Banco de Dados (Supabase)
- Executar migrations:
  - `0012_add_profile_focus.sql`
  - `0013_add_weekly_habits.sql`
- Confirmar que `profiles` tem as colunas `name` e `focus`
- Confirmar que `habits` tem a coluna `target_per_week`

## 2) Login / Cadastro
- Login: inputs e botões com boa legibilidade no desktop e no mobile
- Cadastro:
  - Validar que Nome e Foco são obrigatórios
  - Validar que o cadastro cria `profiles.name` e `profiles.focus`

## 3) Perfil
- Editar perfil:
  - Atualizar Codinome
  - Atualizar Foco
  - Recarregar e confirmar persistência

## 4) Quests Semanais (X/semana)
- Criar quest com frequência “Semanal (X dias/semana)” e meta (ex: 3)
- No Dashboard:
  - Ver badge “Semanal: 0/3” no card da quest
  - Fazer check-in 1x no dia e ver “Semanal: 1/3”
  - Repetir até “Semanal: 3/3”
- Confirmar bloqueio:
  - Tentar fazer check-in extra após bater a meta e validar mensagem de bloqueio

## 5) Regressão
- Criar e completar:
  - Missão diária
  - Dias úteis
  - Tarefa única (some ao concluir)
  - Inimigo (dá dano)
- Confirmar que XP/Gold/streak continuam funcionando

