import { api } from "@/trpc/server";
import Banner from "./banner";
import Details from "./details";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const movie = await api.tmdb.movie.getById({
    id: parseInt(id),
  });

  const credits = await api.tmdb.movie.getCreditsById({
    id: parseInt(id),
  });

  const providers = await api.tmdb.movie.getProvidersById({
    id: parseInt(id),
  });

  return (
    <main>
      <Banner movie={movie} providers={providers} />
      <Details movie={movie} credits={credits} />
    </main>
  );
}
