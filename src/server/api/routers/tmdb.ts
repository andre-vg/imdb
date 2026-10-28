import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { posts } from "@/server/db/schema";
import { env } from "@/env";
import { creditsSchema, movieSchema, popularSchema, providerSchema } from "@/server/types/api-tmdb";

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
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const response = await fetch(
          buildTmdbUrl(`movie/${input.id}`),
          tmdbOptions,
        );

        if (!response.ok) {
          throw new Error(
            `TMDB request failed: ${response.status} ${response.statusText}`,
          );
        }

        const validatedResponse = movieSchema.safeParse(await response.json());

        if (!validatedResponse.success) {
          throw new Error(`Invalid movie data: ${validatedResponse.error.message}`);
        }

        return validatedResponse.data;
      }),

      getCreditsById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const response = await fetch(
          buildTmdbUrl(`movie/${input.id}/credits`),
          tmdbOptions,
        );

        if (!response.ok) {
          throw new Error(
            `TMDB request failed: ${response.status} ${response.statusText}`,
          );
        }

        const validatedResponse = creditsSchema.safeParse(await response.json());

        if (!validatedResponse.success) {
          throw new Error(`Invalid credits data: ${validatedResponse.error.message}`);
        }

        return validatedResponse.data;
      }),

      getProvidersById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const response = await fetch(
          buildTmdbUrl(`movie/${input.id}/watch/providers`),
          tmdbOptions,
        );

        if (!response.ok) {
          throw new Error(
            `TMDB request failed: ${response.status} ${response.statusText}`,
          );
        }

        const validatedResponse = providerSchema.safeParse(await response.json());

        if (!validatedResponse.success) {
          return null; // Return null if the response is invalid
        }

        return validatedResponse.data;
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
