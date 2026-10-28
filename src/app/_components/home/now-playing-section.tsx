import type { MovieListItem } from "@/app/_components/movie-types";
import MovieCard from "@/app/_components/movieCard";
import MovieRail from "./movie-rail";
import SectionHeader from "./section-header";

export default function NowPlayingSection({
  movies,
}: {
  movies: MovieListItem[];
}) {
  if (movies.length === 0) return null;

  return (
    <section
      aria-labelledby="em-cartaz-title"
      className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24"
      id="em-cartaz"
    >
      <MovieRail
        ariaLabel="Filmes em cartaz nos cinemas"
        header={
          <SectionHeader
            description="Estreias e sessões para ver na tela grande, direto do catálogo do TMDB."
            eyebrow="Nas telonas"
            title="Em cartaz nos cinemas"
            titleId="em-cartaz-title"
          />
        }
      >
        {movies.slice(0, 12).map((movie) => (
          <div
            className="w-[150px] shrink-0 snap-start sm:w-[180px]"
            data-rail-item
            key={movie.id}
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </MovieRail>
    </section>
  );
}
