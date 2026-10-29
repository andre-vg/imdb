"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Card, Chip, Spinner } from "@heroui/react";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  RotateCcw,
  Shuffle,
  Sparkles,
  TriangleAlert,
} from "lucide-react";

import { authClient } from "@/server/better-auth/client";
import { api, type RouterOutputs } from "@/trpc/react";
import {
  EMPTY_QUIZ_DRAFT,
  PENDING_ANSWERS_STORAGE_KEY,
  QUIZ_STEP_COUNT,
  QUIZ_STEP_IDS,
  getDecadeOption,
  getGenreLabel,
  getRuntimeOption,
  getToneOption,
  isQuizDraftComplete,
  isQuizStepAnswered,
  quizAnswersSchema,
  quizAnswersToDraft,
  quizDraftToAnswers,
  type QuizAnswers,
  type QuizDraft,
  type QuizStepId,
  type SeenStatus,
} from "@/utils/recommendation";

import QuizOptions from "./quiz-options";
import QuizProgress from "./quiz-progress";
import RecommendationCard from "./recommendation-card";
import ResultsSkeleton from "./results-skeleton";
import SaveCta from "./save-cta";

type RecommendationResult = RouterOutputs["recommendation"]["suggest"];

interface StepContent {
  eyebrow: string;
  title: string;
  description: string;
}

const STEP_CONTENT: Record<QuizStepId, StepContent> = {
  genres: {
    eyebrow: "Seu gosto",
    title: "Que histórias te prendem?",
    description:
      "Escolha de 1 a 3 gêneros que você costuma procurar. Eles são o coração da recomendação.",
  },
  tone: {
    eyebrow: "A experiência",
    title: "Que clima você quer sentir?",
    description:
      "Pense no que você quer sentir quando o filme termina — e não só no assunto dele.",
  },
  pace: {
    eyebrow: "O ritmo",
    title: "Como você gosta de assistir?",
    description:
      "Do corte rápido ao plano longo, o ritmo muda completamente a experiência.",
  },
  decade: {
    eyebrow: "A época",
    title: "De que época vem o seu cinema?",
    description:
      "Clássicos atemporais ou lançamentos recentes? Escolha a janela de tempo que combina com a sua noite.",
  },
  runtime: {
    eyebrow: "A sessão",
    title: "Quanto tempo você tem?",
    description:
      "A duração entra como filtro e ajuda a montar uma sessão que caiba no seu tempo.",
  },
  reality: {
    eyebrow: "A origem",
    title: "História real ou ficção?",
    description:
      "Fatos, biografias e documentários ou mundos totalmente inventados?",
  },
};

function buildRelaxedMessage(relaxed: readonly string[]): string {
  if (relaxed.length === 0) return "";

  const filters = relaxed.join(" e ");

  return `Não encontramos filmes suficientes com todos os filtros. Para completar as 5 sugestões, abrimos mão de ${filters}.`;
}

export default function RecommendationWizard() {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const isAuthenticated = Boolean(session?.user);

  const [draft, setDraft] = useState<QuizDraft>(EMPTY_QUIZ_DRAFT);
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [excludedIds, setExcludedIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasRestored, setHasRestored] = useState(false);

  const savedAnswersRef = useRef<string | null>(null);
  const resultsRef = useRef<HTMLElement>(null);

  const suggestMutation = api.recommendation.suggest.useMutation();
  const saveQuizMutation = api.recommendation.saveQuiz.useMutation();
  const markSeenMutation = api.recommendation.markSeen.useMutation();

  const runSuggest = useCallback(
    async (answers: QuizAnswers, extraExcluded: readonly number[] = []) => {
      setError(null);

      try {
        const data = await suggestMutation.mutateAsync({
          answers,
          excludeIds: [...new Set([...excludedIds, ...extraExcluded])],
        });

        setResult(data);

        if (isAuthenticated) {
          const signature = JSON.stringify(answers);

          if (savedAnswersRef.current !== signature) {
            savedAnswersRef.current = signature;
            saveQuizMutation.mutate({ answers });
          }
        }

        window.requestAnimationFrame(() => {
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      } catch {
        setError(
          "Não foi possível buscar recomendações agora. Verifique sua conexão e tente novamente.",
        );
      }
    },
    [excludedIds, isAuthenticated, saveQuizMutation, suggestMutation],
  );

  // Recupera as respostas guardadas antes do login. Se o visitante voltou
  // autenticado, já geramos a lista; caso contrário, deixamos o quiz pronto
  // no último passo para ele concluir.
  useEffect(() => {
    if (hasRestored || isSessionPending) return;

    setHasRestored(true);

    const stored = window.sessionStorage.getItem(PENDING_ANSWERS_STORAGE_KEY);

    if (!stored) return;

    window.sessionStorage.removeItem(PENDING_ANSWERS_STORAGE_KEY);

    try {
      const parsed = quizAnswersSchema.safeParse(JSON.parse(stored));

      if (!parsed.success) return;

      setDraft(quizAnswersToDraft(parsed.data));

      if (isAuthenticated) {
        void runSuggest(parsed.data);
      } else {
        setStepIndex(QUIZ_STEP_COUNT - 1);
      }
    } catch {
      // Respostas inválidas no storage são descartadas em silêncio.
    }
  }, [hasRestored, isAuthenticated, isSessionPending, runSuggest]);

  const currentStep = QUIZ_STEP_IDS[stepIndex] ?? QUIZ_STEP_IDS[0];
  const content = STEP_CONTENT[currentStep];
  const canContinue = isQuizStepAnswered(currentStep, draft);
  const isLastStep = stepIndex === QUIZ_STEP_COUNT - 1;
  const showResults = result !== null || suggestMutation.isPending;

  const handleDraftChange = (patch: Partial<QuizDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setError(null);
  };

  const handleNext = () => {
    if (!canContinue) return;

    if (!isLastStep) {
      setStepIndex((index) => Math.min(index + 1, QUIZ_STEP_COUNT - 1));
      return;
    }

    const answers = quizDraftToAnswers(draft);

    if (answers) void runSuggest(answers);
  };

  const handleBack = () => {
    setStepIndex((index) => Math.max(index - 1, 0));
  };

  /**
   * Volta ao modo de perguntas mantendo as respostas, para ajustar um
   * critério sem recomeçar do zero.
   */
  const handleEditAnswers = () => {
    setResult(null);
    setError(null);
    setStepIndex(0);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleRestart = () => {
    setDraft(EMPTY_QUIZ_DRAFT);
    setStepIndex(0);
    setResult(null);
    setError(null);
    savedAnswersRef.current = null;
  };

  const handleRegenerate = () => {
    const answers = quizDraftToAnswers(draft);

    if (!answers || !result) return;

    const currentIds = result.movies.map((item) => item.movie.id);

    setExcludedIds((current) => [...new Set([...current, ...currentIds])]);
    void runSuggest(answers, currentIds);
  };

  const handleMark = (movieId: number, status: SeenStatus) => {
    setExcludedIds((current) =>
      current.includes(movieId) ? current : [...current, movieId],
    );

    setResult((current) =>
      current
        ? {
            ...current,
            movies: current.movies.filter((item) => item.movie.id !== movieId),
          }
        : current,
    );

    if (isAuthenticated) {
      markSeenMutation.mutate({ movieId, status });
    }
  };

  const handleSignIn = () => {
    if (isQuizDraftComplete(draft)) {
      window.sessionStorage.setItem(
        PENDING_ANSWERS_STORAGE_KEY,
        JSON.stringify(draft),
      );
    }

    router.push(`/entrar?next=${encodeURIComponent("/recomendar")}`);
  };

  if (showResults) {
    const relaxedMessage = result ? buildRelaxedMessage(result.relaxed) : "";

    return (
      <section
        aria-labelledby="recommendation-results-title"
        className="scroll-mt-24"
        ref={resultsRef}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-accent flex items-center gap-2 text-[11px] font-semibold tracking-[0.28em] uppercase">
              <span aria-hidden="true" className="bg-accent/60 h-px w-6" />
              Seu resultado
            </p>

            <h2
              className="font-display text-foreground mt-3 text-4xl leading-[0.95] tracking-wide uppercase sm:text-5xl"
              id="recommendation-results-title"
            >
              Cinco filmes para você
            </h2>

            <p className="text-muted mt-3 text-sm leading-relaxed sm:text-base">
              Ranqueados pelo seu perfil: gênero, tom, época e qualidade. Marque
              o que já viu para não repetir.
            </p>

            {isQuizDraftComplete(draft) && (
              <ul
                aria-label="Resumo das suas respostas"
                className="mt-4 flex flex-wrap gap-1.5"
              >
                {draft.genres.map((genreId) => (
                  <li key={genreId}>
                    <Chip color="accent" size="sm" variant="soft">
                      {getGenreLabel(genreId)}
                    </Chip>
                  </li>
                ))}
                <li>
                  <Chip color="default" size="sm" variant="soft">
                    {getToneOption(draft.tone).label}
                  </Chip>
                </li>
                <li>
                  <Chip color="default" size="sm" variant="soft">
                    {getDecadeOption(draft.decade).label}
                  </Chip>
                </li>
                <li>
                  <Chip color="default" size="sm" variant="soft">
                    {getRuntimeOption(draft.runtime).label}
                  </Chip>
                </li>
              </ul>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              isDisabled={suggestMutation.isPending || !result}
              onPress={handleRegenerate}
              variant="secondary"
            >
              {suggestMutation.isPending ? (
                <Spinner size="sm" />
              ) : (
                <Shuffle aria-hidden="true" className="size-4" />
              )}
              Ver outros 5
            </Button>

            <Button
              isDisabled={suggestMutation.isPending}
              onPress={handleEditAnswers}
              variant="tertiary"
            >
              <RefreshCw aria-hidden="true" className="size-4" />
              Ajustar respostas
            </Button>

            <Button
              isDisabled={suggestMutation.isPending}
              onPress={handleRestart}
              variant="ghost"
            >
              <RotateCcw aria-hidden="true" className="size-4" />
              Refazer o quiz
            </Button>
          </div>
        </div>

        {relaxedMessage && (
          <Alert className="mt-6" status="warning">
            <Alert.Indicator>
              <TriangleAlert aria-hidden="true" className="size-5" />
            </Alert.Indicator>
            <Alert.Content>
              <Alert.Title>Ajustamos alguns filtros</Alert.Title>
              <Alert.Description>{relaxedMessage}</Alert.Description>
            </Alert.Content>
          </Alert>
        )}

        {error && (
          <Alert className="mt-6" status="danger">
            <Alert.Indicator>
              <TriangleAlert aria-hidden="true" className="size-5" />
            </Alert.Indicator>
            <Alert.Content>
              <Alert.Title>Algo deu errado</Alert.Title>
              <Alert.Description>{error}</Alert.Description>
            </Alert.Content>
          </Alert>
        )}

        <div className="mt-8" aria-live="polite">
          {suggestMutation.isPending ? (
            <ResultsSkeleton />
          ) : result && result.movies.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {result.movies.map((recommendation, index) => (
                <RecommendationCard
                  isPending={markSeenMutation.isPending}
                  key={recommendation.movie.id}
                  onDismiss={(movieId) => handleMark(movieId, "dismissed")}
                  onMarkSeen={(movieId) => handleMark(movieId, "seen")}
                  position={index + 1}
                  recommendation={recommendation}
                />
              ))}
            </div>
          ) : (
            <Card
              className="border-separator bg-surface items-center gap-4 border p-10 text-center"
              variant="default"
            >
              <span
                aria-hidden="true"
                className="bg-accent-soft text-accent grid size-12 place-items-center rounded-full"
              >
                <RefreshCw className="size-6" />
              </span>

              <div>
                <h3 className="text-foreground text-lg font-semibold">
                  Essa lista acabou
                </h3>
                <p className="text-muted mx-auto mt-1 max-w-md text-sm leading-relaxed">
                  Você já marcou todos os filmes desta seleção. Busque outra
                  leva com o mesmo perfil.
                </p>
              </div>

              <Button onPress={handleRegenerate} variant="primary">
                <Shuffle aria-hidden="true" className="size-4" />
                Ver outros 5
              </Button>
            </Card>
          )}
        </div>

        <p className="text-muted mt-6 text-xs">
          {excludedIds.length > 0
            ? `${excludedIds.length} ${excludedIds.length === 1 ? "filme descartado" : "filmes descartados"} nesta sessão.`
            : "Os filmes que você marcar como vistos ou rejeitados não aparecem de novo."}
        </p>

        {!isAuthenticated && <SaveCta onSignIn={handleSignIn} />}
      </section>
    );
  }

  return (
    <Card
      className="border-separator bg-surface overflow-hidden border p-6 sm:p-8"
      variant="default"
    >
      <QuizProgress current={stepIndex + 1} total={QUIZ_STEP_COUNT} />

      <div className="animate-fade-up mt-8" key={currentStep}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-accent text-[11px] font-semibold tracking-[0.28em] uppercase">
              {content.eyebrow}
            </p>
            <h2 className="font-display text-foreground mt-2 text-4xl leading-[0.95] tracking-wide uppercase sm:text-5xl">
              {content.title}
            </h2>
          </div>

          {currentStep === "genres" && (
            <Chip color="accent" size="sm" variant="soft">
              {draft.genres.length} de 3 selecionados
            </Chip>
          )}
        </div>

        <p className="text-muted mt-3 max-w-2xl text-sm leading-relaxed sm:text-base">
          {content.description}
        </p>

        <div className="mt-6">
          <QuizOptions
            draft={draft}
            onChange={handleDraftChange}
            step={currentStep}
          />
        </div>
      </div>

      {error && (
        <Alert className="mt-6" status="danger">
          <Alert.Indicator>
            <TriangleAlert aria-hidden="true" className="size-5" />
          </Alert.Indicator>
          <Alert.Content>
            <Alert.Title>Algo deu errado</Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      <div className="border-separator mt-8 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Button
          isDisabled={stepIndex === 0 || suggestMutation.isPending}
          onPress={handleBack}
          variant="ghost"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Voltar
        </Button>

        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          {!canContinue && (
            <span className="text-muted text-center text-xs sm:text-right">
              {currentStep === "genres"
                ? "Escolha pelo menos um gênero."
                : "Selecione uma opção para continuar."}
            </span>
          )}

          <Button
            isDisabled={!canContinue || suggestMutation.isPending}
            onPress={handleNext}
            size="lg"
            variant="primary"
          >
            {suggestMutation.isPending ? (
              <>
                <Spinner size="sm" />
                Buscando…
              </>
            ) : isLastStep ? (
              <>
                <Sparkles aria-hidden="true" className="size-4" />
                Ver recomendações
              </>
            ) : (
              <>
                Continuar
                <ArrowRight aria-hidden="true" className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
