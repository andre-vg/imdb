import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

export type MovieListItem = inferProcedureOutput<
  AppRouter["tmdb"]["movie"]["popular"]
>["results"][number];

/** Categorias curadas exibidas no catálogo de filmes. */
export type MovieCategory = "trending" | "popular" | "topRated" | "nowPlaying";

export type MovieCollections = Record<MovieCategory, MovieListItem[]>;

export interface MovieCategoryOption {
  id: MovieCategory;
  label: string;
  blurb: string;
}
