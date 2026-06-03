import React, { useContext } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { FormProps, RegisterFormState } from "@/utils/types";
import InputField from "../../atoms/InputField";
import { ThemeContext } from "@/styles/ThemeProvider";
import { isRequired } from "@/utils/constants";

export const ConnectedPAStep3Device = ({
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
  const formatPhone = (digits: string) => {
    if (digits.length <= 3) return digits;

    if (digits.length <= 6) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }

    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

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

  const handlePhoneChange = (text: string) => {
    let digits = onlyDigits(text).slice(0, 10);

    if (value.phone.endsWith("-") && text.length === value.phone.length - 1) {
      digits = digits.slice(0, -1);
    }

    const formatted = formatPhone(digits);
    updateField("phone", formatted);
  };

  return (
    <View style={styles.deviceBlock}>
      <InputField
        label="Text me the link"
        placeholder="###-###-####"
        value={value.phone}
        required={isRequired(formCongif, "phone", value.opt_in_sms)}
        onChangeText={handlePhoneChange}
        errorMessage={t(errorMessages.phone)}
      />

      <Button title="Send sms" onPress={() => {}} />

      <InputField
        label="Email me the link"
        value={value.email_address}
        required={isRequired(formCongif, "email")}
        onChangeText={(text: string) => updateField("email_address", text)}
        errorMessage={t(errorMessages.email_address)}
      />

      <Button title="Send email" onPress={() => {}} />

      <Text style={styles.paragraph}>
        Or open this link on a touch-enable device to finish your registration
      </Text>

      <Button title="Copy link" onPress={() => {}} />
      {handleMainButton}
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    paragraph: {
      fontSize: 14,
      lineHeight: 22,
      marginBottom: 10,
    },

    deviceBlock: {
      gap: 10,
      marginBottom: 10,
    },
  });
