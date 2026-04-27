# Habitos Game

Sistema web de habitos com gamificacao para adultos ocupados.

## Stack MVP

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (Auth + PostgreSQL + RLS)

## Getting Started

1. Crie um arquivo `.env.local` com base no `.env.example`.
   Preencha obrigatoriamente `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY`.
2. Instale as dependencias:

```bash
npm install
```

3. Rode o projeto:

```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000).

## Documentacao

- Visao do produto: `docs/visao-produto.md`
- Arquitetura do MVP: `docs/arquitetura-mvp.md`
- Checklist de execucao: `docs/checklist-mvp.md`

## Rotas iniciais

- `/` Home de apresentacao
- `/login` Acesso e cadastro
- `/dashboard` Visao de progresso e gamificacao
- `/habitos` Lista inicial de habitos

## Banco e RLS

- Migracao inicial: `supabase/migrations/0001_initial_schema.sql`
- Inclui tabelas de habitos, progresso, quests, badges e recompensas
- Inclui policies de RLS por `auth.uid()` para isolamento por usuario

## Proximos passos tecnicos

- Implementar check-in diario com idempotencia
- Persistir XP, nivel e streak
- Integrar quests/badges/recompensas no fluxo real
