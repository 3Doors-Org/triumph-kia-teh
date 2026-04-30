import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  DATABASE_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  SENTRY_DSN: z.string().url().optional(),
});

type ServerEnv = z.infer<typeof serverEnvSchema>;

const requiredInNonDev: ReadonlyArray<keyof ServerEnv> = [
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "DATABASE_URL",
];

let cachedEnv: ServerEnv | null = null;

/**
 * Parses server environment values and optionally enforces required keys.
 * Use `strictRequired: true` for staging/production boot checks.
 */
export function getServerEnv(options?: { strictRequired?: boolean }): ServerEnv {
  if (cachedEnv) return cachedEnv;

  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid server environment configuration: ${issues}`);
  }

  const strictRequired =
    options?.strictRequired ?? parsed.data.NODE_ENV !== "development";

  if (strictRequired) {
    const missing = requiredInNonDev.filter((key) => !parsed.data[key]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables for non-development runtime: ${missing.join(
          ", ",
        )}`,
      );
    }
  }

  cachedEnv = parsed.data;
  return parsed.data;
}

