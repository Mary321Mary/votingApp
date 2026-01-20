import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { ThemeContext } from '@/styles/ThemeProvider';
import { FormProps, StateData } from '@/utils/types';

import InputField from '../atoms/InputField';
import HelpTooltip from '../atoms/HelpTooltip';
import { Checkbox } from '../atoms/Checkbox';
import { Radio } from '../atoms/Radio';
import { STATES } from '@/utils/constants';

interface AddressSectionProps extends Pick<FormProps, 'value' | 'onChange'> {
  state: StateData;
  showRadioButtons?: boolean;
}

export const AddressSection = ({
  value,
  onChange,
  state,
  showRadioButtons = false
}: AddressSectionProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const [showChangedAddress, setShowChangedAddress] = useState(false);
  const [showDifferentMailAddress, setShowDifferentMailAddress] = React.useState(false);

  const updateField = (key: string, fieldValue: any) => {
    onChange({ ...value, [key]: fieldValue });
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
          value={value.address}
          onChangeText={(text: string) => updateField("address", text)}
        />
        <InputField
          label={t("register_page.unit_lot")}
          value={value.unit}
          onChangeText={(text: string) => updateField("unit", text)}
        />
      </View>

      <View style={styles.row}>
        <InputField
          label={t("register_page.city")}
          required
          value={value.city}
          onChangeText={(text: string) => updateField("city", text)}
        />
        <InputField
          label={t("register_page.state")}
          required
          disabled
          value={state.abbreviation}
        />
        <InputField
          label={t("zip")}
          required
          disabled
          value={value.zip}
        />
      </View>

      <Checkbox
        label={t("register_page.different_mail_address")}
        value={showDifferentMailAddress}
        onValueChange={setShowDifferentMailAddress}
      />
      {showDifferentMailAddress && <>
        <Text>Mailing Address
          <HelpTooltip text="Put your mailing address in this box if you get your mail at an address that is different from your home address. If you do not receive mail at your home address you must fill out this section to indicate where you can be reached by mail." />
        </Text>
        <View style={styles.row}>
          <InputField
            label={t("register_page.address")}
            required
            value={value.differentAddress}
            onChangeText={(text: string) => updateField("differentAddress", text)}
          />
          <InputField
            label={t("register_page.unit_lot")}
            value={value.differentUnit}
            onChangeText={(text: string) => updateField("differentUnit", text)}
          />
        </View>
        <View style={styles.row}>
          <InputField
            label={t("register_page.city")}
            required
            value={value.differentCity}
            onChangeText={(text: string) => updateField("differentCity", text)}
          />
          <View >
            <Text style={styles.inputLabel}>
              {t('register_page.state')}*
            </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                style={styles.picker}
                itemStyle={styles.pickerItem}
                selectedValue={value.differentState}
                onValueChange={(itemValue) => updateField("differentState", itemValue)}
              >
                {STATES.map((state_value: { value: string, name: string }) => (
                  <Picker.Item key={state_value.name} label={state_value.name} value={state_value.value} />
                ))}
              </Picker>
            </View>
          </View>
          <InputField
            label={t("zip")}
            required
            numeric
            value={value.differentZip}
            onChangeText={(text: string) => updateField("differentZip", text)}
          />
        </View>
      </>}
      <Checkbox
        label={t("register_page.changed_address")}
        value={showChangedAddress}
        onValueChange={setShowChangedAddress}
      />
      {showChangedAddress && <>
        <Text>Previous Address</Text>
        <View style={styles.row}>
          <InputField
            label={t("register_page.address")}
            required
            value={value.changedAddress}
            onChangeText={(text: string) => updateField("changedAddress", text)}
          />
          <InputField
            label={t("register_page.unit_lot")}
            value={value.changedUnit}
            onChangeText={(text: string) => updateField("changedUnit", text)}
          />
        </View>
        <View style={styles.row}>
          <InputField
            label={t("register_page.city")}
            required
            value={value.changedCity}
            onChangeText={(text: string) => updateField("changedCity", text)}
          />
          <View >
            <Text style={styles.inputLabel}>
              {t('register_page.state')}*
            </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                style={styles.picker}
                itemStyle={styles.pickerItem}
                selectedValue={value.changedState}
                onValueChange={(itemValue) => updateField("changedState", itemValue)}
              >
                {STATES.map((state_value: { value: string, name: string }) => (
                  <Picker.Item key={state_value.name} label={state_value.name} value={state_value.value} />
                ))}
              </Picker>
            </View>
          </View>
          <InputField
            label={t("zip")}
            required
            numeric
            value={value.changedZip}
            onChangeText={(text: string) => updateField("changedZip", text)}
          />
        </View>
      </>}

      {showRadioButtons && <>
        <Radio
          label={t("register_page.has_id", { abbreviation: state.abbreviation })}
          selected={value.hasStateId === true}
          onPress={() => updateField("hasStateId", true)}
        />
        <Radio
          label={t("register_page.no_id", { abbreviation: state.abbreviation })}
          selected={value.hasStateId === false}
          onPress={() => updateField("hasStateId", false)}
        />
      </>}
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


    inputLabel: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      color: theme.textPrimary,
    },
    pickerWrapper: {
      flexBasis: "18%",
      minWidth: "100%",
      height: 48,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 8,
      justifyContent: "center",
      backgroundColor: theme.white,
    },
    picker: {
      width: "100%",
    },
    pickerItem: {
      fontSize: 14,
    },
  });