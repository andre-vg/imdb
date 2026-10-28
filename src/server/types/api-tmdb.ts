import { z } from "zod";

export const popularSchema = z.object({
  page: z.number(),
  results: z.array(
    z.object({
      adult: z.boolean(),
      backdrop_path: z.string(),
      genre_ids: z.array(z.number()),
      id: z.number(),
      original_language: z.string(),
      original_title: z.string(),
      overview: z.string(),
      popularity: z.number(),
      poster_path: z.string(),
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
  backdrop_path: z.string(),
  belongs_to_collection: z
    .object({
      id: z.number(),
      name: z.string(),
      poster_path: z.string(),
      backdrop_path: z.string()
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
  poster_path: z.string(),
  production_companies: z.array(
    z.object({
      id: z.number(),
      logo_path: z.string().nullable(),
      name: z.string(),
      origin_country: z.string()
    })
  ),
  production_countries: z.array(
    z.object({ iso_3166_1: z.string(), name: z.string() })
  ),
  release_date: z.string(),
  revenue: z.number(),
  runtime: z.number(),
  spoken_languages: z.array(
    z.object({
      english_name: z.string(),
      iso_639_1: z.string(),
      name: z.string()
    })
  ),
  status: z.string(),
  tagline: z.string().nullable(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number()
})


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
        order: z.number()
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
        order: z.number()
      })
    ])
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
        job: z.string()
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
        job: z.string()
      })
    ])
  )
})


export const providerSchema = z.object({
  id: z.number(),
  results: z.object({
    AD: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    AE: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    AG: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    AL: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    AR: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    AT: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    AU: z.object({
      link: z.string(),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    BA: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    BB: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    BE: z.object({
      link: z.string(),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    BF: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    BG: z.object({
      link: z.string(),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    BH: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    BO: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    BR: z.object({
      link: z.string(),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    BS: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    BZ: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    CA: z.object({
      link: z.string(),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    CD: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    CH: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    CI: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    CL: z.object({
      link: z.string(),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    CM: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    CO: z.object({
      link: z.string(),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    CR: z.object({
      link: z.string(),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    CV: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    CZ: z.object({
      link: z.string(),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    DE: z.object({
      link: z.string(),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    DK: z.object({
      link: z.string(),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    DO: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    DZ: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    EC: z.object({
      link: z.string(),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    EE: z.object({
      link: z.string(),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    EG: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    ES: z.object({
      link: z.string(),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    FI: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    FJ: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    FR: z.object({
      link: z.string(),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    GB: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    GG: z.object({
      link: z.string(),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    GH: z.object({
      link: z.string(),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    GI: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    GQ: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    GR: z.object({
      link: z.string(),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    GT: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    GY: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    HK: z.object({
      link: z.string(),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    HN: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    HR: z.object({
      link: z.string(),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    HU: z.object({
      link: z.string(),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    ID: z.object({
      link: z.string(),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    IE: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    IL: z.object({
      link: z.string(),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    IN: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    IQ: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    IS: z.object({
      link: z.string(),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    IT: z.object({
      link: z.string(),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    JM: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    JO: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    JP: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    KE: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    KW: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    LB: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    LC: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    LI: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    LT: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    LU: z.object({
      link: z.string(),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    LV: z.object({
      link: z.string(),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    LY: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    MA: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    MD: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    MG: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    MK: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    ML: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    MT: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    MW: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    MX: z.object({
      link: z.string(),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    MY: z.object({
      link: z.string(),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    MZ: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    NE: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    NG: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    NI: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    NL: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    NO: z.object({
      link: z.string(),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    NZ: z.object({
      link: z.string(),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    OM: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    PA: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    PE: z.object({
      link: z.string(),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    PG: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    PH: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    PL: z.object({
      link: z.string(),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    PS: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    PT: z.object({
      link: z.string(),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    PY: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    QA: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    RO: z.object({
      link: z.string(),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    RS: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    SA: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    SC: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    SE: z.object({
      link: z.string(),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    SG: z.object({
      link: z.string(),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    SI: z.object({
      link: z.string(),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    SK: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    SM: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    SN: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    SV: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    TC: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    TD: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    TH: z.object({
      link: z.string(),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    TN: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    TR: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    TT: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    TW: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    TZ: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    UG: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    US: z.object({
      link: z.string(),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    UY: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    VA: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    VE: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    YE: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    ZA: z.object({
      link: z.string(),
      buy: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      ),
      rent: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    ZM: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    }),
    ZW: z.object({
      link: z.string(),
      flatrate: z.array(
        z.object({
          logo_path: z.string(),
          provider_id: z.number(),
          provider_name: z.string(),
          display_priority: z.number()
        })
      )
    })
  })
})


