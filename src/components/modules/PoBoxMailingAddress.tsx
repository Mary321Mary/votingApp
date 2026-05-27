import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";
import { isRequired, isVisible, STATES } from "@/utils/constants";
import { FormProps, RegisterFormState } from "@/utils/types";
import { ThemeContext } from "@/styles/ThemeProvider";
import InputField from "../atoms/InputField";

export const PoBoxMailingAddress = ({
  errorMessages,
  value,
  formCongif,
  onChange,
  onChangeError,
}: FormProps) => {
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
    <>
      {isVisible(formCongif, "mailing_po_box_number") && (
        <InputField
          label={t("michigan.po_box_number")}
          required={isRequired(formCongif, "mailing_po_box_number")}
          value={value.mailing_po_box_number}
          errorMessage={errorMessages.mailing_po_box_number}
          onChangeText={(text: string) =>
            updateField("mailing_po_box_number", text)
          }
        />
      )}

      {isVisible(formCongif, "mailing_city") && (
        <InputField
          label={t("form_fields.city")}
          value={value.mailing_city}
          required={isRequired(formCongif, "mailing_city")}
          errorMessage={errorMessages.mailing_city}
          onChangeText={(text: string) => updateField("mailing_city", text)}
        />
      )}

      {isVisible(formCongif, "mailing_state") && (
        <View style={styles.inputBlock}>
          <Text style={styles.label}>
            {t("form_fields.state")}
            {isRequired(formCongif, "mailing_state") && (
              <Text style={styles.required}> *</Text>
            )}
          </Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={value.mailing_state}
              onValueChange={(text: string) =>
                updateField("mailing_state", text)
              }
            >
              {STATES.map(state_value => (
                <Picker.Item
                  key={state_value.value}
                  label={state_value.name}
                  value={state_value.value}
                />
              ))}
            </Picker>
          </View>
        </View>
      )}

      {isVisible(formCongif, "mailing_zip_code") && (
        <InputField
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

const getStyles = (theme: any) =>
  StyleSheet.create({
    fieldset: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      marginTop: 24,
      marginBottom: 8,
      textTransform: "uppercase",
    },
    disclaimer: {
      fontSize: 12,
      marginVertical: 12,
      color: "#555",
    },

    inputBlock: {
      marginBottom: 16,
    },
    label: {
      textTransform: "uppercase",
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      marginBottom: 6,
    },
    required: {
      color: theme.secondary,
    },
    pickerWrapper: {
      backgroundColor: theme.white,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 6,
      overflow: "hidden",
    },
  });
