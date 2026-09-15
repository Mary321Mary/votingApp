import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "@/styles/ThemeProvider";
import InputField from "../atoms/InputField";
import { FormProps, RegisterFormState } from "@/utils/types";
import { Checkbox } from "../atoms/Checkbox";
import { isRequired, isVisible } from "@/utils/constants";
import { SelectField } from "../atoms/SelectField";
import { PrevNameSection } from "./PrevNameSection";

interface NameSectionProps extends FormProps {
  showChangeName?: boolean;
}

export const NameSection = ({
  value,
  formCongif,
  errorMessages,
  onChange,
  onChangeError,
  showChangeName = false,
}: NameSectionProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

  const TITLES = [
    { name: "", value: "" },
    { name: t("general.titles.mr"), value: t("general.titles.mr") },
    { name: t("general.titles.mrs"), value: t("general.titles.mrs") },
    { name: t("general.titles.miss"), value: t("general.titles.miss") },
    { name: t("general.titles.ms"), value: t("general.titles.ms") },
  ];
  const SUFFIX = [
    { name: t("general.none"), value: "" },
    { name: "Jr.", value: "Jr." },
    { name: "Sr.", value: "Sr." },
    { name: "II", value: "II" },
    { name: "III", value: "III" },
    { name: "IV", value: "IV" },
  ];

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
    <View style={styles.section}>
      <View style={styles.row}>
        {isVisible(formCongif, "name_title") && (
          <SelectField
            name="name_title"
            label={t("form_fields.name_title")}
            value={value.name_title}
            options={TITLES}
            required={isRequired(formCongif, "name_title")}
            errorMessage={errorMessages.name_title}
            onValueChange={itemValue => updateField("name_title", itemValue)}
          />
        )}

        {isVisible(formCongif, "first_name") && (
          <InputField
            name="first_name"
            label={t("form_fields.first_name")}
            required={isRequired(formCongif, "first_name")}
            value={value.first_name}
            errorMessage={t(errorMessages.first_name)}
            onChangeText={(text: string) => updateField("first_name", text)}
          />
        )}
        {isVisible(formCongif, "middle_name") && (
          <InputField
            name="middle_name"
            label={t("form_fields.middle_name")}
            value={value.middle_name}
            required={isRequired(formCongif, "middle_name")}
            errorMessage={t(errorMessages.middle_name)}
            onChangeText={(text: string) => updateField("middle_name", text)}
          />
        )}
        {isVisible(formCongif, "last_name") && (
          <InputField
            name="last_name"
            label={t("form_fields.last_name")}
            value={value.last_name}
            errorMessage={t(errorMessages.last_name)}
            required={isRequired(formCongif, "last_name")}
            onChangeText={(text: string) => updateField("last_name", text)}
          />
        )}

        {isVisible(formCongif, "name_suffix") && (
          <SelectField
            name="prev_name_suffix"
            label={t("form_fields.name_suffix")}
            value={value.prev_name_suffix}
            options={SUFFIX}
            required={isRequired(
              formCongif,
              "prev_name_suffix",
              value.change_of_name,
            )}
            errorMessage={
              errorMessages.prev_name_suffix
                ? t(errorMessages.prev_name_suffix)
                : undefined
            }
            onValueChange={itemValue =>
              updateField("prev_name_suffix", itemValue)
            }
          />
        )}
      </View>

      {isVisible(formCongif, "us_citizen") && (
        <Checkbox
          name="us_citizen"
          label={t("nvra_form_page.citizen")}
          value={value.us_citizen}
          required={isRequired(formCongif, "us_citizen")}
          errorText={t(errorMessages.us_citizen)}
          onValueChange={() => updateField("us_citizen", !value.us_citizen)}
        />
      )}
      {isVisible(formCongif, "age_eligibility") && (
        <Checkbox
          name="age_eligibility"
          label={t("nvra_form_page.age_eligibility")}
          required
          value={value.age_eligibility}
          errorText={t(errorMessages.age_eligibility)}
          onValueChange={checked => {
            if (!checked) {
              // Update age_eligibility and clear all prev_* and mailing_* fields in one batch
              onChange({
                ...value,
                change_of_name: checked,
                prev_name_title: "",
                prev_first_name: "",
                prev_middle_name: "",
                prev_last_name: "",
                prev_name_suffix: "",

                has_mailing_address: false,
                mailing_address: "",
                mailing_unit: "",
                mailing_city: "",
                mailing_state: "",
                mailing_zip_code: "",

                change_of_address: false,
                prev_address: "",
                prev_unit: "",
                prev_city: "",
                prev_state: "",
                prev_zip_code: "",
              });
              // Clear errors for prev_* fields
              const clearedErrors = { ...errorMessages };
              clearedErrors.prev_name_title = "";
              clearedErrors.prev_first_name = "";
              clearedErrors.prev_middle_name = "";
              clearedErrors.prev_last_name = "";
              clearedErrors.prev_name_suffix = "";

              clearedErrors.mailing_address = "";
              clearedErrors.mailing_unit = "";
              clearedErrors.mailing_city = "";
              clearedErrors.mailing_state = "";
              clearedErrors.mailing_zip_code = "";

              clearedErrors.prev_address = "";
              clearedErrors.prev_unit = "";
              clearedErrors.prev_city = "";
              clearedErrors.prev_state = "";
              clearedErrors.prev_zip_code = "";
              onChangeError(clearedErrors);
            } else {
              updateField("age_eligibility", checked);
            }
          }}
        />
      )}
      {isVisible(formCongif, "will_be_18_by_election") && (
        <Checkbox
          name="will_be_18_by_election"
          label={
            formCongif?.fields?.will_be_18_by_election?.label ||
            t("michigan.eligibility.age")
          }
          required
          value={value.will_be_18_by_election}
          errorText={t(errorMessages.will_be_18_by_election)}
          onValueChange={checked =>
            updateField("will_be_18_by_election", checked)
          }
        />
      )}

      {showChangeName && (
        <PrevNameSection
          value={value}
          formCongif={formCongif}
          errorMessages={errorMessages}
          onChange={onChange}
          onChangeError={onChangeError}
        />
      )}
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    section: {},
    row: {
      flexWrap: "wrap",
      width: "100%",
      alignItems: "flex-end",
    },
  });
