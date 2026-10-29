import Image from "next/image";
import {
  CalendarDays,
  Clapperboard,
  ExternalLink,
  Globe,
  MapPin,
  UserRound,
} from "lucide-react";
import { Breadcrumbs, Card, Chip, Link, Separator } from "@heroui/react";
import { buttonVariants, cn } from "@heroui/styles";
import { bindTMDBimage } from "@/utils/tmdb-images";
import {
  formatFullDate,
  getAge,
  translateDepartment,
  translateGender,
} from "@/utils/tmdb-meta";
import type { PersonDetails } from "../person-types";

export default function PersonBanner({ person }: { person: PersonDetails }) {
  const profileURL = person.profile_path
    ? bindTMDBimage({ path: person.profile_path, quality: "w500" })
    : null;

  const department = translateDepartment(person.known_for_department);
  const birthDate = formatFullDate(person.birthday);
  const deathDate = person.deathday ? formatFullDate(person.deathday) : null;

  const age = getAge(person.birthday, person.deathday);
  const birthYear = person.birthday?.slice(0, 4) ?? null;

  return (
    <section
      aria-labelledby="person-name"
      className="relative isolate w-full overflow-hidden bg-neutral-950 text-white"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        {profileURL ? (
          <Image
            fill
            priority
            alt=""
            sizes="100vw"
            src={profileURL}
            className="scale-110 object-cover object-[center_25%] opacity-35 blur-2xl"
          />
        ) : (
          <div className="size-full bg-[radial-gradient(circle_at_70%_20%,rgba(245,197,24,0.22),transparent_55%)]" />
        )}
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/30"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-neutral-950/95 via-neutral-950/60 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_10%,rgba(245,197,24,0.14),transparent_45%)]"
      />
      <div
        aria-hidden="true"
        className="from-background absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t to-transparent"
      />

      <div className="mx-auto w-full max-w-6xl px-5 pt-24 pb-16 sm:px-8 sm:pt-28">
        <div className="inline-flex rounded-full border border-white/10 bg-black/35 px-3 py-1.5 backdrop-blur-md">
          <Breadcrumbs
            aria-label="Você está em"
            className="[&_[data-current]]:text-white/70 [&_a]:text-white/60 [&_a:hover]:text-white [&_svg]:text-white/25"
          >
            <Breadcrumbs.Item href="/">Início</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/person">Pessoas</Breadcrumbs.Item>
            <Breadcrumbs.Item>{person.name}</Breadcrumbs.Item>
          </Breadcrumbs>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-start lg:grid-cols-[13rem_minmax(0,1fr)_18rem] lg:items-end lg:gap-10">
          <div className="w-36 shrink-0 sm:row-span-2 sm:w-auto lg:row-span-1">
            {profileURL ? (
              <Image
                src={profileURL}
                alt={`Foto de ${person.name}`}
                width={500}
                height={750}
                priority
                className="aspect-[2/3] w-full rounded-2xl border border-white/10 object-cover shadow-2xl shadow-black/60"
              />
            ) : (
              <div className="grid aspect-[2/3] w-full place-items-center rounded-2xl border border-white/10 bg-white/5 text-center shadow-2xl shadow-black/60">
                <div className="px-4">
                  <UserRound
                    aria-hidden="true"
                    className="text-gold mx-auto size-8"
                  />
                  <p className="mt-3 text-xs leading-snug text-white/60">
                    Foto indisponível
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <Chip
              size="sm"
              variant="soft"
              className="border border-white/10 bg-white/10 text-white/80"
            >
              {department}
            </Chip>

            <h1
              id="person-name"
              className="font-display mt-4 text-[clamp(3rem,7vw,5.5rem)] leading-[0.86] tracking-wide text-balance uppercase"
            >
              {person.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/65">
              {birthYear && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays aria-hidden="true" className="size-4" />
                  {birthYear}
                </span>
              )}

              {person.place_of_birth && (
                <>
                  <span
                    aria-hidden="true"
                    className="size-1 rounded-full bg-white/30"
                  />
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin aria-hidden="true" className="size-4 shrink-0" />
                    {person.place_of_birth}
                  </span>
                </>
              )}

              {age !== null && (
                <>
                  <span
                    aria-hidden="true"
                    className="size-1 rounded-full bg-white/30"
                  />
                  <span>{age} anos</span>
                </>
              )}
            </div>

            {(person.imdb_id ?? person.homepage) && (
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {person.imdb_id && (
                  <Link
                    className={cn(
                      buttonVariants({ variant: "primary", size: "lg" }),
                      "bg-gold hover:bg-gold-bright gap-2 text-neutral-950 no-underline",
                    )}
                    href={`https://www.imdb.com/name/${person.imdb_id}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <ExternalLink aria-hidden="true" className="size-4" />
                    Ver na IMDb
                  </Link>
                )}

                {person.homepage && (
                  <Link
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "gap-2 border-white/25 text-white no-underline hover:bg-white/10",
                    )}
                    href={person.homepage}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Globe aria-hidden="true" className="size-4" />
                    Site oficial
                  </Link>
                )}
              </div>
            )}
          </div>

          <Card
            variant="transparent"
            className="w-full rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur-xl sm:col-start-2 lg:col-start-3 lg:row-start-1"
          >
            <Card.Header className="gap-1">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-white/45 uppercase">
                Ficha da pessoa
              </p>
            </Card.Header>

            <Separator className="my-4 bg-white/10" />

            <dl className="space-y-3 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="flex shrink-0 items-center gap-2 text-white/50">
                  <CalendarDays aria-hidden="true" className="size-3.5" />
                  Nascimento
                </dt>
                <dd className="text-right font-medium">
                  {birthDate}
                  {age !== null && !person.deathday && (
                    <span className="mt-0.5 block text-xs font-normal text-white/50">
                      {age} anos
                    </span>
                  )}
                </dd>
              </div>

              {deathDate && (
                <div className="flex items-start justify-between gap-4">
                  <dt className="shrink-0 text-white/50">Falecimento</dt>
                  <dd className="text-right font-medium">
                    {deathDate}
                    {age !== null && (
                      <span className="mt-0.5 block text-xs font-normal text-white/50">
                        aos {age} anos
                      </span>
                    )}
                  </dd>
                </div>
              )}

              <div className="flex items-start justify-between gap-4">
                <dt className="flex shrink-0 items-center gap-2 text-white/50">
                  <MapPin aria-hidden="true" className="size-3.5" />
                  Origem
                </dt>
                <dd className="text-right font-medium">
                  {person.place_of_birth?.trim() ? person.place_of_birth : "—"}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-4">
                <dt className="flex shrink-0 items-center gap-2 text-white/50">
                  <Clapperboard aria-hidden="true" className="size-3.5" />
                  Departamento
                </dt>
                <dd className="text-right font-medium">{department}</dd>
              </div>

              <div className="flex items-start justify-between gap-4">
                <dt className="flex shrink-0 items-center gap-2 text-white/50">
                  <UserRound aria-hidden="true" className="size-3.5" />
                  Gênero
                </dt>
                <dd className="text-right font-medium">
                  {translateGender(person.gender)}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </section>
  );
}
