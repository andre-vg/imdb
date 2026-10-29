import Link from "next/link";
import { ArrowUp, ExternalLink } from "lucide-react";
import { Brand } from "./brand";

const exploreLinks = [
  { label: "Top 10 hoje", href: "#top-10" },
  { label: "Populares", href: "#populares" },
  { label: "Mais bem avaliados", href: "#aclamados" },
  { label: "Em cartaz", href: "#em-cartaz" },
  { label: "Recomende para mim", href: "/recomendar" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-separator bg-background-secondary/60 border-t">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link
            aria-label="IMDB — página inicial"
            className="focus-visible:ring-accent focus-visible:ring-offset-background inline-flex rounded-xl focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
            href="/"
          >
            <Brand />
          </Link>
          <p className="text-muted mt-4 max-w-sm text-sm leading-relaxed">
            Descubra o próximo filme, veja notas da comunidade e encontre o que
            está em alta agora. Cinema em um só lugar.
          </p>
        </div>

        <nav aria-label="Explorar">
          <h2 className="text-foreground text-[11px] font-semibold tracking-[0.22em] uppercase">
            Explorar
          </h2>
          <ul className="mt-4 space-y-2.5">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <a
                  className="text-muted hover:text-accent focus-visible:ring-accent focus-visible:ring-offset-background rounded-sm text-sm no-underline transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  href={link.href}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-foreground text-[11px] font-semibold tracking-[0.22em] uppercase">
            Sobre
          </h2>
          <p className="text-muted mt-4 text-sm leading-relaxed">
            Projeto de estudo construído com Next.js, tRPC e HeroUI. Sem fins
            comerciais.
          </p>
          <a
            className="text-muted hover:text-accent focus-visible:ring-accent focus-visible:ring-offset-background mt-4 inline-flex items-center gap-1.5 rounded-sm text-sm no-underline transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            href="https://www.themoviedb.org/"
            rel="noreferrer"
            target="_blank"
          >
            Conheça o TMDB
            <ExternalLink aria-hidden="true" className="size-3.5" />
          </a>
        </div>
      </div>

      <div className="border-separator border-t">
        <div className="text-muted mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {year} IMDB. Projeto de estudo sem fins comerciais.</p>
          <p>
            Este produto usa a API do TMDB, mas não é endossado ou certificado
            pelo TMDB.
          </p>
          <a
            className="hover:text-accent focus-visible:ring-accent focus-visible:ring-offset-background inline-flex items-center gap-1.5 rounded-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            href="#conteudo"
          >
            Voltar ao topo
            <ArrowUp aria-hidden="true" className="size-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
