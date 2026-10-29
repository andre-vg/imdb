import type { Metadata } from "next";
import { Suspense } from "react";

import SignInCard from "@/app/_components/auth/sign-in-card";
import { Brand } from "@/app/_components/brand";

export const metadata: Metadata = {
  title: "Entrar",
  description:
    "Entre com e-mail e senha, GitHub ou Google para salvar seu perfil de recomendação e marcar filmes vistos.",
};

/**
 * Aceita apenas caminhos internos: começa com `/`, mas não é uma URL externa
 * (`//` ou protocolo) nem contém caracteres de escape de rota.
 */
function sanitizeNextPath(value: string | undefined): string {
  if (!value) return "/";

  const isInternal =
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("\\") &&
    !/^\/[^/]*:/.test(value);

  return isInternal ? value : "/";
}

interface LoginPageProps {
  searchParams: Promise<{ next?: string; erro?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next, erro } = await searchParams;
  const nextPath = sanitizeNextPath(next);

  return (
    <main
      className="bg-background relative isolate flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden px-5 py-16"
      id="conteudo"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-20%,rgba(245,197,24,0.16),transparent_55%)]"
      />

      <div className="flex w-full max-w-md flex-col items-center">
        <div className="mb-8 flex items-center gap-2.5">
          <Brand />
        </div>

        <Suspense
          fallback={
            <div
              aria-busy="true"
              className="border-separator bg-surface text-muted w-full max-w-md rounded-3xl border p-8 text-center text-sm"
            >
              Carregando…
            </div>
          }
        >
          {erro && (
            <p
              aria-live="polite"
              className="text-muted relative -top-3 w-full text-center text-xs"
            >
              O login não foi concluído. Se o problema persistir, confira se o
              provedor está acessível ou se as credenciais dele estão
              configuradas e tente novamente.
            </p>
          )}

          <SignInCard nextPath={nextPath} />
        </Suspense>
      </div>
    </main>
  );
}
