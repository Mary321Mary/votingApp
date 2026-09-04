import React, { useContext } from "react";
import { StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { FormProps, RegisterFormState } from "@/utils/types";
import { isRequired } from "@/utils/constants";
import InputField from "../../atoms/InputField";
import { Checkbox } from "@/components/atoms/Checkbox";
import { ThemeContext } from "@/styles/ThemeProvider";

export const ConnectedPAStep2 = ({
  state,
  value,
  formCongif,
  errorMessages,
  onChangeError,
  onChange,
  handleMainButton,
}: FormProps) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  const onlyDigits = (text: string) => text.replace(/\D/g, "");

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
        name="penn_dot_number"
        label={t("pennsylvania.penn_dot_number")}
        value={value.state_id_number}
        required
        disabled={value.has_no_state_license === true}
        maxLength={formCongif.fields.state_id_number?.validations?.max_length}
        errorMessage={
          value.has_no_state_license !== true &&
          t(errorMessages.state_id_number, {
            state_abbr: state.abbreviation,
          })
        }
        onChangeText={(text: string) => {
          const digits = onlyDigits(text);
          const lastFour = digits.slice(-4);

          // Batch all updates together to prevent overwriting
          onChange({
            ...value,
            state_id_number: text,
            has_no_state_license: false,
            last_four_ss_number: lastFour,
          });

          // Clear errors for updated fields
          const clearedErrors = { ...errorMessages };
          if (errorMessages.state_id_number?.length) {
            clearedErrors.state_id_number = "";
          }
          if (errorMessages.last_four_ss_number?.length) {
            clearedErrors.last_four_ss_number = "";
          }
          onChangeError(clearedErrors);
        }}
      />

      <Text style={styles.label}>
        {t("pennsylvania.penn_dot_number_instruction")}
      </Text>
      <Checkbox
        name="has_no_state_license"
        value={value.has_no_state_license === true}
        label={t("pennsylvania.penn_dot_number_none_checkbox")}
        required={isRequired(formCongif, "has_no_state_license")}
        onValueChange={(checked: boolean) =>
          updateField("has_no_state_license", checked)
        }
      />
      {handleMainButton}
    </>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    label: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "medium",
      marginVertical: 5,
    },
  });
