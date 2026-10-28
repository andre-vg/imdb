import { cn } from "@heroui/styles";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  titleId?: string;
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  titleId,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="text-accent flex items-center gap-2 text-[11px] font-semibold tracking-[0.28em] uppercase">
        <span aria-hidden="true" className="bg-accent/60 h-px w-6" />
        {eyebrow}
      </p>

      <h2
        className="font-display text-foreground mt-3 text-4xl leading-[0.95] tracking-wide uppercase sm:text-5xl"
        id={titleId}
      >
        {title}
      </h2>

      {description && (
        <p className="text-muted mt-3 max-w-xl text-sm leading-relaxed sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
