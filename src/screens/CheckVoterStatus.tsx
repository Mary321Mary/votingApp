import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";

import { DateRow } from "@/components/atoms/DateRow";
import InputField from "@/components/atoms/InputField";
import { ThemeContext } from "@/styles/ThemeProvider";
import { Checkbox } from "@/components/atoms/Checkbox";
import { RegisterFormState } from "@/utils/types";
import { RootStackParamList } from "@/components/organisms/Navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Header from "@/components/modules/Header";

type CheckVoterStatusScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "CheckVoterStatus"
>;

export const CheckVoterStatusScreen = ({
  route,
  navigation,
}: CheckVoterStatusScreenProps) => {
  const { zip, email } = route.params;

  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

  const [form, setForm] = useState<RegisterFormState>({
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    changedTitle: "",
    changedFirstName: "",
    changedMiddleName: "",
    changedLastName: "",
    changedSuffix: "",
    isCitizen: true,
    isAdult: true,

    address: "",
    unit: "",
    city: "",
    state: "",
    zip,
    differentAddress: "",
    differentUnit: "",
    differentCity: "",
    differentState: "",
    differentZip: "",
    changedAddress: "",
    changedUnit: "",
    changedCity: "",
    changedState: "",
    changedZip: "",
    hasStateId: true,

    email: email,
    streetName: "",
    streetNumber: "",
    streetType: "",
    streetDirection: "",
    mailingStreetName: "",
    mailingStreetNumber: "",
    mailingStreetType: "",
    mailingUnit: "",
    mailingCity: "",
    mailingState: "",
    mailingZip: "",
    mailingAddressType: "STANDARD",

    poNumber: "",
    poCity: "",
    poState: "",
    poZip: "",

    militaryType: "",
    militaryGroupNumber: "",
    militaryNumber: "",
    militaryPostOffice: "",
    militaryPostState: "",
    militaryZip: "",

    internationalAddress1: "",
    internationalAddress2: "",
    internationalAddress3: "",
    internationalCountry: "",
    internationalZip: "",

    idNumber: "",

    race: "",
    party: "",

    birthMonth: "",
    birthDay: "",
    birthYear: "",
    phone: "",
    phoneType: "Mobile",

    smsConsent: false,
    emailConsent: true,
    volunteer: false,
    mailForm: false,

    residency: false,
    cancelPrevious: false,
    digitalSignature: false,
    licenseUpdated: null,
    duplicateLicense: null,

    fullName: "",
    licenseNumber: "",
    eyeColor: "",
    ssnLast4: "",
  });

  const updateField = (key: string, fieldValue: any) => {
    setForm({ ...form, [key]: fieldValue });
  };

  const onContinue = () => {
    if (form.firstName === "John") {
      navigation.navigate("Lookup");
    } else {
      navigation.navigate("Success");
    }
  };

  return (
    <>
      <Header text="Check Voter Registration Status" />
      <Text style={styles.title}>
        Let’s double check your voter status as the first step.
      </Text>

      {/* Names */}
      <View style={styles.fieldset}>
        <InputField
          label={t("register_page.first_name")}
          required
          value={form.firstName}
          onChangeText={(text: string) => updateField("firstName", text)}
        />
        <InputField
          label={t("register_page.last_name")}
          required
          value={form.lastName}
          onChangeText={(text: string) => updateField("lastName", text)}
        />

        <View>
          <Text style={styles.inputLabel}>{t("register_page.suffix")}*</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              style={styles.picker}
              itemStyle={styles.pickerItem}
              selectedValue={form.suffix}
              onValueChange={itemValue => updateField("suffix", itemValue)}
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

      <View style={styles.fieldset}>
        <DateRow value={form} updateField={updateField} />
      </View>

      <View style={styles.fieldset}>
        <InputField
          label={t("register_page.address")}
          required
          value={form.address}
          onChangeText={(text: string) => updateField("address", text)}
        />
        <InputField
          label={t("register_page.city")}
          required
          value={form.city}
          onChangeText={(text: string) => updateField("city", text)}
        />
        <InputField
          label={t("zip")}
          required
          value={form.zip}
          onChangeText={(text: string) => updateField("zip", text)}
        />

        <InputField
          label={t("email")}
          value={form.email}
          required
          onChangeText={(text: string) => updateField("email", text)}
        />
        <InputField
          label={t("register_page.phone")}
          placeholder="###-###-####"
          value={form.phone}
          onChangeText={(text: string) => updateField("phone", text)}
        />
      </View>

      {/* Checkboxes */}
      <Checkbox
        label={t("register_page.email_opt_in")}
        value={form.emailConsent}
        onValueChange={(checked: boolean) =>
          updateField("emailConsent", checked)
        }
      />

      <Checkbox
        label={t("register_page.sms_opt_in")}
        value={form.smsConsent}
        onValueChange={(checked: boolean) => updateField("smsConsent", checked)}
      />

      {/* Continue */}
      <TouchableOpacity style={styles.button} onPress={onContinue}>
        <Text style={styles.buttonText}>{t("continue")}</Text>
      </TouchableOpacity>
    </>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    inputLabel: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      color: theme.textPrimary,
    },
    row: {
      gap: 8,
      marginBottom: 16,
      alignItems: "flex-end",
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

    fieldset: {
      marginBottom: 24,
      paddingHorizontal: 10,
      alignItems: "center",
      width: "100%",
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      marginVertical: 16,
      textAlign: "center",
    },
    inputBlock: {
      flex: 1,
      marginBottom: 12,
    },
    label: {
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 4,
    },
    input: {
      borderWidth: 1,
      borderColor: "#000",
      borderRadius: 4,
      padding: 10,
    },
    smallInput: {
      borderWidth: 1,
      borderColor: "#000",
      borderRadius: 4,
      padding: 10,
      width: 80,
      textAlign: "center",
    },
    switchRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 10,
    },
    switchText: {
      flex: 1,
      marginLeft: 10,
      fontSize: 13,
    },
    button: {
      backgroundColor: "#1e6bd6",
      padding: 14,
      borderRadius: 4,
      alignItems: "center",
      marginTop: 20,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
    },
  });
