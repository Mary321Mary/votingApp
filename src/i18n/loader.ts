import i18n from "./index";
import { fetchTranslations } from "./api";
import { loadTranslationsFromCache, saveTranslationsToCache } from "./cache";

export async function loadRemoteTranslations(locale: string) {
  console.log("Loading remote translations", locale);
  const cached = await loadTranslationsFromCache(locale);
  console.log("Cached translations", cached);

  if (cached) {
    i18n.addResourceBundle(
      locale,
      "translation",
      cached,
      true,
      true,
    );
    return
  }

  try {
    const response = await fetchTranslations(locale);
    console.log("Fetched translations", response.data);

    i18n.addResourceBundle(
      locale,
      "translation",
      response.data,
      true,
      true,
    );

    await saveTranslationsToCache(locale, response.data);
  } catch (e) {
    console.warn("Failed to fetch remote translations", e);
  }
}
