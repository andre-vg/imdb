import type { Metadata } from "next";

import RecommendationWizard from "@/app/_components/recommendation/recommendation-wizard";

export const metadata: Metadata = {
  title: "Recomendar",
  description:
    "Responda 6 perguntas sobre seu gosto e receba 5 filmes escolhidos para você.",
};

export default function RecommendPage() {
  return (
    <main id="conteudo">
      <section className="relative isolate overflow-hidden bg-neutral-950 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_-10%,rgba(245,197,24,0.22),transparent_50%)]"
        />
        <div
          aria-hidden="true"
          className="to-background absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-transparent"
        />

        <div className="mx-auto w-full max-w-7xl px-5 pt-20 pb-14 sm:px-8 sm:pt-28 sm:pb-16">
          <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.22em] text-white uppercase backdrop-blur-md">
            <span
              aria-hidden="true"
              className="bg-gold size-1.5 rounded-full"
            />
            Sem conta? Sem problema
          </p>

          <h1 className="animate-fade-up font-display mt-5 max-w-3xl text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.9] tracking-wide text-balance uppercase [animation-delay:80ms]">
            Seu próximo filme <span className="text-gold">favorito</span>
          </h1>

          <p className="animate-fade-up text-muted mt-5 max-w-xl text-base leading-relaxed text-white/75 [animation-delay:160ms]">
            Seis perguntas sobre o seu gosto e nós vamos ao catálogo buscar
            cinco filmes com a sua cara. Você pode responder sem entrar — o
            login só serve para guardar seu perfil e não repetir sugestões.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="quiz-title"
        className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8"
      >
        <h2 className="sr-only" id="quiz-title">
          Quiz de preferências
        </h2>

        <RecommendationWizard />
      </section>
    </main>
  );
}
