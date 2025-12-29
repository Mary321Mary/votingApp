import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { ThemeContext } from '@/styles/ThemeProvider';
import InputField from '../atoms/InputField';
import HelpTooltip from '../atoms/HelpTooltip';
import { FormProps } from '@/utils/types';
import { Checkbox } from '../atoms/Checkbox';

interface NameSectionProps extends Pick<FormProps, 'value' | 'onChange'> {
  showChangeName?: boolean;
  showAgeEligibility?: boolean;
  onChangeNameToggle?: (show: boolean) => void;
}

export const NameSection = ({ value, onChange, showChangeName, onChangeNameToggle, showAgeEligibility = false }: NameSectionProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const [showIsAdultBlock, setShowIsAdultBlock] = React.useState(false);

  const updateField = (key: string, fieldValue: any) => {
    onChange({
      ...value,
      [key]: fieldValue,
    });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {t("register_page.section_name")}
        <HelpTooltip text={t('register_page.name_help')} />
      </Text>

      <View style={styles.row}>
        <View>
          <Text style={styles.inputLabel}>{t('register_page.title')}*</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              style={styles.picker}
              itemStyle={styles.pickerItem}
              selectedValue={value.title}
              onValueChange={(itemValue) => updateField("title", itemValue)}
            >
              <Picker.Item label="" value="" />
              <Picker.Item label="Mr." value="Mr." />
              <Picker.Item label="Mrs." value="Mrs." />
              <Picker.Item label="Miss" value="Miss" />
              <Picker.Item label="Ms." value="Ms." />
            </Picker>
          </View>
        </View>

        <InputField
          label={t("register_page.first_name")}
          required
          value={value.firstName}
          onChangeText={(text: string) => updateField("firstName", text)}
        />
        {!showIsAdultBlock && <InputField
          label={t("register_page.middle_name")}
          value={value.middleName}
          onChangeText={(text: string) => updateField("middleName", text)}
        />}
        <InputField
          label={t("register_page.last_name")}
          required
          value={value.lastName}
          onChangeText={(text: string) => updateField("lastName", text)}
        />

        <View>
          <Text style={styles.inputLabel}>{t('register_page.suffix')}*</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              style={styles.picker}
              itemStyle={styles.pickerItem}
              selectedValue={value.suffix}
              onValueChange={(itemValue) => updateField("suffix", itemValue)}
            >
              <Picker.Item label="" value="" />
              <Picker.Item label="Jr." value="Jr." />
              <Picker.Item label="Sr." value="Sr." />
              <Picker.Item label="I" value="I" />
              <Picker.Item label="II" value="II" />
              <Picker.Item label="III" value="III" />
              <Picker.Item label="IV" value="IV" />
              <Picker.Item label="V" value="V" />
              <Picker.Item label="VI" value="VI" />
              <Picker.Item label="VII" value="VII" />
            </Picker>
          </View>
        </View>
      </View>

      {!showIsAdultBlock && <Checkbox
        label={t("register_page.changed_name")}
        helpText={t('register_page.changed_name_help')}
        onValueChange={onChangeNameToggle}
      />}

      {showChangeName && (
        <>
          <Text>Previous Name</Text>
          <View style={styles.row}>
            <View>
              <Text style={styles.inputLabel}>
                {t('register_page.title')}*
              </Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  selectedValue={value.changedTitle}
                  onValueChange={(itemValue) => updateField("changedTitle", itemValue)}
                >
                  <Picker.Item label="" value="" />
                  <Picker.Item label="Mr." value="Mr." />
                  <Picker.Item label="Mrs." value="Mrs." />
                  <Picker.Item label="Miss" value="Miss" />
                  <Picker.Item label="Ms." value="Ms." />
                </Picker>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <InputField
                label={t("register_page.first_name")}
                required
                value={value.changedFirstName}
                onChangeText={(text: string) => updateField("changedFirstName", text)}
              />
            </View>
            {!showIsAdultBlock &&
              <View style={{ flex: 1 }}>
                <InputField
                  label={t("register_page.middle_name")}
                  value={value.changedMiddleName}
                  onChangeText={(text: string) => updateField("changedMiddleName", text)}
                />
              </View>
            }
            <View style={{ flex: 1 }}>
              <InputField
                label={t("register_page.last_name")}
                required
                value={value.changedLastName}
                onChangeText={(text: string) => updateField("changedLastName", text)}
              />
            </View>
            <View >
              <Text style={styles.inputLabel}>
                {t('register_page.suffix')}
              </Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  selectedValue={value.changedSuffix}
                  onValueChange={(itemValue) => updateField("changedSuffix", itemValue)}
                >
                  <Picker.Item label="" value="" />
                  <Picker.Item label="Jr." value="Jr." />
                  <Picker.Item label="Sr." value="Sr." />
                  <Picker.Item label="I" value="I" />
                  <Picker.Item label="II" value="II" />
                  <Picker.Item label="III" value="III" />
                  <Picker.Item label="IV" value="IV" />
                  <Picker.Item label="V" value="V" />
                  <Picker.Item label="VI" value="VI" />
                  <Picker.Item label="VII" value="VII" />
                </Picker>
              </View>
            </View>
          </View>
        </>
      )}
      <Checkbox
        label={t("register_page.eligibility.citizen")}
        required
        value={value.isCitizen}
        onValueChange={() => updateField("isCitizen", value.isCitizen)}
      />
      {showAgeEligibility && <Checkbox
        label={t("register_page.age_eligibility")}
        required
        value
        onValueChange={() => setShowIsAdultBlock(!showIsAdultBlock)}
      />}
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    section: {
      marginBottom: 10,
      paddingHorizontal: 5
    },
    sectionTitle: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 18,
      fontWeight: "semibold",
    },
    inputLabel: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      color: theme.textPrimary,
    },
    row: {
      flexWrap: "wrap",
      gap: 8,
      width: "100%",
      marginBottom: 16,
      alignItems: "flex-end"
    },
    pickerWrapper: {
      flexBasis: "18%",
      minWidth: "100%",
      height: 48,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      justifyContent: "center",
      backgroundColor: "#fff",
    },
    picker: {
      width: "100%",
    },
    pickerItem: {
      fontSize: 14,
    },
  });