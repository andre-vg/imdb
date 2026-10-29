import type { Metadata } from "next";
import { api } from "@/trpc/server";
import SiteFooter from "@/app/_components/site-footer";
import MovieExplorer from "./movie-explorer";
import type { MovieCollections, MovieListItem } from "./movie-types";

export const metadata: Metadata = {
  title: "Filmes",
  description:
    "Explore filmes por coleções: em alta, populares, aclamados e em cartaz. Busque por título, filtre por gênero e descubra sua próxima sessão.",
};

function pickMovies(
  result: PromiseSettledResult<{ results: MovieListItem[] }>,
): MovieListItem[] {
  return result.status === "fulfilled" ? result.value.results : [];
}

export default async function Page() {
  const [trending, popular, topRated, nowPlaying] = await Promise.allSettled([
    api.tmdb.movie.trending(),
    api.tmdb.movie.popular(),
    api.tmdb.movie.topRated(),
    api.tmdb.movie.nowPlaying(),
  ]);

  const collections: MovieCollections = {
    trending: pickMovies(trending),
    popular: pickMovies(popular),
    topRated: pickMovies(topRated),
    nowPlaying: pickMovies(nowPlaying),
  };

  return (
    <main id="conteudo">
      <MovieExplorer collections={collections} />
      <SiteFooter />
    </main>
  );
}
