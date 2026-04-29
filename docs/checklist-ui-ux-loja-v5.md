# Checklist UI/UX + Loja (V5)

## UI/UX (Geral)
- [ ] Progresso semanal com indicador visual (segmentos ou barra) no card semanal
- [ ] Estado “Meta batida na semana” com visual de concluído e sem CTA de check-in
- [ ] Estado “Concluída hoje” para diárias/dias úteis concluídas (sem confusão)
- [ ] Mensagens/toasts padronizadas para:
  - [ ] Quest diária
  - [ ] Quest semanal
  - [ ] Quest única
  - [ ] Inimigo (dano)
- [ ] Nomenclatura padronizada:
  - [ ] “Quest” vs “Missão”
  - [ ] “Ouro” vs “Gold”

## UI/UX (Mobile)
- [ ] Alvos de toque >= 44px para:
  - [ ] Chips/filtros
  - [ ] Botões principais (check-in, boss, comprar, salvar)
  - [ ] Setas de navegação (mês no perfil)
- [ ] Títulos longos com `line-clamp-2` e affordance de expansão
- [ ] Inputs com `inputMode` e `autoCapitalize` apropriados

## UI/UX (Polimento)
- [ ] Empty states com CTAs:
  - [ ] “Criar 1ª Quest”
  - [ ] “Importar modelo”
- [ ] Card de “Resumo semanal” no Dashboard
- [ ] Foco visível e contraste revisado em textos pequenos

## Loja (Itens Pré-prontos)
- [ ] Criar seed/insert de itens pré-prontos (script de migração ou admin-only)
- [ ] Definir custos (🪙) e descrições curtas
- [ ] Garantir que itens não concedem XP direto
- [ ] Implementar efeitos (se aplicável):
  - [ ] Cura 50 HP
  - [ ] Reanimação (1 uso)
  - [ ] Escudo Temporal (24h sem penalidade)
  - [ ] Buff Ouro 24h
  - [ ] Buff XP 24h
  - [ ] “Selo do Caçador” (cancelar 1 inimigo sem dano)
- [ ] Exibir categorias na loja (Consumíveis / Boosts / Cosméticos)

## Validação
- [ ] Testar no mobile (iPhone/Android) com 1 mão
- [ ] Testar fluxo completo:
  - [ ] Cadastro (Nome + Foco)
  - [ ] Criar quest semanal (3/semana)
  - [ ] Bater meta semanal e ver “Meta batida na semana”
  - [ ] Comprar item e validar desconto de ouro

