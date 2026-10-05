import i18n, { ModuleType } from "i18next";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";

import en from "./en/en.json";
import es from "./es/es.json";
import tl from "./tl/tl.json";

// mobile
import enMobile from "./en/mobileEN.json";
import esMobile from "./es/mobileES.json";
import tlMobile from "./tl/mobileTL.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SUPPORTED_LANGS = ["en", "es", "tl"];
export const LANGUAGE_KEY = "user_preferred_locale";

const languageDetector = {
  type: "languageDetector" as ModuleType,
  name: "customNativeDetector",
  async: true,

  detect: async (callback: (lang: string) => void) => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage && SUPPORTED_LANGS.includes(savedLanguage)) {
        return callback(savedLanguage);
      }
    } catch (e) {
      console.error("Failed to fetch language from storage", e);
    }

    const locales = RNLocalize.getLocales();
    const deviceLang = locales?.[0]?.languageCode;
    const finalLang = SUPPORTED_LANGS.includes(deviceLang) ? deviceLang : "en";

    return callback(finalLang);
  },

  init: () => {},
  cacheUserLanguage: async (lang: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    } catch (e) {
      console.error("Failed to save language to storage", e);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: { ...en, ...enMobile } },
      es: { translation: { ...es, ...esMobile } },
      tl: { translation: { ...tl, ...tlMobile } },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
