import React from "react";
import { useTranslation } from "react-i18next";
import { FormProps, RegisterFormState } from "@/utils/types";
import InputField from "../atoms/InputField";
import { isRequired, isVisible } from "@/utils/constants";
import { SelectField } from "../atoms/SelectField";

export const MilitaryMailingAddress = ({
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

  const AA_AE_AP = [
    { name: "", value: "" },
    { name: "AA", value: "aa" },
    { name: "AE", value: "ae" },
    { name: "AP", value: "ap" },
  ];

  const APO_FPO_DPO = [
    { name: "", value: "" },
    { name: "APO", value: "apo" },
    { name: "FPO", value: "fpo" },
    { name: "DPO", value: "dpo" },
  ];

  const BOX_GROUP_TYPE = [
    { name: "", value: "" },
    { name: "UNIT", value: "unit" },
    { name: "CMR", value: "cmr" },
    { name: "PSC", value: "psc" },
  ];

  return (
    <>
      <SelectField
        name="box_group_type"
        label={t("michigan.military.box_group_type")}
        value={value.mailing_box_group_type}
        options={BOX_GROUP_TYPE}
        required
        errorMessage={errorMessages.mailing_box_group_type}
        onValueChange={itemValue =>
          updateField("mailing_box_group_type", itemValue)
        }
      />

      {isVisible(formCongif, "mailing_box_group_number") && (
        <InputField
          name="mailing_box_group_number"
          label={t("michigan.military.box_group_number")}
          required={isRequired(formCongif, "mailing_box_group_number")}
          value={value.mailing_box_group_number}
          errorMessage={errorMessages.mailing_box_group_number}
          onChangeText={(text: string) =>
            updateField("mailing_box_group_number", text)
          }
        />
      )}

      {isVisible(formCongif, "mailing_box_number") && (
        <InputField
          name="mailing_box_number"
          label={t("michigan.military.box_number")}
          value={value.mailing_box_number}
          errorMessage={errorMessages.mailing_box_number}
          required={isRequired(formCongif, "mailing_box_number")}
          onChangeText={(text: string) =>
            updateField("mailing_box_number", text)
          }
        />
      )}

      {isVisible(formCongif, "mailing_apo") && (
        <SelectField
          name="apo_fpo_dpo"
          label={t("michigan.military.apo_fpo_dpo")}
          value={value.mailing_apo}
          options={APO_FPO_DPO}
          required={isRequired(formCongif, "mailing_apo")}
          errorMessage={errorMessages.mailing_apo}
          onValueChange={itemValue => updateField("mailing_apo", itemValue)}
        />
      )}

      {isVisible(formCongif, "mailing_ap") && (
        <SelectField
          name="aa_ae_ap"
          label={t("michigan.military.aa_ae_ap")}
          value={value.mailing_apo}
          options={AA_AE_AP}
          required={isRequired(formCongif, "mailing_ap")}
          errorMessage={errorMessages.mailing_ap}
          onValueChange={itemValue => updateField("mailing_ap", itemValue)}
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
