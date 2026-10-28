"use client";

import { format } from "date-fns";
import { CalendarDays, Clock, ExternalLink, Star } from "lucide-react";
import Image from "next/image";
import { cn, buttonVariants } from "@heroui/styles";
import { Chip, Link, Separator } from "@heroui/react";
import type { AppRouter } from "@/server/api/root";
import type { inferProcedureOutput } from "@trpc/server";
import { bindTMDBimage } from "@/utils/tmdb-images";

type MovieDetails = inferProcedureOutput<AppRouter["tmdb"]["movie"]["getById"]>;
type ProviderDetails = inferProcedureOutput<
  AppRouter["tmdb"]["movie"]["getProvidersById"]
>;

export default function Banner({
  movie,
  providers,
}: {
  movie: MovieDetails;
  providers: ProviderDetails;
}) {
  const backdropURL = bindTMDBimage({
    path: movie.backdrop_path,
    quality: "original",
  });

  const posterURL = bindTMDBimage({
    path: movie.poster_path,
    quality: "w342",
  });

  const runtimeLabel =
    movie.runtime > 0
      ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}min`
      : null;

  return (
    <section className="relative isolate w-full">
      {/* Backdrop */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          fill
          priority
          sizes="100vw"
          alt=""
          src={backdropURL}
          className="object-cover object-top"
        />
        <div className="from-background via-background/60 to-background/10 absolute inset-0 bg-gradient-to-t" />
        <div className="from-background/85 via-background/40 absolute inset-0 bg-gradient-to-r to-transparent" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 pt-56 pb-16 sm:flex-row sm:items-end">
        {/* Poster */}
        <Image
          src={posterURL}
          width={342}
          height={513}
          priority
          alt={`Poster de ${movie.title}`}
          className="border-separator hidden shrink-0 rounded-2xl border object-cover shadow-2xl shadow-black/40 sm:block sm:h-72 sm:w-48 lg:h-80 lg:w-56"
        />

        {/* Info */}
        <div className="flex max-w-3xl flex-col gap-4">
          <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">
            {movie.title}
          </h1>

          {movie.tagline && (
            <p className="text-foreground/70 text-lg italic">{movie.tagline}</p>
          )}

          {/* Meta */}
          <div className="text-muted flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <span className="flex items-center gap-1">
              <Star className="fill-warning text-warning size-4" />
              <span className="text-foreground font-semibold">
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-muted">
                ({movie.vote_count} avaliações no tmdb)
              </span>
            </span>

            <Separator orientation="vertical" className="h-4" />

            {movie.release_date && (
              <span className="flex items-center gap-1">
                <CalendarDays className="size-4" />
                {format(movie.release_date, "yyyy")}
              </span>
            )}

            <Separator orientation="vertical" className="h-4" />

            {runtimeLabel && (
              <span className="flex items-center gap-1">
                <Clock className="size-4" />
                {runtimeLabel}
              </span>
            )}
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <Chip key={genre.id} size="sm" variant="soft">
                {genre.name}
              </Chip>
            ))}
          </div>

          <p className="text-muted max-w-prose text-pretty">{movie.overview}</p>

          {/* Actions */}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {movie.imdb_id && (
              <Link
                href={`https://www.imdb.com/title/${movie.imdb_id}`}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({
                    variant: "primary",
                    size: "lg",
                    className: "bg-amber-400 text-neutral-950",
                  }),
                  "gap-2 rounded-full no-underline",
                )}
              >
                <ExternalLink className="size-4" />
                Ver na IMDb
              </Link>
            )}

            {movie.homepage && (
              <Link
                href={movie.homepage}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "gap-2 rounded-full no-underline",
                )}
              >
                Site oficial
              </Link>
            )}
            {providers?.results.PT.flatrate?.map((prov) => (
              <Link
                key={prov.provider_id}
                href={providers?.results.PT.link ?? "#"}
              >
                <Image
                  width={128}
                  height={128}
                  alt={prov.provider_name}
                  src={bindTMDBimage({
                    path: prov.logo_path,
                    quality: "w185",
                  })}
                  className="size-12 rounded-full"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
