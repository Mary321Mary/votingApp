import React from "react";
import { useTranslation } from "react-i18next";
import { isRequired, isVisible, STATES } from "@/utils/constants";
import { FormProps, RegisterFormState } from "@/utils/types";
import InputField from "../atoms/InputField";
import { SelectField } from "../atoms/SelectField";

export const StandardMailingAddress = ({
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
        name="mailing_address_number"
        label={t("michigan.mailing_street.number")}
        value={value.mailing_address_number}
        errorMessage={t(errorMessages.mailing_address_number)}
        required
        onChangeText={(text: string) =>
          updateField("mailing_address_number", text)
        }
      />

      <InputField
        name="mailing_address_street_name"
        label={t("michigan.mailing_street.name")}
        value={value.mailing_address_street_name}
        errorMessage={t(errorMessages.mailing_address_street_name)}
        required
        onChangeText={(text: string) =>
          updateField("mailing_address_street_name", text)
        }
      />

      <InputField
        name="mailing_address_street_type"
        label={t("michigan.mailing_street.type")}
        value={value.mailing_address_street_type}
        errorMessage={t(errorMessages.mailing_address_street_type)}
        onChangeText={(text: string) =>
          updateField("mailing_address_street_type", text)
        }
      />

      {isVisible(formCongif, "mailing_address") && (
        <InputField
          name="mailing_address"
          label={t("form_fields.address")}
          value={value.mailing_address}
          required={isRequired(formCongif, "mailing_address")}
          errorMessage={t(errorMessages.mailing_address)}
          onChangeText={(text: string) => updateField("mailing_address", text)}
        />
      )}

      <InputField
        name="mailing_unit"
        label={t("michigan.street.apt")}
        value={value.mailing_unit}
        errorMessage={t(errorMessages.mailing_unit)}
        onChangeText={(text: string) => updateField("mailing_unit", text)}
      />

      {isVisible(formCongif, "mailing_city") && (
        <InputField
          name="mailing_city"
          label={t("form_fields.city")}
          value={value.mailing_city}
          required={isRequired(formCongif, "mailing_city")}
          errorMessage={t(errorMessages.mailing_city)}
          onChangeText={(text: string) => updateField("mailing_city", text)}
        />
      )}

      {isVisible(formCongif, "mailing_state") && (
        <SelectField
          name="state"
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
          errorMessage={t(errorMessages.mailing_zip_code)}
          numeric
          onChangeText={(text: string) => updateField("mailing_zip_code", text)}
        />
      )}
    </>
  );
};
