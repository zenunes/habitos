# Checklist de Execucao - Habitos Game

## 1) Descoberta e definicao
- [ ] Validar proposta de valor e diferenciais.
- [ ] Fechar requisitos do MVP (o que entra e o que fica fora).
- [ ] Definir metricas alvo (D1, D7, check-ins/semana).
- [ ] Definir regras iniciais de XP, nivel e streak.

## 2) Fundacao tecnica
- [ ] Criar app Next.js com TypeScript.
- [ ] Configurar Supabase (projeto, auth e banco).
- [ ] Definir schema inicial e migracoes.
- [ ] Ativar RLS e politicas por usuario.
- [ ] Configurar padrao de logs e tratamento de erro.
- [ ] Criar `.env.example` com todas as variaveis.

## 3) Modulo de autenticacao
- [x] Cadastro e login (base inicial com Supabase Auth).
- [x] Sessao persistente e logout (base inicial).
- [ ] Recuperacao de senha.
- [x] Guardas de rota para areas autenticadas (dashboard e habitos).

## 4) Modulo de habitos
- [ ] CRUD de habitos.
- [ ] Configurar recorrencia.
- [ ] Pausar e reativar habito.
- [ ] Listagem de habitos por dia.

## 5) Check-in e progressao
- [ ] Registrar conclusao diaria com idempotencia.
- [ ] Gerar `xp_events` por check-in valido.
- [ ] Recalcular nivel e streak.
- [ ] Exibir progresso no dashboard principal.

## 6) Gamificacao extra (MVP estendido)
- [ ] Quests semanais simples.
- [ ] Badges por consistencia.
- [ ] Loja de recompensas pessoais com resgate.

## 7) Qualidade, seguranca e operacao
- [ ] Cobrir casos criticos com testes.
- [ ] Revisar validacoes de entrada e permissao.
- [ ] Revisar rate limit em rotas sensiveis.
- [ ] Revisar seguranca de secrets e ambiente.
- [ ] Configurar monitoracao e alertas basicos.

## 8) Go-live
- [ ] Publicar ambiente de producao.
- [ ] Rodar checklist final de smoke test.
- [ ] Medir primeiras metricas por 7 dias.
- [ ] Priorizar backlog com base em dados reais.
