import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";
import { ThemeContext } from "@/styles/ThemeProvider";
import { FormProps, RegisterFormState } from "@/utils/types";
import InputField from "../atoms/InputField";

export default function ConnectedOVRStep2({ state, value, onChange }: FormProps) {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

  const [eyeColor, setEyeColor] = useState("");
  const [birthMM, setBirthMM] = useState("");
  const [birthDD, setBirthDD] = useState("");
  const [birthYYYY, setBirthYYYY] = useState("");

  const updateField = <K extends keyof RegisterFormState>(
    key: K,
    fieldValue: RegisterFormState[K]
  ) => {
    onChange({
      ...value,
      [key]: fieldValue,
    });
  };

  return (
    <>
      {/* PERSONAL INFO */}
      <View style={styles.fieldset}>
        <Text style={styles.legend}>{t("register_page.personal_information")}</Text>
        <Text style={styles.text}>{t("register_page.personal_info_match", { state: state.name })}</Text>
        <Text style={styles.text}>{t("register_page.no_license_paper_form", { state: state.name })}</Text>
      </View>

      {/* NAME */}
      <View style={styles.fieldset}>
        <Text style={styles.legend}>{t("register_page.section_name")}</Text>
        <InputField
          label={t("register_page.full_name_label", { state: state.name })}
          required
          onChangeText={(text: string) => updateField("fullName", text)}
        />
        <InputField
          label={t("register_page.license_number_label", { state: state.name })}
          required
          onChangeText={(text: string) => updateField("licenseNumber", text)}
        />

        {/* BIRTHDATE */}
        <View style={styles.inputBlock}>
          <Text style={styles.label}>
            {t("Birthdate")}
            <Text style={styles.required}> *</Text>
          </Text>

          <View style={styles.dateRow}>
            <TextInput
              style={styles.dateInput}
              placeholder="MM"
              keyboardType="number-pad"
              maxLength={2}
              value={birthMM}
              onChangeText={setBirthMM}
            />
            <TextInput
              style={styles.dateInput}
              placeholder="DD"
              keyboardType="number-pad"
              maxLength={2}
              value={birthDD}
              onChangeText={setBirthDD}
            />
            <TextInput
              style={styles.dateInput}
              placeholder="YYYY"
              keyboardType="number-pad"
              maxLength={4}
              value={birthYYYY}
              onChangeText={setBirthYYYY}
            />
          </View>
        </View>

        {/* EYE COLOR */}
        <View style={styles.inputBlock}>
          <Text style={styles.label}>
            Eye color (as printed on your license or state ID)
            <Text style={styles.required}> *</Text>
          </Text>

          <View style={styles.pickerWrapper}>
            <Picker selectedValue={eyeColor} onValueChange={setEyeColor}>
              <Picker.Item label="" value="" />
              <Picker.Item label={t("register_page.eye_color.none")} value="UNK" />
              <Picker.Item label={t("register_page.eye_color.black")} value="BLK" />
              <Picker.Item label={t("register_page.eye_color.blue")} value="BLU" />
              <Picker.Item label={t("register_page.eye_color.brown")} value="BRO" />
              <Picker.Item label={t("register_page.eye_color.green")} value="GRN" />
              <Picker.Item label={t("register_page.eye_color.gray")} value="GRY" />
              <Picker.Item label={t("register_page.eye_color.hazel")} value="HIZ" />
              <Picker.Item label={t("register_page.eye_color.maroon")} value="MAR" />
              <Picker.Item label={t("register_page.eye_color.pink")} value="PNK" />
            </Picker>
          </View>
        </View>

        {/* SSN */}
        <InputField
          label={t("register_page.ssn_last4_label")}
          required
          onChangeText={(text: string) => updateField("ssnLast4", text)}
        />
      </View>
    </>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      padding: 16,
    },
    fieldset: {
      marginBottom: 24,
    },
    legend: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 16,
      fontWeight: "semibold",
      marginBottom: 8,
    },
    text: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      marginBottom: 8,
      color: theme.textPrimary,
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
    input: {
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 6,
      padding: 10,
      fontSize: 14,
    },
    dateRow: {
      flexDirection: "row",
      gap: 8,
    },
    dateInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 6,
      padding: 10,
      textAlign: "center",
    },
    pickerWrapper: {
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 6,
      overflow: "hidden",
    },
  });

