import { I18nHttpClient } from "@/utils/http/i18n_http";

export function fetchTranslations(locale: string) {
  return I18nHttpClient.Client.get<Record<string, any>>(
    `/api/media/main/${locale}`
  );
}
