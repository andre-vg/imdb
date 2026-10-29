"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Minus, Plus, Star } from "lucide-react";
import { Button, Chip, Separator, Tabs } from "@heroui/react";
import { cn } from "@heroui/styles";
import MovieCard from "@/app/_components/movieCard";
import TmdbPoster from "@/app/_components/tmdb-poster";
import {
  getReleaseYear,
  translateDepartment,
  translateJob,
} from "@/utils/tmdb-meta";
import type { PersonDetails as PersonDetailsData } from "../person-types";

type CreditItem = PersonDetailsData["credits"]["cast"][number];

interface FilmographyItem {
  movie: CreditItem;
  role: string;
}

function getTimestamp(date: string | null | undefined) {
  if (!date) return Number.NEGATIVE_INFINITY;

  const timestamp = new Date(`${date}T00:00:00`).getTime();

  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
}

function byReleaseDesc(a: CreditItem, b: CreditItem) {
  return getTimestamp(b.release_date) - getTimestamp(a.release_date);
}

function dedupeById(items: CreditItem[]) {
  const byId = new Map<number, CreditItem>();

  for (const item of items) {
    if (!byId.has(item.id)) byId.set(item.id, item);
  }

  return [...byId.values()];
}

function buildCrewRows(crew: CreditItem[]) {
  const byMovie = new Map<number, { movie: CreditItem; jobs: string[] }>();

  for (const item of crew) {
    const job = item.job
      ? translateJob(item.job)
      : translateDepartment(item.department);

    const entry = byMovie.get(item.id);

    if (!entry) {
      byMovie.set(item.id, { movie: item, jobs: [job] });
    } else if (!entry.jobs.includes(job)) {
      entry.jobs.push(job);
    }
  }

  return [...byMovie.values()].sort((a, b) => byReleaseDesc(a.movie, b.movie));
}

function getCastRole(movie: CreditItem) {
  const character = movie.character?.trim();

  return character && character.length > 0 ? character : "Participação";
}

function CreditRow({ movie, role }: FilmographyItem) {
  const year = getReleaseYear(movie.release_date);

  return (
    <Link
      aria-label={`${movie.title}${year ? ` (${year})` : ""} — ${role}${
        movie.vote_average > 0
          ? `, nota ${movie.vote_average.toFixed(1)} de 10`
          : ""
      }`}
      className="group hover:bg-default-soft focus-visible:ring-accent focus-visible:ring-offset-background flex items-center gap-3 rounded-xl p-1.5 no-underline transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      href={`/movie/${movie.id}`}
    >
      <TmdbPoster
        className="border-separator/60 h-16 w-11 shrink-0 rounded-lg border"
        path={movie.poster_path}
        quality="w185"
        showFallbackLabel={false}
        sizes="44px"
        title={movie.title}
      />

      <div className="min-w-0 flex-1 py-0.5">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <h3 className="text-foreground group-hover:text-accent truncate text-sm font-semibold transition-colors">
            {movie.title}
          </h3>
          {year && <span className="text-muted text-xs">{year}</span>}
        </div>
        <p className="text-muted mt-0.5 line-clamp-1 text-xs">{role}</p>
      </div>

      {movie.vote_average > 0 && (
        <span
          aria-hidden="true"
          className="text-muted hidden shrink-0 items-center gap-1 text-xs tabular-nums sm:inline-flex"
        >
          <Star className="fill-gold text-gold size-3" />
          {movie.vote_average.toFixed(1)}
        </span>
      )}
    </Link>
  );
}

function CreditList({ items }: { items: FilmographyItem[] }) {
  return (
    <ul className="grid gap-x-6 gap-y-0.5 md:grid-cols-2">
      {items.map((item) => (
        <li key={`${item.movie.id}-${item.role}`}>
          <CreditRow movie={item.movie} role={item.role} />
        </li>
      ))}
    </ul>
  );
}

function SectionHeading({
  eyebrow,
  id,
  title,
}: {
  eyebrow: string;
  id: string;
  title: string;
}) {
  return (
    <div className="flex items-end gap-4">
      <div>
        <p className="text-accent text-[11px] font-semibold tracking-[0.28em] uppercase">
          {eyebrow}
        </p>
        <h2
          id={id}
          className="font-display mt-1 text-4xl tracking-wide uppercase"
        >
          {title}
        </h2>
      </div>
      <Separator className="mb-2 hidden flex-1 sm:block" />
    </div>
  );
}

export default function PersonDetails({
  person,
}: {
  person: PersonDetailsData;
}) {
  const [isBiographyExpanded, setIsBiographyExpanded] = useState(false);

  const castRows = useMemo(
    () => dedupeById(person.credits.cast).sort(byReleaseDesc),
    [person.credits.cast],
  );

  const crewRows = useMemo(
    () => buildCrewRows(person.credits.crew),
    [person.credits.crew],
  );

  const knownFor = useMemo(
    () =>
      dedupeById([...person.credits.cast, ...person.credits.crew])
        .filter((movie) => Boolean(movie.poster_path))
        .sort((a, b) => b.vote_count - a.vote_count)
        .slice(0, 6),
    [person.credits.cast, person.credits.crew],
  );

  const biography = person.biography.trim();
  const canExpandBiography = biography.length > 480;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-10 pb-20 sm:px-8 sm:pt-14">
      <section aria-labelledby="biography-title">
        <SectionHeading
          eyebrow="Sobre"
          id="biography-title"
          title="Biografia"
        />

        <div className="mt-6 max-w-3xl">
          {biography ? (
            <>
              <p
                className={cn(
                  "text-foreground/80 text-sm leading-relaxed text-pretty whitespace-pre-line sm:text-base",
                  canExpandBiography &&
                    !isBiographyExpanded &&
                    "line-clamp-4 sm:line-clamp-5",
                )}
              >
                {biography}
              </p>

              {canExpandBiography && (
                <Button
                  className="mt-4 gap-2"
                  onPress={() =>
                    setIsBiographyExpanded((expanded) => !expanded)
                  }
                  size="sm"
                  variant="tertiary"
                >
                  {isBiographyExpanded ? (
                    <Minus aria-hidden="true" className="size-4" />
                  ) : (
                    <Plus aria-hidden="true" className="size-4" />
                  )}
                  {isBiographyExpanded
                    ? "Mostrar menos"
                    : "Ler biografia completa"}
                </Button>
              )}
            </>
          ) : (
            <p className="text-muted text-sm leading-relaxed">
              Ainda não há uma biografia disponível para {person.name}.
            </p>
          )}

          {person.also_known_as.length > 0 && (
            <div className="mt-6">
              <p className="text-muted text-[11px] font-semibold tracking-[0.2em] uppercase">
                Também conhecido como
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {person.also_known_as.map((name) => (
                  <Chip key={name} size="sm" variant="soft">
                    {name}
                  </Chip>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {knownFor.length > 0 && (
        <section aria-labelledby="known-for-title" className="mt-16 sm:mt-20">
          <SectionHeading
            eyebrow="Marcantes"
            id="known-for-title"
            title="Conhecido por"
          />

          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-6">
            {knownFor.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="filmography-title" className="mt-16 sm:mt-20">
        <SectionHeading
          eyebrow="Trajetória"
          id="filmography-title"
          title="Filmografia"
        />

        {castRows.length === 0 && crewRows.length === 0 ? (
          <p className="text-muted mt-6 text-sm leading-relaxed">
            Nenhum trabalho de {person.name} foi registrado no TMDB até agora.
          </p>
        ) : (
          <Tabs
            className="mt-8"
            defaultSelectedKey="atuacao"
            variant="secondary"
          >
            <Tabs.ListContainer>
              <Tabs.List
                aria-label="Seções da filmografia"
                className="w-max min-w-0"
              >
                <Tabs.Tab
                  className="h-9 w-auto px-5 whitespace-nowrap"
                  id="atuacao"
                >
                  Atuação
                  <span className="text-muted ml-1.5 text-xs tabular-nums">
                    {castRows.length}
                  </span>
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab
                  className="h-9 w-auto px-5 whitespace-nowrap"
                  id="equipe"
                >
                  Equipe
                  <span className="text-muted ml-1.5 text-xs tabular-nums">
                    {crewRows.length}
                  </span>
                  <Tabs.Indicator />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>

            <Tabs.Panel className="p-0 pt-5" id="atuacao">
              {castRows.length > 0 ? (
                <CreditList
                  items={castRows.map((movie) => ({
                    movie,
                    role: getCastRole(movie),
                  }))}
                />
              ) : (
                <p className="text-muted text-sm">
                  Nenhum crédito de atuação registrado.
                </p>
              )}
            </Tabs.Panel>

            <Tabs.Panel className="p-0 pt-5" id="equipe">
              {crewRows.length > 0 ? (
                <CreditList
                  items={crewRows.map(({ movie, jobs }) => {
                    const role = jobs.filter(Boolean).join(" · ");

                    return {
                      movie,
                      role:
                        role.length > 0
                          ? role
                          : translateDepartment(movie.department),
                    };
                  })}
                />
              ) : (
                <p className="text-muted text-sm">
                  Nenhum crédito de equipe registrado.
                </p>
              )}
            </Tabs.Panel>
          </Tabs>
        )}
      </section>
    </div>
  );
}
