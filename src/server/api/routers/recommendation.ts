import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { recommendationsSeen, quizResponses } from "@/server/db/schema";
import { getRecommendations } from "@/server/recommendation/engine";
import { SEEN_STATUSES, quizAnswersSchema } from "@/utils/recommendation";

const excludeIdsSchema = z
  .array(z.number().int().positive())
  .max(500)
  .optional();

export const recommendationRouter = createTRPCRouter({
  /**
   * Gera até 5 sugestões a partir das respostas do quiz.
   *
   * Funciona para visitantes e para usuários logados. Quando existe sessão,
   * os filmes já vistos/rejeitados no banco entram automaticamente na lista
   * de exclusão.
   */
  suggest: publicProcedure
    .input(
      z.object({
        answers: quizAnswersSchema,
        excludeIds: excludeIdsSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const excluded = new Set<number>(input.excludeIds ?? []);

      if (ctx.session?.user) {
        const persisted = await ctx.db
          .select({ movieId: recommendationsSeen.movieId })
          .from(recommendationsSeen)
          .where(eq(recommendationsSeen.userId, ctx.session.user.id))
          .limit(500);

        for (const row of persisted) excluded.add(row.movieId);
      }

      return getRecommendations(input.answers, [...excluded]);
    }),

  /** Salva as respostas do quiz para o usuário logado. */
  saveQuiz: protectedProcedure
    .input(z.object({ answers: quizAnswersSchema }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(quizResponses).values({
        userId: ctx.session.user.id,
        answers: input.answers,
      });
    }),

  /**
   * Marca um filme como já visto ou rejeitado. O par (usuário, filme) é
   * único, então clicar duas vezes apenas atualiza o status.
   */
  markSeen: protectedProcedure
    .input(
      z.object({
        movieId: z.number().int().positive(),
        status: z.enum(SEEN_STATUSES),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(recommendationsSeen)
        .values({
          userId: ctx.session.user.id,
          movieId: input.movieId,
          status: input.status,
        })
        .onConflictDoUpdate({
          target: [recommendationsSeen.userId, recommendationsSeen.movieId],
          set: { status: input.status },
        });
    }),
});
