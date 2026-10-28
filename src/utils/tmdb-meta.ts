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

const compactCurrency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCurrency(value: number | null | undefined) {
  return value && value > 0 ? compactCurrency.format(value) : "—";
}

export function formatRuntime(minutes: number | null | undefined) {
  if (!minutes || minutes <= 0) return "—";

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours === 0) return `${rest}min`;
  if (rest === 0) return `${hours}h`;

  return `${hours}h ${rest}min`;
}

const longDate = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatReleaseDate(date: string | null | undefined) {
  if (!date) return "—";

  const parsed = new Date(`${date}T00:00:00`);

  return Number.isNaN(parsed.getTime()) ? "—" : longDate.format(parsed);
}

const languageNames = new Intl.DisplayNames(["pt-BR"], { type: "language" });
const regionNames = new Intl.DisplayNames(["pt-BR"], { type: "region" });

export function getLanguageName(code: string | null | undefined) {
  if (!code) return "—";

  try {
    return languageNames.of(code) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}

export function getCountryName(code: string | null | undefined) {
  if (!code) return "—";

  try {
    return regionNames.of(code) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}

const MOVIE_STATUS_LABELS: Readonly<Record<string, string>> = {
  Released: "Lançado",
  "Post Production": "Pós-produção",
  "In Production": "Em produção",
  Planned: "Planejado",
  Rumored: "Rumor",
  Canceled: "Cancelado",
};

export function translateMovieStatus(status: string | null | undefined) {
  if (!status) return "—";

  return MOVIE_STATUS_LABELS[status] ?? status;
}

export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
