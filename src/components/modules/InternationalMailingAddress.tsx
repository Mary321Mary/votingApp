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
      {isVisible(formCongif, "mailing_address_line1") && (
        <InputField
          label={t("michigan.international.address_line_1")}
          value={value.mailing_address_line1}
          required={isRequired(formCongif, "mailing_address_line1")}
          errorMessage={errorMessages.mailing_address_line1}
          onChangeText={(text: string) =>
            updateField("mailing_address_line1", text)
          }
        />
      )}

      {isVisible(formCongif, "mailing_address_line2") && (
        <InputField
          label={t("michigan.international.address_line_2")}
          value={value.mailing_address_line2}
          required={isRequired(formCongif, "mailing_address_line2")}
          errorMessage={errorMessages.mailing_address_line2}
          onChangeText={(text: string) =>
            updateField("mailing_address_line2", text)
          }
        />
      )}

      {isVisible(formCongif, "mailing_address_line3") && (
        <InputField
          label={t("michigan.international.address_line_3")}
          value={value.mailing_address_line3}
          required={isRequired(formCongif, "mailing_address_line3")}
          errorMessage={errorMessages.mailing_address_line3}
          onChangeText={(text: string) =>
            updateField("mailing_address_line3", text)
          }
        />
      )}

      {isVisible(formCongif, "mailing_postal_code") && (
        <InputField
          label={t("michigan.international.postal_code")}
          value={value.mailing_postal_code}
          required={isRequired(formCongif, "mailing_postal_code")}
          errorMessage={errorMessages.mailing_postal_code}
          numeric
          onChangeText={(text: string) =>
            updateField("mailing_postal_code", text)
          }
        />
      )}

      {isVisible(formCongif, "mailing_country") && (
        <InputField
          label={t("michigan.international.mailing_country")}
          value={value.mailing_country}
          errorMessage={errorMessages.mailing_country}
          numeric
          required
          onChangeText={(text: string) => updateField("mailing_country", text)}
        />
      )}
    </>
  );
};
