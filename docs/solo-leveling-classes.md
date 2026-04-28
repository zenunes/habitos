# Sistema de Progressão e Classes (Job Change) - Solo Leveling

Para trazer a verdadeira essência do anime *Solo Leveling* para o nosso sistema de hábitos, a progressão de nível deixará de ser apenas um número. Conforme o jogador acumula XP, a curva de dificuldade aumenta (Ciclo de XP) e ele passa por **Mudanças de Classe** (Job Change), alterando seu título principal no Dashboard.

## 1. Escala de Classes (Ranks e Jobs)
Baseado na jornada de Sung Jin-Woo, o sistema de classes será dividido pelos marcos de nível:

| Nível | Classe / Rank | Descrição (Lore) |
| :--- | :--- | :--- |
| **Lv 1 ao 9** | Caçador Rank-E | O Mais Fraco da Humanidade. Foco em sobrevivência. |
| **Lv 10 ao 19** | Caçador Rank-D | Sobrevivente. Começando a se adaptar ao sistema. |
| **Lv 20 ao 29** | Caçador Rank-C | Caçador Experiente. |
| **Lv 30 ao 39** | Caçador Rank-B | Elite Inicial. |
| **Lv 40 ao 49** | Necromante | O Despertar. A primeira mudança de classe oficial. |
| **Lv 50 ao 69** | Caçador Rank-A | Caçador de Alto Nível. |
| **Lv 70 ao 89** | Monarca das Sombras | O domínio sobre as sombras começa. |
| **Lv 90 ao 99** | Caçador Rank-S | Nível Nacional. Uma força da natureza. |
| **Lv 100+** | Monarca Absoluto | O ápice do Sistema. |

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