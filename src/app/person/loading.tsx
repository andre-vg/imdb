"use client";

import { Skeleton } from "@heroui/react";

export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Carregando diretório de pessoas…</span>

      <section className="relative overflow-hidden bg-neutral-950">
        <div className="mx-auto w-full max-w-7xl px-5 pt-24 pb-14 sm:px-8 sm:pt-28 sm:pb-16">
          <Skeleton className="h-6 w-44 rounded-full" />
          <Skeleton className="mt-8 h-4 w-28 rounded-full" />
          <Skeleton className="mt-4 h-24 w-72 max-w-full rounded-2xl" />
          <div className="mt-6 space-y-2">
            <Skeleton className="h-3 w-full max-w-xl rounded-full" />
            <Skeleton className="h-3 w-4/5 max-w-lg rounded-full" />
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-10 w-full rounded-xl sm:w-80" />
          <Skeleton className="h-4 w-40 rounded-full" />
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index}>
              <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
              <Skeleton className="mt-3 h-4 w-3/4 rounded-full" />
              <Skeleton className="mt-2 h-3 w-1/2 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
