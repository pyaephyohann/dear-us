/**
 * Server-only helpers for classifying and logging database/API failures.
 * Never import from client components.
 */

const SECRET_PATTERN =
  /postgres(?:ql)?:\/\/\S+|DATABASE_URL\S*|creatorAccessToken\S*/gi;

export function sanitizeErrorMessage(value: unknown): string {
  const raw =
    value instanceof Error
      ? value.message
      : typeof value === "string"
        ? value
        : "";
  return raw.replace(SECRET_PATTERN, "[redacted]").slice(0, 500);
}

export function getPrismaCode(error: unknown): string | undefined {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code?: unknown }).code;
    if (typeof code === "string") return code;
  }
  return undefined;
}

/**
 * Errors that are safe to retry once because the interactive transaction
 * rolled back (or never started). Do not include validation/auth codes.
 */
export function isTransientDbError(error: unknown): boolean {
  const code = getPrismaCode(error);
  if (
    code === "P1001" || // can't reach database
    code === "P1002" || // database timed out
    code === "P1008" || // operations timed out
    code === "P1017" || // server closed the connection
    code === "P2024" || // timed out fetching a connection
    code === "P2028" || // transaction API error / could not start in time
    code === "P2034" // write conflict / deadlock — retry after rollback
  ) {
    return true;
  }

  const message = sanitizeErrorMessage(error);
  return /ECONNRESET|ECONNREFUSED|ETIMEDOUT|EPIPE|connection terminated|Connection terminated|too many clients|remaining connection slots|the database system is starting|can't reach database|Timed out fetching a new connection|Unable to start a transaction|Client has encountered a connection error|Connection ended unexpectedly/i.test(
    message
  );
}

export function logApiEvent(event: {
  operation: string;
  level?: "info" | "error";
  httpStatus?: number;
  errorType?: string;
  prismaCode?: string;
  message?: string;
  validationIssues?: { path: PropertyKey[]; code: string }[];
  transient?: boolean;
  retried?: boolean;
  txSucceeded?: boolean;
}): void {
  const payload = {
    ts: new Date().toISOString(),
    ...event,
    message: event.message ? sanitizeErrorMessage(event.message) : undefined,
  };

  const line = JSON.stringify(payload);
  if (event.level === "error") {
    console.error("[dearus]", line);
  } else {
    console.info("[dearus]", line);
  }
}

export function logCaughtError(
  operation: string,
  error: unknown,
  extra?: { retried?: boolean; txSucceeded?: boolean }
): void {
  const err = error instanceof Error ? error : new Error(String(error));
  logApiEvent({
    operation,
    level: "error",
    httpStatus: 500,
    errorType: err.name,
    prismaCode: getPrismaCode(error),
    message: err.message,
    transient: isTransientDbError(error),
    ...extra,
  });
}
