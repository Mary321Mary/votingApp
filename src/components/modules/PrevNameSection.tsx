import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "@/styles/ThemeProvider";
import InputField from "../atoms/InputField";
import { FormProps, RegisterFormState } from "@/utils/types";
import { Checkbox } from "../atoms/Checkbox";
import { isRequired, isVisible } from "@/utils/constants";
import { SelectField } from "../atoms/SelectField";

interface PrevNameSectionProps extends Omit<FormProps, "state"> {}

export const PrevNameSection = ({
  value,
  formCongif,
  errorMessages,
  onChange,
  onChangeError,
}: PrevNameSectionProps) => {
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
      {isVisible(formCongif, "change_of_name") && (
        <Checkbox
          name="change_of_name"
          value={value.change_of_name}
          required={isRequired(formCongif, "change_of_name")}
          label={t("nvra_form_page.changed_name")}
          helpText={t("nvra_form_page.changed_name_help")}
          onValueChange={(checked: boolean) => {
            if (!checked) {
              // Update change_of_name and clear all prev_* fields in one batch
              onChange({
                ...value,
                change_of_name: checked,
                prev_name_title: "",
                prev_first_name: "",
                prev_middle_name: "",
                prev_last_name: "",
                prev_name_suffix: "",
              });
              // Clear errors for prev_* fields
              const clearedErrors = { ...errorMessages };
              clearedErrors.prev_name_title = "";
              clearedErrors.prev_first_name = "";
              clearedErrors.prev_middle_name = "";
              clearedErrors.prev_last_name = "";
              clearedErrors.prev_name_suffix = "";
              onChangeError(clearedErrors);
            } else {
              updateField("change_of_name", checked);
            }
          }}
        />
      )}

      {value.change_of_name && (
        <View style={styles.row}>
          {isVisible(formCongif, "prev_name_title") && (
            <SelectField
              name="prev_name_title"
              label={t("form_fields.name_title")}
              value={value.prev_name_title}
              options={TITLES}
              required={isRequired(
                formCongif,
                "prev_name_title",
                value.change_of_name,
              )}
              errorMessage={errorMessages.prev_name_title}
              onValueChange={itemValue =>
                updateField("prev_name_title", itemValue)
              }
            />
          )}
          {isVisible(formCongif, "prev_first_name") && (
            <InputField
              name="prev_first_name"
              label={t("form_fields.first_name")}
              value={value.prev_first_name}
              required={isRequired(
                formCongif,
                "prev_first_name",
                value.change_of_name,
              )}
              errorMessage={t(errorMessages.prev_first_name)}
              onChangeText={(text: string) =>
                updateField("prev_first_name", text)
              }
            />
          )}
          {isVisible(formCongif, "prev_middle_name") && (
            <InputField
              name="prev_middle_name"
              label={t("form_fields.middle_name")}
              value={value.prev_middle_name}
              required={isRequired(
                formCongif,
                "prev_middle_name",
                value.change_of_name,
              )}
              errorMessage={t(errorMessages.prev_middle_name)}
              onChangeText={(text: string) =>
                updateField("prev_middle_name", text)
              }
            />
          )}
          {isVisible(formCongif, "prev_last_name") && (
            <InputField
              name="prev_last_name"
              label={t("form_fields.last_name")}
              required={isRequired(
                formCongif,
                "prev_last_name",
                value.change_of_name,
              )}
              errorMessage={t(errorMessages.prev_last_name)}
              value={value.prev_last_name}
              onChangeText={(text: string) =>
                updateField("prev_last_name", text)
              }
            />
          )}
          {isVisible(formCongif, "prev_name_suffix") && (
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
              errorMessage={errorMessages.prev_name_suffix}
              onValueChange={itemValue =>
                updateField("prev_name_suffix", itemValue)
              }
            />
          )}
        </View>
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
