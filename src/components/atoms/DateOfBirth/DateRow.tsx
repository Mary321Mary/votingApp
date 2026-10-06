import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "@/styles/ThemeProvider";
import { RegisterFormState } from "@/utils/types";
import HelpTooltip from "../HelpTooltip";
import { useFormScroll } from "@/contexts/FormScrollContext";

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
  showTooltip?: boolean;
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
  showTooltip = true,
  required = false,
  updateField,
}) => {
  const { day, month, year } = value;
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const { registerField } = useFormScroll();

  const [isMonthModalVisible, setMonthModalVisible] = useState(false);

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

  const selectedMonth = MONTHS.find(m => m.value === String(month.value));

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
        {showTooltip && <HelpTooltip text={t("form_fields.dob_help")} />}
      </View>

      <View style={styles.dateRow}>
        <View style={styles.monthCol}>
          <TouchableOpacity
            disabled={disabled}
            style={[
              styles.selectInput,
              disabled && { backgroundColor: theme.borderColor },
            ]}
            onPress={() => setMonthModalVisible(true)}
          >
            <Text
              style={[
                styles.selectInputText,
                !selectedMonth && { color: theme.gray },
              ]}
              numberOfLines={1}
            >
              {selectedMonth ? selectedMonth.name : t("general.months.month")}
            </Text>
          </TouchableOpacity>
          {month.errorText && (
            <Text style={styles.errorText}>{month.errorText}</Text>
          )}
        </View>

        <View style={styles.dayCol}>
          <TextInput
            ref={registerField(day.name)}
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
          {day.errorText && (
            <Text style={styles.errorText}>{day.errorText}</Text>
          )}
        </View>

        <View style={styles.yearCol}>
          <TextInput
            ref={registerField(year.name)}
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
          {year.errorText && (
            <Text style={styles.errorText}>{year.errorText}</Text>
          )}
        </View>
      </View>

      <Modal visible={isMonthModalVisible} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMonthModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t("general.months.month")}</Text>
            <FlatList
              data={MONTHS}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.monthOption,
                    item.value === month.value && styles.monthOptionSelected,
                  ]}
                  onPress={() => {
                    updateField(month.name, item.value as any);
                    setMonthModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.monthOptionText,
                      item.value === month.value &&
                        styles.monthOptionTextSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
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

    selectInput: {
      backgroundColor: theme.white,
      height: 48,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 6,
      paddingHorizontal: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    selectInputText: {
      fontSize: 14,
      color: theme.textPrimary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    modalContent: {
      backgroundColor: theme.white,
      borderRadius: 12,
      width: "100%",
      maxHeight: "60%",
      paddingVertical: 16,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 12,
      color: theme.textPrimary,
    },
    monthOption: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.borderColor,
    },
    monthOptionSelected: {
      backgroundColor: theme.borderColor + "40",
    },
    monthOptionText: {
      fontSize: 15,
      color: theme.textPrimary,
      textAlign: "center",
    },
    monthOptionTextSelected: {
      fontWeight: "bold",
      color: theme.primary,
    },
  });
