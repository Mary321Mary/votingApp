import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { OVR_TYPE_MAP, StateData } from "@/utils/types";
import { PaperOVR } from "./PaperOVR";
import { OvrState } from "./OvrState";
import { ConnectedOVR } from "./ConnectedOVR";
import { ThemeContext } from "@/styles/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./Navigation";
import { useTranslation } from "react-i18next";

function getFlowType(ovrType: string) {
  return OVR_TYPE_MAP[ovrType] ?? 'paper';
}

type RegisterScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

export const RegisterResult = ({ state }: { state: StateData; }) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const flowType = getFlowType(state.ovr_type);
  const navigation = useNavigation<RegisterScreenNavigation>();
  const { t } = useTranslation();

  const renderComponent = () => {
    switch (flowType) {
      case 'ovr_state':
        return <OvrState state={state} />;

      case 'connected_ovr':
        return <ConnectedOVR state={state} />;

      case 'paper':
      default:
        return <PaperOVR state={state} />;
    }
  };

  return (
    <View style={styles.box}>
      {renderComponent()}
      <View style={styles.buttonBox}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home")}
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
      fontWeight: "600",
    },
    link: {
      color: theme.link,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "medium"
    }
  })