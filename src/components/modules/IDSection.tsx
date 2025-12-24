import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { ThemeContext } from '@/styles/ThemeProvider';
import InputField from '../atoms/InputField';
import { FormProps, StateData } from '@/utils/types';

interface IDSectionProps extends Pick<FormProps, 'value' | 'onChange'> {
  state: StateData;
}

export const IDSection = ({ value, onChange, state }: IDSectionProps) => {
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
      <InputField
        label="ID Number"
        required
        onChangeText={(text: string) => updateField("idNumber", text)}
      />

      <Text style={styles.hint}>
        You must provide your valid {state.name} driver license number or a {state.name} nondriver identification number.
        If you do not have a valid {state.name} driver license or a {state.name} nondriver identification number,
        provide the last four digits of your social security number. If you do not have any of these, you may only
        register at the county auditor's office.
      </Text>

      <View>
        <Text style={styles.inputLabel}>{t('Race')}</Text>
        <View style={styles.pickerWrapper}>
          <Picker style={styles.picker} itemStyle={styles.pickerItem}>
            <Picker.Item label="" value="" />
            <Picker.Item label="Asian" value="Asian" />
            <Picker.Item label="Black or African American" value="Black or African American" />
            <Picker.Item label="Hispanic or Latino" value="Hispanic or Latino" />
            <Picker.Item label="Native American or Alaskan Native" value="Native American or Alaskan Native" />
            <Picker.Item label="Native Hawaiian or Other Pacific Islander" value="Native Hawaiian or Other Pacific Islander" />
            <Picker.Item label="Other" value="Other" />
            <Picker.Item label="Two or More Races" value="Two or More Races" />
            <Picker.Item label="White" value="White" />
            <Picker.Item label="Decline to State" value="Decline to State" />
          </Picker>
        </View>
      </View>

      <View>
        <Text style={styles.inputLabel}>{t('Party')}</Text>
        <View style={styles.pickerWrapper}>
          <Picker style={styles.picker} itemStyle={styles.pickerItem}>
            <Picker.Item label="" value="" />
            <Picker.Item label="Democratic" value="Democratic" />
            <Picker.Item label="Independent" value="Independent" />
            <Picker.Item label="Republican" value="Republican" />
            <Picker.Item label="Libertarian" value="Libertarian" />
            <Picker.Item label="None (No Affiliation)" value="None (No Affiliation)" />
          </Picker>
        </View>
      </View>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    section: {
      marginBottom: 24,
    },
    inputLabel: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      color: theme.textPrimary,
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