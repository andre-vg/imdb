import {
  GENRE_OPTIONS,
  MATCH_WEIGHTS,
  getDecadeOption,
  getPaceOption,
  getRealityOption,
  getRuntimeOption,
  getToneOption,
  type QuizAnswers,
} from "@/utils/recommendation";
import {
  discoverMovies,
  type DiscoverMovieParams,
  type TmdbMovie,
} from "@/server/tmdb/client";

const MIN_RESULTS = 5;
const MAX_EXCLUDED_IDS = 500;

export interface RecommendedMovie {
  movie: TmdbMovie;
  /** Afinidade calculada de 0 a 100. */
  matchScore: number;
  /** Motivos curtos exibidos no card. */
  reasons: string[];
}

export interface RecommendationResult {
  movies: RecommendedMovie[];
  /** Filtros que precisaram ser afrouxados para completar as 5 sugestões. */
  relaxed: string[];
}

interface DiscoverAttempt {
  pages: number[];
  dropRuntime: boolean;
  dropDecade: boolean;
  relaxed: string[];
}

/**
 * Tentativas em ordem de preferência: primeiro com todos os filtros, depois
 * afrouxando a duração e, por fim, a década — como combinado com o produto.
 */
const DISCOVER_ATTEMPTS: readonly DiscoverAttempt[] = [
  { pages: [1, 2], dropRuntime: false, dropDecade: false, relaxed: [] },
  { pages: [1], dropRuntime: true, dropDecade: false, relaxed: ["duração"] },
  {
    pages: [1],
    dropRuntime: true,
    dropDecade: true,
    relaxed: ["duração", "década"],
  },
];

function getDecadeYears(decade: QuizAnswers["decade"]) {
  const option = getDecadeOption(decade);

  return {
    from: option.from ? Number.parseInt(option.from.slice(0, 4), 10) : null,
    to: option.to ? Number.parseInt(option.to.slice(0, 4), 10) : null,
  };
}

function getToneGenres(answers: QuizAnswers) {
  const tone = getToneOption(answers.tone);
  const pace = getPaceOption(answers.pace);
  const reality = getRealityOption(answers.reality);

  return new Set<number>([...tone.genres, ...pace.genres, ...reality.genres]);
}

function buildDiscoverParams(
  answers: QuizAnswers,
  attempt: DiscoverAttempt,
  sortBy: DiscoverMovieParams["sortBy"],
  page: number,
): DiscoverMovieParams {
  const decade = getDecadeOption(answers.decade);
  const runtime = getRuntimeOption(answers.runtime);
  const reality = getRealityOption(answers.reality);

  return {
    withGenres: answers.genres,
    withoutGenres: reality.withoutGenres,
    releaseGte: attempt.dropDecade ? undefined : (decade.from ?? undefined),
    releaseLte: attempt.dropDecade ? undefined : (decade.to ?? undefined),
    runtimeGte: attempt.dropRuntime ? undefined : (runtime.gte ?? undefined),
    runtimeLte: attempt.dropRuntime ? undefined : (runtime.lte ?? undefined),
    sortBy,
    page,
  };
}

function scoreMovie(movie: TmdbMovie, answers: QuizAnswers): number {
  const selectedGenres = new Set(answers.genres);
  const matchedGenres = movie.genre_ids.filter((id) => selectedGenres.has(id));
  const genreScore =
    selectedGenres.size > 0 ? matchedGenres.length / selectedGenres.size : 0;

  const toneGenres = getToneGenres(answers);
  const toneScore = movie.genre_ids.some((id) => toneGenres.has(id)) ? 1 : 0;

  const { from, to } = getDecadeYears(answers.decade);
  const releaseYear = Number.parseInt(movie.release_date.slice(0, 4), 10);
  const decadeScore =
    from === null || Number.isNaN(releaseYear)
      ? 1
      : releaseYear >= from && (to === null || releaseYear <= to)
        ? 1
        : 0;

  const qualityScore = Math.min(1, Math.max(0, movie.vote_average / 10));

  const rawScore =
    genreScore * MATCH_WEIGHTS.genre +
    toneScore * MATCH_WEIGHTS.tone +
    decadeScore * MATCH_WEIGHTS.decade +
    qualityScore * MATCH_WEIGHTS.quality;

  return Math.round(rawScore * 100);
}

function buildReasons(
  movie: TmdbMovie,
  answers: QuizAnswers,
  relaxed: readonly string[],
): string[] {
  const reasons: string[] = [];
  const selectedGenres = new Set(answers.genres);
  const matchedGenreIds = movie.genre_ids.filter((id) =>
    selectedGenres.has(id),
  );

  if (matchedGenreIds.length > 0) {
    reasons.push(
      matchedGenreIds
        .slice(0, 2)
        .map(
          (id) =>
            GENRE_OPTIONS.find((option) => option.value === id)?.label ??
            "Cinema",
        )
        .join(" + "),
    );
  }

  const tone = getToneOption(answers.tone);
  const toneGenres = getToneGenres(answers);

  if (movie.genre_ids.some((id) => toneGenres.has(id))) {
    reasons.push(tone.label);
  }

  if (!relaxed.includes("década") && answers.decade !== "qualquer") {
    reasons.push(getDecadeOption(answers.decade).label);
  }

  if (!relaxed.includes("duração") && answers.runtime !== "qualquer") {
    reasons.push(getRuntimeOption(answers.runtime).label);
  }

  if (answers.reality === "real") {
    const reality = getRealityOption(answers.reality);

    if (movie.genre_ids.some((id) => reality.genres.includes(id))) {
      reasons.push("Baseado em fatos");
    }
  }

  if (reasons.length === 0) {
    reasons.push("Bem avaliado pela comunidade");
  }

  return reasons.slice(0, 3);
}

function dedupeCandidates(
  movies: TmdbMovie[],
  excludedIds: ReadonlySet<number>,
): TmdbMovie[] {
  const seen = new Set<number>();

  return movies.filter((movie) => {
    if (seen.has(movie.id) || excludedIds.has(movie.id)) return false;
    if (movie.adult || !movie.poster_path) return false;

    seen.add(movie.id);
    return true;
  });
}

/**
 * Busca candidatos no TMDB e ranqueia os melhores de acordo com as respostas.
 *
 * A função nunca lança erro por falta de resultados: devolve a melhor lista
 * possível e informa quais filtros precisaram ser afrouxados.
 */
export async function getRecommendations(
  answers: QuizAnswers,
  excludedIds: readonly number[] = [],
): Promise<RecommendationResult> {
  const excluded = new Set<number>(excludedIds.slice(0, MAX_EXCLUDED_IDS));
  let best: RecommendationResult = { movies: [], relaxed: [] };

  for (const attempt of DISCOVER_ATTEMPTS) {
    const responses = await Promise.all(
      attempt.pages.flatMap((page) => [
        discoverMovies(
          buildDiscoverParams(answers, attempt, "popularity.desc", page),
        ),
        discoverMovies(
          buildDiscoverParams(answers, attempt, "vote_average.desc", page),
        ),
      ]),
    );

    const candidates = dedupeCandidates(
      responses.flatMap((response) => response.results),
      excluded,
    );

    if (candidates.length === 0) continue;

    const ranked = candidates
      .map((movie) => ({
        movie,
        matchScore: scoreMovie(movie, answers),
        reasons: buildReasons(movie, answers, attempt.relaxed),
      }))
      .sort((a, b) => {
        if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
        if (b.movie.vote_average !== a.movie.vote_average) {
          return b.movie.vote_average - a.movie.vote_average;
        }

        return b.movie.vote_count - a.movie.vote_count;
      })
      .slice(0, MIN_RESULTS);

    if (ranked.length > best.movies.length) {
      best = { movies: ranked, relaxed: attempt.relaxed };
    }

    if (ranked.length >= MIN_RESULTS) return best;
  }

  return best;
}
