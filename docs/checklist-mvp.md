# Checklist de Melhorias - Solo Leveling (System V2)

## 1) Nova Arquitetura e Design System (RPG/Solo Leveling)
- [x] Atualizar nome do projeto e meta tags para "Solo Leveling".
- [x] Criar design system escuro e com neon azul em `globals.css` (Temática de "Sistema").
- [x] Refatorar Layout Principal (Fontes Rajdhani/Outfit, background temático).
- [x] Melhorar UI/UX da página de Login e Cadastro (Interface "System Initialization").
- [x] Página inicial (Landing Page) imersiva com efeitos de brilho e botões neon.

## 2) Perfil e Status do Jogador
- [x] Refatorar o Dashboard para exibir as estatísticas do jogador como um perfil de RPG.
- [x] Adicionar barra de progresso de XP interativa e moderna.
- [x] Exibir o nível, XP e streak com visual gamificado.
- [x] Página de Perfil (`/perfil`) para permitir que o usuário altere seu "Codinome".

## 3) Painel de Quests Diárias (Hábitos)
- [x] Refatorar CRUD de Hábitos com nomenclatura "Quests Diárias" (`/habitos`).
- [x] Checklist interativo com botão de conclusão gamificado (Check-in).
- [x] Lógica de Quests Diárias: Missões concluídas somem da lista de "pendentes" e vão para "Concluídas Hoje".
- [ ] Implementar Quests Semanais/Mensais (Módulo de Desafios Fixos).
- [ ] Adicionar filtro de dias úteis vs finais de semana para Quests Diárias.

## 4) Sistema de Conquistas e Recompensas
- [x] Loja de Recompensas (`/loja`) para cadastrar itens e comprar com XP (descontando `availablePoints`).
- [x] Sistema de Títulos e Conquistas (`/conquistas`) baseado no Nível e Ofensiva.
- [x] Avaliação dinâmica de conquistas no momento do check-in da quest.
- [ ] Animações de subida de nível ("Level Up!") e pop-ups de conquistas na tela.
- [ ] Inventário de itens comprados na Loja.

## 5) Qualidade e Polimento
- [x] Corrigir bugs de cache e conflitos de pacotes (`lucide-react`, `next`, `react 19`).
- [x] Aceitar campos vazios (descrição) ao criar missões.
- [ ] Garantir responsividade perfeita em todas as telas de celular.
- [ ] Adicionar Toast Notifications (notificações flutuantes) em vez de mensagens estáticas nos botões.
- [ ] Configurar recuperação de senha (fluxo de e-mail).
