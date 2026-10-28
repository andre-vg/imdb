import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Star } from "lucide-react";
import type { MovieListItem } from "@/app/_components/movie-types";
import TmdbPoster from "@/app/_components/tmdb-poster";
import { bindTMDBimage } from "@/utils/tmdb-images";
import { getGenreNames, getReleaseYear } from "@/utils/tmdb-meta";
import SectionHeader from "./section-header";

function SpotlightMovie({ movie }: { movie: MovieListItem }) {
  const year = getReleaseYear(movie.release_date);
  const genres = getGenreNames(movie.genre_ids, 2);
  const imagePath = movie.backdrop_path ?? movie.poster_path;

  return (
    <Link
      aria-label={`${movie.title} — ver detalhes`}
      className="group focus-visible:ring-accent focus-visible:ring-offset-background relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 p-6 text-white shadow-2xl shadow-black/20 focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none sm:min-h-[30rem] sm:p-8"
      href={`/movie/${movie.id}`}
    >
      {imagePath ? (
        <Image
          alt=""
          className="-z-20 object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          src={bindTMDBimage({ path: imagePath, quality: "w780" })}
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_70%_20%,rgba(245,197,24,0.2),transparent_55%)]"
        />
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/65 to-black/10"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/30 to-transparent"
      />

      <div className="relative">
        <p className="text-gold inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[11px] font-semibold tracking-[0.18em] uppercase backdrop-blur-md">
          <Star aria-hidden="true" className="fill-gold text-gold size-3.5" />
          #1 mais bem avaliado
        </p>

        <h3 className="font-display mt-4 max-w-xl text-4xl leading-[0.9] tracking-wide uppercase sm:text-5xl">
          {movie.title}
        </h3>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-white/70">
          <span className="inline-flex items-center gap-1.5 font-semibold text-white">
            <Star aria-hidden="true" className="fill-gold text-gold size-4" />
            {movie.vote_average.toFixed(1)}
            <span className="font-normal text-white/60">/10</span>
          </span>

          {year && (
            <>
              <span
                aria-hidden="true"
                className="size-1 rounded-full bg-white/30"
              />
              <span>{year}</span>
            </>
          )}

          {genres.length > 0 && (
            <>
              <span
                aria-hidden="true"
                className="size-1 rounded-full bg-white/30"
              />
              <span>{genres.join(" · ")}</span>
            </>
          )}
        </div>

        {movie.overview && (
          <p className="mt-4 line-clamp-3 max-w-lg text-sm leading-relaxed text-white/70">
            {movie.overview}
          </p>
        )}

        <span className="text-gold mt-6 inline-flex items-center gap-2 text-sm font-semibold">
          Ver detalhes
          <ArrowRight aria-hidden="true" className="size-4" />
        </span>
      </div>
    </Link>
  );
}

export default function TopRatedSection({
  movies,
}: {
  movies: MovieListItem[];
}) {
  const [featured, ...rest] = movies;

  if (!featured) return null;

  return (
    <section
      aria-labelledby="aclamados-title"
      className="bg-background-secondary/50 border-separator relative overflow-hidden border-y"
      id="aclamados"
    >
      <div
        aria-hidden="true"
        className="bg-accent/5 pointer-events-none absolute top-20 -left-40 size-[30rem] rounded-full blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <SectionHeader
          description="Notas altíssimas dadas pela comunidade do TMDB. Uma lista para quem quer começar pelo topo."
          eyebrow="Notas altíssimas"
          title="Os mais bem avaliados"
          titleId="aclamados-title"
        />

        <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <SpotlightMovie movie={featured} />

          <ol className="divide-separator flex flex-col justify-center divide-y">
            {rest.slice(0, 5).map((movie, index) => {
              const year = getReleaseYear(movie.release_date);
              const genre = getGenreNames(movie.genre_ids, 1)[0];
              const meta = [year, genre].filter((value): value is string =>
                Boolean(value),
              );

              return (
                <li key={movie.id}>
                  <Link
                    aria-label={`${movie.title} — nota ${movie.vote_average.toFixed(1)} de 10`}
                    className="group focus-visible:ring-accent focus-visible:ring-offset-background hover:bg-default-soft -mx-2 flex items-center gap-3 rounded-xl px-2 py-4 focus-visible:ring-2 focus-visible:outline-none sm:gap-4"
                    href={`/movie/${movie.id}`}
                  >
                    <span
                      aria-hidden="true"
                      className="font-display text-muted w-6 shrink-0 text-2xl leading-none"
                    >
                      {String(index + 2).padStart(2, "0")}
                    </span>

                    <TmdbPoster
                      className="border-separator h-20 w-14 shrink-0 rounded-lg border"
                      path={movie.poster_path}
                      quality="w185"
                      sizes="56px"
                      title={movie.title}
                      showFallbackLabel={false}
                    />

                    <span className="min-w-0 flex-1">
                      <span className="text-foreground group-hover:text-accent block truncate font-semibold transition-colors">
                        {movie.title}
                      </span>
                      {meta.length > 0 && (
                        <span className="text-muted mt-0.5 block truncate text-xs">
                          {meta.join(" · ")}
                        </span>
                      )}
                    </span>

                    <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold">
                      <Star
                        aria-hidden="true"
                        className="fill-gold text-gold size-3.5"
                      />
                      {movie.vote_average.toFixed(1)}
                    </span>

                    <ArrowUpRight
                      aria-hidden="true"
                      className="text-muted group-hover:text-accent hidden size-4 shrink-0 transition-colors sm:block"
                    />
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
