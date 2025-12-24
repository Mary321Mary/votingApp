import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '@/styles/ThemeProvider';
import InputField from '../atoms/InputField';
import HelpTooltip from '../atoms/HelpTooltip';
import { FormProps } from '@/utils/types';
import { Checkbox } from '../atoms/Checkbox';

interface AddressSectionProps extends Pick<FormProps, 'value' | 'onChange'> {
  showDifferentMailAddress?: boolean;
  onDifferentMailToggle?: (show: boolean) => void;
}

export const AddressSection = ({ value, onChange, showDifferentMailAddress, onDifferentMailToggle }: AddressSectionProps) => {
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
      <Text style={styles.sectionTitle}>
        {t("register_page.section_home_address")}
        <HelpTooltip text={t('register_page.address_help')} />
      </Text>

      <View style={styles.row}>
        <InputField
          label={t("register_page.address")}
          required
          onChangeText={(text: string) => updateField("address", text)}
        />
        <InputField
          label={t("register_page.unit_lot")}
          onChangeText={(text: string) => updateField("unit", text)}
        />
      </View>

      <View style={styles.row}>
        <InputField
          label={t("register_page.city")}
          required
          onChangeText={(text: string) => updateField("city", text)}
        />
        <InputField
          label={t("register_page.state")}
          required
          onChangeText={(text: string) => updateField("state", text)}
        />
        <InputField
          label={t("zip")}
          required
          onChangeText={(text: string) => updateField("zip", text)}
        />
      </View>

      <Checkbox
        label={t("register_page.different_mail_address")}
        onValueChange={onDifferentMailToggle}
      />
      <Checkbox label={t("register_page.changed_address")} />
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
    row: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      width: "100%",
      marginBottom: 16,
      alignItems: "flex-end"
    },
  });