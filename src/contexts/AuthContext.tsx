import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useCallback,
} from "react";
import type { ReactNode } from "react";

import type {
  User,
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  AuthMeResponse,
} from "@/utils/types";
import * as authService from "@/utils/api";
import {
  getToken,
  getRefreshToken,
  removeTokens,
  setRefreshToken,
  setToken,
  isTokenExpired,
  getTimeUntilExpiration,
} from "@/utils/localStorage";

// Auth Actions
type AuthAction =
  | { type: "AUTH_LOADING" }
  | { type: "AUTH_SUCCESS"; payload: { user: AuthMeResponse; token: string } }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "CLEAR_ERROR" }
  | { type: "UPDATE_USER"; payload: User }
  | {
      type: "TOKEN_REFRESHED";
      payload: { token: string; refreshToken: string };
    };

// Auth Context Type
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (user: Partial<User>) => Promise<User>;
  checkAuth: () => Promise<void>;
  refreshToken: () => Promise<void>;
  authenticateWithStoredToken: () => Promise<boolean>;
}

// Initial State
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_LOADING":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "AUTH_ERROR":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "AUTH_LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "TOKEN_REFRESHED":
      return {
        ...state,
        token: action.payload.token,
        error: null,
      };
    default:
      return state;
  }
};

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const refreshTimeoutRef = useRef<number | null>(null);

  // Check if user is authenticated on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = await getToken();
      if (token) {
        checkAuth();
      } else {
        dispatch({ type: "AUTH_ERROR", payload: "No token found" });
      }
    };
    initAuth();
  }, []);

  // Check authentication status
  const checkAuth = async (): Promise<void> => {
    try {
      dispatch({ type: "AUTH_LOADING" });

      const token = await getToken();
      if (!token) {
        dispatch({ type: "AUTH_ERROR", payload: "No token found" });
        return;
      }

      // Make request to verify token and get user info
      const response = await authService.me({
        Authorization: `Bearer ${token}`,
      });

      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          user: response.data,
          token,
        },
      });
    } catch (error) {
      console.error("Auth check failed:", error);
      dispatch({ type: "AUTH_ERROR", payload: "Authentication failed" });
      removeTokens();
    }
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const response = await authService.login(credentials);
      const user = await authService.me({
        Authorization: `Bearer ${response.data.access_token}`,
      });

      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          user: user.data,
          token: response.data.access_token,
        },
      });
      setToken(response.data.access_token);
      setRefreshToken(response.data.refresh_token);
    } catch (error: unknown) {
      const errorMessage = `Login failed, ${
        error instanceof Error ? error.message : "Unknown error"
      }`;
      console.error("Login failed:", error);
      dispatch({ type: "AUTH_ERROR", payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    try {
      const response = await authService.register(credentials);

      // Store tokens for later use
      setToken(response.data.access_token);
      setRefreshToken(response.data.refresh_token);
    } catch (error: unknown) {
      console.error("Registration failed", error);
      const errorMessage = `Registration failed, ${
        error instanceof Error ? error.message : "Unknown error"
      }`;
      dispatch({ type: "AUTH_ERROR", payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const logout = useCallback((): void => {
    dispatch({ type: "AUTH_LOGOUT" });
    removeTokens();
  }, [dispatch]);

  const clearError = useCallback((): void => {
    dispatch({ type: "CLEAR_ERROR" });
  }, [dispatch]);

  const updateUser = async (body: Partial<User>): Promise<User> => {
    try {
      const response = await authService.updateMe(body);
      dispatch({ type: "UPDATE_USER", payload: response.data });
      return response.data;
    } catch (error) {
      console.error("Failed to update user", error);
      throw new Error("Failed to update user");
    }
  };

  const refreshToken = useCallback(async (): Promise<void> => {
    try {
      console.log("Refreshing token");
      const refreshTokenValue = await getRefreshToken();
      if (!refreshTokenValue) {
        throw new Error("No refresh token available");
      }

      const response = await authService.refreshToken(refreshTokenValue);
      const { access_token, refresh_token } = response.data;

      setToken(access_token);
      setRefreshToken(refresh_token);

      dispatch({
        type: "TOKEN_REFRESHED",
        payload: {
          token: access_token,
          refreshToken: refresh_token,
        },
      });
    } catch (error: unknown) {
      const errorMessage = `Token refresh failed, ${
        error instanceof Error ? error.message : "Unknown error"
      }`;
      dispatch({ type: "AUTH_ERROR", payload: errorMessage });
      removeTokens();
      throw new Error(errorMessage);
    }
  }, [dispatch]);

  const setupTokenRefresh = useCallback(() => {
    console.log("Setting up token refresh");
    if (!state.token) return;

    // Clear existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // Check if token is already expired
    if (isTokenExpired(state.token)) {
      // Token is expired, try to refresh immediately
      refreshToken().catch(() => {
        // If refresh fails, logout
        logout();
      });
      return;
    }

    // Calculate time until token expires (refresh 1 minute before expiration)
    const timeUntilExpiration = getTimeUntilExpiration(state.token);
    const refreshTime = Math.max(timeUntilExpiration - 60000, 0); // 1 minute before expiration

    // Set timeout to refresh token
    refreshTimeoutRef.current = setTimeout(() => {
      refreshToken().catch(() => {
        // If refresh fails, logout
        logout();
      });
    }, refreshTime);
  }, [state.token, refreshToken, logout]);

  // Method to authenticate using stored tokens (for post-payment flow)
  const authenticateWithStoredToken = async (): Promise<boolean> => {
    try {
      const token = await getToken();
      if (!token) {
        return false;
      }

      // Try to authenticate with stored token
      const response = await authService.me({
        Authorization: `Bearer ${token}`,
      });

      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          user: response.data,
          token,
        },
      });

      return true;
    } catch (error) {
      console.error("Stored token authentication failed:", error);
      // Don't remove tokens here - they might become valid after webhook processing
      return false;
    }
  };

  // Set up proactive token refresh
  useEffect(() => {
    if (state.token && state.isAuthenticated) {
      setupTokenRefresh();
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [state.token, state.isAuthenticated, setupTokenRefresh]);

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    updateUser,
    checkAuth,
    refreshToken,
    authenticateWithStoredToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
