import { z } from "zod";

/**
 * Configuração compartilhada do quiz de recomendação.
 *
 * Este módulo é importado tanto pelo cliente (wizard) quanto pelo servidor
 * (motor de recomendação), por isso não pode depender de APIs do Node ou do
 * Next.js. Apenas dados, tipos e validação.
 */

export const MAX_SELECTED_GENRES = 3;

export const QUIZ_STEP_IDS = [
  "genres",
  "tone",
  "pace",
  "decade",
  "runtime",
  "reality",
] as const;

export type QuizStepId = (typeof QUIZ_STEP_IDS)[number];

export const QUIZ_STEP_COUNT = QUIZ_STEP_IDS.length;

/** Pesos usados para ranquear os candidatos devolvidos pelo TMDB. */
export const MATCH_WEIGHTS = {
  genre: 0.5,
  tone: 0.25,
  decade: 0.15,
  quality: 0.1,
} as const;

export const SEEN_STATUSES = ["seen", "dismissed"] as const;

export type SeenStatus = (typeof SEEN_STATUSES)[number];

/** Chave usada para preservar as respostas quando o visitante vai fazer login. */
export const PENDING_ANSWERS_STORAGE_KEY =
  "imdb:recommendation:pending-answers";

export type QuizIconKey =
  | "book"
  | "calendar"
  | "compass"
  | "drama"
  | "eye"
  | "film"
  | "fingerprint"
  | "ghost"
  | "globe"
  | "heart"
  | "moon"
  | "popcorn"
  | "rocket"
  | "smile"
  | "sparkles"
  | "swords"
  | "timer"
  | "zap";

export interface BaseQuizOption<TValue extends string | number> {
  value: TValue;
  label: string;
  description?: string;
  icon: QuizIconKey;
}

/* -------------------------------------------------------------------------- */
/* Gêneros                                                                    */
/* -------------------------------------------------------------------------- */

export const GENRE_OPTIONS = [
  { value: 28, label: "Ação", icon: "swords" },
  { value: 35, label: "Comédia", icon: "smile" },
  { value: 18, label: "Drama", icon: "drama" },
  { value: 53, label: "Suspense", icon: "eye" },
  { value: 27, label: "Terror", icon: "ghost" },
  { value: 878, label: "Ficção científica", icon: "rocket" },
  { value: 10749, label: "Romance", icon: "heart" },
  { value: 16, label: "Animação", icon: "sparkles" },
  { value: 80, label: "Crime", icon: "fingerprint" },
  { value: 99, label: "Documentário", icon: "film" },
] as const satisfies readonly BaseQuizOption<number>[];

const GENRE_ID_SET = new Set<number>(
  GENRE_OPTIONS.map((option) => option.value),
);

const GENRE_LABEL_BY_ID = new Map<number, string>(
  GENRE_OPTIONS.map((option) => [option.value, option.label]),
);

export function getGenreLabel(genreId: number): string {
  return GENRE_LABEL_BY_ID.get(genreId) ?? "Outro";
}

/* -------------------------------------------------------------------------- */
/* Tom / emoção                                                               */
/* -------------------------------------------------------------------------- */

export const TONE_IDS = ["leve", "tenso", "epico", "reflexivo"] as const;

export type ToneId = (typeof TONE_IDS)[number];

export interface ToneOption extends BaseQuizOption<ToneId> {
  /** Gêneros usados como sinal de afinidade (não são filtro rígido). */
  genres: readonly number[];
}

export const TONE_OPTIONS = [
  {
    value: "leve",
    label: "Leve e divertido",
    description: "Para rir, relaxar e sair bem-humorado",
    icon: "smile",
    genres: [35, 16, 10751],
  },
  {
    value: "tenso",
    label: "Tenso e instigante",
    description: "Mistério, suspense e frio na espinha",
    icon: "eye",
    genres: [53, 27, 9648],
  },
  {
    value: "epico",
    label: "Épico e emocionante",
    description: "Adrenalina, aventura e grandiosidade",
    icon: "zap",
    genres: [28, 12, 878],
  },
  {
    value: "reflexivo",
    label: "Reflexivo e dramático",
    description: "Histórias densas para pensar depois",
    icon: "drama",
    genres: [18, 36, 10757],
  },
] as const satisfies readonly ToneOption[];

export function getToneOption(tone: ToneId): ToneOption {
  return (
    TONE_OPTIONS.find((option) => option.value === tone) ?? TONE_OPTIONS[0]
  );
}

/* -------------------------------------------------------------------------- */
/* Ritmo                                                                      */
/* -------------------------------------------------------------------------- */

export const PACE_IDS = ["acao", "equilibrado", "contemplativo"] as const;

export type PaceId = (typeof PACE_IDS)[number];

export interface PaceOption extends BaseQuizOption<PaceId> {
  genres: readonly number[];
}

export const PACE_OPTIONS = [
  {
    value: "acao",
    label: "Ação do início ao fim",
    description: "Cenas rápidas e pouca pausa para respirar",
    icon: "zap",
    genres: [28, 53, 80],
  },
  {
    value: "equilibrado",
    label: "Ritmo equilibrado",
    description: "Alterna entre tensão e respiro",
    icon: "compass",
    genres: [],
  },
  {
    value: "contemplativo",
    label: "Lento e contemplativo",
    description: "Tempo para os personagens e o ambiente",
    icon: "moon",
    genres: [18, 10749, 9648],
  },
] as const satisfies readonly PaceOption[];

export function getPaceOption(pace: PaceId): PaceOption {
  return (
    PACE_OPTIONS.find((option) => option.value === pace) ?? PACE_OPTIONS[0]
  );
}

/* -------------------------------------------------------------------------- */
/* Década                                                                     */
/* -------------------------------------------------------------------------- */

export const DECADE_IDS = [
  "classicos",
  "anos80_90",
  "anos2000",
  "anos2010",
  "atuais",
  "qualquer",
] as const;

export type DecadeId = (typeof DECADE_IDS)[number];

export interface DecadeOption extends BaseQuizOption<DecadeId> {
  from: string | null;
  to: string | null;
}

export const DECADE_OPTIONS = [
  {
    value: "classicos",
    label: "Clássicos",
    description: "Até 1979",
    icon: "film",
    from: "1900-01-01",
    to: "1979-12-31",
  },
  {
    value: "anos80_90",
    label: "Anos 80 e 90",
    description: "De 1980 a 1999",
    icon: "calendar",
    from: "1980-01-01",
    to: "1999-12-31",
  },
  {
    value: "anos2000",
    label: "Anos 2000",
    description: "De 2000 a 2009",
    icon: "calendar",
    from: "2000-01-01",
    to: "2009-12-31",
  },
  {
    value: "anos2010",
    label: "Anos 2010",
    description: "De 2010 a 2019",
    icon: "calendar",
    from: "2010-01-01",
    to: "2019-12-31",
  },
  {
    value: "atuais",
    label: "2020 em diante",
    description: "Lançamentos recentes",
    icon: "sparkles",
    from: "2020-01-01",
    to: null,
  },
  {
    value: "qualquer",
    label: "Tanto faz",
    description: "Qualquer época",
    icon: "globe",
    from: null,
    to: null,
  },
] as const satisfies readonly DecadeOption[];

export function getDecadeOption(decade: DecadeId): DecadeOption {
  return (
    DECADE_OPTIONS.find((option) => option.value === decade) ??
    DECADE_OPTIONS[DECADE_OPTIONS.length - 1]!
  );
}

/* -------------------------------------------------------------------------- */
/* Duração                                                                    */
/* -------------------------------------------------------------------------- */

export const RUNTIME_IDS = ["curto", "medio", "longo", "qualquer"] as const;

export type RuntimeId = (typeof RUNTIME_IDS)[number];

export interface RuntimeOption extends BaseQuizOption<RuntimeId> {
  gte: number | null;
  lte: number | null;
}

export const RUNTIME_OPTIONS = [
  {
    value: "curto",
    label: "Sessão rápida",
    description: "Até 100 minutos",
    icon: "timer",
    gte: null,
    lte: 100,
  },
  {
    value: "medio",
    label: "Duração padrão",
    description: "Entre 100 e 140 minutos",
    icon: "timer",
    gte: 100,
    lte: 140,
  },
  {
    value: "longo",
    label: "Mergulho longo",
    description: "Mais de 140 minutos",
    icon: "timer",
    gte: 140,
    lte: null,
  },
  {
    value: "qualquer",
    label: "Tanto faz",
    description: "Qualquer duração",
    icon: "globe",
    gte: null,
    lte: null,
  },
] as const satisfies readonly RuntimeOption[];

export function getRuntimeOption(runtime: RuntimeId): RuntimeOption {
  return (
    RUNTIME_OPTIONS.find((option) => option.value === runtime) ??
    RUNTIME_OPTIONS[RUNTIME_OPTIONS.length - 1]!
  );
}

/* -------------------------------------------------------------------------- */
/* História real x ficção                                                     */
/* -------------------------------------------------------------------------- */

export const REALITY_IDS = ["real", "ficcao", "qualquer"] as const;

export type RealityId = (typeof REALITY_IDS)[number];

export interface RealityOption extends BaseQuizOption<RealityId> {
  /** Gêneros que recebem reforço quando a pessoa prefere histórias reais. */
  genres: readonly number[];
  /** Gêneros excluídos da busca, quando fizer sentido. */
  withoutGenres: readonly number[];
}

export const REALITY_OPTIONS = [
  {
    value: "real",
    label: "História real",
    description: "Fatos, biografias e documentários",
    icon: "book",
    genres: [36, 10757, 99],
    withoutGenres: [],
  },
  {
    value: "ficcao",
    label: "Ficção",
    description: "Mundos inventados, sem documentários",
    icon: "rocket",
    genres: [],
    withoutGenres: [99],
  },
  {
    value: "qualquer",
    label: "Tanto faz",
    description: "Sem preferência",
    icon: "globe",
    genres: [],
    withoutGenres: [],
  },
] as const satisfies readonly RealityOption[];

export function getRealityOption(reality: RealityId): RealityOption {
  return (
    REALITY_OPTIONS.find((option) => option.value === reality) ??
    REALITY_OPTIONS[REALITY_OPTIONS.length - 1]!
  );
}

/* -------------------------------------------------------------------------- */
/* Respostas                                                                  */
/* -------------------------------------------------------------------------- */

const genreIdSchema = z
  .number()
  .int()
  .refine((value) => GENRE_ID_SET.has(value), { message: "Gênero inválido" });

export const quizAnswersSchema = z.object({
  genres: z.array(genreIdSchema).min(1).max(MAX_SELECTED_GENRES),
  tone: z.enum(TONE_IDS),
  pace: z.enum(PACE_IDS),
  decade: z.enum(DECADE_IDS),
  runtime: z.enum(RUNTIME_IDS),
  reality: z.enum(REALITY_IDS),
});

export type QuizAnswers = z.infer<typeof quizAnswersSchema>;

export type QuizDraft = {
  genres: number[];
  tone?: ToneId;
  pace?: PaceId;
  decade?: DecadeId;
  runtime?: RuntimeId;
  reality?: RealityId;
};

export const EMPTY_QUIZ_DRAFT: QuizDraft = { genres: [] };

export function isQuizDraftComplete(draft: QuizDraft): draft is QuizAnswers {
  return (
    draft.genres.length > 0 &&
    draft.genres.length <= MAX_SELECTED_GENRES &&
    draft.tone !== undefined &&
    draft.pace !== undefined &&
    draft.decade !== undefined &&
    draft.runtime !== undefined &&
    draft.reality !== undefined
  );
}

export function isQuizStepAnswered(
  step: QuizStepId,
  draft: QuizDraft,
): boolean {
  switch (step) {
    case "genres":
      return draft.genres.length > 0;
    case "tone":
      return draft.tone !== undefined;
    case "pace":
      return draft.pace !== undefined;
    case "decade":
      return draft.decade !== undefined;
    case "runtime":
      return draft.runtime !== undefined;
    case "reality":
      return draft.reality !== undefined;
  }
}

export function quizDraftToAnswers(draft: QuizDraft): QuizAnswers | null {
  return isQuizDraftComplete(draft) ? draft : null;
}

export function quizAnswersToDraft(answers: QuizAnswers): QuizDraft {
  return { ...answers, genres: [...answers.genres] };
}
