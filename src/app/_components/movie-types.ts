import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

export type MovieListItem = inferProcedureOutput<
  AppRouter["tmdb"]["movie"]["popular"]
>["results"][number];
