import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { FormProps, RegisterFormState } from '@/utils/types';
import { ThemeContext } from '@/styles/ThemeProvider';
import InputField from '../atoms/InputField';
import { Radio } from '../atoms/Radio';
import { Picker } from '@react-native-picker/picker';
import HelpTooltip from '../atoms/HelpTooltip';
import { Checkbox } from '../atoms/Checkbox';

export const OvrState = ({ state, value, onChange }: FormProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

  const [hasLicense, setHasLicense] = useState<null | boolean>(null);
  const [showChangeName, setShowChangeName] = React.useState(false);
  const [showDifferentMailAddress, setShowDifferentMailAddress] = React.useState(false);
  const [showChangedAddress, setShowChangedAddress] = React.useState(false);
  const [showIsAdultBlock, setShowIsAdultBlock] = React.useState(false);

  const updateField = <K extends keyof RegisterFormState>(
    key: K,
    fieldValue: RegisterFormState[K]
  ) => {
    onChange({
      ...value,
      [key]: fieldValue,
    });
  };

  return (
    <View style={styles.block}>
      {/* NAME */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("register_page.section_name")}
          <HelpTooltip text={t('register_page.name_help')} />
        </Text>
        <View style={styles.row}>
          <View >
            <Text style={styles.inputLabel}>={t('register_page.title')}*</Text>
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
          <InputField
            label={t("register_page.first_name")}
            required
            onChangeText={(text: string) => updateField("firstName", text)}
          />
          {!showIsAdultBlock && <InputField
            label={t("register_page.middle_name")}
            onChangeText={(text: string) => updateField("middleName", text)}
          />}
          <InputField
            label={t("register_page.last_name")}
            required
            onChangeText={(text: string) => updateField("lastName", text)}
          />
          <View>
            <Text style={styles.inputLabel}>{t('register_page.suffix')}*</Text>
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

        {!showIsAdultBlock && <Checkbox
          label={t("register_page.changed_name")}
          helpText={t('register_page.changed_name_help')}
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
                onChangeText={(text: string) => updateField("changedFirstName", text)}
              />
              {!showIsAdultBlock && <InputField
                label={t("register_page.middle_name")}
                onChangeText={(text: string) => updateField("changedMiddleName", text)}
              />}
              <InputField
                label={t("register_page.last_name")}
                required
                onChangeText={(text: string) => updateField("changedLastName", text)}
              />
              <View >
                <Text style={styles.inputLabel}>
                  {t('register_page.suffix')}*
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
          </>
        )}
        <Checkbox
          label={t("register_page.eligibility.citizen")}
          required
          defaultValue
        />
        <Checkbox
          label={t("register_page.age_eligibility")}
          required
          defaultValue
        />
      </View>

      {/* ADDRESS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("register_page.section_home_address")}
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
            onChangeText={() => { }}
          />
          <InputField
            label={t("zip")}
            required
            onChangeText={() => { }}
          />
        </View>

        <Checkbox label={t("register_page.different_mail_address")} />
        {showDifferentMailAddress && <>
          <Text>Mailing Address
            <HelpTooltip text="Put your mailing address in this box if you get your mail at an address that is different from your home address. If you do not receive mail at your home address you must fill out this section to indicate where you can be reached by mail." />
          </Text>
          <View style={styles.row}>
            <InputField
              label={t("register_page.address")}
              required
              onChangeText={(text: string) => updateField("differentAddress", text)}
            />
            <InputField
              label={t("register_page.unit_lot")}
              onChangeText={(text: string) => updateField("differentUnit", text)}
            />
          </View>
          <View style={styles.row}>
            <InputField
              label={t("register_page.city")}
              required
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
                  selectedValue={t('register_page.state')}
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
              onChangeText={(text: string) => updateField("differentZip", text)}
            />
          </View>
        </>}
        <Checkbox label={t("register_page.changed_address")} />
        {showChangedAddress && <>
          <Text>Previous Address</Text>
          <View style={styles.row}>
            <InputField
              label={t("register_page.address")}
              required
              onChangeText={(text: string) => updateField("changedAddress", text)}
            />
            <InputField
              label={t("register_page.unit_lot")}
              onChangeText={(text: string) => updateField("changedUnit", text)}
            />
          </View>
          <View style={styles.row}>
            <InputField
              label={t("register_page.city")}
              required
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
                  selectedValue={t('register_page.state')}
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
              onChangeText={(text: string) => updateField("changedZip", text)}
            />
          </View>
        </>}

        <Radio
          label={t("register_page.has_id", { abbreviation: state.abbreviation })}
          selected={hasLicense === true}
          onPress={() => setHasLicense(true)}
        />
        <Radio
          label={t("register_page.no_id", { abbreviation: state.abbreviation })}
          selected={hasLicense === false}
          onPress={() => setHasLicense(false)}
        />
      </View>

      {/* ID */}
      <View style={{ width: "100%" }}>
        <InputField
          label={t('register_page.id_number')}
          required
          onChangeText={(text: string) => updateField("idNumber", text)}
        />
        <Text style={styles.hint}>{t("register_page.driver_license", { name: state.name })}</Text>
      </View>

      {/* ADDITIONAL */}
      <View style={styles.section}>
        <View >
          <Text style={styles.inputLabel}>
            {t('register_page.race.title')}
            <HelpTooltip text={t("register_page.race_help", { name: state.name })} />
          </Text>
          <View style={styles.pickerWrapper}>
            <Picker
              style={styles.picker}
              itemStyle={styles.pickerItem}
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
        </View>
      </View>

      {/* CONTACT */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('register_page.section_contact')}</Text>
        <View style={styles.row}>
          <InputField
            label={t('register_page.dob')}
            helpText={t('register_page.dob_help')}
            required
            placeholder="MM / DD / YYYY"
            onChangeText={(text: string) => updateField("birth", text)}
          />
          <InputField
            label={t('register_page.phone')}
            helpText={t('register_page.phone_help')}
            placeholder="###-###-####"
            onChangeText={(text: string) => updateField("phone", text)}
          />
          <View>
            <Text style={styles.inputLabel}>{t('register_page.phone_type')}</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label={t('register_page.phone_types.mobile')} value="Mobile" />
                <Picker.Item label={t('register_page.phone_types.home')} value="Home" />
                <Picker.Item label={t('register_page.phone_types.work')} value="Work" />
                <Picker.Item label={t('register_page.phone_types.other')} value="Other" />
              </Picker>
            </View>
          </View>
        </View>
      </View>

      {/* CONSENTS */}
      <View style={styles.section}>
        <Checkbox label={t('register_page.sms_opt_in')} />
        <Text style={styles.hint}>{t('register_page.sms_disclaimer')}</Text>
        <Checkbox
          label={t('register_page.email_opt_in')}
          defaultValue
        />
        <Checkbox label={t('register_page.volunteer')} />
        <Checkbox label={t('register_page.mail_form')} />
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
