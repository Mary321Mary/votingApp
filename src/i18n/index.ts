import i18n, { ModuleType } from "i18next";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";

import en from "./en.json";
import es from "./es.json";
import ph from "./ph.json";

const SUPPORTED_LANGS = ['en', 'es', 'ph'];

const languageDetector = {
  type: "languageDetector" as ModuleType,
  name: "customNativeDetector",

  detect: () => {
    const locales = RNLocalize.getLocales();
    if (!locales || locales.length === 0) {
      return "en";
    }

    const deviceLang = locales[0].languageCode;

    return SUPPORTED_LANGS.includes(deviceLang)
      ? deviceLang
      : "en";
  },

  init: () => { },
  cacheUserLanguage: () => { },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      ph: { translation: ph },
    },
    supportedLngs: SUPPORTED_LANGS,
    fallbackLng: "en",
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
