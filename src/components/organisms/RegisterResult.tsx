import React, { useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import {
  OVR_TYPE_MAP,
  RegisterFormState,
  RegisterFormStateError,
  StateData,
} from "@/utils/types";
import { PaperOVR } from "./PaperOVR";
import { OvrState } from "./OvrState";
import { ConnectedOVR } from "./ConnectedOVR";
import { ThemeContext } from "@/styles/ThemeProvider";
import { RootStackParamList } from "./Navigation";
import ConnectedOVRStep2 from "./ConnectedOVRStep2";
import ConnectedOVRStep3 from "./ConnectedOVRStep3";
import { NotParticipating } from "./NotParticipating";
import { useNavigation } from "@react-navigation/native";

function getFlowType(ovrType: string) {
  return OVR_TYPE_MAP[ovrType] ?? "paper";
}

type RegisterScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

interface RegisterResultProps {
  state: StateData;
  zip: string;
  email: string;
}

const EMPTY_ERROR_MESSAGES = {
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
  isCitizen: "",
  isAdult: "",
  email: "",

  address: "",
  unit: "",
  city: "",
  state: "",
  zip: "",
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
  hasStateId: "",

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
  phoneType: "",

  smsConsent: "",
  emailConsent: "",
  volunteer: "",
  mailForm: "",

  residency: "",
  cancelPrevious: "",
  digitalSignature: "",
  licenseUpdated: "",
  duplicateLicense: "",

  fullName: "",
  licenseNumber: "",
  eyeColor: "",
  ssnLast4: "",

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
  mailingAddressType: "",
  isAdultBlock: "",
};

export const RegisterResult = ({ state, zip, email }: RegisterResultProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<RegisterScreenNavigation>();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const flowType = getFlowType(state?.ovr_type || "");
  const [errMsg, setErrMsg] =
    useState<RegisterFormStateError>(EMPTY_ERROR_MESSAGES);

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
    state: state.abbreviation,
    zip,
    differentAddress: "",
    differentUnit: "",
    differentCity: "",
    differentState: state.abbreviation,
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

  const renderContent = () => {
    if (flowType === "connected_ovr") {
      if (step === 1)
        return (
          <ConnectedOVR
            state={state}
            value={form}
            errorMessages={errMsg}
            onChange={setForm}
            onChangeError={setErrMsg}
          />
        );
      if (step === 2)
        return (
          <ConnectedOVRStep2
            state={state}
            value={form}
            errorMessages={errMsg}
            onChange={setForm}
            onChangeError={setErrMsg}
          />
        );
      if (step === 3)
        return (
          <ConnectedOVRStep3
            state={state}
            value={form}
            errorMessages={errMsg}
            onChange={setForm}
            onChangeError={setErrMsg}
          />
        );
    }

    switch (flowType) {
      case "not_participating":
        return (
          <NotParticipating
            state={state}
            value={form}
            errorMessages={errMsg}
            onChange={setForm}
            onChangeError={setErrMsg}
          />
        );
      case "ovr_state":
        return (
          <OvrState
            state={state}
            value={form}
            errorMessages={errMsg}
            onChange={setForm}
            onChangeError={setErrMsg}
          />
        );
      case "paper":
      default:
        return (
          <PaperOVR
            state={state}
            value={form}
            errorMessages={errMsg}
            onChange={setForm}
            onChangeError={setErrMsg}
          />
        );
    }
  };

  const validateConnectedOvr = () => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    const miIdRegex = /^[A-Z]\d{12}$/i;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let errorMessage = { ...EMPTY_ERROR_MESSAGES };
    if (step === 1) {
      if (!form.isCitizen) {
        errorMessage.isCitizen = t("register_page.us_citizen_2");
      }
      if (!form.isAdult) {
        errorMessage.isAdult = t("register_page.age_eligibility_error_2", {
          state: state.name,
        });
      }
      if (!form.residency) {
        errorMessage.residency = "show";
      }
      if (!form.cancelPrevious) {
        errorMessage.cancelPrevious = "show";
      }
      if (!form.digitalSignature) {
        errorMessage.digitalSignature = "show";
      }
      if (form.licenseUpdated !== "no") {
        errorMessage.licenseUpdated = "show";
      }
      if (form.duplicateLicense !== "no") {
        errorMessage.duplicateLicense = "show";
      }
    } else if (step === 2) {
      if (!form.fullName.trim()) {
        errorMessage.fullName = t("register_page.required");
      }
      if (!form.licenseNumber.trim()) {
        errorMessage.licenseNumber = t("register_page.id_number_error_2");
      } else if (!miIdRegex.test(form.licenseNumber.trim())) {
        errorMessage.licenseNumber = t("register_page.id_number_error_1");
      }
      if (!form.birthMonth.trim()) {
        errorMessage.birthMonth = t("register_page.required");
      }
      if (!form.birthDay.trim()) {
        errorMessage.birthDay = t("register_page.required");
      }
      if (!form.birthYear.trim()) {
        errorMessage.birthYear = t("register_page.required");
      } else if (Number(form.birthYear) < 1900) {
        errorMessage.birthYear = t("register_page.invalid_year");
      }
      if (
        form.birthYear.trim() &&
        form.birthMonth.trim() &&
        form.birthDay.trim()
      ) {
        const year = Number(form.birthYear);
        const month = Number(form.birthMonth) - 1;
        const day = Number(form.birthDay);

        const date = new Date(year, month, day);

        const isInvalidDate =
          date.getFullYear() !== year ||
          date.getMonth() !== month ||
          date.getDate() !== day;

        if (isInvalidDate) {
          errorMessage.birthDay = t("register_page.invalid_birth_date");
        }
      }
      if (!form.ssnLast4.trim() || form.ssnLast4.trim().length !== 4) {
        errorMessage.ssnLast4 = t("register_page.ssn_error");
      }
    } else if (step === 3) {
      if (!form.streetNumber.trim()) {
        errorMessage.streetNumber = t("register_page.required");
      }
      if (!form.streetName.trim()) {
        errorMessage.streetName = t("register_page.required");
      }
      if (!form.city.trim()) {
        errorMessage.city = t("register_page.required");
      }
      if (!form.state.trim()) {
        errorMessage.state = t("register_page.required");
      }
      if (!form.zip.trim()) {
        errorMessage.zip = t("register_page.required");
      } else if (!zipRegex.test(form.zip.trim())) {
        errorMessage.zip = t("register_page.invalid_zip");
      }
      // Mailing Address Toggle validation need here ...
      if (form.smsConsent && !form.phone.trim()) {
        errorMessage.phone = t("register_page.phone_election_error");
      }
      if (!form.email.trim()) {
        errorMessage.email = t("register_page.required");
      } else if (!emailRegex.test(form.email.trim())) {
        errorMessage.email = t("register_page.email_invalid");
      }
    }

    setErrMsg(errorMessage);
    return !Object.values(errorMessage).some(value => value.trim() !== "");
  };

  const handleMainButtonClick = () => {
    if (flowType === "connected_ovr") {
      if (step === 1) {
        if (validateConnectedOvr()) {
          navigation.navigate("Success");
        }
        // setStep(2);
      } else if (step === 2) {
        setStep(3);
      } else {
        navigation.navigate("Success");
      }
    } else {
      navigation.navigate("Success");
    }
  };

  return (
    <View style={styles.box}>
      {renderContent()}
      <View style={styles.buttonBox}>
        {flowType !== "not_participating" && (
          <TouchableOpacity
            style={styles.button}
            onPress={handleMainButtonClick}
          >
            <Text
              style={[
                styles.buttonText,
                flowType === "connected_ovr" && step !== 3
                  ? styles.registerText
                  : styles.restartText,
              ]}
              //  style={styles.buttonText}
            >
              {flowType === "connected_ovr" && step !== 3
                ? t("register")
                : t("restart")}
            </Text>
          </TouchableOpacity>
        )}
        <Text style={styles.link} onPress={() => navigation.goBack()}>
          {t("back")}
        </Text>
      </View>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    box: {
      marginVertical: 20,
      padding: 15,
      backgroundColor: theme.background,
      borderRadius: 10,
    },
    buttonBox: {
      display: "flex",
      alignItems: "center",
      gap: 20,
      marginTop: 20,
    },
    button: {
      backgroundColor: "green",
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderRadius: 5,
      marginLeft: 10,
      height: 45,
      justifyContent: "center",
    },
    buttonText: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 16,
      fontWeight: "semibold",
    },
    registerText: {
      color: theme.white,
    },
    restartText: {
      color: theme.textPrimary,
    },
    link: {
      color: theme.link,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "medium",
    },
  });
