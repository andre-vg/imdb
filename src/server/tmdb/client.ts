import { env } from "@/env";
import { popularSchema } from "@/server/types/api-tmdb";

const tmdbURL = "https://api.themoviedb.org/3/";
const tmdbLanguage = "pt-BR";

export const buildTmdbUrl = (
  path: string,
  params: Record<string, string> = {},
) => {
  const url = new URL(path, tmdbURL);

  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }

  url.searchParams.set("language", params.language ?? tmdbLanguage);

  return url.toString();
};

export const tmdbOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: env.TMDB_BEARER,
  },
  // Mantém as respostas em cache por 1 hora, evitando uma chamada à API a
  // cada visita.
  next: { revalidate: 60 * 60 },
};

export async function fetchTmdbList(
  path: string,
  params: Record<string, string> = {},
) {
  const response = await fetch(buildTmdbUrl(path, params), tmdbOptions);

  if (!response.ok) {
    throw new Error(
      `TMDB request failed: ${response.status} ${response.statusText}`,
    );
  }

  return popularSchema.parse(await response.json());
}

export type TmdbMovieList = Awaited<ReturnType<typeof fetchTmdbList>>;
export type TmdbMovie = TmdbMovieList["results"][number];

export interface DiscoverMovieParams {
  withGenres?: readonly number[];
  withoutGenres?: readonly number[];
  releaseGte?: string;
  releaseLte?: string;
  runtimeGte?: number;
  runtimeLte?: number;
  sortBy: "popularity.desc" | "vote_average.desc";
  page: number;
}

/**
 * Consulta o endpoint `/discover/movie` do TMDB com filtros de qualidade
 * padrão do recomendador (nota e quantidade mínima de votos).
 */
export async function discoverMovies(params: DiscoverMovieParams) {
  const query: Record<string, string> = {
    include_adult: "false",
    page: String(params.page),
    sort_by: params.sortBy,
    "vote_average.gte": "6",
    "vote_count.gte": "150",
  };

  if (params.withGenres && params.withGenres.length > 0) {
    query.with_genres = params.withGenres.join("|");
  }

  if (params.withoutGenres && params.withoutGenres.length > 0) {
    query.without_genres = params.withoutGenres.join("|");
  }

  if (params.releaseGte) {
    query["primary_release_date.gte"] = params.releaseGte;
  }

  if (params.releaseLte) {
    query["primary_release_date.lte"] = params.releaseLte;
  }

  if (params.runtimeGte !== undefined) {
    query["with_runtime.gte"] = String(params.runtimeGte);
  }

  if (params.runtimeLte !== undefined) {
    query["with_runtime.lte"] = String(params.runtimeLte);
  }

  return fetchTmdbList("discover/movie", query);
}
