import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Linking,
  Platform,
  ToastAndroid,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import InAppBrowser from "react-native-inappbrowser-reborn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Clipboard from "@react-native-clipboard/clipboard";
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
import { reportEvent } from "@/utils/api";
import { REPORT_EVENT_STEPS } from "@/utils/report/eventReporting";

import { ThemeContext } from "@/styles/ThemeProvider";
import Header from "@/layout/Header";
import { useUIConfig } from "@/contexts/UIConfigContext";
import { PollingLocationsBlock } from "@/components/organisms/PollingLocationsBlock";
import { CustomButton } from "@/components/atoms/CustomButton";
import { RootStackParamList } from "@/components/Navigation";

type DashboardScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Dashboard"
>;

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { config } = useUIConfig();

  const [userName, setUserName] = useState<string>("");
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
  const [status, setStatus] = useState<string>();
  const [elections, setElections] = useState<
    {
      id: number;
      type: string;
      date: string;
      description: string;
    }[]
  >([]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [
          storedForm,
          storedOnboardingCompleted,
          storesElections,
          storesStatus,
        ] = await Promise.all([
          AsyncStorage.getItem(VOTER_FORM_STORAGE_KEY),
          AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY),
          AsyncStorage.getItem(VOTER_ELECTIONS_KEY),
          AsyncStorage.getItem(VOTER_USER_STATUS),
        ]);

        if (storedForm) {
          const parsedForm = JSON.parse(storedForm);
          setSavedForm(parsedForm);
          if (parsedForm.first_name) {
            setUserName(parsedForm.first_name + " " + parsedForm.last_name);
          }
        }
        setOnboardingCompleted(Boolean(storedOnboardingCompleted));
        if (storesElections) {
          setElections(JSON.parse(storesElections));
        }
        setStatus(storesStatus || "pending");
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

  const welcomeText = userName
    ? onboardingCompleted
      ? t("native_local.dashboard.returning", { firstname: userName })
      : t("native_local.dashboard.finished_onboarding", { firstname: userName })
    : "Welcome back. Your best next step are ...";

  const handleContinueOnboarding = () => {
    navigation.navigate("CheckVoterStatus", {
      form: savedForm,
    });
  };

  const handleCopyLink = async () => {
    try {
      Clipboard.setString(config?.share?.registrations?.copy_link || "");

      if (Platform.OS === "android") {
        ToastAndroid.show(t(`pennsylvania.link_copied`), ToastAndroid.SHORT);
      } else {
        Alert.alert("Success", t(`pennsylvania.link_copied`));
      }
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const openInAppUrl = async (url: string) => {
    if (!url) return;
    try {
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url, {
          // iOS settings
          dismissButtonStyle: "close",
          preferredBarTintColor: "#ffffff",
          preferredControlTintColor: "#000000",
          readerMode: false,
          animated: true,
          modalEnabled: true,
          // Android settings
          showTitle: true,
          toolbarColor: "#ffffff",
          secondaryToolbarColor: "black",
          navigationBarColor: "black",
          enableUrlBarHiding: true,
          enableDefaultShare: false,
        });
      } else {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error(error);
      await Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <Header showMenu text={t("native_local.dashboard.title")} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.text}>{welcomeText}</Text>
        <Text style={styles.text}>Status: {status}</Text>

        {userName && <PollingLocationsBlock />}
        {userName && elections.length > 0 && (
          <View style={styles.buttonContainer}>
            <Text style={styles.bold}>
              {t("native_local.dashboard.upcoming_election")}
            </Text>
            {elections.map(election => (
              <Text key={election.id}>{election.description}</Text>
            ))}
          </View>
        )}

        <View style={styles.buttonContainer}>
          {!onboardingCompleted && (
            <CustomButton
              title="Continue Onboarding"
              onPress={handleContinueOnboarding}
            />
          )}

          <CustomButton
            title={t("finish_with_state_page3.fb_button_text")}
            variant="outline-primary"
            onPress={async () => {
              const url = config?.share?.lookup?.facebook || "";
              if (url) openInAppUrl(url);

              const registration_uid =
                (await AsyncStorage.getItem(`registration_uid`)) || "";
              await reportEvent({
                registration_uid,
                partner_id: "1",
                step: REPORT_EVENT_STEPS.EMPTY,
                event_name: "CTA clicked: " + url,
              });
            }}
          />
          <CustomButton
            title={t("finish_with_state_page3.x_button_text")}
            variant="outline-primary"
            onPress={async () => {
              const url = config?.share?.lookup?.x || "";
              if (url) openInAppUrl(url);

              const registration_uid =
                (await AsyncStorage.getItem(`registration_uid`)) || "";
              await reportEvent({
                registration_uid,
                partner_id: "1",
                step: REPORT_EVENT_STEPS.EMPTY,
                event_name: "CTA clicked: " + url,
              });
            }}
          />
          <CustomButton
            title={t("finish_with_state_page3.copy_button_text")}
            variant="outline-primary"
            onPress={handleCopyLink}
          />

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
    bold: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 16,
      fontWeight: "bold",
      lineHeight: 22,
      color: theme.textPrimary,
    },
    buttonContainer: {
      width: "100%",
      marginTop: 10,
    },
  });
