import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  FIRST_TIME_COMPLETED_KEY,
  ONBOARDING_COMPLETED_KEY,
  VOTER_ELECTIONS_KEY,
  VOTER_FORM_STORAGE_KEY,
  VOTER_POOLING_KEY,
  VOTER_USER_STATUS,
} from "@/utils/constants";
import { CheckRegistrationStatus } from "@/utils/types";

import { ThemeContext } from "@/styles/ThemeProvider";
import Header from "@/layout/Header";
import { CustomButton } from "@/components/atoms/CustomButton";
import { RootStackParamList } from "@/components/Navigation";

type ReturnScreenProps = NativeStackScreenProps<RootStackParamList, "Return">;

export default function ReturnScreen({ navigation }: ReturnScreenProps) {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  const [savedForm, setSavedForm] = useState<CheckRegistrationStatus>({
    partner_id: 1,

    first_name: "",
    last_name: "",
    email: "",
    city: "",
    zip: "",

    aptunit: "",
    address: "",
    birthMonth: "",
    birthDay: "",
    birthYear: "",
    date_of_birth: "",
    phone: "",

    opt_in_email: false,
    opt_in_sms: true,
    volunteer: false,

    survey_question_1: "",
    survey_answer_1: "",
    survey_question_2: "",
    survey_answer_2: "",

    prefType1: true,
    prefType2: true,
    prefType3: true,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [storedForm, storedOnboardingCompleted] = await Promise.all([
          AsyncStorage.getItem(VOTER_FORM_STORAGE_KEY),
          AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY),
        ]);

        if (storedForm) {
          const parsedForm = JSON.parse(storedForm);
          setSavedForm(parsedForm);
        }
        setOnboardingCompleted(Boolean(storedOnboardingCompleted));
      } catch (error) {
        console.error("Failed to load user data from AsyncStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const handleContinueOnboarding = () => {
    navigation.navigate("CheckVoterStatus", {
      form: savedForm,
    });
  };

  return (
    <View style={styles.container}>
      <Header showMenu text={t("native_local.restart.title")} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.text}>{t("native_local.restart.body")}</Text>

        <View style={styles.buttonContainer}>
          {!onboardingCompleted && (
            <CustomButton
              title="Continue Onboarding"
              onPress={handleContinueOnboarding}
            />
          )}

          <CustomButton
            title="Reset Test"
            onPress={async () => {
              try {
                await AsyncStorage.multiRemove([
                  VOTER_POOLING_KEY,
                  VOTER_FORM_STORAGE_KEY,
                  FIRST_TIME_COMPLETED_KEY,
                  ONBOARDING_COMPLETED_KEY,
                  VOTER_ELECTIONS_KEY,
                  VOTER_USER_STATUS,
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

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      flex: 1,
      backgroundColor: theme.white,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      padding: 20,
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
