"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { Building2, ExternalLink, Minus, Plus, Tv } from "lucide-react";
import {
  Avatar,
  Card,
  Chip,
  Disclosure,
  Link,
  Separator,
  Table,
  Tabs,
} from "@heroui/react";
import type { AppRouter } from "@/server/api/root";
import type { inferProcedureOutput } from "@trpc/server";
import PersonCard from "@/app/_components/personCard";
import { bindTMDBimage } from "@/utils/tmdb-images";
import {
  formatCurrency,
  formatReleaseDate,
  formatRuntime,
  formatVoteCount,
  getCountryName,
  getInitials,
  getLanguageName,
  translateMovieStatus,
} from "@/utils/tmdb-meta";

type MovieDetails = inferProcedureOutput<AppRouter["tmdb"]["movie"]["getById"]>;
type CreditDetails = inferProcedureOutput<
  AppRouter["tmdb"]["movie"]["getCreditsById"]
>;
type ProviderDetails = inferProcedureOutput<
  AppRouter["tmdb"]["movie"]["getProvidersById"]
>;
type CrewMember = CreditDetails["crew"][number];

const CREW_LABELS: Readonly<Record<string, string>> = {
  Director: "Direção",
  Screenplay: "Roteiro",
  Writer: "Roteiro",
  Story: "História",
  Novel: "Obra original",
  Producer: "Produção",
  "Executive Producer": "Produção executiva",
  "Director of Photography": "Fotografia",
  Editor: "Montagem",
  "Original Music Composer": "Trilha sonora",
  "Production Design": "Design de produção",
  "Costume Design": "Figurino",
  Casting: "Elenco",
};

const CREW_PRIORITY = Object.keys(CREW_LABELS);

function getKeyCrew(crew: CrewMember[]) {
  const priority = new Map(CREW_PRIORITY.map((job, index) => [job, index]));

  return crew
    .filter((person) => priority.has(person.job))
    .sort(
      (a, b) =>
        (priority.get(a.job) ?? CREW_PRIORITY.length) -
          (priority.get(b.job) ?? CREW_PRIORITY.length) ||
        a.name.localeCompare(b.name, "pt-BR"),
    )
    .filter(
      (person, index, list) =>
        list.findIndex((item) => item.id === person.id) === index,
    );
}

function CrewCard({ person }: { person: CrewMember }) {
  const imageURL = person.profile_path
    ? bindTMDBimage({ path: person.profile_path, quality: "w185" })
    : null;

  return (
    <Card
      variant="tertiary"
      className="flex-row items-center gap-3 rounded-2xl p-3"
    >
      <Avatar className="size-12 shrink-0" color="accent">
        {imageURL && (
          <Avatar.Image asChild alt={person.name} src={imageURL}>
            <Image
              width={185}
              height={185}
              alt={person.name}
              className="size-full object-cover"
              src={imageURL}
            />
          </Avatar.Image>
        )}
        <Avatar.Fallback className="text-sm">
          {getInitials(person.name)}
        </Avatar.Fallback>
      </Avatar>

      <div className="min-w-0">
        <p className="text-foreground truncate text-sm font-semibold">
          {person.name}
        </p>
        <p className="text-muted truncate text-xs">
          {CREW_LABELS[person.job] ?? person.job}
        </p>
      </div>
    </Card>
  );
}

export default function Details({
  movie,
  credits,
  providers,
}: {
  movie: MovieDetails;
  credits: CreditDetails;
  providers: ProviderDetails;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const keyCrew = getKeyCrew(credits.crew).slice(0, 18);

  const watchProviders = providers?.results.PT;
  const providerGroups = [
    { label: "Streaming", items: watchProviders?.flatrate ?? [] },
    { label: "Alugar", items: watchProviders?.rent ?? [] },
    { label: "Comprar", items: watchProviders?.buy ?? [] },
  ].filter((group) => group.items.length > 0);

  const technicalRows: { label: string; value: ReactNode }[] = [
    { label: "Título original", value: movie.original_title },
    {
      label: "Situação",
      value: (
        <Chip size="sm" variant="soft">
          {translateMovieStatus(movie.status)}
        </Chip>
      ),
    },
    {
      label: "Data de lançamento",
      value: formatReleaseDate(movie.release_date),
    },
    { label: "Duração", value: formatRuntime(movie.runtime) },
    {
      label: "Idioma original",
      value: getLanguageName(movie.original_language),
    },
    {
      label: "País de origem",
      value:
        movie.origin_country.length > 0
          ? movie.origin_country.map(getCountryName).join(", ")
          : "—",
    },
    { label: "Orçamento", value: formatCurrency(movie.budget) },
    { label: "Receita", value: formatCurrency(movie.revenue) },
    {
      label: "Avaliação",
      value: `${movie.vote_average.toFixed(1)}/10 · ${formatVoteCount(
        movie.vote_count,
      )} avaliações`,
    },
  ];

  return (
    <section
      aria-labelledby="details-title"
      className="mx-auto w-full max-w-6xl px-5 pt-10 pb-20 sm:px-8 sm:pt-14"
    >
      <div className="flex items-end gap-4">
        <div>
          <p className="text-accent text-[11px] font-semibold tracking-[0.28em] uppercase">
            Créditos e informações
          </p>
          <h2
            id="details-title"
            className="font-display mt-1 text-4xl tracking-wide uppercase"
          >
            Detalhes
          </h2>
        </div>
        <Separator className="mb-2 hidden flex-1 sm:block" />
      </div>

      <Tabs className="mt-8" defaultSelectedKey="elenco" variant="secondary">
        <Tabs.ListContainer>
          <Tabs.List
            aria-label="Seções de detalhes do filme"
            className="w-max min-w-0"
          >
            <Tabs.Tab className="h-9 w-auto px-5 whitespace-nowrap" id="elenco">
              Elenco
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab className="h-9 w-auto px-5 whitespace-nowrap" id="equipe">
              Equipe
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab className="h-9 w-auto px-5 whitespace-nowrap" id="ficha">
              Ficha técnica
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>

        <Tabs.Panel className="p-0 pt-6" id="elenco">
          {credits.cast.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {credits.cast.slice(0, 10).map((person) => (
                  <PersonCard
                    key={person.id}
                    id={person.id}
                    imagePath={person.profile_path}
                    name={person.name}
                    subtitle={person.character}
                  />
                ))}
              </div>

              {credits.cast.length > 10 && (
                <Disclosure
                  className="mt-8"
                  isExpanded={isExpanded}
                  onExpandedChange={setIsExpanded}
                >
                  <Disclosure.Heading className="flex justify-center">
                    <Disclosure.Trigger className="border-separator bg-surface hover:bg-default-soft focus-visible:ring-accent inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none">
                      {isExpanded ? (
                        <Minus aria-hidden="true" className="size-4" />
                      ) : (
                        <Plus aria-hidden="true" className="size-4" />
                      )}
                      {isExpanded ? "Mostrar menos" : "Ver elenco completo"}
                      <Disclosure.Indicator className="ms-1" />
                    </Disclosure.Trigger>
                  </Disclosure.Heading>

                  <Disclosure.Content>
                    <Disclosure.Body className="mt-6">
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        {credits.cast.slice(10, 40).map((person) => (
                          <PersonCard
                            key={person.id}
                            id={person.id}
                            imagePath={person.profile_path}
                            name={person.name}
                            subtitle={person.character}
                          />
                        ))}
                      </div>
                    </Disclosure.Body>
                  </Disclosure.Content>
                </Disclosure>
              )}
            </>
          ) : (
            <p className="text-muted text-sm">
              O elenco deste filme ainda não foi divulgado.
            </p>
          )}
        </Tabs.Panel>

        <Tabs.Panel className="p-0 pt-6" id="equipe">
          {keyCrew.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {keyCrew.map((person) => (
                <CrewCard key={`${person.id}-${person.job}`} person={person} />
              ))}
            </div>
          ) : (
            <p className="text-muted text-sm">
              Os créditos de equipe deste filme ainda não foram divulgados.
            </p>
          )}
        </Tabs.Panel>

        <Tabs.Panel className="p-0 pt-6" id="ficha">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <Table variant="primary">
              <Table.ScrollContainer>
                <Table.Content aria-label={`Ficha técnica de ${movie.title}`}>
                  <Table.Header>
                    <Table.Column isRowHeader className="text-foreground/70">
                      Informação
                    </Table.Column>
                    <Table.Column className="text-foreground/70">
                      Detalhe
                    </Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {technicalRows.map((row) => (
                      <Table.Row key={row.label} id={row.label}>
                        <Table.Cell className="text-muted align-top whitespace-nowrap">
                          {row.label}
                        </Table.Cell>
                        <Table.Cell>{row.value}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>

            <div className="flex flex-col gap-4">
              <Card variant="tertiary" className="rounded-2xl">
                <Card.Header>
                  <Card.Title className="flex items-center gap-2 text-base font-semibold">
                    <Tv aria-hidden="true" className="text-accent size-4" />
                    Onde assistir
                  </Card.Title>
                  <Card.Description>
                    Disponibilidade no Brasil, via TMDB.
                  </Card.Description>
                </Card.Header>

                <Card.Content className="mt-1">
                  {providerGroups.length > 0 ? (
                    <div className="space-y-3">
                      {providerGroups.map((group) => (
                        <div key={group.label}>
                          <p className="text-muted mb-1.5 text-[11px] font-semibold tracking-wider uppercase">
                            {group.label}
                          </p>
                          <div className="flex flex-col gap-1">
                            {group.items.map((provider) => (
                              <Link
                                key={`${group.label}-${provider.provider_id}`}
                                className="hover:bg-default-soft flex items-center gap-3 rounded-xl p-1.5 no-underline transition-colors"
                                href={watchProviders?.link ?? "#"}
                                rel="noreferrer"
                                target="_blank"
                              >
                                <Avatar className="size-8">
                                  <Avatar.Image
                                    alt={provider.provider_name}
                                    src={bindTMDBimage({
                                      path: provider.logo_path,
                                      quality: "w92",
                                    })}
                                  />
                                  <Avatar.Fallback className="text-[10px]">
                                    {getInitials(provider.provider_name)}
                                  </Avatar.Fallback>
                                </Avatar>
                                <span className="text-foreground text-sm font-medium">
                                  {provider.provider_name}
                                </span>
                                <ExternalLink
                                  aria-hidden="true"
                                  className="text-muted ml-auto size-3.5"
                                />
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted text-sm">
                      Nenhum serviço de streaming cadastrado no Brasil.
                    </p>
                  )}
                </Card.Content>
              </Card>

              {movie.production_companies.length > 0 && (
                <Card variant="tertiary" className="rounded-2xl">
                  <Card.Header>
                    <Card.Title className="flex items-center gap-2 text-base font-semibold">
                      <Building2
                        aria-hidden="true"
                        className="text-accent size-4"
                      />
                      Produção
                    </Card.Title>
                    <Card.Description>
                      Empresas responsáveis pelo filme.
                    </Card.Description>
                  </Card.Header>

                  <Card.Content className="mt-1 flex-row flex-wrap gap-2">
                    {movie.production_companies.map((company) => (
                      <Chip key={company.id} size="sm" variant="soft">
                        {company.name}
                      </Chip>
                    ))}
                  </Card.Content>
                </Card>
              )}
            </div>
          </div>
        </Tabs.Panel>
      </Tabs>
    </section>
  );
}
