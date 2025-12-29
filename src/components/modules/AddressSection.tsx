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
        <View style={{ flex: 1 }}>
          <InputField
            label={t("register_page.address")}
            required
            value={value.address}
            onChangeText={(text: string) => updateField("address", text)}
          />
        </View>
        <View style={{ flex: 1 }}>
          <InputField
            label={t("register_page.unit_lot")}
            value={value.unit}
            onChangeText={(text: string) => updateField("unit", text)}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <InputField
            label={t("register_page.city")}
            required
            value={value.city}
            onChangeText={(text: string) => updateField("city", text)}
          />
        </View>
        <View style={{ flex: 1 }}>
          <InputField
            label={t("register_page.state")}
            required
            value={state.abbreviation}
            onChangeText={() => { }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <InputField
            label={t("zip")}
            required
            value={value.zip}
            onChangeText={() => { }}
          />
        </View>
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
                <Picker.Item label="AL" value="Alabama" />
                <Picker.Item label="AK" value="Alaska" />
                <Picker.Item label="AZ" value="Arizona" />
                <Picker.Item label="AR" value="Arkansas" />
                <Picker.Item label="CA" value="California" />
                <Picker.Item label="CO" value="Colorado" />
                <Picker.Item label="CT" value="Connecticut" />
                <Picker.Item label="DE" value="Delaware" />
                <Picker.Item label="DC" value="District of Columbia" />
                <Picker.Item label="FL" value="Florida" />
                <Picker.Item label="GA" value="Georgia" />
                <Picker.Item label="HI" value="Hawaii" />
                <Picker.Item label="ID" value="Idaho" />
                <Picker.Item label="IL" value="Illinois" />
                <Picker.Item label="IN" value="Indiana" />
                <Picker.Item label="IA" value="Iowa" />
                <Picker.Item label="KS" value="Kansas" />
                <Picker.Item label="KY" value="Kentucky" />
                <Picker.Item label="LA" value="Louisiana" />
                <Picker.Item label="ME" value="Maine" />
                <Picker.Item label="MD" value="Maryland" />
                <Picker.Item label="MA" value="Massachusetts" />
                <Picker.Item label="MI" value="Michigan" />
                <Picker.Item label="MN" value="Minnesota" />
                <Picker.Item label="MS" value="Mississippi" />
                <Picker.Item label="MO" value="Missouri" />
                <Picker.Item label="MT" value="Montana" />
                <Picker.Item label="NE" value="Nebraska" />
                <Picker.Item label="NV" value="Nevada" />
                <Picker.Item label="NH" value="New Hampshire" />
                <Picker.Item label="NJ" value="New Jersey" />
                <Picker.Item label="NM" value="New Mexico" />
                <Picker.Item label="NY" value="New York" />
                <Picker.Item label="NC" value="North Carolina" />
                <Picker.Item label="ND" value="North Dakota" />
                <Picker.Item label="OH" value="Ohio" />
                <Picker.Item label="OK" value="Oklahoma" />
                <Picker.Item label="OR" value="Oregon" />
                <Picker.Item label="PA" value="Pennsylvania" />
                <Picker.Item label="RI" value="Rhode Island" />
                <Picker.Item label="SC" value="South Carolina" />
                <Picker.Item label="SD" value="South Dakota" />
                <Picker.Item label="TN" value="Tennessee" />
                <Picker.Item label="TX" value="Texas" />
                <Picker.Item label="UT" value="Utah" />
                <Picker.Item label="VT" value="Vermont" />
                <Picker.Item label="VA" value="Virginia" />
                <Picker.Item label="WA" value="Washington" />
                <Picker.Item label="WV" value="West Virginia" />
                <Picker.Item label="WI" value="Wisconsin" />
                <Picker.Item label="WY" value="Wyoming" />
              </Picker>
            </View>
          </View>
          <InputField
            label={t("zip")}
            required
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
                <Picker.Item label="" value="" />
                <Picker.Item label="AL" value="Alabama" />
                <Picker.Item label="AK" value="Alaska" />
                <Picker.Item label="AZ" value="Arizona" />
                <Picker.Item label="AR" value="Arkansas" />
                <Picker.Item label="CA" value="California" />
                <Picker.Item label="CO" value="Colorado" />
                <Picker.Item label="CT" value="Connecticut" />
                <Picker.Item label="DE" value="Delaware" />
                <Picker.Item label="DC" value="District of Columbia" />
                <Picker.Item label="FL" value="Florida" />
                <Picker.Item label="GA" value="Georgia" />
                <Picker.Item label="HI" value="Hawaii" />
                <Picker.Item label="ID" value="Idaho" />
                <Picker.Item label="IL" value="Illinois" />
                <Picker.Item label="IN" value="Indiana" />
                <Picker.Item label="IA" value="Iowa" />
                <Picker.Item label="KS" value="Kansas" />
                <Picker.Item label="KY" value="Kentucky" />
                <Picker.Item label="LA" value="Louisiana" />
                <Picker.Item label="ME" value="Maine" />
                <Picker.Item label="MD" value="Maryland" />
                <Picker.Item label="MA" value="Massachusetts" />
                <Picker.Item label="MI" value="Michigan" />
                <Picker.Item label="MN" value="Minnesota" />
                <Picker.Item label="MS" value="Mississippi" />
                <Picker.Item label="MO" value="Missouri" />
                <Picker.Item label="MT" value="Montana" />
                <Picker.Item label="NE" value="Nebraska" />
                <Picker.Item label="NV" value="Nevada" />
                <Picker.Item label="NH" value="New Hampshire" />
                <Picker.Item label="NJ" value="New Jersey" />
                <Picker.Item label="NM" value="New Mexico" />
                <Picker.Item label="NY" value="New York" />
                <Picker.Item label="NC" value="North Carolina" />
                <Picker.Item label="ND" value="North Dakota" />
                <Picker.Item label="OH" value="Ohio" />
                <Picker.Item label="OK" value="Oklahoma" />
                <Picker.Item label="OR" value="Oregon" />
                <Picker.Item label="PA" value="Pennsylvania" />
                <Picker.Item label="RI" value="Rhode Island" />
                <Picker.Item label="SC" value="South Carolina" />
                <Picker.Item label="SD" value="South Dakota" />
                <Picker.Item label="TN" value="Tennessee" />
                <Picker.Item label="TX" value="Texas" />
                <Picker.Item label="UT" value="Utah" />
                <Picker.Item label="VT" value="Vermont" />
                <Picker.Item label="VA" value="Virginia" />
                <Picker.Item label="WA" value="Washington" />
                <Picker.Item label="WV" value="West Virginia" />
                <Picker.Item label="WI" value="Wisconsin" />
                <Picker.Item label="WY" value="Wyoming" />
              </Picker>
            </View>
          </View>
          <InputField
            label={t("zip")}
            required
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
      flexBasis: "18%", // Title
      minWidth: 70,
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