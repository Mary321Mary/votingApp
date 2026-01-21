import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";
import { STATES } from "@/utils/constants";
import { FormProps, RegisterFormState } from "@/utils/types";
import { ThemeContext } from "@/styles/ThemeProvider";
import InputField from "../atoms/InputField";

export const PoBoxMailingAddress = ({ errorMessages, value, onChange }: FormProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

  const updateField = <K extends keyof RegisterFormState>(
    key: K,
    fieldValue: RegisterFormState[K]
  ) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return <>
    <InputField
      label={t('register_page.po_box_number')}
      required
      value={value.poNumber}
      errorMessage={errorMessages.poNumber}
      onChangeText={(text: string) => updateField("poNumber", text)}
    />

    <InputField
      label={t("register_page.city")}
      value={value.poCity}
      errorMessage={errorMessages.poCity}
      required
      onChangeText={(text: string) => updateField("poCity", text)}
    />

    <View style={styles.inputBlock}>
      <Text style={styles.label}>
        {t("register_page.state")}
        <Text style={styles.required}> *</Text>
      </Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={value.poState}
          onValueChange={(text: string) => updateField("poState", text)}
        >
          {STATES.map((state_value) => (
            <Picker.Item
              key={state_value.value}
              label={state_value.name}
              value={state_value.value}
            />
          ))}
        </Picker>
      </View>
    </View>

    <InputField
      label={t("zip")}
      value={value.poZip}
      errorMessage={errorMessages.poZip}
      numeric
      required
      onChangeText={(text: string) => updateField("poZip", text)}
    />
  </>
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
