import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { MovieListItem } from "@/app/_components/movie-types";
import TmdbPoster from "@/app/_components/tmdb-poster";
import { getGenreNames, getReleaseYear } from "@/utils/tmdb-meta";

export default function MovieCard({ movie }: { movie: MovieListItem }) {
  const year = getReleaseYear(movie.release_date);
  const genre = getGenreNames(movie.genre_ids, 1)[0];
  const meta = [year, genre].filter((value): value is string => Boolean(value));

  return (
    <Link
      aria-label={`${movie.title} — nota ${movie.vote_average.toFixed(1)} de 10${year ? `, ${year}` : ""}`}
      className="group focus-visible:ring-accent focus-visible:ring-offset-background block rounded-2xl focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
      href={`/movie/${movie.id}`}
    >
      <div className="relative">
        <TmdbPoster
          className="border-separator bg-surface aspect-[2/3] w-full rounded-2xl border shadow-sm transition-[transform,box-shadow,border-color] duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-black/10 motion-reduce:transform-none motion-reduce:transition-none"
          imageClassName="transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
          path={movie.poster_path}
          quality="w500"
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, (max-width: 1280px) 22vw, 15vw"
          title={movie.title}
        />

        <span
          aria-hidden="true"
          className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/65 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-md"
        >
          <Star className="fill-gold text-gold size-3" />
          {movie.vote_average.toFixed(1)}
        </span>

        <div
          aria-hidden="true"
          className="ring-accent/0 group-hover:ring-accent/30 pointer-events-none absolute inset-0 rounded-2xl ring-1 transition-colors duration-300 ring-inset"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-2xl bg-gradient-to-t from-black/90 via-black/45 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white">
            Ver detalhes
            <ArrowRight className="size-3.5" />
          </span>
        </div>
      </div>

      <div className="mt-3 px-0.5">
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
