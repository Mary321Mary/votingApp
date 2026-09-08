import { COVR_CLIENT_ERRORS } from "../register/covrClientErrors";
import { formatApiTimeoutEventName } from "./apiTimeoutHelpers";

export type CovrCheckMethodName =
  | "check_mi_covr"
  | "check_pa_covr"
  | "check_wa_covr";

export function apiTimeoutMethodFromPollErrors(
  errors: string[] | undefined,
  checkMethod: CovrCheckMethodName,
): CovrCheckMethodName | undefined {
  if (errors?.includes(COVR_CLIENT_ERRORS.POLL_TIMEOUT)) {
    return checkMethod;
  }
  return undefined;
}

export function resolveCovrFailEventName(
  defaultEventName: string,
  apiTimeoutMethod?: CovrCheckMethodName,
): string {
  return apiTimeoutMethod
    ? formatApiTimeoutEventName(apiTimeoutMethod)
    : defaultEventName;
}
