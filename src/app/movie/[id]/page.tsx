import { api } from "@/trpc/server";
import { bindTMDBimage } from "@/utils/tmdb-images";
import { cn } from "@heroui/styles";
import { extractPaletteFromUrl } from "@/utils/extract-palette";
import Banner from "./banner";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const movie = await api.tmdb.movie.getById({
    id: parseInt(id),
  });

  const bgURL = bindTMDBimage({
    path: movie.backdrop_path,
    quality: "original",
  });

  return (
    <section>
      <Banner movie={movie} />
    </section>
  );
}
