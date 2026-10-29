"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Label, Spinner } from "@heroui/react";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";

import { authClient } from "@/server/better-auth/client";

export type AuthMode = "login" | "signup";

interface EmailPasswordFormProps {
  mode: AuthMode;
  /** Rota interna para onde voltar após autenticar. */
  nextPath: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mapAuthError(
  code: string | undefined,
  message: string | undefined,
  mode: AuthMode,
): string {
  switch (code) {
    case "USER_ALREADY_EXISTS":
      return "Este e-mail já tem cadastro. Volte para a aba Entrar.";
    case "INVALID_EMAIL":
      return "Informe um e-mail válido.";
    case "PASSWORD_TOO_SHORT":
    case "WEAK_PASSWORD":
      return "A senha precisa ter pelo menos 8 caracteres.";
    case "INVALID_EMAIL_OR_PASSWORD":
      return "E-mail ou senha incorretos.";
    case "EMAIL_NOT_VERIFIED":
      return "Confirme seu e-mail antes de entrar.";
    default:
      return (
        message ??
        (mode === "signup"
          ? "Não foi possível criar a conta agora. Tente novamente."
          : "Não foi possível entrar agora. Tente novamente.")
      );
  }
}

const FIELD_ID_PREFIX = "auth";

export default function EmailPasswordForm({
  mode,
  nextPath,
}: EmailPasswordFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const isSignup = mode === "signup";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const errors: FieldErrors = {};

    if (isSignup && name.trim().length < 2) {
      errors.name = "Informe seu nome.";
    }

    if (!EMAIL_PATTERN.test(email.trim())) {
      errors.email = "Informe um e-mail válido.";
    }

    if (isSignup ? password.length < 8 : password.length === 0) {
      errors.password = isSignup
        ? "A senha precisa ter pelo menos 8 caracteres."
        : "Informe sua senha.";
    }

    if (errors.name || errors.email || errors.password) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsPending(true);

    try {
      const result = isSignup
        ? await authClient.signUp.email({
            email: email.trim(),
            password,
            name: name.trim(),
          })
        : await authClient.signIn.email({
            email: email.trim(),
            password,
          });

      if (result.error) {
        setFormError(
          mapAuthError(result.error.code, result.error.message, mode),
        );
        setIsPending(false);
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setFormError(
        isSignup
          ? "Não foi possível criar a conta agora. Verifique sua conexão e tente novamente."
          : "Não foi possível entrar agora. Verifique sua conexão e tente novamente.",
      );
      setIsPending(false);
    }
  };

  const nameFieldId = `${FIELD_ID_PREFIX}-${isSignup ? "signup" : "login"}-name`;
  const emailFieldId = `${FIELD_ID_PREFIX}-${isSignup ? "signup" : "login"}-email`;
  const passwordFieldId = `${FIELD_ID_PREFIX}-${isSignup ? "signup" : "login"}-password`;

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      {isSignup && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={nameFieldId}>Nome</Label>
          <Input
            autoComplete="name"
            className="w-full"
            id={nameFieldId}
            onChange={(event) => setName(event.target.value)}
            placeholder="Como você se chama?"
            value={name}
          />
          {fieldErrors.name && (
            <p className="text-danger text-xs" role="alert">
              {fieldErrors.name}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={emailFieldId}>E-mail</Label>
        <Input
          autoComplete="email"
          className="w-full"
          id={emailFieldId}
          inputMode="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="voce@exemplo.com"
          type="email"
          value={email}
        />
        {fieldErrors.email && (
          <p className="text-danger text-xs" role="alert">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={passwordFieldId}>Senha</Label>

        <div className="relative">
          <Input
            autoComplete={isSignup ? "new-password" : "current-password"}
            className="w-full pr-11"
            id={passwordFieldId}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={isSignup ? "Mínimo de 8 caracteres" : "Sua senha"}
            type={showPassword ? "text" : "password"}
            value={password}
          />

          <button
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={showPassword}
            className="text-muted hover:text-foreground focus-visible:ring-accent absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full focus-visible:ring-2 focus-visible:outline-none"
            onClick={() => setShowPassword((visible) => !visible)}
            tabIndex={-1}
            type="button"
          >
            {showPassword ? (
              <EyeOff aria-hidden="true" className="size-4" />
            ) : (
              <Eye aria-hidden="true" className="size-4" />
            )}
          </button>
        </div>

        {fieldErrors.password && (
          <p className="text-danger text-xs" role="alert">
            {fieldErrors.password}
          </p>
        )}
      </div>

      {formError && (
        <p
          aria-live="polite"
          className="text-danger bg-danger-soft/50 rounded-xl px-3 py-2 text-sm"
          role="alert"
        >
          {formError}
        </p>
      )}

      <Button
        className="w-full"
        isDisabled={isPending}
        size="lg"
        type="submit"
        variant="primary"
      >
        {isPending ? (
          <>
            <Spinner size="sm" />
            {isSignup ? "Criando conta…" : "Entrando…"}
          </>
        ) : isSignup ? (
          <>
            <UserPlus aria-hidden="true" className="size-4" />
            Criar conta
          </>
        ) : (
          <>
            <LogIn aria-hidden="true" className="size-4" />
            Entrar
          </>
        )}
      </Button>
    </form>
  );
}
