import React, { useContext } from "react";
import { Picker } from "@react-native-picker/picker";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "@/styles/ThemeProvider";
import { FormProps, RegisterFormState } from "@/utils/types";
import InputField from "../atoms/InputField";

export const MilitaryMailingAddress = ({ errorMessages, value, onChange }: FormProps) => {
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
    <View style={styles.inputBlock}>
      <Text style={styles.label}>
        {t('register_page.box_group_type')}
        <Text style={styles.required}> *</Text>
      </Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={value.militaryType}
          onValueChange={(text: string) => updateField("militaryType", text)}
        >
          <Picker.Item label="" value="" />
          <Picker.Item label={t('register_page.unit')} value="UNIT" />
          <Picker.Item label={t('register_page.cmr')} value="CMR" />
          <Picker.Item label={t('register_page.psc')} value="PSC" />
        </Picker>
      </View>
    </View>

    <InputField
      label={t('register_page.box_group_number')}
      required
      value={value.militaryGroupNumber}
      errorMessage={errorMessages.militaryGroupNumber}
      onChangeText={(text: string) => updateField("militaryGroupNumber", text)}
    />

    <InputField
      label={t('register_page.box_number')}
      value={value.militaryNumber}
      errorMessage={errorMessages.militaryNumber}
      required
      onChangeText={(text: string) => updateField("militaryNumber", text)}
    />

    <View style={styles.inputBlock}>
      <Text style={styles.label}>
        APO/FPO/DPO
        <Text style={styles.required}> *</Text>
      </Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={value.militaryPostOffice}
          onValueChange={(text: string) => updateField("militaryPostOffice", text)}
        >
          <Picker.Item label="" value="" />
          <Picker.Item label="APO" value="APO" />
          <Picker.Item label="FPO" value="FPO" />
          <Picker.Item label="DPO" value="DPO" />
        </Picker>
      </View>
    </View>

    <View style={styles.inputBlock}>
      <Text style={styles.label}>
        AA/AE/AP
        <Text style={styles.required}> *</Text>
      </Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={value.militaryPostState}
          onValueChange={(text: string) => updateField("militaryPostState", text)}
        >
          <Picker.Item label="" value="" />
          <Picker.Item label="AA" value="AA" />
          <Picker.Item label="AE" value="AE" />
          <Picker.Item label="AP" value="AP" />
        </Picker>
      </View>
    </View>

    <InputField
      label={t("zip")}
      value={value.militaryZip}
      errorMessage={errorMessages.militaryZip}
      numeric
      required
      onChangeText={(text: string) => updateField("militaryZip", text)}
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
