"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, SearchX, UserRound } from "lucide-react";
import {
  Breadcrumbs,
  Button,
  SearchField,
  Skeleton,
  Spinner,
} from "@heroui/react";
import { api } from "@/trpc/react";
import type { PopularPerson } from "./person-types";
import { bindTMDBimage } from "@/utils/tmdb-images";
import {
  getInitials,
  getReleaseYear,
  translateDepartment,
} from "@/utils/tmdb-meta";

const SEARCH_DEBOUNCE_MS = 350;
const PEOPLE_GRID_CLASS =
  "mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 xl:grid-cols-6";

function getKnownFor(person: PopularPerson) {
  const item =
    person.known_for.find((known) => known.poster_path) ?? person.known_for[0];

  if (!item) return null;

  const title = item.title ?? item.name;

  if (!title) return null;

  return {
    title,
    year: getReleaseYear(item.release_date ?? item.first_air_date),
  };
}

function DirectoryCard({ person }: { person: PopularPerson }) {
  const imageURL = person.profile_path
    ? bindTMDBimage({ path: person.profile_path, quality: "w342" })
    : null;

  const knownFor = getKnownFor(person);
  const department = translateDepartment(person.known_for_department);

  return (
    <Link
      aria-label={`Ver perfil de ${person.name}${knownFor ? `, conhecido por ${knownFor.title}` : ""}`}
      className="group focus-visible:ring-accent focus-visible:ring-offset-background block rounded-2xl focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
      href={`/person/${person.id}`}
    >
      <div className="relative">
        <div className="border-separator bg-surface relative aspect-[2/3] w-full overflow-hidden rounded-2xl border shadow-sm transition-[transform,box-shadow,border-color] duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-black/10 motion-reduce:transform-none motion-reduce:transition-none">
          {imageURL ? (
            <Image
              alt={`Foto de ${person.name}`}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, (max-width: 1280px) 22vw, 15vw"
              src={imageURL}
            />
          ) : (
            <div className="from-surface-secondary via-surface to-background-secondary text-muted flex size-full flex-col items-center justify-center gap-2 bg-gradient-to-br">
              <UserRound aria-hidden="true" className="size-8" />
              <span className="text-sm font-semibold">
                {getInitials(person.name)}
              </span>
            </div>
          )}

          {department !== "Atuação" && (
            <span className="absolute top-2 left-2 inline-flex max-w-[calc(100%-1rem)] truncate rounded-full border border-white/10 bg-black/65 px-2 py-1 text-[10px] font-semibold tracking-wide text-white uppercase backdrop-blur-md">
              {department}
            </span>
          )}

          <div
            aria-hidden="true"
            className="ring-accent/0 group-hover:ring-accent/30 pointer-events-none absolute inset-0 rounded-2xl ring-1 transition-colors duration-300 ring-inset"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-2xl bg-gradient-to-t from-black/90 via-black/45 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white">
              Ver perfil
              <ArrowRight className="size-3.5" />
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 px-0.5">
        <h3 className="text-foreground group-hover:text-accent line-clamp-1 text-sm leading-snug font-semibold transition-colors">
          {person.name}
        </h3>
        <p className="text-muted mt-1 line-clamp-1 text-xs">
          {knownFor
            ? `${knownFor.title}${knownFor.year ? ` · ${knownFor.year}` : ""}`
            : department}
        </p>
      </div>
    </Link>
  );
}

function PeopleGrid({ people }: { people: PopularPerson[] }) {
  return (
    <div className={PEOPLE_GRID_CLASS}>
      {people.map((person) => (
        <DirectoryCard key={person.id} person={person} />
      ))}
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite" className={PEOPLE_GRID_CLASS}>
      <span className="sr-only">Buscando pessoas…</span>
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} aria-hidden="true">
          <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
          <Skeleton className="mt-3 h-4 w-3/4 rounded-full" />
          <Skeleton className="mt-2 h-3 w-1/2 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function PeopleDirectory({
  people,
}: {
  people: PopularPerson[];
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;

  useEffect(() => {
    if (!trimmedQuery) {
      setDebouncedQuery("");
      return;
    }

    const timeout = window.setTimeout(
      () => setDebouncedQuery(trimmedQuery),
      SEARCH_DEBOUNCE_MS,
    );

    return () => window.clearTimeout(timeout);
  }, [trimmedQuery]);

  const isDebouncing = hasQuery && trimmedQuery !== debouncedQuery;

  const search = api.tmdb.people.search.useInfiniteQuery(
    { query: debouncedQuery },
    {
      enabled: hasQuery && !isDebouncing,
      initialCursor: 1,
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
      retry: 1,
      staleTime: 60 * 1000,
    },
  );

  const searchResults = useMemo(() => {
    const results = search.data?.pages.flatMap((page) => page.results) ?? [];

    return Array.from(
      new Map(results.map((person) => [person.id, person])).values(),
    );
  }, [search.data]);

  const totalResults = search.data?.pages[0]?.total_results ?? 0;
  const isSearching = hasQuery && (isDebouncing || search.isPending);

  let resultsLabel = "Pessoas em alta no TMDB";

  if (hasQuery) {
    if (isSearching) {
      resultsLabel = "Buscando pessoas…";
    } else if (search.isError) {
      resultsLabel = "Busca indisponível";
    } else if (searchResults.length === 0) {
      resultsLabel = "Nenhum resultado";
    } else if (totalResults > searchResults.length) {
      resultsLabel = `${searchResults.length} de ${totalResults.toLocaleString(
        "pt-BR",
      )} pessoas`;
    } else {
      resultsLabel = `${searchResults.length} ${
        searchResults.length === 1 ? "pessoa encontrada" : "pessoas encontradas"
      }`;
    }
  }

  return (
    <>
      <section
        aria-labelledby="people-title"
        className="relative isolate overflow-hidden bg-neutral-950 text-white"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_78%_18%,rgba(245,197,24,0.18),transparent_55%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(10,10,10,0.85),transparent_60%)]"
        />

        <div className="mx-auto w-full max-w-7xl px-5 pt-24 pb-14 sm:px-8 sm:pt-28 sm:pb-16">
          <div className="inline-flex rounded-full border border-white/10 bg-black/35 px-3 py-1.5 backdrop-blur-md">
            <Breadcrumbs
              aria-label="Você está em"
              className="[&_[data-current]]:text-white/70 [&_a]:text-white/60 [&_a:hover]:text-white [&_svg]:text-white/25"
            >
              <Breadcrumbs.Item href="/">Início</Breadcrumbs.Item>
              <Breadcrumbs.Item>Pessoas</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>

          <p className="text-gold mt-8 flex items-center gap-2 text-[11px] font-semibold tracking-[0.28em] uppercase">
            <span aria-hidden="true" className="bg-gold/60 h-px w-6" />
            Diretório
          </p>

          <h1
            className="font-display mt-3 text-[clamp(3.4rem,9vw,7rem)] leading-[0.85] tracking-wide text-balance uppercase"
            id="people-title"
          >
            Pessoas
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-pretty text-white/70 sm:text-base">
            Elencos, diretores e equipes por trás dos filmes. Explore quem está
            em alta agora e descubra a trajetória de cada profissional.
          </p>
        </div>
      </section>

      <section
        aria-label="Diretório de pessoas"
        className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchField
            aria-label="Buscar pessoas por nome"
            className="w-full sm:max-w-sm"
            onChange={setQuery}
            value={query}
            variant="secondary"
          >
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input
                maxLength={100}
                placeholder="Buscar por nome"
              />
              {isSearching && (
                <Spinner aria-hidden="true" className="shrink-0" size="sm" />
              )}
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>

          <p aria-live="polite" className="text-muted text-sm">
            {resultsLabel}
          </p>
        </div>

        {!hasQuery ? (
          people.length > 0 ? (
            <PeopleGrid people={people} />
          ) : (
            <div className="border-separator bg-surface mt-10 rounded-3xl border border-dashed px-6 py-16 text-center">
              <UserRound
                aria-hidden="true"
                className="text-muted mx-auto size-8"
              />
              <h2 className="font-display text-foreground mt-4 text-3xl tracking-wide uppercase">
                Diretório indisponível
              </h2>
              <p className="text-muted mx-auto mt-2 max-w-sm text-sm leading-relaxed">
                Não foi possível carregar as pessoas agora. Verifique sua
                conexão e tente novamente em instantes.
              </p>
              <Button className="mt-6" onPress={() => window.location.reload()}>
                Tentar novamente
              </Button>
            </div>
          )
        ) : isSearching ? (
          <SearchResultsSkeleton />
        ) : search.isError ? (
          <div className="border-separator bg-surface mt-10 rounded-3xl border border-dashed px-6 py-16 text-center">
            <SearchX aria-hidden="true" className="text-muted mx-auto size-8" />
            <h2 className="font-display text-foreground mt-4 text-3xl tracking-wide uppercase">
              Busca indisponível
            </h2>
            <p className="text-muted mx-auto mt-2 max-w-sm text-sm leading-relaxed">
              Não foi possível buscar pessoas agora. Verifique sua conexão e
              tente novamente em instantes.
            </p>
            <Button className="mt-6" onPress={() => void search.refetch()}>
              Tentar novamente
            </Button>
          </div>
        ) : searchResults.length > 0 ? (
          <>
            <PeopleGrid people={searchResults} />

            {search.hasNextPage && (
              <div className="mt-10 flex justify-center">
                <Button
                  isDisabled={search.isFetchingNextPage}
                  onPress={() => void search.fetchNextPage()}
                  variant="secondary"
                >
                  {search.isFetchingNextPage ? "Carregando…" : "Carregar mais"}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="border-separator bg-surface mt-10 rounded-3xl border border-dashed px-6 py-16 text-center">
            <UserRound
              aria-hidden="true"
              className="text-muted mx-auto size-8"
            />
            <h2 className="font-display text-foreground mt-4 text-3xl tracking-wide uppercase">
              Ninguém por aqui
            </h2>
            <p className="text-muted mx-auto mt-2 max-w-sm text-sm leading-relaxed">
              Não encontramos ninguém para “{trimmedQuery}”. Tente outro nome ou
              revise a grafia.
            </p>
            <Button
              className="mt-6"
              onPress={() => setQuery("")}
              variant="tertiary"
            >
              Limpar busca
            </Button>
          </div>
        )}
      </section>
    </>
  );
}
