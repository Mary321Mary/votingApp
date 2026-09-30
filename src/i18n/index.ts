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

const SUPPORTED_LANGS = ["en", "es", "tl"];

const languageDetector = {
  type: "languageDetector" as ModuleType,
  name: "customNativeDetector",

  detect: () => {
    const locales = RNLocalize.getLocales();
    if (!locales || locales.length === 0) {
      return "en";
    }

    const deviceLang = locales[0].languageCode;

    return SUPPORTED_LANGS.includes(deviceLang) ? deviceLang : "en";
  },

  init: () => {},
  cacheUserLanguage: () => {},
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
