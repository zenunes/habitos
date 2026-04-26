import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-10 font-sans text-zinc-900">
      <main className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Habitos Game
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          Sistema de habitos com gamificacao
        </h1>
        <p className="mt-4 text-zinc-600">
          MVP focado em adultos ocupados: habitos, check-ins e progresso com
          XP, niveis, streaks, quests e recompensas pessoais.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/dashboard"
            className="rounded-xl bg-zinc-900 px-4 py-3 text-center font-medium text-white transition hover:bg-zinc-700"
          >
            Ir para Dashboard
          </Link>
          <Link
            href="/habitos"
            className="rounded-xl border border-zinc-300 px-4 py-3 text-center font-medium text-zinc-800 transition hover:bg-zinc-100"
          >
            Ir para Habitos
          </Link>
        </div>
      </main>
    </div>
  );
}
