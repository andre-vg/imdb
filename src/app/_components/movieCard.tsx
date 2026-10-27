import React from "react";
import { bindTMDBimage } from "@/utils/tmdb-images";
import { Card } from "@heroui/react";
import Image from "next/image";
import type { AppRouter } from "@/server/api/root";
import type { inferProcedureOutput } from "@trpc/server";
import { format, compareAsc } from "date-fns";
import Link from "next/link";

type PopularMovie = inferProcedureOutput<
  AppRouter["tmdb"]["movie"]["popular"]
>["results"][number];

export default function MovieCard({ movie }: { movie: PopularMovie }) {
  return (
    <Link href={`movie/${movie.id}`}>
      <Card>
        <Card.Content>
          <Image
            src={bindTMDBimage({
              path: movie.poster_path,
              quality:"w500"
            })}
            className="rounded-xl"
            width={600}
            height={1000}
            alt={movie.title}
          />
        </Card.Content>
        <Card.Header>
          <Card.Title className="font-semibold">{movie.title}</Card.Title>
          <Card.Description>
            {format(movie.release_date, "PPP")}
          </Card.Description>
        </Card.Header>
        <Card.Footer />
      </Card>
    </Link>
  );
}
