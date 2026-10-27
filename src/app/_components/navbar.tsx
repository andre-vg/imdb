"use client";

import {
  useEffect,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Button, Link, cn } from "@heroui/react";
import { Menu, X } from "lucide-react";
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
}

function NavLink({ item, pathname, className }: NavLinkProps) {
  const active = isItemActive(pathname, item);

  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={cn(
        "text-sm font-medium no-underline transition-colors",
        active ? "text-accent" : "text-muted hover:text-foreground",
        className,
      )}
      href={item.href}
      render={(props) => (
        <NextLink
          {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
          href={item.href}
        />
      )}
    >
      {item.label}
    </Link>
  );
}

export default function Navbar({
  brand = (
    <NextLink className="text-lg font-bold tracking-tight" href="/">
      IMDB
    </NextLink>
  ),
  items = defaultItems,
  rightContent,
  className,
  position = "sticky",
  maxWidth = "lg",
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
        isBlurred ? "bg-background/70 backdrop-blur-lg" : "bg-background",
        className,
      )}
    >
      <header
        className={cn(
          "mx-auto flex h-16 items-center justify-between gap-4 px-6",
          maxWidthClasses[maxWidth],
        )}
      >
        <div className="flex items-center gap-3">
          <Button
            aria-controls="navbar-mobile-menu"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            className="md:hidden"
            isIconOnly
            onPress={() => setIsMenuOpen((open) => !open)}
            size="sm"
            variant="ghost"
          >
            {isMenuOpen ? (
              <X aria-hidden="true" className="size-5" />
            ) : (
              <Menu aria-hidden="true" className="size-5" />
            )}
          </Button>

          {brand}
        </div>

        <ul className="hidden items-center gap-6 md:flex">
          {items.map((item) => (
            <li key={item.href}>
              <NavLink item={item} pathname={pathname} />
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">{rightContent}</div>
        <ThemeSwitcher />
      </header>

      {isMenuOpen && (
        <div
          className="border-separator border-t md:hidden"
          id="navbar-mobile-menu"
        >
          <ul className="flex flex-col gap-1 px-6 py-4">
            {items.map((item) => (
              <li key={item.href}>
                <NavLink
                  className="block py-2 text-base"
                  item={item}
                  pathname={pathname}
                />
              </li>
            ))}

            {rightContent && (
              <li className="border-separator mt-3 flex flex-col gap-2 border-t pt-3">
                {rightContent}
              </li>
            )}
            <ThemeSwitcher />
          </ul>
        </div>
      )}
    </nav>
  );
}
