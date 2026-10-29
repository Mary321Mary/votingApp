import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  FIRST_TIME_COMPLETED_KEY,
  INITIAL_USER_STATE,
  ONBOARDING2_COMPLETED_KEY,
  ONBOARDING_COMPLETED_KEY,
  VOTER_STATE_STORAGE_KEY,
  VOTER_USER_STORAGE_KEY,
} from "@/utils/constants";

import { ThemeContext } from "@/styles/ThemeProvider";
import { COLORS } from "@/styles/colors";
import Header from "@/layout/Header";
import { CustomButton } from "@/components/atoms/CustomButton";
import { RootStackParamList } from "@/components/Navigation";

type ReturnScreenProps = NativeStackScreenProps<RootStackParamList, "Return">;

export default function ReturnScreen({ navigation }: ReturnScreenProps) {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  const handleContinueOnboarding = async () => {
    const [storedForm, storedOnboardingCompleted] = await Promise.all([
      AsyncStorage.getItem(VOTER_USER_STORAGE_KEY),
      AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY),
    ]);
    let form = INITIAL_USER_STATE;
    if (storedForm) {
      form = JSON.parse(storedForm);
    }

    if (storedOnboardingCompleted === "true") {
      navigation.navigate("Onboarding2", { form });
    } else {
      navigation.navigate("CheckVoterStatus", { form });
    }
  };

  return (
    <View style={styles.container}>
      <Header showMenu text={t("native_local.restart.title")} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.text}>{t("native_local.restart.body")}</Text>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Continue Onboarding"
            onPress={handleContinueOnboarding}
          />

          <CustomButton
            title="Reset Test"
            onPress={async () => {
              try {
                await AsyncStorage.multiRemove([
                  VOTER_USER_STORAGE_KEY,
                  FIRST_TIME_COMPLETED_KEY,
                  ONBOARDING_COMPLETED_KEY,
                  ONBOARDING2_COMPLETED_KEY,
                  VOTER_STATE_STORAGE_KEY,
                ]);
              } catch (error) {
                console.error("Failed to clear saved data:", error);
              }
              navigation.replace("Welcome");
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: typeof COLORS) =>
  StyleSheet.create({
    container: {
      width: "100%",
      flex: 1,
      backgroundColor: theme.white,
    },
    content: {
      padding: 10,
      alignItems: "center",
    },
    text: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 16,
      fontWeight: "600",
      lineHeight: 22,
      color: theme.textPrimary,
    },
    buttonContainer: {
      width: "100%",
      marginTop: 10,
    },
  });
