import type { AppRouter } from "@/server/api/root";
import { extractPaletteFromUrl } from "@/utils/extract-palette";
import { bindTMDBimage } from "@/utils/tmdb-images";
import { cn } from "@heroui/styles";
import type { inferProcedureOutput } from "@trpc/server";
import React from "react";

type MovieDetails = inferProcedureOutput<AppRouter["tmdb"]["movie"]["getById"]>;

export default async function Banner({ movie }: { movie: MovieDetails }) {
  

  return (
    <div
      className={cn(
        `h-96 w-screen bg-cover bg-center bg-no-repeat`,
      )}
    >
      <div className={cn("relative flex w-full justify-items-end")}>
        <h2 className="text-5xl">{movie.title}</h2>
        <p>{movie.overview}</p>
      </div>
    </div>
  );
}
