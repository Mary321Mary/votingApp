import React, { useContext } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "@/styles/ThemeProvider";
import { RegisterFormState } from "@/utils/types";

interface DateRowProps {
  value: any;
  updateField: <K extends keyof RegisterFormState>(
    key: K,
    fieldValue: RegisterFormState[K],
  ) => void;
}

export const DateRow = ({ value, updateField }: DateRowProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

  return (
    <View style={styles.inputBlock}>
      <Text style={styles.label}>
        {t("register_page.dob")}
        <Text style={styles.required}> *</Text>
      </Text>

      <View style={styles.dateRow}>
        <TextInput
          style={styles.dateInput}
          placeholder="MM"
          keyboardType="number-pad"
          maxLength={2}
          value={value.birthMonth}
          onChangeText={(text: string) => updateField("birthMonth", text)}
        />
        <TextInput
          style={styles.dateInput}
          placeholder="DD"
          keyboardType="number-pad"
          maxLength={2}
          value={value.birthDay}
          onChangeText={(text: string) => updateField("birthDay", text)}
        />
        <TextInput
          style={styles.dateInput}
          placeholder="YYYY"
          keyboardType="number-pad"
          maxLength={4}
          value={value.birthYear}
          onChangeText={(text: string) => updateField("birthYear", text)}
        />
      </View>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    inputBlock: {
      gap: 4,
      width: "100%",
    },
    label: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "medium",
    },
    required: {
      color: theme.secondary,
    },
    dateRow: {
      flexDirection: "row",
      gap: 8,
    },
    dateInput: {
      backgroundColor: theme.white,
      flex: 1,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 6,
      padding: 10,
      textAlign: "center",
    },
  });
