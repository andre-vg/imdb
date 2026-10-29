"use client";

import { Button, Card, Chip } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Star, ThumbsDown } from "lucide-react";

import TmdbPoster from "@/app/_components/tmdb-poster";
import type { RouterOutputs } from "@/trpc/react";
import {
  formatVoteCount,
  getGenreNames,
  getReleaseYear,
} from "@/utils/tmdb-meta";

export type RecommendedMovie =
  RouterOutputs["recommendation"]["suggest"]["movies"][number];

interface RecommendationCardProps {
  recommendation: RecommendedMovie;
  /** Posição na lista, usada para numerar os cards. */
  position: number;
  onMarkSeen: (movieId: number) => void;
  onDismiss: (movieId: number) => void;
  isPending?: boolean;
}

export default function RecommendationCard({
  recommendation,
  position,
  onMarkSeen,
  onDismiss,
  isPending = false,
}: RecommendationCardProps) {
  const router = useRouter();
  const { movie, matchScore, reasons } = recommendation;
  const year = getReleaseYear(movie.release_date);
  const genres = getGenreNames(movie.genre_ids, 2).join(" · ");
  const meta = [year, genres].filter((value): value is string =>
    Boolean(value),
  );

  return (
    <Card
      className="group border-separator bg-surface hover:border-accent/40 hover:shadow-accent/5 relative h-full gap-0 overflow-hidden border p-0 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-2xl"
      variant="default"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <TmdbPoster
          className="size-full"
          imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
          path={movie.poster_path}
          quality="w500"
          sizes="(min-width: 1280px) 240px, (min-width: 768px) 30vw, 80vw"
          title={movie.title}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent"
        />

        <span
          aria-hidden="true"
          className="font-display absolute top-3 left-4 text-2xl leading-none text-white/70 drop-shadow"
        >
          {String(position).padStart(2, "0")}
        </span>

        <Chip
          className="absolute top-3 right-3 backdrop-blur-md"
          color="accent"
          size="sm"
          variant="primary"
        >
          <Star aria-hidden="true" className="size-3" />
          {matchScore}% de match
        </Chip>

        <div className="absolute inset-x-4 bottom-3">
          <h3 className="line-clamp-2 text-lg leading-tight font-semibold text-white">
            {movie.title}
          </h3>
          {meta.length > 0 && (
            <p className="mt-1 text-xs text-white/65">{meta.join(" · ")}</p>
          )}
        </div>
      </div>

      <Card.Content className="gap-3 p-4">
        <div className="text-muted flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span className="inline-flex items-center gap-1">
            <Star aria-hidden="true" className="fill-gold text-gold size-3.5" />
            <span className="text-foreground font-semibold">
              {movie.vote_average.toFixed(1)}
            </span>
            /10
          </span>
          <span
            aria-hidden="true"
            className="bg-separator size-1 rounded-full"
          />
          <span>{formatVoteCount(movie.vote_count)} avaliações</span>
        </div>

        <ul
          className="flex flex-wrap gap-1.5"
          aria-label="Por que recomendamos"
        >
          {reasons.map((reason) => (
            <li key={reason}>
              <Chip color="default" size="sm" variant="soft">
                {reason}
              </Chip>
            </li>
          ))}
        </ul>
      </Card.Content>

      <Card.Footer className="mt-auto flex-col gap-2 p-4 pt-0">
        <div className="grid w-full grid-cols-2 gap-2">
          <Button
            fullWidth
            isDisabled={isPending}
            onPress={() => onMarkSeen(movie.id)}
            size="sm"
            variant="secondary"
          >
            <Check aria-hidden="true" className="size-4" />
            Já assisti
          </Button>

          <Button
            fullWidth
            isDisabled={isPending}
            onPress={() => onDismiss(movie.id)}
            size="sm"
            variant="tertiary"
          >
            <ThumbsDown aria-hidden="true" className="size-4" />
            Não curti
          </Button>
        </div>

        <Button
          fullWidth
          onPress={() => router.push(`/movie/${movie.id}`)}
          size="sm"
          variant="ghost"
        >
          Ver detalhes
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </Card.Footer>
    </Card>
  );
}
