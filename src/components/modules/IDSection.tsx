import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { ThemeContext } from '@/styles/ThemeProvider';
import { FormProps, StateData } from '@/utils/types';

import InputField from '../atoms/InputField';
import HelpTooltip from '../atoms/HelpTooltip';

interface IDSectionProps extends Pick<FormProps, 'value' | 'onChange'> {
  state: StateData;
  showParty?: boolean;
}

export const IDSection = ({ value, onChange, state, showParty = false }: IDSectionProps) => {
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
        label={t('register_page.id_number')}
        required
        value={value.idNumber}
        onChangeText={(text: string) => updateField("idNumber", text)}
      />

      <Text style={styles.hint}>{t("register_page.driver_license", { name: state.name })}</Text>
      <Text style={styles.inputLabel}>
        {t('register_page.race.title')}
        <HelpTooltip text={t("register_page.race_help", { name: state.name })} />
      </Text>
      <View style={styles.pickerWrapper}>
        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={value.race}
          onValueChange={(itemValue) => updateField("race", itemValue)}
        >
          <Picker.Item label="" value="" />
          <Picker.Item label={t('register_page.race.asian')} value="Asian" />
          <Picker.Item label={t('register_page.race.black')} value="Black or African American" />
          <Picker.Item label={t('register_page.race.hispanic')} value="Hispanic or Latino" />
          <Picker.Item label={t('register_page.race.native_american')} value="Native American or Alaskan Native" />
          <Picker.Item label={t('register_page.race.pacific')} value="Native Hawaiian or Other Pacific Islander" />
          <Picker.Item label={t('register_page.race.other')} value="Other" />
          <Picker.Item label={t('register_page.race.multiple')} value="Two or More Races" />
          <Picker.Item label={t('register_page.race.white')} value="White" />
          <Picker.Item label={t('register_page.race.decline')} value="Decline to State" />
        </Picker>
      </View>

      {showParty && <>
        <Text style={styles.inputLabel}>
          {t('register_page.party.title')}
          <HelpTooltip text={"You do not have to register with a political party to register to vote."} />
        </Text>
        <View style={styles.pickerWrapper}>
          <Picker
            style={styles.picker}
            itemStyle={styles.pickerItem}
            selectedValue={value.party}
            onValueChange={(itemValue) => updateField("party", itemValue)}
          >
            <Picker.Item label="" value="" />
            <Picker.Item label={t('register_page.party.democratic')} value="Democratic" />
            <Picker.Item label={t('register_page.party.independent')} value="Independent" />
            <Picker.Item label={t('register_page.party.republican')} value="Republican" />
            <Picker.Item label={t('register_page.party.libertarian')} value="Libertarian" />
            <Picker.Item label={t('register_page.party.none')} value="None (No Affiliation)" />
          </Picker>
        </View>
      </>}
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    section: {
      paddingHorizontal: 5,
      marginBottom: 10,
    },
    inputLabel: {
      marginVertical: 5,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      color: theme.textPrimary,
    },
    pickerWrapper: {
      flexBasis: "18%",
      minWidth: 70,
      height: 48,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 8,
      justifyContent: "center",
      backgroundColor: theme.white,
    },
    picker: {
      // height: 48,
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
      marginBottom: 8,
      lineHeight: 18,
    },
  });