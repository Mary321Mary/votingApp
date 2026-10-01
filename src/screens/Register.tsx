import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import Header from "@/layout/Header";
import { ThemeContext } from "@/styles/ThemeProvider";
import { RootStackParamList } from "@/components/Navigation";
import { RegisterResult } from "@/components/organisms/RegisterResult/RegisterResult";

type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Register"
>;

export default function RegisterScreen({
  route,
  navigation,
}: RegisterScreenProps) {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

  const state = route?.params ?? null;

  if (!state) {
    navigation.navigate("Home");
    return null;
  }

  const {
    status,
    state: regState,
    counties,
    zip,
    email,
    pageFromLookup,
    workflowType,
    showRedirectText,
    voluntaryPaperRedirect,
    form,
    initialStep,
    isRedirectedCompressNVRA,
    onboardingFlow,
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
          counties={counties}
          pageFromLookup={pageFromLookup || ""}
          workflowType={workflowType}
          showRedirectText={showRedirectText || false}
          voluntaryPaperRedirect={voluntaryPaperRedirect ?? false}
          isRedirectedCompressNVRA={isRedirectedCompressNVRA ?? false}
          form={form}
          initialStep={initialStep}
          onboardingFlow={onboardingFlow}
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
