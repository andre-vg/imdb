import { api } from "@/trpc/server";
import MovieCard from "./_components/movieCard";

export default async function Home() {
  const movies = await api.tmdb.movie.popular();

  return (
    <section className="m-32">
      <h1 className="text-2xl font-bold">Filmes populares</h1>
      <div className="grid grid-cols-6 gap-3">
        {movies.results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
