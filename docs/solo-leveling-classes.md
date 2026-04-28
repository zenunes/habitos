# Sistema de Progressão e Classes - "O Caminho do Despertar"

Para manter a interface gamificada e imersiva sem copiar diretamente os animes, criei uma **Árvore de Progressão Original** focada no conceito de "Despertar" e domínio sobre a própria vida (hábitos). 

O jogador não é apenas um caçador de monstros; ele é um indivíduo comum que descobre um sistema que o permite reescrever sua própria realidade. Conforme ele prova sua consistência e domina seus hábitos, ele transcende a biologia normal.

## 1. Escala de Classes (Ranks Originais)
O sistema avalia a sincronia do usuário com seus hábitos. Cada mudança de classe representa uma quebra de limitação humana:

| Nível | Classe / Rank | Descrição (Lore) |
| :--- | :--- | :--- |
| **Lv 1 ao 9** | O Adormecido | A fase inicial. O sistema ainda é instável e o usuário é refém da procrastinação. |
| **Lv 10 ao 19** | O Desperto | O primeiro vislumbre de controle. Hábitos começam a se formar, mas a mente ainda hesita. |
| **Lv 20 ao 29** | Forjador de Rotinas | O usuário entende que motivação é falha e disciplina é a chave. A rotina se torna uma armadura. |
| **Lv 30 ao 39** | Arquitetos do Tempo | O tempo não é mais um inimigo. O usuário molda suas horas como um recurso tangível. |
| **Lv 40 ao 49** | Especialista (Job Change) | A primeira Grande Provação. O usuário se especializa na execução impecável de tarefas diárias. |
| **Lv 50 ao 69** | Mestre do Controle | Impulsos e distrações não têm mais poder. A execução de missões torna-se quase automática. |
| **Lv 70 ao 89** | O Transcendente | Limites físicos e mentais são superados diariamente. A fadiga é apenas um conceito. |
| **Lv 90 ao 99** | Arquiteto da Realidade | O usuário tem poder absoluto sobre o que faz, construindo o próprio destino sem falhas. |
| **Lv 100+** | A Anomalia (Apex) | Um erro no sistema. A perfeição e consistência encarnadas. |

## 2. Ciclo de XP (Curva de Progressão)
Atualmente, o nível é calculado de forma linear (Ex: Nível * 120 XP). Para o novo sistema, implementaremos uma curva de XP exponencial ou baseada em multiplicadores, onde os primeiros níveis são fáceis de passar, mas os níveis de "Mudança de Classe" exigem um esforço contínuo e diário muito maior.

Fórmula proposta: `XP Necessário = (Nível Atual ^ 1.5) * 100`

## 3. Checklist de Implementação

### Lógica (Backend)
- [ ] **Mapeamento de Classes:** Criar a função `getHunterClass(level: number)` no domínio de progressão (`progression.ts`).
- [ ] **Refatoração do XP:** Atualizar a função `calculateLevel(xpTotal)` para usar a nova curva de experiência (Ciclo de XP).
- [ ] **Detector de Job Change:** Adicionar lógica no `actions-checkin.ts` para detectar não apenas o *Level Up*, mas também o *Class Up* (Mudança de Classe), retornando um sinal especial para a interface.

### Interface (Frontend)
- [ ] **UI do Dashboard:** Adicionar a exibição da Classe atual (ex: "Necromante") abaixo ou ao lado do nome do Caçador no painel principal.
- [ ] **Animação de Job Change:** Criar um alerta épico (diferente do Level Up comum) quando o jogador mudar de classe, imitando a tela de sistema do anime ("Você cumpriu os requisitos da Quest de Mudança de Classe").
- [ ] **Página de Perfil:** Mostrar o emblema da classe atual e uma barra de progresso específica para a próxima mudança de classe.

---
*Arise.*