/**
 * Prisma Client Singleton
 *
 * During development, Next.js hot-reloads modules on every request.
 * Without this pattern, each reload creates a new PrismaClient instance,
 * eventually exhausting the database connection pool.
 *
 * This stores the client on `globalThis` so it survives hot reloads
 * in development while remaining unused in production.
 *
 * Prisma 7 requires a driver adapter (PrismaPg) for PostgreSQL connections.
 *
 * Database access is server-only — never import this in client components.
 */

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
