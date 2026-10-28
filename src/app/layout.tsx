import "@/styles/globals.css";

import { type Metadata } from "next";
import { Bebas_Neue, Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import Navbar from "./_components/navbar";
import { Providers } from "./providers";
import { setDefaultOptions } from "date-fns";
import { ptBR } from "date-fns/locale";

export const metadata: Metadata = {
  title: {
    default: "IMDB — Descubra seu próximo filme",
    template: "%s | IMDB",
  },
  description:
    "Explore os filmes mais populares, os mais bem avaliados e o que está em cartaz. Notas, gêneros e detalhes em um só lugar.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  setDefaultOptions({ locale: ptBR });
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geist.variable} ${bebasNeue.variable}`}
    >
      <body className="bg-background text-foreground min-h-screen antialiased">
        <a
          className="focus:bg-gold sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-neutral-950 focus:ring-2 focus:ring-neutral-950 focus:outline-none"
          href="#conteudo"
        >
          Pular para o conteúdo
        </a>
        <Providers>
          <TRPCReactProvider>
            <Navbar />
            {children}
          </TRPCReactProvider>
        </Providers>
      </body>
    </html>
  );
}
