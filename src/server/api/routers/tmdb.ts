import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { posts } from "@/server/db/schema";
import { buildTmdbUrl, fetchTmdbList, tmdbOptions } from "@/server/tmdb/client";
import {
  creditsSchema,
  movieSchema,
  peopleListSchema,
  personCreditSchema,
  providerSchema,
} from "@/server/types/api-tmdb";

const fetchMovieList = (path: string) => fetchTmdbList(path);

export const tmdbRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  movie: {
    trending: publicProcedure.query(() => fetchMovieList("trending/movie/day")),

    popular: publicProcedure.query(() => fetchMovieList("movie/popular")),

    topRated: publicProcedure.query(() => fetchMovieList("movie/top_rated")),

    nowPlaying: publicProcedure.query(() =>
      fetchMovieList("movie/now_playing"),
    ),
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
          throw new Error(
            `Invalid movie data: ${validatedResponse.error.message}`,
          );
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

        const validatedResponse = creditsSchema.safeParse(
          await response.json(),
        );

        if (!validatedResponse.success) {
          throw new Error(
            `Invalid credits data: ${validatedResponse.error.message}`,
          );
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

        const validatedResponse = providerSchema.safeParse(
          await response.json(),
        );

        if (!validatedResponse.success) {
          return null; // Return null if the response is invalid
        }

        return validatedResponse.data;
      }),
  },

  people: {
    popular: publicProcedure
      .input(z.object({ page: z.number().int().min(1).max(500) }).optional())
      .query(async ({ input }) => {
        const response = await fetch(
          buildTmdbUrl("person/popular", {
            page: String(input?.page ?? 1),
          }),
          tmdbOptions,
        );

        if (!response.ok) {
          throw new Error(
            `TMDB request failed: ${response.status} ${response.statusText}`,
          );
        }

        const validatedResponse = peopleListSchema.safeParse(
          await response.json(),
        );

        if (!validatedResponse.success) {
          throw new Error(
            `Invalid popular people data: ${validatedResponse.error.message}`,
          );
        }

        return validatedResponse.data;
      }),

    search: publicProcedure
      .input(
        z.object({
          query: z.string().trim().min(1).max(100),
          cursor: z.number().int().min(1).max(500).optional(),
        }),
      )
      .query(async ({ input }) => {
        const response = await fetch(
          buildTmdbUrl("search/person", {
            query: input.query,
            page: String(input.cursor ?? 1),
          }),
          tmdbOptions,
        );

        if (!response.ok) {
          throw new Error(
            `TMDB request failed: ${response.status} ${response.statusText}`,
          );
        }

        const validatedResponse = peopleListSchema.safeParse(
          await response.json(),
        );

        if (!validatedResponse.success) {
          throw new Error(
            `Invalid people search data: ${validatedResponse.error.message}`,
          );
        }

        return validatedResponse.data;
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const response = await fetch(
          buildTmdbUrl(`person/${input.id}?append_to_response=credits`),
          tmdbOptions,
        );

        if (!response.ok) {
          throw new Error(
            `TMDB request failed: ${response.status} ${response.statusText}`,
          );
        }

        const validatedResponse = personCreditSchema.safeParse(
          await response.json(),
        );

        if (!validatedResponse.success) {
          throw new Error(
            `Invalid person credit data: ${validatedResponse.error.message}`,
          );
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
