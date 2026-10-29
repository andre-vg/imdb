"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Spinner, Tabs } from "@heroui/react";
import { ArrowLeft } from "lucide-react";

import { Brand } from "@/app/_components/brand";
import EmailPasswordForm, {
  type AuthMode,
} from "@/app/_components/auth/email-password-form";
import GithubIcon from "@/app/_components/auth/github-icon";
import GoogleIcon from "@/app/_components/auth/google-icon";
import { authClient } from "@/server/better-auth/client";

interface SignInCardProps {
  /** Rota interna para voltar depois do login. Já validada pela página. */
  nextPath: string;
}

type SocialProvider = "github" | "google";

const DESCRIPTION_BY_MODE: Record<AuthMode, string> = {
  login:
    "Entre com sua conta para salvar as respostas do quiz, marcar filmes vistos e receber recomendações que não se repetem.",
  signup:
    "Crie uma conta em segundos para guardar seu perfil de recomendação e marcar o que você já assistiu.",
};

export default function SignInCard({ nextPath }: SignInCardProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [socialPending, setSocialPending] = useState<SocialProvider | null>(
    null,
  );
  const [socialError, setSocialError] = useState<string | null>(null);

  const isSignup = mode === "signup";

  const handleSocial = async (provider: SocialProvider) => {
    setSocialPending(provider);
    setSocialError(null);

    try {
      await authClient.signIn.social({
        provider,
        callbackURL: nextPath,
        errorCallbackURL: "/entrar?erro=social",
      });
      // O navegador é redirecionado para o provedor; nada mais a fazer aqui.
    } catch {
      setSocialPending(null);
      setSocialError(
        `Não foi possível iniciar o login com ${
          provider === "github" ? "o GitHub" : "o Google"
        }. Tente novamente em instantes.`,
      );
    }
  };

  return (
    <Card
      className="border-separator bg-surface w-full max-w-md overflow-hidden border p-6 sm:p-8"
      variant="default"
    >
      <div className="flex flex-col items-center text-center">
        <Brand showWordmark={false} />

        <h1 className="font-display text-foreground mt-5 text-4xl leading-[0.95] tracking-wide uppercase">
          {isSignup ? "Crie sua conta" : "Entre na IMDB"}
        </h1>

        <p className="text-muted mt-3 text-sm leading-relaxed">
          {DESCRIPTION_BY_MODE[mode]}
        </p>
      </div>

      <Tabs
        aria-label="Entrar ou criar conta"
        className="mt-6 w-full"
        onSelectionChange={(key) => setMode(key as AuthMode)}
        selectedKey={mode}
      >
        <Tabs.ListContainer>
          <Tabs.List className="grid w-full grid-cols-2">
            <Tabs.Tab className="px-2" id="login">
              Entrar
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab className="px-2" id="signup">
              Criar conta
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>

      <div className="mt-5">
        <EmailPasswordForm key={mode} mode={mode} nextPath={nextPath} />
      </div>

      <div className="mt-6 flex items-center gap-3" role="separator">
        <span className="bg-separator h-px flex-1" />
        <span className="text-muted text-xs">ou continue com</span>
        <span className="bg-separator h-px flex-1" />
      </div>

      {socialError && (
        <p
          aria-live="polite"
          className="text-danger bg-danger-soft/50 mt-3 rounded-xl px-3 py-2 text-sm"
          role="alert"
        >
          {socialError}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-2.5">
        <Button
          className="w-full"
          isDisabled={socialPending !== null}
          onPress={() => handleSocial("github")}
          size="lg"
          variant="secondary"
        >
          {socialPending === "github" ? (
            <Spinner size="sm" />
          ) : (
            <GithubIcon className="size-5" />
          )}
          Continuar com GitHub
        </Button>

        <Button
          className="w-full"
          isDisabled={socialPending !== null}
          onPress={() => handleSocial("google")}
          size="lg"
          variant="secondary"
        >
          {socialPending === "google" ? (
            <Spinner size="sm" />
          ) : (
            <GoogleIcon className="size-5" />
          )}
          Continuar com Google
        </Button>
      </div>

      <p className="text-muted mt-5 text-center text-xs leading-relaxed">
        Ao entrar, você concorda em usar seus dados apenas para personalizar as
        recomendações deste projeto de estudo.
      </p>

      <div className="border-separator mt-6 border-t pt-4 text-center">
        <Button onPress={() => router.push(nextPath)} size="sm" variant="ghost">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Voltar sem entrar
        </Button>
      </div>
    </Card>
  );
}
