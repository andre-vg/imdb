import Link from "next/link";
import { Star } from "lucide-react";
import type { MovieListItem } from "@/app/_components/movie-types";
import TmdbPoster from "@/app/_components/tmdb-poster";
import { getGenreNames, getReleaseYear } from "@/utils/tmdb-meta";
import MovieRail from "./movie-rail";
import SectionHeader from "./section-header";

interface RankedMovieCardProps {
  movie: MovieListItem;
  rank: number;
}

function RankedMovieCard({ movie, rank }: RankedMovieCardProps) {
  const year = getReleaseYear(movie.release_date);
  const genre = getGenreNames(movie.genre_ids, 1)[0];
  const meta = [year, genre].filter((value): value is string => Boolean(value));

  return (
    <Link
      aria-label={`${rank}º lugar: ${movie.title} — nota ${movie.vote_average.toFixed(1)}`}
      className="group focus-visible:ring-accent focus-visible:ring-offset-background w-[240px] shrink-0 snap-start rounded-2xl focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none sm:w-[280px]"
      data-rail-item
      href={`/movie/${movie.id}`}
    >
      <div className="relative flex h-[290px] items-end sm:h-[340px]">
        <span
          aria-hidden="true"
          className="font-display pointer-events-none absolute bottom-4 left-0 z-0 text-[7rem] leading-[0.72] text-transparent opacity-90 transition-opacity [-webkit-text-stroke:2px_var(--accent)] group-hover:opacity-100 sm:text-[8rem]"
        >
          {String(rank).padStart(2, "0")}
        </span>

        <div className="relative z-10 ml-auto w-[62%]">
          <TmdbPoster
            className="border-separator aspect-[2/3] w-full rounded-2xl border shadow-xl shadow-black/25"
            imageClassName="transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
            path={movie.poster_path}
            quality="w342"
            sizes="(max-width: 640px) 150px, 180px"
            title={movie.title}
          />

          <span
            aria-hidden="true"
            className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/65 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-md"
          >
            <Star className="fill-gold text-gold size-3" />
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-foreground group-hover:text-accent line-clamp-2 min-h-[2.5rem] text-sm leading-snug font-semibold transition-colors">
          {movie.title}
        </h3>
        {meta.length > 0 && (
          <p className="text-muted mt-1 text-xs">{meta.join(" · ")}</p>
        )}
      </div>
    </Link>
  );
}

export default function TopTenSection({ movies }: { movies: MovieListItem[] }) {
  if (movies.length === 0) return null;

  return (
    <section
      aria-labelledby="top-10-title"
      className="bg-background-secondary/60 border-separator relative overflow-hidden border-b"
      id="top-10"
    >
      <div
        aria-hidden="true"
        className="bg-accent/5 pointer-events-none absolute top-0 -right-32 size-96 rounded-full blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <MovieRail
          ariaLabel="Top 10 filmes de hoje"
          header={
            <SectionHeader
              description="Os títulos que estão dominando as conversas nas últimas 24 horas."
              eyebrow="Ranking diário"
              title="Top 10 hoje"
              titleId="top-10-title"
            />
          }
        >
          {movies.slice(0, 10).map((movie, index) => (
            <RankedMovieCard key={movie.id} movie={movie} rank={index + 1} />
          ))}
        </MovieRail>
      </div>
    </section>
  );
}
