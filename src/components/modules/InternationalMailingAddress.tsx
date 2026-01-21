import React from "react";
import { useTranslation } from "react-i18next";
import { FormProps, RegisterFormState } from "@/utils/types";
import InputField from "../atoms/InputField";

export const InternationalMailingAddress = ({ errorMessages, value, onChange }: FormProps) => {
  const { t } = useTranslation();

  const updateField = <K extends keyof RegisterFormState>(
    key: K,
    fieldValue: RegisterFormState[K]
  ) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return <>
    <InputField
      label={t('register_page.address_line', { number: 1 })}
      required
      value={value.internationalAddress1}
      errorMessage={errorMessages.internationalAddress1}
      onChangeText={(text: string) => updateField("internationalAddress1", text)}
    />

    <InputField
      label={t('register_page.address_line', { number: 2 })}
      value={value.internationalAddress2}
      errorMessage={errorMessages.internationalAddress2}
      onChangeText={(text: string) => updateField("internationalAddress2", text)}
    />

    <InputField
      label={t('register_page.address_line', { number: 3 })}
      value={value.internationalAddress3}
      errorMessage={errorMessages.internationalAddress3}
      onChangeText={(text: string) => updateField("internationalAddress3", text)}
    />

    <InputField
      label={t("register_page.postal_code")}
      value={value.internationalZip}
      errorMessage={errorMessages.internationalZip}
      numeric
      onChangeText={(text: string) => updateField("internationalZip", text)}
    />

    <InputField
      label={t("register_page.country")}
      value={value.internationalCountry}
      errorMessage={errorMessages.internationalCountry}
      numeric
      required
      onChangeText={(text: string) => updateField("internationalCountry", text)}
    />
  </>
};
