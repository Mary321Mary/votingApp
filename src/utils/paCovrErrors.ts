export const PA_COVR_CLIENT_ERRORS = {
  POLL_TIMEOUT: "CLIENT_POLL_TIMEOUT",
  POLL_ABORTED: "CLIENT_POLL_ABORTED",
  CHECK_NOT_FOUND: "CLIENT_CHECK_NOT_FOUND",
} as const;

const KNOWN_PA_COVR_SERVICE_ERRORS = new Set([
  "error",
  "empty",
  "format",
  "timeout",
  "VR_WAPI_PennDOTServiceDown",
  "VR_WAPI_ServiceError",
  "VR_WAPI_SystemError",
]);

const CLIENT_ERROR_CODES = new Set<string>(
  Object.values(PA_COVR_CLIENT_ERRORS),
);

export type PACovrErrorVariant = "generic" | "zip" | "penndot";

export function parsePACovrErrorCode(entry: string): string {
  const trimmed = entry.trim();
  const match = trimmed.match(/:\s*(\S+)\s*$/);
  return match?.[1] ?? trimmed;
}

export function classifyPACovrErrors(errors: string[]): {
  variant: PACovrErrorVariant;
  isInternal: boolean;
  codes: string[];
} {
  const codes = errors
    .map(parsePACovrErrorCode)
    .filter(code => code.length > 0);

  if (codes.includes("VR_WAPI_InvalidOVRzipcode")) {
    return { variant: "zip", isInternal: false, codes };
  }

  if (codes.includes("VR_WAPI_InvalidOVRDL")) {
    return { variant: "penndot", isInternal: false, codes };
  }

  if (codes.length === 0) {
    return { variant: "generic", isInternal: false, codes };
  }

  if (
    codes.every(
      code =>
        CLIENT_ERROR_CODES.has(code) || KNOWN_PA_COVR_SERVICE_ERRORS.has(code),
    )
  ) {
    return { variant: "generic", isInternal: false, codes };
  }

  return { variant: "generic", isInternal: true, codes };
}

export function getPACovrFailNavigationExtras(variant: PACovrErrorVariant): {
  errorVariant: PACovrErrorVariant;
  retryInitialStep: 1 | 2;
} {
  return {
    errorVariant: variant,
    retryInitialStep: variant === "penndot" ? 2 : 1,
  };
}

export function getPAErrorI18nKey(errorVariant?: PACovrErrorVariant): string {
  switch (errorVariant) {
    case "zip":
      return "pennsylvania.error_text_zip";
    case "penndot":
      return "pennsylvania.error_text_penndot";
    default:
      return "pennsylvania.error_text";
  }
}
