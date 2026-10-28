import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Star,
  TrendingUp,
} from "lucide-react";
import type { MovieListItem } from "@/app/_components/movie-types";
import TmdbPoster from "@/app/_components/tmdb-poster";
import { bindTMDBimage } from "@/utils/tmdb-images";
import {
  formatVoteCount,
  getGenreNames,
  getReleaseYear,
} from "@/utils/tmdb-meta";

interface HeroProps {
  movie: MovieListItem;
  trending: MovieListItem[];
  showTopTenLink?: boolean;
}

export default function Hero({
  movie,
  trending,
  showTopTenLink = false,
}: HeroProps) {
  const year = getReleaseYear(movie.release_date);
  const genres = getGenreNames(movie.genre_ids, 3);
  const related = trending.filter((item) => item.id !== movie.id).slice(0, 3);
  const backdrop = movie.backdrop_path
    ? bindTMDBimage({ path: movie.backdrop_path, quality: "original" })
    : null;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[86svh] flex-col justify-end overflow-hidden bg-neutral-950 text-white"
    >
      {backdrop ? (
        <Image
          alt=""
          className="absolute inset-0 -z-20 size-full object-cover object-[center_28%]"
          fill
          priority
          sizes="100vw"
          src={backdrop}
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_75%_20%,rgba(245,197,24,0.18),transparent_45%)]"
        />
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/55 to-black/25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/95 via-black/50 to-black/5"
      />
      <div
        aria-hidden="true"
        className="from-background absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t to-transparent"
      />

      <div className="mx-auto w-full max-w-7xl px-5 pt-24 pb-36 sm:px-8 sm:pb-40">
        <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="max-w-3xl">
            <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.22em] uppercase backdrop-blur-md">
              <TrendingUp aria-hidden="true" className="text-gold size-3.5" />
              Em alta hoje
            </p>

            <h1
              className="animate-fade-up font-display mt-5 max-w-4xl text-[clamp(3.4rem,8vw,8rem)] leading-[0.85] tracking-wide text-balance uppercase [animation-delay:80ms]"
              id="hero-title"
            >
              {movie.title}
            </h1>

            <div className="animate-fade-up mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/70 [animation-delay:160ms]">
              <span className="inline-flex items-center gap-1.5">
                <Star
                  aria-hidden="true"
                  className="fill-gold text-gold size-4"
                />
                <span className="font-semibold text-white">
                  {movie.vote_average.toFixed(1)}
                </span>
                <span>/10</span>
              </span>

              <span
                aria-hidden="true"
                className="size-1 rounded-full bg-white/30"
              />

              <span>{formatVoteCount(movie.vote_count)} avaliações</span>

              {year && (
                <>
                  <span
                    aria-hidden="true"
                    className="size-1 rounded-full bg-white/30"
                  />
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays aria-hidden="true" className="size-4" />
                    {year}
                  </span>
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
              <p className="animate-fade-up mt-5 line-clamp-3 max-w-xl text-base leading-relaxed text-pretty text-white/75 [animation-delay:240ms] sm:line-clamp-4">
                {movie.overview}
              </p>
            )}

            <div className="animate-fade-up mt-8 flex flex-wrap items-center gap-3 [animation-delay:320ms]">
              <Link
                className="bg-gold hover:bg-gold-bright focus-visible:ring-gold inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-neutral-950 no-underline shadow-lg shadow-black/20 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 focus-visible:outline-none"
                href={`/movie/${movie.id}`}
              >
                Ver detalhes
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>

              {showTopTenLink && (
                <a
                  className="focus-visible:ring-gold inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white no-underline backdrop-blur-md transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 focus-visible:outline-none"
                  href="#top-10"
                >
                  Top 10 de hoje
                  <ArrowDown aria-hidden="true" className="size-4" />
                </a>
              )}
            </div>
          </div>

          {related.length > 0 && (
            <aside
              aria-labelledby="hero-trending-title"
              className="animate-fade-up hidden rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl [animation-delay:400ms] lg:block"
            >
              <div className="flex items-center justify-between gap-3">
                <h2
                  className="text-[11px] font-semibold tracking-[0.22em] text-white/60 uppercase"
                  id="hero-trending-title"
                >
                  Em alta agora
                </h2>
                <TrendingUp aria-hidden="true" className="text-gold size-4" />
              </div>

              <ul className="mt-2 divide-y divide-white/10">
                {related.map((item, index) => {
                  const itemYear = getReleaseYear(item.release_date);

                  return (
                    <li key={item.id}>
                      <Link
                        aria-label={`${item.title} — nota ${item.vote_average.toFixed(1)}`}
                        className="group focus-visible:ring-gold flex items-center gap-3 rounded-lg py-3 no-underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 focus-visible:outline-none"
                        href={`/movie/${item.id}`}
                      >
                        <span
                          aria-hidden="true"
                          className="font-display w-5 shrink-0 text-lg leading-none text-white/30 transition-colors group-hover:text-white/60"
                        >
                          {String(index + 2).padStart(2, "0")}
                        </span>

                        <TmdbPoster
                          className="h-14 w-10 shrink-0 rounded-md"
                          path={item.poster_path}
                          quality="w185"
                          showFallbackLabel={false}
                          sizes="40px"
                          title={item.title}
                        />

                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-white transition-colors group-hover:text-white/80">
                            {item.title}
                          </span>
                          <span className="mt-0.5 flex items-center gap-2 text-xs text-white/50">
                            {itemYear && <span>{itemYear}</span>}
                            <span className="inline-flex items-center gap-1">
                              <Star
                                aria-hidden="true"
                                className="fill-gold text-gold size-3"
                              />
                              {item.vote_average.toFixed(1)}
                            </span>
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
