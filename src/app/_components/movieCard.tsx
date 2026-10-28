import React from "react";
import { bindTMDBimage } from "@/utils/tmdb-images";
import { Card } from "@heroui/react";
import Image from "next/image";
import type { AppRouter } from "@/server/api/root";
import type { inferProcedureOutput } from "@trpc/server";
import { format } from "date-fns";
import Link from "next/link";

type PopularMovie = inferProcedureOutput<
  AppRouter["tmdb"]["movie"]["popular"]
>["results"][number];

export default function MovieCard({ movie }: { movie: PopularMovie }) {
  const releaseDate = movie.release_date
    ? format(new Date(movie.release_date), "PPP")
    : "Release date unavailable";

  return (
    <Link href={`/movie/${movie.id}`} className="block h-full">
      <Card className="group h-full overflow-hidden border-none bg-content1 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
        <Card.Content className="p-0">
          <div className="relative aspect-9/16 w-full overflow-hidden rounded-t-xl">
            <Image
              src={bindTMDBimage({
                path: movie.poster_path,
                quality: "w500",
              })}
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              alt={movie.title}
            />
          </div>
        </Card.Content>

        <Card.Header className="flex-col items-start gap-1 p-3">
          <Card.Title className="line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug">
            {movie.title}
          </Card.Title>
          <Card.Description className="text-xs text-default-500">
            {releaseDate}
          </Card.Description>
        </Card.Header>
      </Card>
    </Link>
  );
}
