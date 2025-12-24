import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { ThemeContext } from '@/styles/ThemeProvider';
import InputField from '../atoms/InputField';
import { FormProps } from '@/utils/types';
import { Checkbox } from '../atoms/Checkbox';

interface ContactSectionProps extends Pick<FormProps, 'value' | 'onChange'> { }

export const ContactSection = ({ value, onChange }: ContactSectionProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

  const updateField = (key: string, fieldValue: any) => {
    onChange({
      ...value,
      [key]: fieldValue,
    });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("register_page.section_contact")}</Text>

      <View style={styles.row}>
        <InputField
          label={t("Date of Birth")}
          placeholder="MM / DD / YYYY"
          onChangeText={(text: string) => updateField("dateOfBirth", text)}
        />
        <InputField
          label={t("Phone")}
          placeholder="###-###-####"
          onChangeText={(text: string) => updateField("phone", text)}
        />
        <View>
          <Text style={styles.inputLabel}>{t('Type')}</Text>
          <View style={styles.pickerWrapper}>
            <Picker style={styles.picker} itemStyle={styles.pickerItem}>
              <Picker.Item label="Mobile" value="Mobile" />
              <Picker.Item label="Home" value="Home" />
              <Picker.Item label="Work" value="Work" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Checkbox label="Send me text messages from Rock the Vote" />

        <Text style={styles.hint}>
          By signing up, you consent to receive periodic text messages from Rock the Vote (788683).
          Message and data rates may apply. Text HELP for info or STOP to stop receiving messages.
          No purchase necessary. See terms and conditions and privacy policy.
        </Text>

        <Checkbox
          label="Receive action alerts and other email updates"
          defaultValue
        />
        <Checkbox label="I would like to volunteer with Rock the Vote" />
        <Checkbox label="Please mail me my form, I can't print it right now" />
      </View>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    section: {
      marginBottom: 24,
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
      alignItems: "flex-end"
    },
    pickerWrapper: {
      flexBasis: "18%",
      minWidth: 70,
      height: 48,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      justifyContent: "center",
      backgroundColor: "#fff",
    },
    picker: {
      height: 48,
      width: "100%",
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