const requiredInProduction = ["JWT_SECRET", "DB_HOST", "DB_USER", "DB_NAME"] as const;

export function validateEnvironment() {
  if (process.env.NODE_ENV === "production") {
    for (const name of requiredInProduction) {
      if (!process.env[name]) throw new Error(`Variable d'environnement manquante: ${name}`);
    }
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET est obligatoire");
  if (process.env.NODE_ENV === "production" && secret.length < 32) {
    throw new Error("JWT_SECRET doit contenir au moins 32 caractères en production");
  }
}

export const appPort = Number(process.env.APP_PORT ?? process.env.PORT ?? 3000);
