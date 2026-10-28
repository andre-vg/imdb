"use client";

import { Button, Card, Chip, Disclosure, Separator } from "@heroui/react";
import { format } from "date-fns";
import type { AppRouter } from "@/server/api/root";
import type { inferProcedureOutput } from "@trpc/server";
import PersonCard from "@/app/_components/personCard";
import { Plus } from "lucide-react";
import { useState } from "react";

type MovieDetails = inferProcedureOutput<AppRouter["tmdb"]["movie"]["getById"]>;
type CreditDetails = inferProcedureOutput<
  AppRouter["tmdb"]["movie"]["getCreditsById"]
>;


const formatCurrency = (value: number) =>
  value > 0
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
        notation: "compact",
      }).format(value)
    : "—";

export default function Details({
  movie,
  credits,
}: {
  movie: MovieDetails;
  credits: CreditDetails;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="mx-auto max-w-6xl px-6 pt-4 pb-16">
      <div className="flex items-center gap-4">
        <h2 className="text-foreground text-xl font-bold tracking-tight">
          Detalhes
        </h2>
        <Separator className="flex-1" />
      </div>

      <div className="mt-6 space-y-4">
        <h3>Elenco principal</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {credits.cast.slice(0, 10).map((person) => (
            <PersonCard person={person} key={person.id} />
          ))}
        </div>
        <Disclosure isExpanded={isExpanded} onExpandedChange={setIsExpanded}>
          <Disclosure.Heading>
            <Button slot="trigger" variant="secondary">
              <Plus />
              Ver Mais
              <Disclosure.Indicator />
            </Button>
          </Disclosure.Heading>
          <Disclosure.Content>
            <Disclosure.Body className="shadow-panel bg-surface flex flex-col items-center rounded-3xl p-4 text-center">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:grid-cols-8">
                {credits.cast.slice(10, 99999).map((person) => (
                  <PersonCard person={person} key={person.id} />
                ))}
              </div>
            </Disclosure.Body>
          </Disclosure.Content>
        </Disclosure>
      </div>

      {movie.production_companies.length > 0 && (
        <div className="mt-8">
          <h3 className="text-muted text-sm font-semibold tracking-wider uppercase">
            Produção
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {movie.production_companies.map((company) => (
              <Chip key={company.id} size="sm" variant="tertiary">
                {company.name}
              </Chip>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
