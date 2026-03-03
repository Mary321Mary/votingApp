import React from "react";
import { useTranslation } from "react-i18next";
import { FormProps, RegisterFormState } from "@/utils/types";
import InputField from "../atoms/InputField";
import { isRequired, isVisible } from "@/utils/constants";

export const InternationalMailingAddress = ({
  errorMessages,
  value,
  formCongif,
  onChange,
  onChangeError,
}: FormProps) => {
  const { t } = useTranslation();

  const updateField = <K extends keyof RegisterFormState>(
    key: K,
    fieldValue: RegisterFormState[K],
  ) => {
    onChange({ ...value, [key]: fieldValue });
    if (errorMessages[key].length) {
      onChangeError({
        ...errorMessages,
        [key]: "",
      });
    }
  };

  return (
    <>
      <InputField
        label={t("register_page.international.address_line_1")}
        required
        value={value.addressLine1}
        errorMessage={errorMessages.addressLine1}
        onChangeText={(text: string) => updateField("addressLine1", text)}
      />

      <InputField
        label={t("register_page.international.address_line_2")}
        value={value.addressLine2}
        errorMessage={errorMessages.addressLine2}
        onChangeText={(text: string) => updateField("addressLine2", text)}
      />

      <InputField
        label={t("register_page.international.address_line_3")}
        value={value.addressLine3}
        errorMessage={errorMessages.addressLine3}
        onChangeText={(text: string) => updateField("addressLine3", text)}
      />

      {isVisible(formCongif, "mailing_zip_code") && (
        <InputField
          label={t("register_page.international.postal_code")}
          value={value.mailingZip}
          required={isRequired(formCongif, "mailing_zip_code")}
          errorMessage={errorMessages.mailingZip}
          numeric
          onChangeText={(text: string) => updateField("mailingZip", text)}
        />
      )}

      <InputField
        label={t("register_page.country")}
        value={value.mailingCountry}
        errorMessage={errorMessages.mailingCountry}
        numeric
        required
        onChangeText={(text: string) => updateField("mailingCountry", text)}
      />
    </>
  );
};
