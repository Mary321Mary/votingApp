import type {
  AuthData,
  AuthMeResponse,
  DataConfigurationRequest,
  FetchDataCollectionConfigResponse,
  LoginCredentials,
  RegisterCredentials,
  RegisterData,
  SubmitEmailZipRequest,
  SubmitEmailZipResponse,
  UIConfig,
  User,
} from "utils/types";
import { HttpClient } from "utils/http/http";
import * as ENDPOINTS from "utils/endpoints";

// need to check and fix

export function login(
  credentials: LoginCredentials,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<LoginCredentials, AuthData>(
    ENDPOINTS.AUTH_LOGIN,
    credentials,
    headers,
  );
}

export function register(
  credentials: RegisterCredentials,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<RegisterCredentials, RegisterData>(
    ENDPOINTS.AUTH_REGISTER,
    credentials,
    headers,
  );
}

export function refreshToken(
  refreshTokenValue: string,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<{ refresh_token: string }, AuthData>(
    ENDPOINTS.AUTH_REFRESH,
    { refresh_token: refreshTokenValue },
    headers,
  );
}

export function me(headers: Record<string, string> = {}) {
  return HttpClient.Client.get<AuthMeResponse>(ENDPOINTS.AUTH_ME, headers);
}

export function updateMe(
  data: Partial<User>,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.patch<Partial<User>, User>(
    ENDPOINTS.AUTH_UPDATE_ME,
    data,
    headers,
  );
}

// need to check EMAIL_ZIP and UI_CONFIG

export function submitEmailZip(
  data: SubmitEmailZipRequest,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<SubmitEmailZipRequest, SubmitEmailZipResponse>(
    ENDPOINTS.EMAIL_ZIP,
    data,
    headers,
  );
}

export function fetchUIConfiguration(headers: Record<string, string> = {}) {
  return HttpClient.Client.get<UIConfig>(ENDPOINTS.UI_CONFIG, headers);
}

export function fetchDataConfiguration(
  data: DataConfigurationRequest,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.get<FetchDataCollectionConfigResponse>(
    ENDPOINTS.DATA_CONFIG +
      `&state_abbreviation=${data.state_abbreviation}&workflow_type=${data.workflow_type}&locale=${data.locale}`,
    headers,
  );
}

export async function submitEmailZipFake(
  data: SubmitEmailZipRequest,
  headers: Record<string, string> = {},
) {
  await new Promise(r => setTimeout(() => r(undefined), 100));

  switch (data.zip) {
    case "48001":
      return {
        status: { success: true, errors: [] },
        state: {
          name: "Michigan",
          abbreviation: "MI",
          ovr_type: "connected_ovr",
          not_participating_text: "",
        },
        user: { first_name: "John", last_name: "Doe" },
      };

    case "38111":
      return {
        status: { success: true, errors: [] },
        state: {
          name: "Tennessee",
          abbreviation: "TN",
          ovr_type: "state_ovr",
          not_participating_text: "",
        },
        user: { first_name: "John", last_name: "Doe" },
      };

    case "03031":
      return {
        status: { success: true, errors: [] },
        state: {
          name: "New Hampshire",
          abbreviation: "NH",
          ovr_type: "not_participating",
          not_participating_text: "No OVR in NH",
        },
        user: { first_name: "John", last_name: "Doe" },
      };

    case "72007":
      return {
        status: { success: true, errors: [] },
        state: {
          name: "Arkansas",
          abbreviation: "AR",
          ovr_type: "paper",
          not_participating_text: "",
        },
        user: { first_name: "John", last_name: "Doe" },
      };

    case "00000":
      return {
        status: { success: false, errors: ["ZIP Code 00000 is not valid"] },
        state: {},
        user: {},
      };

    default:
      return {
        status: { success: false, errors: ["Not a test case"] },
        state: {},
        user: {},
      };
  }
}
