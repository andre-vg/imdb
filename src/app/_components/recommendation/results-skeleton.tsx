"use client";

import { Skeleton } from "@heroui/react";

export default function ResultsSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    >
      <span className="sr-only">Buscando filmes para você…</span>

      {Array.from({ length: 5 }, (_, index) => (
        <div
          className="border-separator bg-surface overflow-hidden rounded-3xl border"
          key={index}
        >
          <Skeleton className="aspect-[2/3] w-full rounded-none" />

          <div className="space-y-3 p-4">
            <Skeleton className="h-4 w-3/4 rounded-full" />
            <Skeleton className="h-3 w-1/2 rounded-full" />
            <div className="flex gap-1.5">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-9 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
