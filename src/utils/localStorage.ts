import * as Keychain from "react-native-keychain";
import { decode as atob } from "base-64";

// Ключи
const TOKEN_KEY = "jwtToken";
const REFRESH_TOKEN_KEY = "refreshToken";

// ======== GETTERS ========

export async function getToken(): Promise<string | null> {
  const credentials = await Keychain.getGenericPassword({ service: TOKEN_KEY });
  return credentials ? credentials.password : null;
}

export async function getRefreshToken(): Promise<string | null> {
  const credentials = await Keychain.getGenericPassword({
    service: REFRESH_TOKEN_KEY,
  });
  return credentials ? credentials.password : null;
}

// ======== SETTERS ========

export async function setToken(token: string): Promise<void> {
  await Keychain.setGenericPassword("token", token, { service: TOKEN_KEY });
}

export async function setRefreshToken(token: string): Promise<void> {
  await Keychain.setGenericPassword("refresh", token, {
    service: REFRESH_TOKEN_KEY,
  });
}

// ======== REMOVE ========

export async function removeTokens(): Promise<void> {
  await Keychain.resetGenericPassword({ service: TOKEN_KEY });
  await Keychain.resetGenericPassword({ service: REFRESH_TOKEN_KEY });
}

// ======== EXPIRATION CHECK ========

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
}

export function getTokenExpirationTime(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000;
  } catch {
    return null;
  }
}

export function getTimeUntilExpiration(token: string): number {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) return 0;

  return Math.max(0, expirationTime - Date.now());
}
