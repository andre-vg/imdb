"use client";

import Image from "next/image";
import {
  CalendarDays,
  Clock,
  ExternalLink,
  Film,
  Globe,
  Star,
} from "lucide-react";
import {
  Avatar,
  Breadcrumbs,
  Card,
  Chip,
  Link,
  ProgressCircle,
  Separator,
  Tooltip,
} from "@heroui/react";
import { buttonVariants, cn } from "@heroui/styles";
import type { AppRouter } from "@/server/api/root";
import type { inferProcedureOutput } from "@trpc/server";
import { bindTMDBimage } from "@/utils/tmdb-images";
import {
  formatRuntime,
  formatVoteCount,
  getInitials,
  getReleaseYear,
  translateMovieStatus,
} from "@/utils/tmdb-meta";

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
  const backdropURL = movie.backdrop_path
    ? bindTMDBimage({ path: movie.backdrop_path, quality: "original" })
    : null;

  const posterURL = movie.poster_path
    ? bindTMDBimage({ path: movie.poster_path, quality: "w500" })
    : null;

  const year = getReleaseYear(movie.release_date);
  const runtime = formatRuntime(movie.runtime);
  const status = translateMovieStatus(movie.status);
  const rating = movie.vote_average.toFixed(1);
  const ratingPercent = Math.round(movie.vote_average * 10);

  const watchProviders = providers?.results.PT;
  const streamingProviders = watchProviders?.flatrate ?? [];

  return (
    <section
      aria-labelledby="movie-title"
      className="relative isolate w-full overflow-hidden bg-neutral-950 text-white"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        {backdropURL ? (
          <Image
            fill
            priority
            alt=""
            sizes="100vw"
            src={backdropURL}
            className="object-cover object-top"
          />
        ) : (
          <div className="size-full bg-[radial-gradient(circle_at_70%_20%,rgba(245,197,24,0.22),transparent_55%)]" />
        )}
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-neutral-950 via-neutral-950/75 to-neutral-950/25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-neutral-950/95 via-neutral-950/60 to-transparent"
      />
      <div
        aria-hidden="true"
        className="from-background absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t to-transparent"
      />

      <div className="mx-auto w-full max-w-6xl px-5 pt-24 pb-16 sm:px-8 sm:pt-28">
        <div className="inline-flex rounded-full border border-white/10 bg-black/35 px-3 py-1.5 backdrop-blur-md">
          <Breadcrumbs
            aria-label="Você está em"
            className="[&_a]:text-white/60 [&_a:hover]:text-white [&_svg]:text-white/25"
          >
            <Breadcrumbs.Item href="/">Início</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/#populares">Filmes</Breadcrumbs.Item>
            <Breadcrumbs.Item>{movie.title}</Breadcrumbs.Item>
          </Breadcrumbs>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-start lg:grid-cols-[13rem_minmax(0,1fr)_17rem] lg:items-end lg:gap-10">
          <div className="w-36 shrink-0 sm:row-span-2 sm:w-auto lg:row-span-1">
            {posterURL ? (
              <Image
                src={posterURL}
                alt={`Pôster de ${movie.title}`}
                width={500}
                height={750}
                priority
                className="border-separator aspect-[2/3] w-full rounded-2xl border border-white/10 object-cover shadow-2xl shadow-black/60"
              />
            ) : (
              <div className="grid aspect-[2/3] w-full place-items-center rounded-2xl border border-white/10 bg-white/5 text-center shadow-2xl shadow-black/60">
                <div className="px-4">
                  <Film
                    aria-hidden="true"
                    className="text-gold mx-auto size-8"
                  />
                  <p className="mt-3 text-xs leading-snug text-white/60">
                    Pôster indisponível
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="min-w-0">
            {movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <Chip
                    key={genre.id}
                    size="sm"
                    variant="soft"
                    className="border border-white/10 bg-white/10 text-white/80"
                  >
                    {genre.name}
                  </Chip>
                ))}
              </div>
            )}

            <h1
              id="movie-title"
              className="font-display mt-4 text-[clamp(3rem,7vw,5.5rem)] leading-[0.86] tracking-wide text-balance uppercase"
            >
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="mt-3 max-w-2xl text-lg text-white/65 italic">
                {movie.tagline}
              </p>
            )}

            {movie.overview && (
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-pretty text-white/75 sm:text-base">
                {movie.overview}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {movie.imdb_id && (
                <Link
                  className={cn(
                    buttonVariants({ variant: "primary", size: "lg" }),
                    "bg-gold hover:bg-gold-bright gap-2 text-neutral-950 no-underline",
                  )}
                  href={`https://www.imdb.com/title/${movie.imdb_id}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  <ExternalLink aria-hidden="true" className="size-4" />
                  Ver na IMDb
                </Link>
              )}

              {movie.homepage && (
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "gap-2 border-white/25 text-white no-underline hover:bg-white/10",
                  )}
                  href={movie.homepage}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Globe aria-hidden="true" className="size-4" />
                  Site oficial
                </Link>
              )}
            </div>

            {streamingProviders.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="text-[11px] font-semibold tracking-[0.2em] text-white/45 uppercase">
                  Onde assistir
                </span>
                <div className="flex items-center gap-2">
                  {streamingProviders.map((provider) => (
                    <Tooltip key={provider.provider_id}>
                      <Tooltip.Trigger>
                        <Link
                          aria-label={`Assistir ${provider.provider_name}`}
                          className="focus-visible:ring-gold inline-flex rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 focus-visible:outline-none"
                          href={watchProviders?.link ?? "#"}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <Avatar className="size-10 border border-white/15">
                            <Avatar.Image
                              alt={provider.provider_name}
                              src={bindTMDBimage({
                                path: provider.logo_path,
                                quality: "w185",
                              })}
                            />
                            <Avatar.Fallback className="text-[10px]">
                              {getInitials(provider.provider_name)}
                            </Avatar.Fallback>
                          </Avatar>
                        </Link>
                      </Tooltip.Trigger>
                      <Tooltip.Content>
                        <Tooltip.Arrow />
                        {provider.provider_name}
                      </Tooltip.Content>
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Card
            variant="transparent"
            className="w-full rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur-xl sm:col-start-2 lg:col-start-3 lg:row-start-1"
          >
            <Card.Header className="gap-1">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-white/45 uppercase">
                Nota TMDB
              </p>
            </Card.Header>

            <Card.Content className="mt-3 flex-row items-center gap-4">
              <ProgressCircle
                aria-label={`Nota ${rating} de 10`}
                color="warning"
                value={ratingPercent}
                className="relative size-20 shrink-0"
              >
                <ProgressCircle.Track className="size-full">
                  <ProgressCircle.TrackCircle />
                  <ProgressCircle.FillCircle />
                </ProgressCircle.Track>
                <span className="absolute inset-0 grid place-items-center text-lg font-bold">
                  {rating}
                </span>
              </ProgressCircle>

              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-semibold">
                  <Star
                    aria-hidden="true"
                    className="fill-gold text-gold size-4"
                  />
                  de 10
                </p>
                <p className="mt-0.5 text-xs text-white/55">
                  {formatVoteCount(movie.vote_count)} avaliações
                </p>
              </div>
            </Card.Content>

            <Separator className="my-4 bg-white/10" />

            <dl className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-white/50">
                  <CalendarDays aria-hidden="true" className="size-3.5" />
                  Ano
                </dt>
                <dd className="font-medium">{year ?? "—"}</dd>
              </div>

              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-white/50">
                  <Clock aria-hidden="true" className="size-3.5" />
                  Duração
                </dt>
                <dd className="font-medium">{runtime}</dd>
              </div>

              <div className="flex items-center justify-between gap-3">
                <dt className="text-white/50">Situação</dt>
                <dd className="font-medium">{status}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </section>
  );
}
