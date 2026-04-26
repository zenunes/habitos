# Habitos Game

Sistema web de habitos com gamificacao para adultos ocupados.

## Stack MVP

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (Auth + PostgreSQL + RLS)

## Getting Started

1. Crie um arquivo `.env.local` com base no `.env.example`.
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
- `/dashboard` Visao de progresso e gamificacao
- `/habitos` Lista inicial de habitos

## Proximos passos tecnicos

- Integrar Supabase Auth e sessao
- Criar schema SQL inicial com RLS
- Implementar check-in diario com idempotencia
- Persistir XP, nivel e streak
