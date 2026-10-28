import { Clapperboard } from "lucide-react";
import { cn } from "@heroui/styles";

interface BrandProps {
  className?: string;
  showWordmark?: boolean;
}

export function Brand({ className, showWordmark = true }: BrandProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden="true"
        className="bg-gold shadow-gold/20 grid size-9 shrink-0 place-items-center rounded-xl text-neutral-950 shadow-lg"
      >
        <Clapperboard className="size-5" strokeWidth={2.2} />
      </span>
      {showWordmark && (
        <span className="font-display text-foreground text-2xl leading-none tracking-[0.08em]">
          IMDB
        </span>
      )}
    </span>
  );
}
