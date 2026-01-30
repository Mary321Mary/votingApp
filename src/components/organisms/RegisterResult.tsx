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
          />
        );
      if (step === 2)
        return (
          <ConnectedOVRStep2
            state={state}
            value={form}
            errorMessages={errMsg}
            onChange={setForm}
          />
        );
      if (step === 3)
        return (
          <ConnectedOVRStep3
            state={state}
            value={form}
            errorMessages={errMsg}
            onChange={setForm}
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
          />
        );
      case "ovr_state":
        return (
          <OvrState
            state={state}
            value={form}
            errorMessages={errMsg}
            onChange={setForm}
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
          />
        );
    }
  };

  const handleMainButtonClick = () => {
    if (flowType === "connected_ovr") {
      if (step === 1) {
        setStep(2);
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
      backgroundColor: theme.primary,
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
      color: "green",
    },
    link: {
      color: theme.link,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "medium",
    },
  });
