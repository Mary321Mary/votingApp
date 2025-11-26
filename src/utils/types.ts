export interface User {
  id: number;
  username: string;
  password_hash: string;
  email: string;
  name: string;
  birth_date?: string; // ISO date string
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  created_at: string; // ISO datetime string
}

export interface AuthState {
  user: AuthMeResponse | User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  user: {
    username: string;
    name: string;
    email: string;
    password: string;
    state: string;
    city: string;
    address: string;
    phone: string;
    birth_date: string;
    zip: string;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export type AuthData = {
  access_token: string;
  refresh_token: string;
};

export type RegisterData = {
  access_token: string;
  refresh_token: string;
};

export interface AuthMeResponse {
  email: string;
  username: string;
  name: string;
  state: string;
  city: string;
  address: string;
  phone: string;
  birth_date?: string;
  agency?: string;
  zip: string;
}

// zip

export interface UIConfig {
  display_locale_switcher: string;
  supported_locales: string[];
  urls: {
    homepage: string;
    terms: string;
    privacy: string;
    shortcode: string;
  };
}

export interface SubmitEmailZipRequest {
  email: string;
  zip: string;
}

export interface SubmitEmailZipResponse {
  status: { success: boolean; errors: string[] };
  state: {
    name: string;
    abbreviation: string;
    ovr_type: string;
    not_participating_text?: string;
  };
  user: Record<string, unknown>;
}
