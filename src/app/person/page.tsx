import type { Metadata } from "next";
import { api } from "@/trpc/server";
import SiteFooter from "@/app/_components/site-footer";
import PeopleDirectory from "./people-directory";
import type { PopularPerson } from "./person-types";

export const metadata: Metadata = {
  title: "Pessoas",
  description:
    "Explore atores, diretores e equipes por trás dos filmes. Descubra quem está em alta e conheça a trajetória de cada profissional.",
};

export default async function Page() {
  const [firstPage, secondPage] = await Promise.allSettled([
    api.tmdb.people.popular({ page: 1 }),
    api.tmdb.people.popular({ page: 2 }),
  ]);

  const results = [firstPage, secondPage].flatMap((result) =>
    result.status === "fulfilled" ? result.value.results : [],
  );

  const people = Array.from(
    new Map<number, PopularPerson>(
      results.map((person) => [person.id, person]),
    ).values(),
  );

  return (
    <main id="conteudo">
      <PeopleDirectory people={people} />
      <SiteFooter />
    </main>
  );
}
