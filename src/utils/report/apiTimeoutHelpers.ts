export type ReportApiTimeoutOptions = {
  registration_uid?: string | null;
  partner_id?: string | number | null;
};

export type ApiTimeoutReportContext = {
  registration_uid?: string | null;
  partner_id?: string | number | null;
};

/** Last path segment of an API URL, e.g. `/api/ng/check_pa_covr` → `check_pa_covr`. */
export function apiMethodFromUrl(url?: string | null): string {
  if (!url) {
    return "unknown";
  }
  const path = url.split("?")[0];
  const segments = path.split("/").filter(Boolean);
  return segments[segments.length - 1] || "unknown";
}

/** Skip timeout reporting for telemetry endpoints to avoid recursive calls. */
export function isTelemetryEndpoint(url?: string | null): boolean {
  const method = apiMethodFromUrl(url);
  return method === "report_event" || method === "report_internal_error";
}

export function resolvePartnerId(partnerId?: string | number | null): string {
  if (partnerId != null && partnerId !== "") {
    return String(partnerId);
  }
  return "1";
}

export function formatApiTimeoutEventName(methodName: string): string {
  return `API timeout: ${methodName}`;
}

const COVR_CHECK_METHODS = new Set([
  "check_mi_covr",
  "check_pa_covr",
  "check_wa_covr",
]);

/** COVR check polls report timeout on the fail screen — skip interceptor duplicates. */
export function isCovrCheckEndpoint(url?: string | null): boolean {
  return COVR_CHECK_METHODS.has(apiMethodFromUrl(url));
}

export type ReportEventFn = (
  payload: ReturnType<typeof buildApiTimeoutPayload>,
) => void | Promise<unknown>;

/** Fire-and-forget API timeout report; never throws into callers. */
export function fireApiTimeoutReport(
  reportEvent: ReportEventFn,
  methodName: string,
  options?: ReportApiTimeoutOptions,
): void {
  const payload = buildApiTimeoutPayload(methodName, options);
  try {
    void Promise.resolve(reportEvent(payload)).catch((err) =>
      console.error("Failed to report API timeout:", err),
    );
  } catch (err) {
    console.error("Failed to report API timeout:", err);
  }
}

/** Pure payload builder — safe to import from http without pulling in api.ts. */
export function buildApiTimeoutPayload(
  methodName: string,
  options?: ReportApiTimeoutOptions,
): {
  registration_uid: string;
  partner_id: string;
  step: "";
  event_name: string;
} {
  return {
    registration_uid: options?.registration_uid || "",
    partner_id: resolvePartnerId(options?.partner_id),
    step: "",
    event_name: formatApiTimeoutEventName(methodName),
  };
}

/** Safely parse Axios request body (string or already-parsed object). */
export function parseRequestData(rawData: unknown): Record<string, any> {
  if (typeof rawData === "string") {
    return JSON.parse(rawData || "{}");
  }
  if (rawData && typeof rawData === "object") {
    return rawData as Record<string, any>;
  }
  return {};
}

export function registrationContextFromRequestBody(reqData: Record<string, any>): {
  registration_uid: string | null;
  partner_id: string | number;
} {
  const registrant = reqData?.registrant || {};
  return {
    registration_uid: reqData?.registration_uid || registrant?.registration_uid || null,
    partner_id: reqData?.partner_id ?? registrant?.partner_id ?? "1",
  };
}
