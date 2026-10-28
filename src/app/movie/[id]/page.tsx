import { api } from "@/trpc/server";
import Banner from "./banner";
import Details from "./details";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movieId = Number.parseInt(id, 10);

  const [movie, credits, providers] = await Promise.all([
    api.tmdb.movie.getById({ id: movieId }),
    api.tmdb.movie.getCreditsById({ id: movieId }),
    api.tmdb.movie.getProvidersById({ id: movieId }),
  ]);

  return (
    <main id="conteudo">
      <Banner movie={movie} providers={providers} />
      <Details movie={movie} credits={credits} providers={providers} />
    </main>
  );
}
