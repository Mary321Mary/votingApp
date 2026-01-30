import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";

import { FormProps, RegisterFormState } from "@/utils/types";
import { ThemeContext } from "@/styles/ThemeProvider";
import InputField from "../atoms/InputField";
import { Checkbox } from "../atoms/Checkbox";
import { DateRow } from "../atoms/DateRow";

interface ContactSectionProps extends Pick<FormProps, "value" | "onChange"> {}

export const ContactSection = ({ value, onChange }: ContactSectionProps) => {
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
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {t("register_page.section_contact")}
      </Text>

      <DateRow value={value} updateField={updateField} />
      <View style={styles.row}>
        <InputField
          label={t("register_page.phone")}
          helpText={t("register_page.phone_help")}
          placeholder="###-###-####"
          value={value.phone}
          onChangeText={(text: string) => updateField("phone", text)}
        />
        <View>
          <Text style={styles.inputLabel}>{t("register_page.phone_type")}</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              style={styles.picker}
              itemStyle={styles.pickerItem}
              selectedValue={value.phoneType}
              onValueChange={itemValue => updateField("phoneType", itemValue)}
            >
              <Picker.Item
                label={t("register_page.phone_types.mobile")}
                value="Mobile"
              />
              <Picker.Item
                label={t("register_page.phone_types.home")}
                value="Home"
              />
              <Picker.Item
                label={t("register_page.phone_types.work")}
                value="Work"
              />
              <Picker.Item
                label={t("register_page.phone_types.other")}
                value="Other"
              />
            </Picker>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Checkbox
          label={t("register_page.sms_opt_in")}
          value={value.smsConsent}
          onValueChange={(checked: boolean) =>
            updateField("smsConsent", checked)
          }
        />
        <Text style={styles.hint}>{t("register_page.sms_disclaimer")}</Text>
        <Checkbox
          label={t("register_page.email_opt_in")}
          value={value.emailConsent}
          onValueChange={(checked: boolean) =>
            updateField("emailConsent", checked)
          }
        />
        <Checkbox
          label={t("register_page.volunteer")}
          value={value.volunteer}
          onValueChange={(checked: boolean) =>
            updateField("volunteer", checked)
          }
        />
        <Checkbox
          label={t("register_page.mail_form")}
          value={value.mailForm}
          onValueChange={(checked: boolean) => updateField("mailForm", checked)}
        />
      </View>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    section: {
      paddingHorizontal: 5,
      marginBottom: 10,
    },
    sectionTitle: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 18,
      fontWeight: "semibold",
      marginBottom: 12,
    },
    inputLabel: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      color: theme.textPrimary,
    },
    row: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      width: "100%",
      marginBottom: 16,
      alignItems: "flex-end",
    },
    pickerWrapper: {
      flexBasis: "18%",
      minWidth: 120,
      height: 48,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 8,
      justifyContent: "center",
      backgroundColor: theme.white,
    },
    picker: {
      width: "100%",
      color: theme.textPrimary,
    },
    pickerItem: {
      fontSize: 14,
    },
    hint: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 13,
      color: theme.gray,
      marginTop: 8,
      lineHeight: 18,
    },
  });
