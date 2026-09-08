import axios, {
  type AxiosResponse,
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import * as authService from "utils/api";
import Config from "react-native-config";
import {
  apiMethodFromUrl,
  fireApiTimeoutReport,
  isCovrCheckEndpoint,
  isTelemetryEndpoint,
  parseRequestData,
  registrationContextFromRequestBody,
  resolvePartnerId,
} from "../report/apiTimeoutHelpers";
import { isNetworkFailure, notifyApiUnreachable } from "./isServerUnreachable";

const DEFAULT_AXIOS_TIMEOUT_MS = 60000;

// Extend the AxiosRequestConfig to include _retry property
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export class HttpClient {
  private client: AxiosInstance;
  private static instance: HttpClient;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  private constructor() {
    const BASE_URL = Config.REACT_APP_BASE_URL;

    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: DEFAULT_AXIOS_TIMEOUT_MS,
      headers: {
        "Content-type": "application/json",
      },
    });

    this.client.interceptors.request.use(
      config => {
        return config;
      },
      error => {
        return Promise.reject(error);
      },
    );

    // Add response interceptor to handle token refresh
    this.client.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as ExtendedAxiosRequestConfig;

        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry
        ) {
          if (this.isRefreshing) {
            return Promise.reject(error);
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // Process queued requests
            this.failedQueue.forEach(({ resolve }) => {
              resolve();
            });
            this.failedQueue = [];

            this.isRefreshing = false;
            return this.client(originalRequest);
          } catch (refreshError) {
            console.error("Refresh token error:", refreshError);
            this.isRefreshing = false;

            // Reject queued requests
            this.failedQueue.forEach(({ reject }) => {
              reject(refreshError);
            });
            this.failedQueue = [];

            return Promise.reject(refreshError);
          }
        }

        const originalUrl = originalRequest?.url;
        // Telemetry failures must not re-enter this interceptor: reporting
        // report_internal_error while offline used to recurse forever.
        if (isTelemetryEndpoint(originalUrl)) {
          return Promise.reject(error);
        }

        const status = error.response?.status;
        const isAborted = error.code === "ECONNABORTED";
        const reportTimeout = isAborted && !isCovrCheckEndpoint(originalUrl);
        const reportInternal =
          !isAborted && (status === 422 || (status != null && status >= 500));

        if (isNetworkFailure(error)) {
          notifyApiUnreachable();
        }

        if (reportTimeout || reportInternal) {
          try {
            const reqData = parseRequestData(originalRequest?.data);
            const { registration_uid: registrationUid, partner_id: partnerId } =
              registrationContextFromRequestBody(reqData);
            const partnerIdStr = resolvePartnerId(partnerId);

            if (reportTimeout) {
              fireApiTimeoutReport(
                authService.reportEvent,
                apiMethodFromUrl(originalUrl),
                {
                  registration_uid: registrationUid || "",
                  partner_id: partnerIdStr,
                },
              );
            }

            authService
              .reportInternalError({
                message: `API Failure on ${originalRequest?.method?.toUpperCase()} ${
                  originalRequest?.url
                }: ${error.message}`,
                registration_uid: registrationUid || "",
                voter_uid:
                  reqData?.voter_uid || reqData?.registrant?.voter_uid || null,
                partner_id: partnerIdStr,
                workflow_type: reqData?.workflow_type || null,
                severity: "error",
                context: {
                  http_status: status || "NETWORK_ERROR",
                  error_code: error.code || "UNKNOWN",
                  response_body: error.response?.data || null,
                },
              })
              .catch(err => console.error("Failed to send telemetry:", err));
          } catch (loggingError) {
            console.error(
              "Failed to parse error context for telemetry:",
              loggingError,
            );
          }
        }

        return Promise.reject(error);
      },
    );
  }

  static get Client(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }

    return HttpClient.instance;
  }

  get<ReturnType>(
    url: string,
    headers?: Record<string, string>,
  ): Promise<AxiosResponse<ReturnType>> {
    return this.client.get<ReturnType>(url, { headers });
  }

  post<DataType, ReturnType = void>(
    url: string,
    data: DataType,
    headers?: Record<string, string>,
  ): Promise<AxiosResponse<ReturnType>> {
    return this.client.post<ReturnType>(url, data, { headers });
  }

  put<DataType, ReturnType = void>(
    url: string,
    data: DataType,
    headers?: Record<string, string>,
  ): Promise<AxiosResponse<ReturnType>> {
    return this.client.put<ReturnType>(url, data, { headers });
  }

  patch<DataType, ReturnType = void>(
    url: string,
    data: DataType,
    headers?: Record<string, string>,
  ): Promise<AxiosResponse<ReturnType>> {
    return this.client.patch<ReturnType>(url, data, { headers });
  }

  delete(
    url: string,
    headers?: Record<string, string>,
  ): Promise<AxiosResponse> {
    return this.client.delete(url, { headers });
  }
}
