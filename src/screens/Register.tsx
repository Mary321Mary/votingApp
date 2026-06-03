import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Header from "@/layout/Header";
import { ThemeContext } from "@/styles/ThemeProvider";
import { RootStackParamList } from "@/components/organisms/Navigation";
import { RegisterResult } from "@/components/organisms/RegisterResult";
import { SubmitEmailZipResponseProps } from "@/utils/types";

interface RegisterScreenProps {
  route: { params: SubmitEmailZipResponseProps };
}

type RegisterScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

export default function RegisterScreen({ route }: RegisterScreenProps) {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<RegisterScreenNavigation>();

  const state = route?.params ?? null;

  if (!state) {
    navigation.navigate("Home");
    return null;
  }

  const {
    status,
    state: regState,
    zip,
    email,
    pageFromLookup,
    workflowType,
    showRedirectText,
    form,
  } = state;

  const title =
    status.success && regState
      ? `Register in ${regState.name}`
      : "Zip Code Error";

  return (
    <>
      <Header text={title} />
      {status.success && regState ? (
        <RegisterResult
          state={regState}
          zip={zip}
          email={email}
          pageFromLookup={pageFromLookup || ""}
          workflowType={workflowType}
          showRedirectText={showRedirectText || false}
          form={form}
        />
      ) : (
        <View>
          {status.errors?.map((error: string, index: number) => (
            <Text key={index} style={styles.errorText}>
              {error}
            </Text>
          ))}

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.buttonText}>{t("return")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    errorText: {
      color: theme.secondary,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 12,
      marginBottom: 6,
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
  });
