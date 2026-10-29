"use client";

import { useRouter } from "next/navigation";
import { Avatar, Button, Dropdown } from "@heroui/react";
import { Film, LogIn, LogOut } from "lucide-react";

import { authClient } from "@/server/better-auth/client";

/**
 * Área de autenticação do navbar. Sem sessão, exibe o botão "Entrar";
 * com sessão, mostra o avatar do GitHub com um menu para voltar ao quiz
 * de recomendações ou sair.
 */
export default function NavbarAuth() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <span
        aria-hidden="true"
        className="bg-separator/60 block size-9 animate-pulse rounded-full"
      />
    );
  }

  if (!user) {
    return (
      <Button
        className="min-h-9 gap-1.5 px-4 text-sm"
        onPress={() => router.push("/entrar")}
        size="sm"
        variant="ghost"
      >
        <LogIn aria-hidden="true" className="size-4" />
        Entrar
      </Button>
    );
  }

  const initials =
    user.name
      ?.split(/\s+/)
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "IMDB";

  return (
    <Dropdown>
      <Dropdown.Trigger aria-label={`Menu de ${user.name ?? "usuário"}`}>
        <Avatar
          className="focus-visible:ring-accent focus-visible:ring-offset-background size-9 cursor-pointer rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          color="accent"
          size="sm"
        >
          <Avatar.Image
            alt={`Foto de ${user.name ?? "usuário"}`}
            src={user.image ?? undefined}
          />
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>

      <Dropdown.Popover placement="bottom end">
        <Dropdown.Menu aria-label="Menu do usuário">
          <Dropdown.Item>
            <span className="truncate">
              <span className="text-foreground block text-sm font-semibold">
                {user.name}
              </span>
              <span className="text-muted block truncate text-xs">
                {user.email}
              </span>
            </span>
          </Dropdown.Item>

          <Dropdown.Item
            onAction={() => router.push("/recomendar")}
            textValue="Recomendações"
          >
            <Film aria-hidden="true" className="size-4" />
            Recomendações
          </Dropdown.Item>

          <Dropdown.Item
            onAction={() => {
              void authClient.signOut().then(() => {
                router.push("/");
                router.refresh();
              });
            }}
            textValue="Sair"
          >
            <LogOut aria-hidden="true" className="size-4" />
            Sair
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
