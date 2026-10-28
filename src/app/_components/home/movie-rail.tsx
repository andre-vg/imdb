"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MovieRailProps {
  ariaLabel: string;
  header: ReactNode;
  children: ReactNode;
}

export default function MovieRail({
  ariaLabel,
  header,
  children,
}: MovieRailProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateBounds = useCallback(() => {
    const track = trackRef.current;

    if (!track) return;

    setAtStart(track.scrollLeft <= 8);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    updateBounds();
    track.addEventListener("scroll", updateBounds, { passive: true });

    const resizeObserver = new ResizeObserver(updateBounds);
    resizeObserver.observe(track);

    return () => {
      track.removeEventListener("scroll", updateBounds);
      resizeObserver.disconnect();
    };
  }, [updateBounds]);

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;

    if (!track) return;

    const firstItem = track.querySelector<HTMLElement>("[data-rail-item]");
    const amount = firstItem
      ? (firstItem.offsetWidth + 20) * 2
      : track.clientWidth * 0.8;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    track.scrollBy({
      left: direction * amount,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        {header}

        <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
          <button
            aria-label="Rolar filmes para a esquerda"
            className="border-separator bg-surface text-foreground hover:border-accent hover:text-accent focus-visible:ring-accent focus-visible:ring-offset-background grid size-11 place-items-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-35"
            disabled={atStart}
            onClick={() => scrollByPage(-1)}
            type="button"
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            aria-label="Rolar filmes para a direita"
            className="border-separator bg-surface text-foreground hover:border-accent hover:text-accent focus-visible:ring-accent focus-visible:ring-offset-background grid size-11 place-items-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-35"
            disabled={atEnd}
            onClick={() => scrollByPage(1)}
            type="button"
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>

      <div
        aria-label={ariaLabel}
        className="hide-scrollbar focus-visible:outline-accent mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 focus-visible:outline-2 focus-visible:outline-offset-8 sm:gap-5"
        ref={trackRef}
        role="region"
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  );
}
