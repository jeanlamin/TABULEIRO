export type AppErrorCode =
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "CONFLICT"
  | "UNAUTHORIZED"
  | "UNEXPECTED";

export interface AppError {
  readonly code: AppErrorCode;
  readonly message: string;
  readonly cause?: unknown;
}

export type AppResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: AppError };

export function ok<T>(value: T): AppResult<T> {
  return { ok: true, value };
}

export function err<T = never>(
  code: AppErrorCode,
  message: string,
  cause?: unknown,
): AppResult<T> {
  return { ok: false, error: { code, message, cause } };
}
