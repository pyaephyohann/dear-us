/**
 * Prisma Client Singleton
 *
 * During development, Next.js hot-reloads modules on every request.
 * Without this pattern, each reload creates a new PrismaClient instance,
 * eventually exhausting the database connection pool.
 *
 * This stores the client and pg Pool on `globalThis` so they survive hot
 * reloads and are reused across serverless invocations in the same isolate.
 *
 * Prisma 7 requires a driver adapter (PrismaPg) for PostgreSQL connections.
 *
 * Database access is server-only — never import this in client components.
 *
 * Vercel + Neon: serverless isolates freeze idle TCP connections. Keep the
 * pool tiny, fail connection attempts in a bounded time, and retry once on
 * transient disconnects/timeouts (see withTransientRetry).
 */

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import {
  isTransientDbError,
  logApiEvent,
} from "./api/db-errors";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

function createPool(): Pool {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // One connection per serverless isolate — avoids Neon connection storms.
    max: 1,
    idleTimeoutMillis: 10_000,
    // Neon compute can take a few seconds to wake from scale-to-zero.
    connectionTimeoutMillis: 10_000,
    allowExitOnIdle: true,
  });

  pool.on("error", (err) => {
    logApiEvent({
      operation: "pg-pool",
      level: "error",
      errorType: err.name,
      message: err.message,
      transient: true,
    });
  });

  return pool;
}

function createPrismaClient(): PrismaClient {
  const pool = globalForPrisma.pgPool ?? createPool();
  globalForPrisma.pgPool = pool;

  const adapter = new PrismaPg(pool, {
    onPoolError: (err) => {
      logApiEvent({
        operation: "prisma-pool",
        level: "error",
        errorType: err.name,
        message: err.message,
        transient: true,
      });
    },
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;

/**
 * Interactive-transaction options sized for Neon cold starts on Vercel.
 * Defaults (maxWait 2s / timeout 5s) are what made first-save attempts
 * fail intermittently while the immediate retry succeeded.
 */
export const MUTATION_TX_OPTIONS = {
  maxWait: 10_000,
  timeout: 15_000,
} as const;

/**
 * Execute a Prisma query with a timeout.
 * Prevents infinite hangs when DATABASE_URL is missing or database is unreachable.
 */
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  errorMessage = "Database operation timed out"
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), ms)
    ),
  ]);
}

/**
 * Retry a mutation once when the failure is a transient connection /
 * transaction-timeout / deadlock. Interactive transactions roll back on
 * throw, so this will not double-create a Little Thing.
 */
export async function withTransientRetry<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (!isTransientDbError(error)) throw error;

    logApiEvent({
      operation,
      level: "error",
      errorType: error instanceof Error ? error.name : "Error",
      prismaCode:
        error && typeof error === "object" && "code" in error
          ? String((error as { code?: unknown }).code)
          : undefined,
      message: error instanceof Error ? error.message : String(error),
      transient: true,
      retried: false,
    });

    return await fn();
  }
}
