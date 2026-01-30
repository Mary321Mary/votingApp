import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";
import { ThemeContext } from "@/styles/ThemeProvider";
import { FormProps, RegisterFormState } from "@/utils/types";
import InputField from "../atoms/InputField";
import { RegisterStepHeader } from "../modules/RegisterStepHeader";
import { DateRow } from "../atoms/DateRow";

export default function ConnectedOVRStep2({
  state,
  value,
  onChange,
}: FormProps) {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

  const updateField = <K extends keyof RegisterFormState>(
    key: K,
    fieldValue: RegisterFormState[K],
  ) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return (
    <>
      {/* PERSONAL INFO */}
      <View style={styles.fieldset}>
        <RegisterStepHeader
          titleKey="register_page.personal_information"
          completedSteps={2}
          currentStep={3}
        />
        <Text style={styles.text}>
          {t("register_page.personal_info_match", { state: state.name })}
        </Text>
        <Text style={styles.text}>
          {t("register_page.no_license_paper_form", { state: state.name })}
        </Text>
      </View>

      {/* NAME */}
      <View style={styles.fieldset}>
        <Text style={styles.legend}>{t("register_page.section_name")}</Text>
        <InputField
          value={value.fullName}
          label={t("register_page.full_name_label", { state: state.name })}
          required
          onChangeText={(text: string) => updateField("fullName", text)}
        />
        <InputField
          value={value.licenseNumber}
          label={t("register_page.license_number_label", { state: state.name })}
          required
          onChangeText={(text: string) => updateField("licenseNumber", text)}
        />

        <DateRow value={value} updateField={updateField} />

        {/* EYE COLOR */}
        <View style={styles.inputBlock}>
          <Text style={styles.label}>
            {t("register_page.eye_color.label")}
            <Text style={styles.required}>*</Text>
          </Text>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={value.eyeColor}
              onValueChange={(text: string) => updateField("eyeColor", text)}
            >
              <Picker.Item label="" value="" />
              <Picker.Item
                label={t("register_page.eye_color.none")}
                value="UNK"
              />
              <Picker.Item
                label={t("register_page.eye_color.black")}
                value="BLK"
              />
              <Picker.Item
                label={t("register_page.eye_color.blue")}
                value="BLU"
              />
              <Picker.Item
                label={t("register_page.eye_color.brown")}
                value="BRO"
              />
              <Picker.Item
                label={t("register_page.eye_color.green")}
                value="GRN"
              />
              <Picker.Item
                label={t("register_page.eye_color.gray")}
                value="GRY"
              />
              <Picker.Item
                label={t("register_page.eye_color.hazel")}
                value="HIZ"
              />
              <Picker.Item
                label={t("register_page.eye_color.maroon")}
                value="MAR"
              />
              <Picker.Item
                label={t("register_page.eye_color.pink")}
                value="PNK"
              />
            </Picker>
          </View>
        </View>

        {/* SSN */}
        <InputField
          value={value.ssnLast4}
          label={t("register_page.ssn_last4_label")}
          required
          numeric
          maxLength={4}
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
    pickerWrapper: {
      backgroundColor: theme.white,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 6,
      overflow: "hidden",
    },
  });
