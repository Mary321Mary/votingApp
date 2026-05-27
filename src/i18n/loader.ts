import i18n from "./index";
import { fetchTranslations } from "./api";
import { loadTranslationsFromCache, saveTranslationsToCache } from "./cache";

export async function loadRemoteTranslations(locale: string) {
  const cached = await loadTranslationsFromCache(locale);

  if (cached) {
    i18n.addResourceBundle(locale, "translation", cached, true, true);
    return;
  }

  try {
    const response = await fetchTranslations(locale);
    i18n.addResourceBundle(locale, "translation", response.data, true, true);
    await saveTranslationsToCache(locale, response.data);
  } catch (e) {
    console.warn("Failed to fetch remote translations", e);
  }
}
