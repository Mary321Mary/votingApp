import React, { useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { OVR_TYPE_MAP, RegisterFormState, StateData } from "@/utils/types";
import { PaperOVR } from "./PaperOVR";
import { OvrState } from "./OvrState";
import { ConnectedOVR } from "./ConnectedOVR";
import { ThemeContext } from "@/styles/ThemeProvider";
import { RootStackParamList } from "./Navigation";
import ConnectedOVRStep2 from "./ConnectedOVRStep2";

function getFlowType(ovrType: string) {
  return OVR_TYPE_MAP[ovrType] ?? 'paper';
}

type RegisterScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

interface RegisterResultProps {
  state: StateData;
  zip: string;
}

export const RegisterResult = ({ state, zip }: RegisterResultProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<RegisterScreenNavigation>();

  const [step, setStep] = useState<1 | 2>(1);
  const flowType = getFlowType(state?.ovr_type || '');
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
    if (flowType === 'connected_ovr') {
      return step === 1
        ? <ConnectedOVR state={state} value={form} onChange={setForm} />
        : <ConnectedOVRStep2 state={state} value={form} onChange={setForm} />;
    }

    switch (flowType) {
      case 'ovr_state':
        return <OvrState state={state} value={form} onChange={setForm} />;
      case 'paper':
      default:
        return <PaperOVR state={state} value={form} onChange={setForm} />;
    }
  };

  const handleMainButtonClick = () => {
    if (flowType === 'connected_ovr') {
      if (step === 1) {
        setStep(2);
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
        <TouchableOpacity
          style={styles.button}
          onPress={handleMainButtonClick}
        >
          <Text style={styles.buttonText}>{t("register")}</Text>
        </TouchableOpacity>
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
      marginTop: 20
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
      color: theme.white,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 16,
      fontWeight: "semibold",
    },
    link: {
      color: theme.link,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "medium"
    }
  })