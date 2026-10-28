import type { MovieListItem } from "@/app/_components/movie-types";
import MovieCard from "@/app/_components/movieCard";
import SectionHeader from "./section-header";

export default function PopularSection({
  movies,
}: {
  movies: MovieListItem[];
}) {
  if (movies.length === 0) return null;

  return (
    <section
      aria-labelledby="populares-title"
      className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24"
      id="populares"
    >
      <SectionHeader
        description="Uma seleção do que está em alta agora, atualizada ao longo do dia."
        eyebrow="No radar"
        title="Populares no momento"
        titleId="populares-title"
      />

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 xl:grid-cols-6">
        {movies.slice(0, 12).map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
