import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { posts } from "@/server/db/schema";
import { env } from "@/env";
import { popularSchema } from "@/server/types/api-tmdb";

const tmdbURL = "https://api.themoviedb.org/3/";
const tmdbLanguage = "pt-BR";

const buildTmdbUrl = (path: string, params: Record<string, string> = {}) => {
  const url = new URL(path, tmdbURL);

  url.searchParams.set("language", params.language ?? tmdbLanguage);

  return url.toString();
};

const tmdbOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: env.TMDB_BEARER,
  },
};

export const tmdbRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  movie: {
    popular: publicProcedure.query(async () => {
      const response = await fetch(buildTmdbUrl("movie/popular"), tmdbOptions);

      if (!response.ok) {
        throw new Error(
          `TMDB request failed: ${response.status} ${response.statusText}`,
        );
      }

      const validatedResponse = popularSchema.parse(await response.json());

      return validatedResponse;
    }),
  },

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name,
        createdById: ctx.session.user.id,
      });
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    return post ?? null;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
