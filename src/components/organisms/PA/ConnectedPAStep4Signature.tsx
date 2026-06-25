import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { FormProps, RegisterFormState } from "@/utils/types";
import InputField from "../../atoms/InputField";
import { Checkbox } from "@/components/atoms/Checkbox";
import { ThemeContext } from "@/styles/ThemeProvider";
import { isRequired } from "@/utils/constants";
import SignatureUpload from "@/components/modules/SignatureUpload";

export const ConnectedPAStep4Signature = ({
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

  const handleSSNChange = (text: string) => {
    const digits = onlyDigits(text);
    const lastFour = digits.slice(-4);
    updateField("last_four_ss_number", lastFour);
  };

  const handleSomeoneHelpedChange = (checked: boolean) => {
    if (!checked) {
      onChange({
        ...value,
        someone_helped: checked,
        helper_electronic_signature_acknowledged: false,
      });
    } else {
      onChange({
        ...value,
        someone_helped: checked,
      });
    }
  };

  return (
    <View>
      <Text style={styles.paragraph}>
        {t("pennsylvania.complete_with_upload")}
      </Text>

      <Text style={styles.label}>
        {t("pennsylvania.upload_signature_instruction")}
      </Text>

      <SignatureUpload
        initialValue={value.signature_base64}
        error={t(errorMessages.signature_base64)}
        selectButtonTextKey="pennsylvania.upload_signature_button_text"
        onChange={({ base64 }) => {
          updateField("signature_base64", base64);
        }}
      />

      {/* SSN */}
      <InputField
        label={t("pennsylvania.ssn4_label")}
        value={value.last_four_ss_number}
        disabled={value.has_no_ssn === true}
        maxLength={4}
        onChangeText={handleSSNChange}
        errorMessage={t(errorMessages.last_four_ss_number)}
      />

      {/* Checkbox */}
      <Checkbox
        value={value.has_no_ssn === true}
        label={t("pennsylvania.ssn4_none_checkbox")}
        required={isRequired(formCongif, "has_no_ssn")}
        onValueChange={(checked: boolean) => {
          if (checked) {
            onChange({
              ...value,
              has_no_ssn: checked,
              last_four_ss_number: "",
            });
          } else {
            onChange({ ...value, has_no_ssn: checked });
          }
        }}
      />

      {/* Someone helped */}
      <Checkbox
        value={value.someone_helped}
        label={t("pennsylvania.someone_helped")}
        onValueChange={handleSomeoneHelpedChange}
      />

      {value.someone_helped && (
        <>
          <InputField
            label={t("pennsylvania.helper_name_label")}
            value={value.helper_name}
            required
            errorMessage={t(errorMessages.helper_name)}
            onChangeText={(text: string) => updateField("helper_name", text)}
          />

          <InputField
            label={t("pennsylvania.helper_address_label")}
            value={value.helper_address}
            required
            errorMessage={t(errorMessages.helper_address)}
            onChangeText={(text: string) => updateField("helper_address", text)}
          />

          <InputField
            label={t("pennsylvania.helper_phone_label")}
            value={value.helper_phone}
            required
            errorMessage={t(errorMessages.helper_phone)}
            onChangeText={(text: string) => updateField("helper_phone", text)}
          />

          <View style={styles.termsBox}>
            <Text style={styles.termsText}>
              {t("pennsylvania.helper_terms_paragraph_1")}
            </Text>

            <Text style={styles.termsBold}>
              {t("pennsylvania.helper_terms_paragraph_2")}
            </Text>

            <Text style={styles.bullet}>
              • {t("pennsylvania.helper_terms_bullet_1")}
            </Text>

            <Text style={styles.bullet}>
              • {t("pennsylvania.helper_terms_bullet_2")}
            </Text>
          </View>

          <Checkbox
            value={value.helper_electronic_signature_acknowledged}
            label={t("pennsylvania.helper_terms_confirm_label")}
            onValueChange={(checked: boolean) =>
              updateField("helper_electronic_signature_acknowledged", checked)
            }
          />
        </>
      )}
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

    label: {
      fontSize: 14,
      fontWeight: "700",
    },

    termsBox: {
      backgroundColor: theme.background,
      borderRadius: 10,
      padding: 14,
      marginVertical: 16,
    },

    termsText: {
      fontSize: 13,
      marginBottom: 10,
    },

    termsBold: {
      fontSize: 13,
      fontWeight: "700",
      marginBottom: 10,
    },

    bullet: {
      fontSize: 13,
      marginBottom: 6,
    },
  });
