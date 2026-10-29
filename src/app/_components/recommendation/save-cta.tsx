"use client";

import { Button, Card } from "@heroui/react";
import { LogIn, Sparkles } from "lucide-react";

interface SaveCtaProps {
  onSignIn: () => void;
}

/**
 * Convite exibido depois dos resultados para visitantes. O quiz continua
 * funcionando sem conta; o login serve para guardar o perfil e evitar
 * sugestões repetidas.
 */
export default function SaveCta({ onSignIn }: SaveCtaProps) {
  return (
    <Card
      className="border-accent/25 from-accent-soft/40 to-surface mt-10 overflow-hidden border bg-gradient-to-r p-5 sm:p-6"
      variant="transparent"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="bg-accent text-accent-foreground grid size-10 shrink-0 place-items-center rounded-full"
          >
            <Sparkles className="size-5" />
          </span>

          <div>
            <h2 className="text-foreground text-base font-semibold">
              Quer guardar este perfil?
            </h2>
            <p className="text-muted mt-1 max-w-xl text-sm leading-relaxed">
              Entre com o GitHub para salvar suas respostas e marcar filmes
              vistos. Assim as próximas recomendações não repetem o que você já
              conhece.
            </p>
          </div>
        </div>

        <Button
          className="shrink-0"
          onPress={onSignIn}
          size="md"
          variant="primary"
        >
          <LogIn aria-hidden="true" className="size-4" />
          Entrar e salvar
        </Button>
      </div>
    </Card>
  );
}
