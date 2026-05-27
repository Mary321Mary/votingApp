import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";
import { ThemeContext } from "@/styles/ThemeProvider";
import { RegisterFormState } from "@/utils/types";

interface DateRowProps {
  value: RegisterFormState;
  disabled?: boolean;
  useIssue?: boolean;
  updateField: <K extends keyof RegisterFormState>(
    key: K,
    fieldValue: RegisterFormState[K],
  ) => void;
}

export const DateRow = ({
  value,
  disabled = false,
  useIssue = false,
  updateField,
}: DateRowProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const [error, setError] = useState("");

  const MONTHS = [
    { value: "", name: t("general.months.month") },
    { value: "01", name: t("general.months.january") },
    { value: "02", name: t("general.months.february") },
    { value: "03", name: t("general.months.march") },
    { value: "04", name: t("general.months.april") },
    { value: "05", name: t("general.months.may") },
    { value: "06", name: t("general.months.june") },
    { value: "07", name: t("general.months.july") },
    { value: "08", name: t("general.months.august") },
    { value: "09", name: t("general.months.september") },
    { value: "10", name: t("general.months.october") },
    { value: "11", name: t("general.months.november") },
    { value: "12", name: t("general.months.december") },
  ];

  const handleDayChange = (text: string) => {
    if (/^\d*$/.test(text) && text.length <= 2) {
      if (useIssue) updateField("issueDay", text);
      else updateField("birthDay", text);
    }
  };

  return (
    <View style={styles.dateRow}>
      <View style={styles.inputBlock}>
        <View
          style={[
            styles.pickerWrapper,
            disabled && { backgroundColor: theme.borderColor },
          ]}
        >
          <Picker
            enabled={!disabled}
            selectedValue={useIssue ? value.issueMonth : value.birthMonth}
            onValueChange={(text: string) => {
              if (useIssue) updateField("issueMonth", text);
              else updateField("birthMonth", text);
            }}
          >
            {MONTHS.map(month => (
              <Picker.Item
                key={month.value}
                label={month.name}
                value={month.value}
              />
            ))}
          </Picker>
        </View>
      </View>
      <TextInput
        style={[
          styles.dateInput,
          disabled && { backgroundColor: theme.borderColor },
        ]}
        placeholder="DD"
        keyboardType="number-pad"
        maxLength={2}
        editable={!disabled}
        value={useIssue ? value.issueDay : value.birthDay}
        onChangeText={handleDayChange}
      />
      <TextInput
        style={[
          styles.dateInput,
          disabled && { backgroundColor: theme.borderColor },
        ]}
        placeholder="YYYY"
        keyboardType="number-pad"
        maxLength={4}
        editable={!disabled}
        value={useIssue ? value.issueYear : value.birthYear}
        onChangeText={(text: string) => {
          if (useIssue) updateField("issueYear", text);
          else updateField("birthYear", text);
          if (Number(text) < 1900) {
            setError(t("form_fields.invalid_year"));
          } else {
            setError("");
          }
        }}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    section: {
      marginTop: 5,
    },
    inputBlock: {
      width: "100%",
    },
    label: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "medium",
      textTransform: "uppercase",
    },
    required: {
      color: theme.secondary,
    },
    dateRow: {
      gap: 10,
      marginBottom: 10,
    },
    dateInput: {
      backgroundColor: theme.white,
      height: 48,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 6,
      padding: 10,
    },
    errorText: {
      color: theme.secondary,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 12,
      marginTop: 5,
    },
    pickerWrapper: {
      height: 48,
      backgroundColor: theme.white,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 6,
      overflow: "hidden",
      justifyContent: "center",
    },
  });
