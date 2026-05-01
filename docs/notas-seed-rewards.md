# Notas de Seed (Rewards)

## Fonte da verdade
- A migration [0019_consolidate_seed_default_rewards.sql](file:///workspace/supabase/migrations/0019_consolidate_seed_default_rewards.sql) passa a ser a referência principal para a lista de recompensas padrão.

## Por que isso existe
- Migrations anteriores (ex: `0014`, `0015`, `0017`) redefiniam a função `seed_default_rewards` com listas diferentes, o que pode gerar comportamento inconsistente dependendo da ordem aplicada no banco.
- A 0019 fixa uma versão (`seed_default_rewards_v1`) e mantém um wrapper (`seed_default_rewards`) para compatibilidade.

