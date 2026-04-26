# Arquitetura MVP (Next.js + Supabase)

## Stack base
- Frontend + Backend BFF: Next.js (App Router) com TypeScript.
- Banco e auth: Supabase (PostgreSQL + Auth + RLS).
- Estilo UI: Tailwind CSS.
- Jobs agendados: Supabase Scheduled Functions ou cron seguro no backend.
- Observabilidade: logs estruturados e rastreio de erros (ex: Sentry).

## Principios de arquitetura
- Simples primeiro: entregar valor rapido com baixo acoplamento.
- Modulos pequenos: separar dominios (auth, habitos, progresso, quests, recompensas).
- Regras de negocio no backend: evitar regra critica no cliente.
- Seguranca por padrao: RLS ativo em todas as tabelas de usuario.

## Dominios e modulos
- Auth:
  - Cadastro, login, sessao, recuperacao.
- Habitos:
  - CRUD, recorrencia, estado ativo/pausado.
- Check-in:
  - Registro diario de conclusao com idempotencia.
- Progressao:
  - XP, nivel, streak, eventos de pontuacao.
- Quests e badges:
  - Regras semanais basicas e conceder conquistas.
- Recompensas:
  - Catalogo pessoal e resgate por pontos.

## Modelo de dados inicial
- `profiles` (id, nome, timezone, created_at).
- `habits` (id, user_id, titulo, descricao, frequencia, ativo, created_at).
- `habit_logs` (id, habit_id, user_id, data_ref, status, created_at).
- `xp_events` (id, user_id, origem, pontos, metadata, created_at).
- `user_progress` (user_id, xp_total, nivel, streak_atual, melhor_streak, updated_at).
- `quests` (id, tipo, titulo, regra, ativa, inicio, fim).
- `user_quests` (id, quest_id, user_id, status, progresso, concluida_em).
- `badges` (id, codigo, titulo, criterio).
- `user_badges` (id, badge_id, user_id, concedida_em).
- `rewards` (id, user_id, titulo, custo_pontos, ativa).
- `reward_redemptions` (id, reward_id, user_id, custo_pontos, resgatada_em).

## Fluxo principal (MVP)
1. Usuario faz login.
2. Cria habitos com recorrencia.
3. Faz check-in diario.
4. Sistema gera evento de XP e recalcula progresso.
5. Sistema atualiza streak.
6. Sistema valida quest e badge elegiveis.
7. Usuario acumula pontos e resgata recompensa pessoal.

## Seguranca
- RLS por `user_id` em todas as entidades de usuario.
- Service role key apenas no backend server-side.
- Validacao de entrada em todas as rotas.
- Rate limit em endpoints sensiveis (auth e check-in).
- Auditoria de eventos criticos (`xp_events`, redemptions).

## Escalabilidade e manutencao
- Separar camada de dominio da camada HTTP.
- Criar casos de uso curtos e reaproveitaveis.
- Evitar funcoes muito longas; quebrar por responsabilidade.
- Preparar feature flags para liberar mecanicas gradualmente.

## Ambientes
- Dev: dados locais/sandbox, logs verbosos.
- Test: base isolada, seeds de teste, suites automatizadas.
- Prod: secrets protegidos, monitoracao ativa e alertas.

## Roadmap tecnico (3 fases)
- Fase 1 (MVP base):
  - Auth, habitos, check-in, XP/nivel/streak.
- Fase 2 (engajamento):
  - Quests semanais, badges e notificacoes.
- Fase 3 (evolucao):
  - Loja de recompensas mais rica, insights e social leve.
