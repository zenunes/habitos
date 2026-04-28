import Link from "next/link";
import { LoginForm, SignupForm } from "@/app/login/auth-forms";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 py-10">
      <section className="grid w-full gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight">Entrar</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Acesse seu progresso diario de habitos.
          </p>
          <div className="mt-5">
            <LoginForm />
          </div>
        </article>

        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight">Criar conta</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Comece com um fluxo rapido e simples.
          </p>
          <div className="mt-5">
            <SignupForm />
          </div>
        </article>
      </section>

      <Link
        href="/"
        className="fixed top-4 left-4 rounded-lg border border-zinc-300 bg-white px-3 py-1 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
      >
        Voltar
      </Link>
    </main>
  );
}
