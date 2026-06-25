import React, { useContext } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { FormProps, RegisterFormState } from "@/utils/types";
import InputField from "../../atoms/InputField";
import { ThemeContext } from "@/styles/ThemeProvider";
import { isRequired } from "@/utils/constants";
import { PhoneSection } from "@/components/modules/PhoneSection";

export const ConnectedPAStep3Device = ({
  value,
  state,
  formCongif,
  errorMessages,
  onChangeError,
  onChange,
}: FormProps) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

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
    <View style={styles.deviceBlock}>
      <PhoneSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        onChange={onChange}
        onChangeError={onChangeError}
      />

      <Button title={t("pennsylvania.send_sms")} onPress={() => {}} />

      <InputField
        label={t("pennsylvania.email_me_link")}
        value={value.email_address}
        required={isRequired(formCongif, "email")}
        onChangeText={(text: string) => updateField("email_address", text)}
        errorMessage={t(errorMessages.email_address)}
      />

      <Button title={t("pennsylvania.send_email")} onPress={() => {}} />

      <Text style={styles.paragraph}>
        {t("pennsylvania.continue_on_touch_device")}
      </Text>

      <Button title={t("pennsylvania.copy_link")} onPress={() => {}} />
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
