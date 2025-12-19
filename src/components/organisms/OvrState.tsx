import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StateData } from '@/utils/types';
import { ThemeContext } from '@/styles/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '../modules/Checkbox';
import InputField from '../modules/InputField';
import { Radio } from '../modules/Radio';
import { Picker } from '@react-native-picker/picker';
import HelpTooltip from '../modules/HelpTooltip';

export const OvrState = ({ state }: { state: StateData; }) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const [hasLicense, setHasLicense] = useState<null | boolean>(null);

  return (
    <View style={styles.block}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Name</Text>
        <View style={styles.row}>
          <View >
            <Text style={styles.inputLabel}>
              {t('register_page.title')}
            </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="" value="" />
                <Picker.Item label="Mr." value="Mr." />
                <Picker.Item label="Mrs." value="Mrs." />
                <Picker.Item label="Miss" value="Miss" />
                <Picker.Item label="Ms." value="Ms." />
              </Picker>
            </View>
          </View>
          <InputField label={t("FIRST NAME")} required onChangeText={() => { }} />
          <InputField label={t("MIDDLE")} onChangeText={() => { }} />
          <InputField label={t("LAST NAME")} required onChangeText={() => { }} />
          <View >
            <Text style={styles.inputLabel}>
              {t('register_page.suffix')}
            </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                style={styles.picker}
                itemStyle={styles.pickerItem}
                selectedValue={t('register_page.suffix')}
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

        <Checkbox label="I have changed my name." />
        <Checkbox label="I am a U.S. citizen" required defaultValue />
        <Checkbox
          label="I will be 18 or older by the next election."
          required
          defaultValue
        />
      </View>

      {/* ADDRESS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Home Address
          <HelpTooltip text="Put your home address in these boxes. Do not put your mailing address here if it is different from your home address. Do not use a post office box or rural route without a box number. If you live in a rural area but do not have a street address, or if you have no address, please show where you live using the map on the printed form." />
        </Text>
        <View style={styles.row}>
          <InputField label={t("ADDRESS")} required onChangeText={() => { }} />
          <InputField label={t("UNIT/LOT #")} onChangeText={() => { }} />
        </View>

        <View style={styles.row}>
          <InputField label={t("CITY")} required onChangeText={() => { }} />
          <InputField label={t("STATE")} required onChangeText={() => { }} />
          <InputField label={t("ZIP CODE")} required onChangeText={() => { }} />
        </View>

        <Checkbox label="I get my mail at a different address" />
        <Checkbox label="I have changed my address since the last time I registered to vote" />

        <Radio
          label={`I have a ${state.abbreviation} state ID or driver's license`}
          selected={hasLicense === true}
          onPress={() => setHasLicense(true)}
        />
        <Radio
          label={`I do not have a ${state.abbreviation} state ID or driver's license`}
          selected={hasLicense === false}
          onPress={() => setHasLicense(false)}
        />
      </View>

      {/* ID */}
      <View style={{ width: "100%" }}>
        <InputField label="ID Number" required onChangeText={() => { }} />

        <Text style={styles.hint}>
          You must provide your full Social Security number.
        </Text>
      </View>

      {/* ADDITIONAL */}
      <View style={styles.section}>
        <View >
          <Text style={styles.inputLabel}>
            {t('Race')}
          </Text>
          <View style={styles.pickerWrapper}>
            <Picker
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
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
      </View>

      {/* CONTACT */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <View style={styles.row}>
          <InputField label={t("Date of Birth")} placeholder="MM / DD / YYYY" onChangeText={() => { }} />
          <InputField label={t("Phone")} placeholder="###-###-####" onChangeText={() => { }} />
          <View >
            <Text style={styles.inputLabel}>
              {t('Type')}
            </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Mobile" value="Mobile" />
                <Picker.Item label="Home" value="Home" />
                <Picker.Item label="Work" value="Work" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>
          </View>
        </View>
      </View>

      {/* CONSENTS */}
      <View style={styles.section}>
        <Checkbox label="Send me text messages from Rock the Vote" />

        <Text style={styles.hint}>
          By signing up, you consent to receive periodic text messages from Rock the Vote (788683).
          Message and data rates may apply. Text HELP for info or STOP to stop receiving messages.
          No purchase necessary. See terms and conditions and privacy policy.
        </Text>

        <Checkbox
          label="Receive action alerts and other email updates from Rock the Vote"
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
    block: {
      minWidth: "100%",
    },
    text: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "regular"
    },
    bold: {
      fontWeight: "bold"
    },
    link: {
      color: theme.link,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "regular"
    },
    container: {
      padding: 16,
      backgroundColor: theme.white,
    },
    section: {
      marginBottom: 24,
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
      height: 48,
      width: "100%",
    },
    pickerItem: {
      fontSize: 14,
    },


    sectionTitle: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 18,
      fontWeight: "semibold",
    },
    // row: {
    //   flexDirection: "row",
    //   gap: 10,
    //   marginBottom: 12,
    // },
    inputBlock: {
      gap: 4,
    },
    label: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "medium",
    },
    required: {
      color: theme.secondary,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.borderColor,
      fontWeight: "regular",
      borderRadius: 6,
      padding: 10,
    },
    checkbox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    },
    checkboxText: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "regular",
      flex: 1,
    },
    hint: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 13,
      fontWeight: "regular",
      color: theme.gray,
      marginTop: 8,
      lineHeight: 18,
    },
  })
