import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_PREFIX = "i18n_cache_";

export async function saveTranslationsToCache(
  locale: string,
  data: Record<string, any>,
) {
  await AsyncStorage.setItem(
    `${CACHE_PREFIX}${locale}`,
    JSON.stringify(data),
  );
}

export async function loadTranslationsFromCache(
  locale: string,
): Promise<Record<string, any> | null> {
  const raw = await AsyncStorage.getItem(`${CACHE_PREFIX}${locale}`);
  return raw ? JSON.parse(raw) : null;
}

export async function clearTranslationsCache(locale?: string) {
  if (locale) {
    await AsyncStorage.removeItem(`${CACHE_PREFIX}${locale}`);
  }
}
