import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { FormProps, RegisterFormState } from "@/utils/types";
import { ThemeContext } from "@/styles/ThemeProvider";
import InputField from "@/components/atoms/InputField";
import SignatureUpload from "@/components/modules/SignatureUpload";

export const ConnectedWAStep2 = ({
  value,
  errorMessages,
  onChange,
  onChangeError,
  handleMainButton,
}: FormProps) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  const updateField = <K extends keyof RegisterFormState>(
    key: K,
    fieldValue: RegisterFormState[K],
  ) => {
    onChange({ ...value, [key]: fieldValue });
    if (errorMessages[key]?.length) {
      onChangeError({ ...errorMessages, [key]: "" });
    }
  };

  const onlyDigits = (text: string) => text.replace(/\D/g, "");

  const handleSSNChange = (text: string) => {
    const digits = onlyDigits(text);
    updateField("last_four_ss_number", digits.slice(-4));
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>
        {t("washington.comment_optional")}
      </Text>

      <InputField
        showEye
        label={t("washington.ssn4_optional")}
        value={value.last_four_ss_number}
        maxLength={4}
        secureTextEntry
        onChangeText={handleSSNChange}
        errorMessage={
          errorMessages.last_four_ss_number
            ? t(errorMessages.last_four_ss_number)
            : ""
        }
      />

      <Text style={styles.fieldLabel}>
        {t("washington.signature_optional")}
      </Text>
      <Text style={styles.helpText}>{t("washington.signature_help")}</Text>

      <SignatureUpload
        initialValue={value.signature_base64}
        error={t(errorMessages.signature_base64)}
        selectButtonTextKey="washington.upload_signature_image_button"
        onChange={({ base64 }) => {
          updateField("signature_base64", base64);
        }}
      />
      <View style={styles.button}>{handleMainButton}</View>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 12,
    },
    fieldLabel: {
      fontSize: 14,
      fontWeight: "600",
      marginTop: 24,
      marginBottom: 2,
    },
    helpText: {
      fontSize: 13,
      lineHeight: 20,
      color: theme.textMuted ?? "#666",
      marginTop: 0,
      marginBottom: 12,
    },
    button: {
      marginTop: 15,
    },
  });
