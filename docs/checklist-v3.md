# Checklist de Melhorias - Solo Leveling (System V3)

Após uma análise completa do projeto, identifiquei diversas oportunidades de melhoria em Lógica, Interface (UI/UX) e Arquitetura do Código. Abaixo estão os itens documentados para a próxima fase do sistema:

## 1) Lógica do Sistema (Regras de Negócio)
- [x] **Lógica de Ofensiva (Streak) Real:** 
  - *Problema atual:* O sistema adiciona `+1` na ofensiva para *cada* missão completada, inflacionando o número. Além disso, não reseta quando o jogador perde um dia.
  - *Solução:* Adicionar a coluna `last_checkin_date` em `user_progress`. Se o último check-in for de hoje, a ofensiva não muda. Se for de ontem, soma `+1`. Se for mais antigo, a ofensiva reseta para `1`.
- [x] **Filtro de Dias Úteis no Servidor:**
  - *Problema atual:* Missões de "Dias Úteis" podem ser concluídas em finais de semana, e vice-versa.
  - *Solução:* O backend deve ocultar ou desabilitar missões de dias úteis quando for sábado ou domingo.
- [ ] **Sistema de Penalidade (HP / Fadiga):**
  - *Problema atual:* Não há consequência negativa por não completar missões (apenas não se ganha XP).
  - *Solução:* Implementar uma barra de Vida (HP) ou sistema de "Fadiga" que diminui se missões obrigatórias forem ignoradas no dia anterior.

## 2) Arquitetura de Código
- [x] **Componentização do Cabeçalho (Header Global):**
  - *Problema atual:* O cabeçalho com os links (Loja, Conquistas, Perfil, etc) está replicado idêntico em `/dashboard`, `/loja`, `/perfil`, `/conquistas` e `/habitos`.
  - *Solução:* Extrair para um componente `<SystemHeader />` reutilizável para aplicar o princípio DRY (Don't Repeat Yourself).
- [ ] **Tratamento de Fuso Horário (Timezones):**
  - *Problema atual:* A string `todayStr` usa a data ISO universal (`split("T")[0]`), o que pode gerar bugs se o usuário estiver de noite no Brasil e o servidor na Europa (já seria outro dia).
  - *Solução:* Usar uma biblioteca como `date-fns` ou garantir a conversão pelo `Intl.DateTimeFormat` local.

## 3) Interface e UX (Experiência do Usuário)
- [x] **Loading States (Skeletons):**
  - *Problema atual:* O Next.js SSR causa um "piscar" ou tela em branco durante o carregamento de dados pesados entre páginas.
  - *Solução:* Criar arquivos `loading.tsx` usando componentes de "Skeleton" (blocos que piscam simulando a interface) para navegação fluida.
- [x] **Barra de Navegação Mobile (Bottom Bar):**
  - *Problema atual:* No celular, o cabeçalho tem 5 botões quadrados empilhados, o que ocupa muito espaço útil da tela.
  - *Solução:* Transformar a navegação principal em uma "Bottom Bar" (barra fixada na base do celular) para telas pequenas, deixando o layout mais limpo.
- [ ] **Pop-up de Detalhes da Missão:**
  - *Problema atual:* A descrição longa de uma missão ocupa muito espaço no card.
  - *Solução:* Esconder a descrição e mostrá-la apenas quando o usuário clicar no card (um pop-up/modal ou collapse).

## 4) Próximas Features
- [ ] **Quests de Longo Prazo:** (Ex: Missões semanais, mensais ou épicas que dão recompensas enormes).
- [ ] **Inventário Avançado:** Permitir "Consumir" um item do inventário depois que ele for comprado na Loja.
- [ ] **Fluxo de Recuperação de Senha.**