import Image from "next/image";
import { Film } from "lucide-react";
import { cn } from "@heroui/styles";
import { bindTMDBimage } from "@/utils/tmdb-images";

interface TmdbPosterProps {
  path: string | null;
  title: string;
  quality?: "w185" | "w342" | "w500" | "w780";
  sizes: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  showFallbackLabel?: boolean;
}

export default function TmdbPoster({
  path,
  title,
  quality = "w500",
  sizes,
  priority = false,
  className,
  imageClassName,
  showFallbackLabel = true,
}: TmdbPosterProps) {
  return (
    <div
      className={cn("bg-surface-secondary relative overflow-hidden", className)}
    >
      {path ? (
        <Image
          alt={`Poster de ${title}`}
          className={cn("object-cover", imageClassName)}
          fill
          priority={priority}
          sizes={sizes}
          src={bindTMDBimage({ path, quality })}
        />
      ) : (
        <div className="from-surface-secondary via-surface to-background-secondary text-muted flex size-full flex-col items-center justify-center gap-2 bg-gradient-to-br">
          <Film aria-hidden="true" className="size-5" />
          {showFallbackLabel && (
            <span className="line-clamp-2 px-2 text-center text-[10px] font-medium">
              {title}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
