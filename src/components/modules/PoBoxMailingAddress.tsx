import React from "react";
import { useTranslation } from "react-i18next";
import { isRequired, isVisible, STATES } from "@/utils/constants";
import { FormProps, RegisterFormState } from "@/utils/types";
import InputField from "../atoms/InputField";
import { SelectField } from "../atoms/SelectField";

export const PoBoxMailingAddress = ({
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
      {isVisible(formCongif, "mailing_po_box_number") && (
        <InputField
          name="mailing_po_box_number"
          label={t("michigan.po_box_number")}
          required={isRequired(formCongif, "mailing_po_box_number")}
          value={value.mailing_po_box_number}
          errorMessage={errorMessages.mailing_po_box_number}
          onChangeText={(text: string) =>
            updateField("mailing_po_box_number", text)
          }
        />
      )}

      {isVisible(formCongif, "mailing_city") && (
        <InputField
          name="mailing_city"
          label={t("form_fields.city")}
          value={value.mailing_city}
          required={isRequired(formCongif, "mailing_city")}
          errorMessage={errorMessages.mailing_city}
          onChangeText={(text: string) => updateField("mailing_city", text)}
        />
      )}

      {isVisible(formCongif, "mailing_state") && (
        <SelectField
          name="mailing_state"
          label={t("form_fields.state")}
          value={value.mailing_state}
          options={STATES}
          required={isRequired(formCongif, "mailing_state")}
          errorMessage={errorMessages.mailing_state}
          onValueChange={itemValue => updateField("mailing_state", itemValue)}
        />
      )}

      {isVisible(formCongif, "mailing_zip_code") && (
        <InputField
          name="mailing_zip_code"
          label={t("form_fields.zip")}
          value={value.mailing_zip_code}
          required={isRequired(formCongif, "mailing_zip_code")}
          errorMessage={errorMessages.mailing_zip_code}
          numeric
          onChangeText={(text: string) => updateField("mailing_zip_code", text)}
        />
      )}
    </>
  );
};
