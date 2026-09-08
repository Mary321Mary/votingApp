import { isAxiosError } from "axios";
import { COVR_CLIENT_ERRORS } from "./covrClientErrors";

export function isAxiosRequestTimeout(error: unknown): boolean {
  return isAxiosError(error) && error.code === "ECONNABORTED";
}

type PollCheckCatchOptions = {
  signal?: AbortSignal;
  isAborted: (error: unknown) => boolean;
  /** MI omits error codes on abort / 404 (legacy behavior). */
  useEmptyErrorsOnAbort?: boolean;
};

/** Resolve poll check errors or rethrow for unexpected failures. */
export function resolvePollCheckCatchErrors(
  error: unknown,
  options: PollCheckCatchOptions,
): string[] | "throw" {
  const { signal, isAborted, useEmptyErrorsOnAbort = false } = options;

  if (isAborted(error) || signal?.aborted) {
    return useEmptyErrorsOnAbort ? [] : [COVR_CLIENT_ERRORS.POLL_ABORTED];
  }
  if (isAxiosError(error) && error.response?.status === 404) {
    return useEmptyErrorsOnAbort ? [] : [COVR_CLIENT_ERRORS.CHECK_NOT_FOUND];
  }
  if (isAxiosRequestTimeout(error)) {
    return [COVR_CLIENT_ERRORS.POLL_TIMEOUT];
  }
  return "throw";
}
