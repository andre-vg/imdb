import { api } from "@/trpc/server";
import Hero from "./_components/home/hero";
import NowPlayingSection from "./_components/home/now-playing-section";
import PopularSection from "./_components/home/popular-section";
import TopRatedSection from "./_components/home/top-rated-section";
import TopTenSection from "./_components/home/top-ten-section";
import SiteFooter from "./_components/site-footer";

function HeroFallback() {
  return (
    <section className="relative flex min-h-[75svh] items-center justify-center overflow-hidden bg-neutral-950 px-5 py-24 text-center text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(245,197,24,0.18),transparent_50%)]"
      />
      <div className="relative max-w-xl">
        <p className="text-gold text-[11px] font-semibold tracking-[0.28em] uppercase">
          Ops, sinal perdido
        </p>
        <h1 className="font-display mt-4 text-6xl leading-[0.9] tracking-wide text-balance uppercase sm:text-7xl">
          O cinema está a caminho
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
          Não foi possível carregar os filmes agora. Verifique sua conexão e
          tente novamente em instantes.
        </p>
        <form action="/">
          <button
            className="bg-gold hover:bg-gold-bright focus-visible:ring-gold mt-8 inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-neutral-950 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 focus-visible:outline-none"
            type="submit"
          >
            Tentar novamente
          </button>
        </form>
      </div>
    </section>
  );
}

export default async function Home() {
  const [trendingResult, popularResult, topRatedResult, nowPlayingResult] =
    await Promise.allSettled([
      api.tmdb.movie.trending(),
      api.tmdb.movie.popular(),
      api.tmdb.movie.topRated(),
      api.tmdb.movie.nowPlaying(),
    ]);

  const trending =
    trendingResult.status === "fulfilled" ? trendingResult.value.results : [];
  const popular =
    popularResult.status === "fulfilled" ? popularResult.value.results : [];
  const topRated =
    topRatedResult.status === "fulfilled" ? topRatedResult.value.results : [];
  const nowPlaying =
    nowPlayingResult.status === "fulfilled"
      ? nowPlayingResult.value.results
      : [];

  const hero =
    trending.find((movie) => Boolean(movie.backdrop_path)) ??
    trending[0] ??
    popular.find((movie) => Boolean(movie.backdrop_path)) ??
    popular[0] ??
    topRated[0] ??
    nowPlaying[0];

  return (
    <main id="conteudo">
      {hero ? (
        <Hero
          movie={hero}
          showTopTenLink={trending.length > 0}
          trending={trending}
        />
      ) : (
        <HeroFallback />
      )}

      <TopTenSection movies={trending} />
      <PopularSection movies={popular} />
      <TopRatedSection movies={topRated} />
      <NowPlayingSection movies={nowPlaying} />
      <SiteFooter />
    </main>
  );
}
