import React, { useContext } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";
import { ThemeContext } from "@/styles/ThemeProvider";
import { RegisterFormState } from "@/utils/types";

interface DateField {
  name: keyof RegisterFormState;
  value: string;
  errorText?: string;
}
interface DateOfBirthFields {
  day: DateField;
  month: DateField;
  year: DateField;
}
interface DateOfBirthProps {
  value: DateOfBirthFields;
  disabled?: boolean;
  updateField: <K extends keyof RegisterFormState>(
    key: K,
    fieldValue: RegisterFormState[K],
  ) => void;
}

export const DateRow: React.FC<DateOfBirthProps> = ({
  value,
  disabled = false,
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
      updateField(day.name, text);
    }
  };

  return (
    <>
      {year.errorText && <Text style={styles.errorText}>{year.errorText}</Text>}
      {day.errorText && <Text style={styles.errorText}>{day.errorText}</Text>}
      {month.errorText && (
        <Text style={styles.errorText}>{month.errorText}</Text>
      )}
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
              selectedValue={month.value}
              onValueChange={(text: string) => updateField(month.name, text)}
            >
              {MONTHS.map(monthItem => (
                <Picker.Item
                  key={monthItem.value}
                  label={monthItem.name}
                  value={monthItem.value}
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
          value={day.value}
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
          value={year.value}
          onChangeText={(text: string) => updateField(year.name, text)}
        />
      </View>
    </>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    inputBlock: {
      width: "100%",
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
