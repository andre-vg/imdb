"use client";

import { Skeleton } from "@heroui/react";

export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Carregando perfil da pessoa…</span>

      <section className="relative overflow-hidden bg-neutral-950">
        <div className="mx-auto w-full max-w-6xl px-5 pt-24 pb-16 sm:px-8 sm:pt-28">
          <Skeleton className="h-6 w-56 rounded-full" />

          <div className="mt-8 grid gap-8 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-end lg:grid-cols-[13rem_minmax(0,1fr)_18rem] lg:gap-10">
            <Skeleton className="aspect-[2/3] w-36 rounded-2xl sm:w-full" />

            <div className="space-y-4">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-20 w-3/4 rounded-2xl" />
              <Skeleton className="h-5 w-1/2 rounded-full" />
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-11 w-36 rounded-full" />
                <Skeleton className="h-11 w-32 rounded-full" />
              </div>
            </div>

            <Skeleton className="h-72 w-full rounded-2xl sm:col-start-2 lg:col-start-3 lg:row-start-1" />
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-5 pt-10 pb-20 sm:px-8 sm:pt-14">
        <Skeleton className="h-9 w-48 rounded-lg" />
        <div className="mt-6 max-w-3xl space-y-2">
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-3 w-11/12 rounded-full" />
          <Skeleton className="h-3 w-4/5 rounded-full" />
        </div>

        <Skeleton className="mt-16 h-9 w-56 rounded-lg" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="aspect-[2/3] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
