import React, { useContext } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";
import { ThemeContext } from "@/styles/ThemeProvider";
import { RegisterFormState } from "@/utils/types";
import HelpTooltip from "../HelpTooltip";


export interface DateField {
  name: keyof RegisterFormState;
  value: string;
  errorText?: string;
}

export interface DateOfBirthFields {
  day: DateField;
  month: DateField;
  year: DateField;
}

export interface DateOfBirthProps {
  value: DateOfBirthFields;
  legend?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  updateField: <K extends keyof RegisterFormState>(
    key: K,
    fieldValue: RegisterFormState[K],
  ) => void;
}

export const DateRow: React.FC<DateOfBirthProps> = ({
  name = "date_of_birth",
  value,
  legend,
  disabled = false,
  required = false,
  updateField,
}) => {
  const { day, month, year } = value;
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  

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
      updateField(day.name, text as any);
    }
  };

  const handleYearChange = (text: string) => {
    const formatted = text.replace(/\D/g, "").slice(0, 4);
    updateField(year.name, formatted as any);
  };

  return (
    <View style={styles.fieldset}>
      <View style={styles.legendContainer}>
        <Text style={styles.legendText}>
          {legend || t("form_fields.dob")}
          {required && <Text style={styles.requiredStar}> *</Text>}
        </Text>
        <HelpTooltip text={t("form_fields.dob_help")} />
      </View>

      {year.errorText && <Text style={styles.errorText}>{year.errorText}</Text>}
      {day.errorText && <Text style={styles.errorText}>{day.errorText}</Text>}
      {month.errorText && (
        <Text style={styles.errorText}>{month.errorText}</Text>
      )}

      <View style={styles.dateRow}>
        <View style={styles.monthCol}>
          <View
            style={[
              styles.pickerWrapper,
              disabled && { backgroundColor: theme.borderColor },
            ]}
          >
            <Picker
              enabled={!disabled}
              selectedValue={month.value}
              onValueChange={(text: string) =>
                updateField(month.name, text as any)
              }
              dropdownIconColor={theme.textPrimary}
              style={styles.picker}
            >
              {MONTHS.map(monthItem => (
                <Picker.Item
                  key={monthItem.value}
                  label={monthItem.name}
                  value={monthItem.value}
                  style={{ fontSize: 14 }}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.dayCol}>
          <TextInput
            style={[
              styles.dateInput,
              disabled && { backgroundColor: theme.borderColor },
            ]}
            placeholder="DD"
            placeholderTextColor={theme.gray}
            keyboardType="number-pad"
            maxLength={2}
            editable={!disabled}
            value={day.value}
            onChangeText={handleDayChange}
          />
        </View>

        {/* Год (flex: 4) */}
        <View style={styles.yearCol}>
          <TextInput
            style={[
              styles.dateInput,
              disabled && { backgroundColor: theme.borderColor },
            ]}
            placeholder="YYYY"
            placeholderTextColor={theme.gray}
            keyboardType="number-pad"
            maxLength={4}
            editable={!disabled}
            value={year.value}
            onChangeText={handleYearChange}
          />
        </View>
      </View>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    fieldset: {
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 15,
      marginTop: 20,
      marginBottom: 20,
      position: "relative",
    },
    legendContainer: {
      position: "absolute",
      top: -10,
      left: 12,
      backgroundColor: theme.white,
      borderRadius: 5,
      padding: 3,
      flexDirection: "row",
      alignItems: "center",
    },
    legendText: {
      fontSize: 14,
      fontWeight: "bold",
      textTransform: "uppercase",
      color: theme.textPrimary,
    },
    requiredStar: {
      color: theme.danger || "red",
      fontWeight: "bold",
    },
    dateRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 4,
    },
    monthCol: {
      flex: 5,
    },
    dayCol: {
      flex: 3,
    },
    yearCol: {
      flex: 4,
    },
    pickerWrapper: {
      height: 45,
      backgroundColor: theme.white,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 5,
      overflow: "hidden",
      justifyContent: "center",
    },
    picker: {
      height: 48,
      width: "100%",
    },
    dateInput: {
      backgroundColor: theme.white,
      height: 48,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 6,
      paddingHorizontal: 10,
      fontSize: 14,
      color: theme.textPrimary,
      textAlign: "center",
    },
    errorText: {
      color: theme.danger || "red",
      fontSize: 11,
      marginBottom: 4,
    },
  });
