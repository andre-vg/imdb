/**
 * Gêneros oficiais do TMDB. Usado para transformar `genre_ids` em nomes
 * legíveis sem precisar de uma requisição extra por filme.
 */
export const TMDB_GENRES: Readonly<Record<number, string>> = {
  28: "Ação",
  12: "Aventura",
  16: "Animação",
  35: "Comédia",
  80: "Crime",
  99: "Documentário",
  18: "Drama",
  10751: "Família",
  14: "Fantasia",
  36: "História",
  27: "Terror",
  10402: "Música",
  9648: "Mistério",
  10749: "Romance",
  878: "Ficção científica",
  10770: "Cinema TV",
  53: "Suspense",
  10752: "Guerra",
  37: "Faroeste",
};

export function getGenreNames(
  genreIds: readonly number[],
  limit = 2,
): string[] {
  const names: string[] = [];

  for (const id of genreIds) {
    const name = TMDB_GENRES[id];

    if (name) names.push(name);
    if (names.length >= limit) break;
  }

  return names;
}

export function getReleaseYear(
  releaseDate: string | null | undefined,
): string | null {
  if (!releaseDate) return null;

  const year = releaseDate.slice(0, 4);

  return /^\d{4}$/.test(year) ? year : null;
}

const compactNumber = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatVoteCount(voteCount: number) {
  return compactNumber.format(voteCount);
}
