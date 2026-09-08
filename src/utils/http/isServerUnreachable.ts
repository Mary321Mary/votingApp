import { isAxiosError } from "axios";

const UNREACHABLE_CODES = new Set([
  "ERR_NETWORK",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_CONNECTION_REFUSED",
  "ERR_CONNECTION_RESET",
  "ERR_FAILED",
]);

type ApiDownHandler = () => void;

let apiDownHandler: ApiDownHandler | null = null;

/** Register the React-side handler (same pattern as setDebugLogger). */
export function setApiDownHandler(handler: ApiDownHandler | null): void {
  apiDownHandler = handler;
}

/** True when the request never got an HTTP response (offline, timeout, refused). */
export function isNetworkFailure(error: unknown): boolean {
  if (!isAxiosError(error)) {
    return false;
  }
  if (error.code && UNREACHABLE_CODES.has(error.code)) {
    return true;
  }
  return !error.response;
}

/**
 * True when an API call failed because the server never produced a usable
 * response (network drop, timeout, connection refused) or returned 5xx.
 */
export function isServerUnreachable(error: unknown): boolean {
  if (isNetworkFailure(error)) {
    return true;
  }
  if (!isAxiosError(error)) {
    return false;
  }
  return (error.response?.status ?? 0) >= 500;
}

export function notifyApiUnreachable(): void {
  apiDownHandler?.();
}
