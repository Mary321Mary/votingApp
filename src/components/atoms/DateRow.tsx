import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";
import { ThemeContext } from "@/styles/ThemeProvider";
import { RegisterFormState } from "@/utils/types";

interface DateRowProps {
  value: any;
  required?: boolean;
  updateField: <K extends keyof RegisterFormState>(
    key: K,
    fieldValue: RegisterFormState[K],
  ) => void;
}

export const DateRow = ({
  value,
  required = false,
  updateField,
}: DateRowProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const [error, setError] = useState("");

  return (
    <View style={styles.inputBlock}>
      <Text style={styles.label}>
        {t("register_page.dob")}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <View style={styles.dateRow}>
        <View style={styles.inputBlock}>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={value.birthMonth}
              onValueChange={(text: string) => updateField("birthMonth", text)}
            >
              <Picker.Item label="- Select Month -" value="" />
              <Picker.Item label={t("01 - January")} value="1" />
              <Picker.Item label={t("02 - February")} value="2" />
              <Picker.Item label={t("03 - March")} value="3" />
              <Picker.Item label={t("04 - April")} value="4" />
              <Picker.Item label={t("05 - May")} value="5" />
              <Picker.Item label={t("06 - June")} value="6" />
              <Picker.Item label={t("07 - July")} value="7" />
              <Picker.Item label={t("08 - August")} value="8" />
              <Picker.Item label={t("09 - September")} value="9" />
              <Picker.Item label={t("10 - October")} value="10" />
              <Picker.Item label={t("11 - November")} value="11" />
              <Picker.Item label={t("12 - December")} value="12" />
            </Picker>
          </View>
        </View>
        <View style={styles.inputBlock}>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={value.birthDay}
              onValueChange={(text: string) => updateField("birthDay", text)}
            >
              <Picker.Item label="- Select Day -" value="" />
              <Picker.Item label={t("01")} value="01" />
              <Picker.Item label={t("02")} value="02" />
              <Picker.Item label={t("03")} value="03" />
              <Picker.Item label={t("04")} value="04" />
              <Picker.Item label={t("05")} value="05" />
              <Picker.Item label={t("06")} value="06" />
              <Picker.Item label={t("07")} value="07" />
              <Picker.Item label={t("08")} value="08" />
              <Picker.Item label={t("09")} value="09" />
              <Picker.Item label={t("10")} value="10" />
              <Picker.Item label={t("11")} value="11" />
              <Picker.Item label={t("12")} value="12" />
              <Picker.Item label={t("13")} value="13" />
              <Picker.Item label={t("14")} value="14" />
              <Picker.Item label={t("15")} value="15" />
              <Picker.Item label={t("16")} value="16" />
              <Picker.Item label={t("17")} value="17" />
              <Picker.Item label={t("18")} value="18" />
              <Picker.Item label={t("19")} value="19" />
              <Picker.Item label={t("20")} value="20" />
              <Picker.Item label={t("21")} value="21" />
              <Picker.Item label={t("22")} value="22" />
              <Picker.Item label={t("23")} value="23" />
              <Picker.Item label={t("24")} value="24" />
              <Picker.Item label={t("25")} value="25" />
              <Picker.Item label={t("26")} value="26" />
              <Picker.Item label={t("27")} value="27" />
              <Picker.Item label={t("28")} value="28" />
              <Picker.Item label={t("29")} value="29" />
              <Picker.Item label={t("30")} value="30" />
              <Picker.Item label={t("31")} value="31" />
            </Picker>
          </View>
        </View>
        <TextInput
          style={styles.dateInput}
          placeholder="YYYY"
          keyboardType="number-pad"
          maxLength={4}
          value={value.birthYear}
          onChangeText={(text: string) => {
            updateField("birthYear", text);
            if (Number(value.birthYear) < 1900) {
              setError(t("register_page.invalid_year"));
            } else {
              setError("");
            }
          }}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
      gap: 10,
    },
    dateInput: {
      backgroundColor: theme.white,
      height: 55,
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
      backgroundColor: theme.white,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 6,
      overflow: "hidden",
    },
  });
