import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { env } from "@/env";
import { db } from "@/server/db";

const googleClientId = env.BETTER_AUTH_GOOGLE_CLIENT_ID;
const googleClientSecret = env.BETTER_AUTH_GOOGLE_CLIENT_SECRET;

// O provider só é registrado quando as credenciais existem; sem elas o app
// continua funcionando com GitHub e e-mail/senha.
const googleProvider =
  googleClientId && googleClientSecret
    ? {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        redirectURI: "http://localhost:3000/api/auth/callback/google",
      }
    : null;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "pg" or "mysql"
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: env.BETTER_AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
      redirectURI: "http://localhost:3000/api/auth/callback/github",
    },
    ...(googleProvider ? { google: googleProvider } : {}),
  },
});

export type Session = typeof auth.$Infer.Session;
