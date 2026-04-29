# Backlog UI/UX + Loja (V5)

## Objetivo
Melhorar clareza, consistência visual e retenção no uso diário, reduzindo atrito em mobile e padronizando nomenclaturas do sistema.

## UI/UX (Prioridade Alta)
### 1) Progresso semanal mais “tátil”
- Adicionar um indicador visual de progresso no card semanal (ex: 3 segmentos preenchidos ou barra).
- Exibir também o texto “Semanal: X/Y” para leitura rápida.
- Estado final: “Meta batida na semana” com destaque e sem ação de check-in.

### 2) Estados de botão mais claros
- Quando a ação estiver indisponível:
  - Semanal: meta batida → botão desabilitado com label “Meta batida”
  - Diário/Útil: já concluído → “Concluída hoje”
  - Inimigo: manter “Receber dano” mas com confirmação opcional (toggle) para reduzir cliques acidentais

### 3) Consistência de nomenclatura (copy)
- Padronizar termos:
  - Usar “Quest” em toda UI (ou “Missão”), mas não misturar.
  - Usar “Ouro” (Gold) consistentemente, inclusive nos toasts.
- Padronizar mensagens pós check-in:
  - Conclusão padrão (XP + Ouro)
  - Conclusão semanal
  - Conclusão de tarefa única

## UI/UX (Mobile – Prioridade Alta)
### 4) Alvos de toque (44px)
- Garantir que botões e chips (filtros, setas do mês, botões no card) tenham altura mínima de 44px em mobile.
- Ajustar espaçamentos e alinhamentos para evitar “misclick”.

### 5) Texto longo e truncamento
- Adicionar `line-clamp-2` em títulos longos de quests.
- Adicionar affordance de expansão (tap) quando truncado.

### 6) Formulários (entrada no mobile)
- Inputs com `inputMode`/`autoCapitalize` adequados:
  - Email: `inputMode=email`, `autoCapitalize=none`
  - Nome/Foco/Título: `autoCapitalize=sentences`
- Placeholders mais curtos e objetivos.

## UI/UX (Polimento – Prioridade Média)
### 7) Empty states acionáveis
- Quando não houver quests:
  - CTA primário “Criar 1ª Quest”
  - CTA secundário “Importar modelo”

### 8) Resumo semanal no dashboard
- Card “Semana” (soma de progresso das semanais):
  - “X metas batidas / Y semanais ativas”
  - ou “X check-ins semanais nesta semana”

### 9) Acessibilidade
- Garantir foco visível (ring) em inputs e botões.
- Ajustar contraste do texto pequeno (labels 10px/12px).

## Loja: Itens Pré-prontos (Curadoria Inicial)
### Objetivo
Ter itens “plug-and-play” para usuários que não querem configurar uma loja do zero.

**Regras sugeridas**
- Itens de loja consomem Ouro.
- Itens não devem dar XP direto.
- Itens podem:
  - Recuperar HP
  - Congelar penalidades (férias)
  - Multiplicar recompensas (limitado e temporário)
  - Customizar a experiência (cosméticos)

### Lista sugerida (primeiro pack)
1. Poção de Cura (30 HP) — 50 🪙
2. Kit de Primeiros Socorros (50 HP) — 80 🪙
3. Reanimação (HP volta a 30 quando zerar; 1 uso) — 150 🪙
4. Escudo Temporal (sem dano por falha por 24h) — 300 🪙
5. Pergaminho de Disciplina (bônus +20% Ouro por 24h) — 120 🪙
6. Amuleto do Foco (bônus +20% XP por 24h) — 120 🪙
7. Selo do Caçador (remove 1 “inimigo” do dia sem dano; 1 uso) — 70 🪙
8. Ticket de Recompensa (cria 1 item custom extra na loja) — 40 🪙
9. Cosmético: Moldura do Perfil (raridade) — 200 🪙
10. Cosmético: Título dourado (raridade) — 250 🪙

