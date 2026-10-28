"use client";

import { useEffect, useState, type ReactNode } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@heroui/react";
import { Menu, X } from "lucide-react";
import { Brand } from "./brand";
import { ThemeSwitcher } from "./theme-switcher";

export type NavbarPosition = "static" | "sticky" | "fixed";
export type NavbarMaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface NavbarItem {
  /** Texto exibido no link. */
  label: string;
  /** Rota de destino. */
  href: string;
  /** Força o estado ativo. Por padrão é detectado pela rota atual. */
  isActive?: boolean;
}

export interface NavbarProps {
  /** Logo/marca exibida à esquerda. */
  brand?: ReactNode;
  /** Links de navegação. */
  items?: NavbarItem[];
  /** Conteúdo exibido à direita (ex.: botões de login, avatar). */
  rightContent?: ReactNode;
  /** Classes extras aplicadas ao `<nav>`. */
  className?: string;
  /** Posicionamento da barra. */
  position?: NavbarPosition;
  /** Largura máxima do conteúdo interno. */
  maxWidth?: NavbarMaxWidth;
  /** Exibe a borda inferior. */
  isBordered?: boolean;
  /** Aplica fundo translúcido com blur. */
  isBlurred?: boolean;
  /** Rótulo acessível da navegação. */
  ariaLabel?: string;
}

const maxWidthClasses: Record<NavbarMaxWidth, string> = {
  sm: "max-w-[640px]",
  md: "max-w-[768px]",
  lg: "max-w-[1024px]",
  xl: "max-w-[1280px]",
  "2xl": "max-w-[1536px]",
  full: "max-w-full",
};

const positionClasses: Record<NavbarPosition, string> = {
  static: "",
  sticky: "sticky top-0",
  fixed: "fixed top-0",
};

const defaultItems: NavbarItem[] = [
  { label: "Início", href: "/" },
  { label: "Filmes", href: "/movie" },
];

function isItemActive(pathname: string, item: NavbarItem) {
  if (item.isActive !== undefined) return item.isActive;
  if (item.href === "/") return pathname === "/";

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

interface NavLinkProps {
  item: NavbarItem;
  pathname: string;
  className?: string;
  onNavigate?: () => void;
}

function NavLink({ item, pathname, className, onNavigate }: NavLinkProps) {
  const active = isItemActive(pathname, item);

  return (
    <NextLink
      aria-current={active ? "page" : undefined}
      className={cn(
        "focus-visible:ring-accent focus-visible:ring-offset-background inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium no-underline transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        active
          ? "bg-accent-soft text-accent"
          : "text-muted hover:bg-default-soft hover:text-foreground",
        className,
      )}
      href={item.href}
      onClick={onNavigate}
    >
      {item.label}
    </NextLink>
  );
}

export default function Navbar({
  brand = <Brand />,
  items = defaultItems,
  rightContent,
  className,
  position = "sticky",
  maxWidth = "xl",
  isBordered = true,
  isBlurred = true,
  ariaLabel = "Navegação principal",
}: NavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fecha o menu mobile sempre que a rota muda.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Fecha o menu mobile com a tecla Esc.
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "z-40 w-full",
        positionClasses[position],
        isBordered && "border-separator border-b",
        isBlurred ? "bg-background/75 backdrop-blur-xl" : "bg-background",
        className,
      )}
    >
      <header
        className={cn(
          "mx-auto flex h-16 items-center justify-between gap-4 px-5 sm:px-8",
          maxWidthClasses[maxWidth],
        )}
      >
        <NextLink
          aria-label="IMDB — página inicial"
          className="focus-visible:ring-accent focus-visible:ring-offset-background rounded-xl focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
          href="/"
        >
          {brand}
        </NextLink>

        <ul className="hidden items-center gap-1 md:flex">
          {items.map((item) => (
            <li key={item.href}>
              <NavLink item={item} pathname={pathname} />
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          {rightContent && (
            <div className="hidden items-center gap-3 md:flex">
              {rightContent}
            </div>
          )}

          <ThemeSwitcher />

          <button
            aria-controls="navbar-mobile-menu"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            className="text-foreground hover:bg-default-soft focus-visible:ring-accent focus-visible:ring-offset-background grid size-11 place-items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            type="button"
          >
            {isMenuOpen ? (
              <X aria-hidden="true" className="size-5" />
            ) : (
              <Menu aria-hidden="true" className="size-5" />
            )}
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div
          className="border-separator border-t md:hidden"
          id="navbar-mobile-menu"
        >
          <ul className="flex flex-col gap-1 px-5 py-3">
            {items.map((item) => (
              <li key={item.href}>
                <NavLink
                  className="w-full px-4 py-3 text-base"
                  item={item}
                  onNavigate={() => setIsMenuOpen(false)}
                  pathname={pathname}
                />
              </li>
            ))}

            {rightContent && (
              <li className="border-separator mt-2 flex flex-col gap-2 border-t pt-3">
                {rightContent}
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
