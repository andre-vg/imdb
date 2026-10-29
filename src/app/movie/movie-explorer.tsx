"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Clapperboard,
  Flame,
  SearchX,
  SlidersHorizontal,
  Sparkles,
  Star,
} from "lucide-react";
import {
  Breadcrumbs,
  Button,
  Card,
  Chip,
  EmptyState,
  Link,
  ListBox,
  SearchField,
  Select,
  Separator,
  Skeleton,
  Spinner,
  ToggleButton,
  ToggleButtonGroup,
} from "@heroui/react";
import { buttonVariants, cn } from "@heroui/styles";
import { api } from "@/trpc/react";
import MovieCard from "@/app/_components/movieCard";
import { bindTMDBimage } from "@/utils/tmdb-images";
import { TMDB_GENRES, getGenreNames, getReleaseYear } from "@/utils/tmdb-meta";
import type {
  MovieCategory,
  MovieCategoryOption,
  MovieCollections,
  MovieListItem,
} from "./movie-types";

const SEARCH_DEBOUNCE_MS = 350;

const MOVIE_GRID_CLASS =
  "mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 xl:grid-cols-6";

const CATEGORIES = [
  {
    id: "trending",
    label: "Em alta",
    blurb: "O que está dominando as conversas nas últimas 24 horas.",
  },
  {
    id: "popular",
    label: "Populares",
    blurb: "Os títulos mais procurados do momento.",
  },
  {
    id: "topRated",
    label: "Aclamados",
    blurb: "As maiores notas da comunidade, filme a filme.",
  },
  {
    id: "nowPlaying",
    label: "Em cartaz",
    blurb: "O que está passando nas telas de cinema agora.",
  },
] as const satisfies readonly MovieCategoryOption[];

const GENRE_FILTER_IDS = [
  28, 12, 16, 35, 80, 99, 18, 14, 27, 9648, 10749, 878, 53, 10752, 37, 10402,
] as const;

const GENRE_OPTIONS = GENRE_FILTER_IDS.map((id) => ({
  id: String(id),
  label: TMDB_GENRES[id] ?? "Outro",
}));

type SortId = "default" | "rating" | "popularity" | "release" | "title";

const SORT_OPTIONS: readonly { id: SortId; label: string }[] = [
  { id: "default", label: "Destaque" },
  { id: "rating", label: "Melhor nota" },
  { id: "popularity", label: "Popularidade" },
  { id: "release", label: "Lançamento" },
  { id: "title", label: "Título (A–Z)" },
];

function getTimestamp(date: string | null | undefined) {
  if (!date) return Number.NEGATIVE_INFINITY;

  const timestamp = new Date(`${date}T00:00:00`).getTime();

  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
}

function sortMovies(movies: MovieListItem[], sort: SortId) {
  if (sort === "default") return movies;

  const sorted = [...movies];

  switch (sort) {
    case "rating":
      sorted.sort(
        (a, b) =>
          b.vote_average - a.vote_average || b.vote_count - a.vote_count,
      );
      break;
    case "popularity":
      sorted.sort((a, b) => b.popularity - a.popularity);
      break;
    case "release":
      sorted.sort(
        (a, b) => getTimestamp(b.release_date) - getTimestamp(a.release_date),
      );
      break;
    case "title":
      sorted.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
      break;
  }

  return sorted;
}

function filterByGenres(movies: MovieListItem[], genres: readonly string[]) {
  if (genres.length === 0) return movies;

  const selected = new Set(genres.map(Number));

  return movies.filter((movie) =>
    movie.genre_ids.some((genreId) => selected.has(genreId)),
  );
}

function dedupeById(items: MovieListItem[]) {
  return Array.from(new Map(items.map((movie) => [movie.id, movie])).values());
}

function MovieGrid({ movies }: { movies: MovieListItem[] }) {
  return (
    <div className={MOVIE_GRID_CLASS}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

function MovieGridSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite" className={MOVIE_GRID_CLASS}>
      <span className="sr-only">Buscando filmes…</span>
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} aria-hidden="true">
          <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
          <Skeleton className="mt-3 h-4 w-3/4 rounded-full" />
          <Skeleton className="mt-2 h-3 w-1/2 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function CatalogEmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <EmptyState className="border-separator bg-surface mt-10 flex flex-col items-center rounded-3xl border border-dashed px-6 py-16 text-center">
      <span aria-hidden="true" className="text-muted">
        {icon}
      </span>
      <h2 className="font-display text-foreground mt-4 text-3xl tracking-wide uppercase">
        {title}
      </h2>
      <p className="text-muted mx-auto mt-2 max-w-sm text-sm leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </EmptyState>
  );
}

function FeaturedSpotlight({ movie }: { movie: MovieListItem }) {
  const backdropURL = movie.backdrop_path
    ? bindTMDBimage({ path: movie.backdrop_path, quality: "w780" })
    : null;

  const year = getReleaseYear(movie.release_date);
  const genres = getGenreNames(movie.genre_ids, 2).join(" · ");
  const meta = [year, genres].filter(Boolean).join(" · ");

  return (
    <Card
      className="w-full grid-rows-[auto_1fr] gap-0 overflow-hidden rounded-3xl border border-white/10 bg-black/35 p-0 backdrop-blur-xl"
      variant="transparent"
    >
      <div className="relative aspect-[16/9] w-full">
        {backdropURL ? (
          <Image
            alt=""
            className="object-cover"
            fill
            sizes="(max-width: 1024px) 100vw, 22rem"
            src={backdropURL}
          />
        ) : (
          <div className="size-full bg-[radial-gradient(circle_at_70%_20%,rgba(245,197,24,0.25),transparent_55%)]" />
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent"
        />

        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/55 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase backdrop-blur-md">
          <Flame aria-hidden="true" className="text-gold size-3.5" />
          Destaque
        </span>

        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/55 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
          <Star aria-hidden="true" className="fill-gold text-gold size-3" />
          {movie.vote_average.toFixed(1)}
        </span>
      </div>

      <Card.Content className="p-4">
        <h2 className="font-display line-clamp-2 text-2xl leading-[0.95] tracking-wide uppercase">
          {movie.title}
        </h2>

        {meta && <p className="mt-1.5 text-xs text-white/55">{meta}</p>}

        {movie.overview && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/70">
            {movie.overview}
          </p>
        )}

        <Link
          className={cn(
            buttonVariants({ variant: "primary", size: "sm" }),
            "bg-gold hover:bg-gold-bright mt-4 gap-2 text-neutral-950 no-underline",
          )}
          href={`/movie/${movie.id}`}
        >
          Ver detalhes
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </Card.Content>
    </Card>
  );
}

export default function MovieExplorer({
  collections,
}: {
  collections: MovieCollections;
}) {
  const [category, setCategory] = useState<MovieCategory>("trending");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sort, setSort] = useState<SortId>("default");

  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;

  useEffect(() => {
    if (!trimmedQuery) {
      setDebouncedQuery("");
      return;
    }

    const timeout = window.setTimeout(
      () => setDebouncedQuery(trimmedQuery),
      SEARCH_DEBOUNCE_MS,
    );

    return () => window.clearTimeout(timeout);
  }, [trimmedQuery]);

  const isDebouncing = hasQuery && trimmedQuery !== debouncedQuery;

  const search = api.tmdb.movie.search.useInfiniteQuery(
    { query: debouncedQuery },
    {
      enabled: hasQuery && !isDebouncing,
      initialCursor: 1,
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
      retry: 1,
      staleTime: 60 * 1000,
    },
  );

  const searchResults = useMemo(
    () => dedupeById(search.data?.pages.flatMap((page) => page.results) ?? []),
    [search.data],
  );

  const activeCategory =
    CATEGORIES.find((item) => item.id === category) ?? CATEGORIES[0];

  const baseMovies = hasQuery ? searchResults : collections[category];

  const visibleMovies = useMemo(
    () => sortMovies(filterByGenres(baseMovies, selectedGenres), sort),
    [baseMovies, selectedGenres, sort],
  );

  const totalResults = search.data?.pages[0]?.total_results ?? 0;
  const isSearching = hasQuery && (isDebouncing || search.isPending);

  const featured =
    collections.trending[0] ??
    collections.popular[0] ??
    collections.topRated[0] ??
    collections.nowPlaying[0] ??
    null;

  const featuredBackdrop = featured?.backdrop_path
    ? bindTMDBimage({ path: featured.backdrop_path, quality: "original" })
    : null;

  const handleCategoryChange = (keys: Set<unknown>) => {
    const [next] = [...keys];

    if (typeof next === "string") setCategory(next as MovieCategory);
  };

  const handleGenreChange = (keys: Set<unknown>) => {
    setSelectedGenres([...keys].map(String));
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSort("default");
  };

  let resultsLabel = `${visibleMovies.length} ${
    visibleMovies.length === 1 ? "filme" : "filmes"
  } · ${activeCategory.label}`;

  if (hasQuery) {
    if (isSearching) {
      resultsLabel = "Buscando filmes…";
    } else if (search.isError) {
      resultsLabel = "Busca indisponível";
    } else if (visibleMovies.length === 0) {
      resultsLabel = "Nenhum resultado";
    } else if (totalResults > searchResults.length) {
      resultsLabel = `${searchResults.length} de ${totalResults.toLocaleString(
        "pt-BR",
      )} filmes`;
    } else {
      resultsLabel = `${visibleMovies.length} ${
        visibleMovies.length === 1 ? "filme encontrado" : "filmes encontrados"
      }`;
    }
  }

  const hasFilters = selectedGenres.length > 0 || sort !== "default";

  return (
    <>
      <section
        aria-labelledby="movies-title"
        className="relative isolate overflow-hidden bg-neutral-950 text-white"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-20">
          {featuredBackdrop ? (
            <Image
              alt=""
              className="scale-110 object-cover opacity-25 blur-2xl"
              fill
              priority
              sizes="100vw"
              src={featuredBackdrop}
            />
          ) : (
            <div className="size-full bg-[radial-gradient(circle_at_78%_18%,rgba(245,197,24,0.18),transparent_55%)]" />
          )}
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(10,10,10,0.92),rgba(10,10,10,0.55))]"
        />

        <div className="mx-auto w-full max-w-7xl px-5 pt-24 pb-14 sm:px-8 sm:pt-28 sm:pb-16">
          <div className="inline-flex rounded-full border border-white/10 bg-black/35 px-3 py-1.5 backdrop-blur-md">
            <Breadcrumbs
              aria-label="Você está em"
              className="[&_[data-current]]:text-white/70 [&_a]:text-white/60 [&_a:hover]:text-white [&_svg]:text-white/25"
            >
              <Breadcrumbs.Item href="/">Início</Breadcrumbs.Item>
              <Breadcrumbs.Item>Filmes</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
            <div className="max-w-2xl">
              <p className="text-gold flex items-center gap-2 text-[11px] font-semibold tracking-[0.28em] uppercase">
                <span aria-hidden="true" className="bg-gold/60 h-px w-6" />
                Catálogo
              </p>

              <h1
                className="font-display mt-3 text-[clamp(3.4rem,9vw,7rem)] leading-[0.85] tracking-wide text-balance uppercase"
                id="movies-title"
              >
                Filmes
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-pretty text-white/70 sm:text-base">
                Do blockbuster ao clássico cult. Navegue por coleções curadas,
                filtre por gênero e encontre a sua próxima sessão em segundos.
              </p>

              <ul
                aria-label="Resumo das coleções"
                className="mt-6 flex flex-wrap gap-2"
              >
                {CATEGORIES.map((item) => (
                  <li key={item.id}>
                    <Chip
                      className="border border-white/10 bg-white/10 text-white/80"
                      size="sm"
                      variant="soft"
                    >
                      {item.label}
                      <span className="ml-1.5 text-white/50 tabular-nums">
                        {collections[item.id].length}
                      </span>
                    </Chip>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  className={cn(
                    buttonVariants({ variant: "primary", size: "lg" }),
                    "bg-gold hover:bg-gold-bright gap-2 text-neutral-950 no-underline",
                  )}
                  href="#catalogo"
                >
                  <Clapperboard aria-hidden="true" className="size-4" />
                  Explorar catálogo
                </Link>

                <Link
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "gap-2 border-white/25 text-white no-underline hover:bg-white/10",
                  )}
                  href="/recomendar"
                >
                  <Sparkles aria-hidden="true" className="text-gold size-4" />
                  Monte seu quiz
                </Link>
              </div>
            </div>

            {featured && (
              <div className="animate-fade-up">
                <FeaturedSpotlight movie={featured} />
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        aria-label="Catálogo de filmes"
        className="mx-auto w-full max-w-7xl scroll-mt-24 px-5 py-12 sm:px-8 sm:py-16"
        id="catalogo"
      >
        <div className="flex items-end gap-4">
          <div>
            <p className="text-accent text-[11px] font-semibold tracking-[0.28em] uppercase">
              Explorar
            </p>
            <h2 className="font-display mt-1 text-4xl tracking-wide uppercase">
              Catálogo
            </h2>
          </div>
          <Separator className="mb-2 hidden flex-1 sm:block" />
        </div>

        <p className="text-muted mt-3 max-w-xl text-sm leading-relaxed">
          {hasQuery
            ? "Resultados de busca em todo o catálogo do TMDB."
            : activeCategory.blurb}
        </p>

        <div className="mt-8 flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SearchField
              aria-label="Buscar filmes por título"
              className="w-full sm:max-w-sm"
              onChange={setQuery}
              value={query}
              variant="secondary"
            >
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input
                  maxLength={100}
                  placeholder="Buscar por título"
                />
                {isSearching && (
                  <Spinner aria-hidden="true" className="shrink-0" size="sm" />
                )}
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>

            <p aria-live="polite" className="text-muted text-sm">
              {resultsLabel}
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {!hasQuery && (
              <ToggleButtonGroup
                aria-label="Coleção de filmes"
                className="hide-scrollbar max-w-full overflow-x-auto"
                disallowEmptySelection
                isDetached
                onSelectionChange={handleCategoryChange}
                selectedKeys={[category]}
                selectionMode="single"
                size="sm"
              >
                {CATEGORIES.map((item) => (
                  <ToggleButton
                    className="shrink-0 rounded-full"
                    id={item.id}
                    key={item.id}
                  >
                    {item.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            )}

            <div className="flex items-center gap-3 lg:ml-auto">
              <span
                aria-hidden="true"
                className="text-muted hidden items-center gap-1.5 text-xs font-medium sm:inline-flex"
              >
                <SlidersHorizontal className="size-3.5" />
                Ordenar
              </span>

              <Select
                aria-label="Ordenar filmes"
                className="w-full sm:w-44"
                onSelectionChange={(key) => {
                  if (typeof key === "string") setSort(key as SortId);
                }}
                selectedKey={sort}
                variant="secondary"
              >
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {SORT_OPTIONS.map((option) => (
                      <ListBox.Item id={option.id} key={option.id}>
                        {option.label}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>
          </div>

          <div className="hide-scrollbar -mx-1 overflow-x-auto px-1 pb-1">
            <ToggleButtonGroup
              aria-label="Filtrar por gênero"
              isDetached
              onSelectionChange={handleGenreChange}
              selectedKeys={selectedGenres}
              selectionMode="multiple"
              size="sm"
            >
              {GENRE_OPTIONS.map((option) => (
                <ToggleButton
                  className="shrink-0 rounded-full"
                  id={option.id}
                  key={option.id}
                >
                  {option.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>
        </div>

        {hasQuery ? (
          isSearching ? (
            <MovieGridSkeleton />
          ) : search.isError ? (
            <CatalogEmptyState
              action={
                <Button onPress={() => void search.refetch()}>
                  Tentar novamente
                </Button>
              }
              description="Não foi possível buscar filmes agora. Verifique sua conexão e tente novamente em instantes."
              icon={<SearchX className="size-8" />}
              title="Busca indisponível"
            />
          ) : visibleMovies.length > 0 ? (
            <>
              <MovieGrid movies={visibleMovies} />

              {search.hasNextPage && (
                <div className="mt-10 flex justify-center">
                  <Button
                    isDisabled={search.isFetchingNextPage}
                    onPress={() => void search.fetchNextPage()}
                    variant="secondary"
                  >
                    {search.isFetchingNextPage
                      ? "Carregando…"
                      : "Carregar mais"}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <CatalogEmptyState
              action={
                hasFilters ? (
                  <Button onPress={clearFilters} variant="tertiary">
                    Limpar filtros
                  </Button>
                ) : (
                  <Button onPress={() => setQuery("")} variant="tertiary">
                    Limpar busca
                  </Button>
                )
              }
              description={`Não encontramos filmes para “${trimmedQuery}”${
                hasFilters ? " com os filtros aplicados" : ""
              }. Tente outro título ou revise a grafia.`}
              icon={<SearchX className="size-8" />}
              title="Nenhum filme por aqui"
            />
          )
        ) : collections[category].length > 0 && visibleMovies.length > 0 ? (
          <MovieGrid movies={visibleMovies} />
        ) : collections[category].length > 0 ? (
          <CatalogEmptyState
            action={
              <Button onPress={clearFilters} variant="tertiary">
                Limpar filtros
              </Button>
            }
            description="Nenhum filme desta coleção combina com o gênero escolhido. Limpe os filtros para ver a seleção completa."
            icon={<SlidersHorizontal className="size-8" />}
            title="Sem correspondências"
          />
        ) : (
          <CatalogEmptyState
            action={
              <Button onPress={() => window.location.reload()}>
                Tentar novamente
              </Button>
            }
            description="Não foi possível carregar o catálogo agora. Verifique sua conexão e tente novamente em instantes."
            icon={<Clapperboard className="size-8" />}
            title="Catálogo indisponível"
          />
        )}
      </section>
    </>
  );
}
