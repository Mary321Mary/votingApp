import axios, {
  type AxiosResponse,
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  getToken,
  getRefreshToken,
  setToken,
  setRefreshToken,
  removeTokens,
} from "utils/localStorage";
import * as authService from "utils/api";
import Config from "react-native-config";

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
      headers: {
        "Content-type": "application/json",
      },
    });

    this.client.interceptors.request.use(
      async config => {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
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

          const refreshTokenValue = await getRefreshToken();
          if (!refreshTokenValue) {
            this.isRefreshing = false;
            await removeTokens();
            return Promise.reject(error);
          }

          try {
            const response = await authService.refreshToken(refreshTokenValue);
            const { access_token, refresh_token } = response.data;

            await setToken(access_token);
            await setRefreshToken(refresh_token);

            // Update the original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${access_token}`;
            }

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
            await removeTokens();

            // Reject queued requests
            this.failedQueue.forEach(({ reject }) => {
              reject(refreshError);
            });
            this.failedQueue = [];

            return Promise.reject(refreshError);
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
