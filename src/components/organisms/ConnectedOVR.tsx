import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FormProps, RegisterFormState } from '@/utils/types';
import { ThemeContext } from '@/styles/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { Radio } from '../atoms/Radio';
import { Checkbox } from '../atoms/Checkbox';

export const ConnectedOVR = ({ state, value, onChange }: FormProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

  const updateField = <K extends keyof RegisterFormState>(
    key: K,
    fieldValue: RegisterFormState[K]
  ) => {
    onChange({ ...value, [key]: fieldValue, });
  };

  return (
    <View style={styles.block}>
      <Checkbox
        value={value.isCitizen}
        label={t("register_page.eligibility.citizen")}
        required
        onValueChange={() => updateField("isCitizen", value.isCitizen)}
      />
      <Checkbox
        value={value.isAdult}
        label={t("register_page.eligibility.age")}
        required
        onValueChange={() => updateField("isAdult", value.isAdult)}
      />
      <Checkbox
        value={value.residency}
        label={t("register_page.eligibility.residency", {
          state: state.name,
        })}
        onValueChange={() => updateField("residency", value.isAdult)}
      />
      <Checkbox
        value={value.cancelPrevious}
        label={t("register_page.eligibility.cancelPrevious")}
        required
        onValueChange={() => updateField("cancelPrevious", value.cancelPrevious)}
      />
      <Checkbox
        value={value.digitalSignature}
        label={t("register_page.eligibility.digitalSignature")}
        required
        onValueChange={() => updateField("digitalSignature", value.digitalSignature)}
      />

      {/* LICENSE UPDATE */}
      <Text style={styles.gray}>
        {t("register_page.questions.licenseUpdate")}
        <Text style={styles.required}> *</Text>
      </Text>

      <Radio
        label={t("register_page.no")}
        selected={value.licenseUpdated === "no"}
        onPress={() => updateField("licenseUpdated", "no")}
      />
      <Radio
        label={t("register_page.yes")}
        selected={value.licenseUpdated === "yes"}
        onPress={() => updateField("licenseUpdated", "yes")}
      />

      {/* DUPLICATE LICENSE */}
      <Text style={styles.gray}>
        {t("register_page.questions.duplicateLicense")}
        <Text style={styles.required}> *</Text>
      </Text>

      <Radio
        label={t("register_page.no")}
        selected={value.duplicateLicense === "no"}
        onPress={() => updateField("duplicateLicense", "no")}
      />
      <Radio
        label={t("register_page.yes")}
        selected={value.duplicateLicense === "yes"}
        onPress={() => updateField("duplicateLicense", "yes")}
      />
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    block: {
      maxWidth: "90%",
      minWidth: "80%"
    },
    text: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "regular"
    },
    gray: {
      color: theme.gray,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "regular",
      marginTop: 12,
      marginBottom: 4,
    },
    bold: {
      fontWeight: "bold"
    },
    link: {
      color: theme.link,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "regular"
    },
    checkbox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    checkboxText: {
      fontSize: 14,
      flex: 1,
    },
    required: {
      color: "red",
    }
  })
