import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

export type PopularPerson = inferProcedureOutput<
  AppRouter["tmdb"]["people"]["popular"]
>["results"][number];

export type PersonDetails = inferProcedureOutput<
  AppRouter["tmdb"]["people"]["getById"]
>;
