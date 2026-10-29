import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { api } from "@/trpc/server";
import PersonBanner from "./person-banner";
import PersonDetails from "./person-details";

const getPerson = cache(async (id: string) => {
  const personId = Number.parseInt(id, 10);

  if (!Number.isInteger(personId) || personId <= 0) return null;

  return api.tmdb.people.getById({ id: personId }).catch(() => null);
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const person = await getPerson(id);

  if (!person) return { title: "Pessoa não encontrada" };

  const description = person.biography
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 155);

  return {
    title: person.name,
    description: description || `Perfil de ${person.name} no IMDB.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = await getPerson(id);

  if (!person) notFound();

  return (
    <main id="conteudo">
      <PersonBanner person={person} />
      <PersonDetails person={person} />
    </main>
  );
}
