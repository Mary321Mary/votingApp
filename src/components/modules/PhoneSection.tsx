import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

import { FormProps, RegisterFormState } from "@/utils/types";
import { ThemeContext } from "@/styles/ThemeProvider";
import InputField from "../atoms/InputField";
import { isRequired, isVisible } from "@/utils/constants";

interface PhoneSectionProps extends FormProps {}

export const PhoneSection = ({
  value,
  formCongif,
  errorMessages,
  onChange,
  onChangeError,
}: PhoneSectionProps) => {
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

  const onlyDigits = (text: string) => text.replace(/\D/g, "");

  const formatPhone = (digits: string) => {
    if (digits.length <= 3) return digits;

    if (digits.length <= 6) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }

    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };
  const handlePhoneChange = (text: string) => {
    let digits = onlyDigits(text).slice(0, 10);

    if (value.phone.endsWith("-") && text.length === value.phone.length - 1) {
      digits = digits.slice(0, -1);
    }

    const formatted = formatPhone(digits);
    updateField("phone", formatted);
  };

  return (
    <View style={styles.row}>
      {isVisible(formCongif, "phone") && (
        <InputField
          label={t("form_fields.phone")}
          helpText={t("form_fields.phone_help")}
          placeholder="###-###-####"
          value={value.phone}
          required={isRequired(formCongif, "phone", value.opt_in_sms)}
          errorMessage={t(errorMessages.phone)}
          onChangeText={handlePhoneChange}
        />
      )}
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      flexWrap: "wrap",
      width: "100%",
      alignItems: "flex-end",
      marginVertical: 5,
    },
  });
