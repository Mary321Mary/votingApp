/** Shared client-side COVR poll / check error codes (all states). */
export const COVR_CLIENT_ERRORS = {
  POLL_TIMEOUT: "CLIENT_POLL_TIMEOUT",
  POLL_ABORTED: "CLIENT_POLL_ABORTED",
  CHECK_NOT_FOUND: "CLIENT_CHECK_NOT_FOUND",
} as const;
