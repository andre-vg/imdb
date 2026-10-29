import { z } from "zod";

export const popularSchema = z.object({
  page: z.number(),
  results: z.array(
    z.object({
      adult: z.boolean(),
      backdrop_path: z.string().nullable(),
      genre_ids: z.array(z.number()),
      id: z.number(),
      original_language: z.string(),
      original_title: z.string(),
      overview: z.string(),
      popularity: z.number(),
      poster_path: z.string().nullable(),
      release_date: z.string(),
      title: z.string(),
      video: z.boolean(),
      vote_average: z.number(),
      vote_count: z.number(),
    }),
  ),
  total_pages: z.number(),
  total_results: z.number(),
});

export const movieSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  belongs_to_collection: z
    .object({
      id: z.number(),
      name: z.string(),
      poster_path: z.string().nullable(),
      backdrop_path: z.string().nullable(),
    })
    .nullable(),
  budget: z.number(),
  genres: z.array(z.object({ id: z.number(), name: z.string() })),
  homepage: z.string().nullable(),
  id: z.number(),
  imdb_id: z.string().nullable(),
  origin_country: z.array(z.string()),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(),
  production_companies: z.array(
    z.object({
      id: z.number(),
      logo_path: z.string().nullable(),
      name: z.string(),
      origin_country: z.string().nullable(),
    }),
  ),
  production_countries: z.array(
    z.object({ iso_3166_1: z.string(), name: z.string() }),
  ),
  release_date: z.string(),
  revenue: z.number(),
  runtime: z.number(),
  spoken_languages: z.array(
    z.object({
      english_name: z.string(),
      iso_639_1: z.string(),
      name: z.string(),
    }),
  ),
  status: z.string(),
  tagline: z.string().nullable(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
});

export const creditsSchema = z.object({
  id: z.number(),
  cast: z.array(
    z.union([
      z.object({
        adult: z.boolean(),
        gender: z.number(),
        id: z.number(),
        known_for_department: z.string(),
        name: z.string(),
        original_name: z.string(),
        popularity: z.number(),
        profile_path: z.string(),
        cast_id: z.number(),
        character: z.string(),
        credit_id: z.string(),
        order: z.number(),
      }),
      z.object({
        adult: z.boolean(),
        gender: z.number(),
        id: z.number(),
        known_for_department: z.string(),
        name: z.string(),
        original_name: z.string(),
        popularity: z.number(),
        profile_path: z.null(),
        cast_id: z.number(),
        character: z.string(),
        credit_id: z.string(),
        order: z.number(),
      }),
    ]),
  ),
  crew: z.array(
    z.union([
      z.object({
        adult: z.boolean(),
        gender: z.number(),
        id: z.number(),
        known_for_department: z.string(),
        name: z.string(),
        original_name: z.string(),
        popularity: z.number(),
        profile_path: z.string(),
        credit_id: z.string(),
        department: z.string(),
        job: z.string(),
      }),
      z.object({
        adult: z.boolean(),
        gender: z.number(),
        id: z.number(),
        known_for_department: z.string(),
        name: z.string(),
        original_name: z.string(),
        popularity: z.number(),
        profile_path: z.null(),
        credit_id: z.string(),
        department: z.string(),
        job: z.string(),
      }),
    ]),
  ),
});

const watchProviderSchema = z.object({
  logo_path: z.string(),
  provider_id: z.number(),
  provider_name: z.string(),
  display_priority: z.number(),
});

const watchProviderRegionSchema = z.object({
  link: z.string().optional(),
  flatrate: z.array(watchProviderSchema).optional(),
  rent: z.array(watchProviderSchema).optional(),
  buy: z.array(watchProviderSchema).optional(),
  free: z.array(watchProviderSchema).optional(),
  ads: z.array(watchProviderSchema).optional(),
});

export const providerSchema = z.object({
  id: z.number(),
  results: z.record(z.string(), watchProviderRegionSchema),
});

/**
 * Item de crédito de uma pessoa (filme em que atuou ou trabalhou).
 * Campos como `character`, `job` e `department` variam conforme o tipo de
 * crédito, por isso são opcionais.
 */
const personCreditItemSchema = z
  .object({
    adult: z.boolean(),
    backdrop_path: z.string().nullable(),
    genre_ids: z.array(z.number()),
    id: z.number(),
    title: z.string(),
    original_language: z.string(),
    original_title: z.string(),
    overview: z.string(),
    popularity: z.number(),
    poster_path: z.string().nullable(),
    release_date: z.string(),
    softcore: z.boolean().optional(),
    video: z.boolean(),
    vote_average: z.number(),
    vote_count: z.number(),
    character: z.string().optional(),
    credit_id: z.string(),
    order: z.number().optional(),
    department: z.string().optional(),
    job: z.string().optional(),
  })
  .passthrough();

export const personCreditSchema = z.object({
  adult: z.boolean(),
  also_known_as: z.array(z.string()).default([]),
  biography: z.string().default(""),
  birthday: z.string().nullable(),
  deathday: z.string().nullable(),
  gender: z.number(),
  homepage: z.string().nullable(),
  id: z.number(),
  imdb_id: z.string().nullable(),
  known_for_department: z.string(),
  name: z.string(),
  place_of_birth: z.string().nullable(),
  popularity: z.number(),
  profile_path: z.string().nullable(),
  credits: z
    .object({
      cast: z.array(personCreditItemSchema).default([]),
      crew: z.array(personCreditItemSchema).default([]),
    })
    .default({ cast: [], crew: [] }),
});

const knownForItemSchema = z
  .object({
    id: z.number(),
    media_type: z.string(),
    title: z.string().optional(),
    name: z.string().optional(),
    poster_path: z.string().nullable().optional(),
    release_date: z.string().optional(),
    first_air_date: z.string().optional(),
    vote_average: z.number().optional(),
  })
  .passthrough();

const popularPersonSchema = z.object({
  adult: z.boolean(),
  gender: z.number().default(0),
  id: z.number(),
  known_for_department: z.string().default("Acting"),
  name: z.string(),
  original_name: z.string(),
  popularity: z.number(),
  profile_path: z.string().nullable(),
  known_for: z.array(knownForItemSchema).default([]),
});

export const peopleListSchema = z.object({
  page: z.number(),
  results: z.array(popularPersonSchema),
  total_pages: z.number(),
  total_results: z.number(),
});
