import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "@/styles/ThemeProvider";
import { FormProps, RegisterFormState } from "@/utils/types";
import { isRequired, isVisible } from "@/utils/constants";
import { SelectField } from "../atoms/SelectField";

interface IDSectionProps extends FormProps {
  showRadioButtons?: boolean;
}

export const RaceAndParty = ({
  value,
  formCongif,
  errorMessages,
  onChange,
  onChangeError,
}: IDSectionProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
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
    <View style={styles.section}>
      {(!value.age_eligibility || !value.has_no_state_license) &&
        isVisible(formCongif, "race") && (
          <SelectField
            name="race"
            label={t("form_fields.race")}
            value={value.race}
            options={
              formCongif.fields.race.options?.map((option: string) => ({
                name: option,
                value: option,
              })) || []
            }
            required={isRequired(formCongif, "race")}
            errorMessage={errorMessages.race}
            helpText={formCongif?.fields?.race?.tooltip}
            onValueChange={itemValue => updateField("race", itemValue)}
          />
        )}
      {(!value.age_eligibility || !value.has_no_state_license) &&
        isVisible(formCongif, "party") && (
          <SelectField
            name="party"
            label={t("form_fields.party")}
            value={value.party}
            options={
              formCongif.fields.party.options?.map((option: string) => ({
                name: option,
                value: option,
              })) || []
            }
            required={isRequired(formCongif, "party")}
            errorMessage={errorMessages.party}
            helpText={formCongif?.fields?.party?.tooltip}
            onValueChange={itemValue => updateField("party", itemValue)}
          />
        )}
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    section: {},
    inputLabel: {
      textTransform: "uppercase",
      marginVertical: 5,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      color: theme.textPrimary,
    },
    pickerWrapper: {
      flexBasis: "18%",
      minWidth: "100%",
      height: 45,
      backgroundColor: theme.white,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 5,
      overflow: "hidden",
      justifyContent: "center",
    },
    picker: {
      // height: 48,
      width: "100%",
    },
    pickerItem: {
      fontSize: 14,
    },
    required: {
      color: theme.secondary,
    },
  });
