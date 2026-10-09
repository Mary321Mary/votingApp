import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Linking,
} from "react-native";
import { Trans, useTranslation } from "react-i18next";
import InAppBrowser from "react-native-inappbrowser-reborn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  FIRST_TIME_COMPLETED_KEY,
  ONBOARDING2_COMPLETED_KEY,
  ONBOARDING_COMPLETED_KEY,
  VOTER_FORM_STORAGE_KEY,
  VOTER_STATE_STORAGE_KEY,
  VOTER_USER_STATUS,
} from "@/utils/constants";
import { CheckRegistrationStatus, StateData } from "@/utils/types";
import { reportEvent, submitEmailZip } from "@/utils/api";
import { REPORT_EVENT_STEPS } from "@/utils/report/eventReporting";

import { ThemeContext } from "@/styles/ThemeProvider";
import Header from "@/layout/Header";
import { useUIConfig } from "@/contexts/UIConfigContext";
import { CustomButton } from "@/components/atoms/CustomButton";
import { RootStackParamList } from "@/components/Navigation";
import i18n from "i18n";
import ElectionData from "@/components/organisms/ElectionData";

type DashboardScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Dashboard"
>;

export default function DashboardScreen({
  navigation,
  route,
}: DashboardScreenProps) {
  const { afterRegistration = false } = route.params || {};
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { config } = useUIConfig();

  const [userName, setUserName] = useState<string>("");
  const [savedState, setSavedState] = useState<StateData>();
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
    opt_in_sms: false,
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
  const [status, setStatus] = useState<boolean>();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [storedForm, storesStatus, storedState] = await Promise.all([
          AsyncStorage.getItem(VOTER_FORM_STORAGE_KEY),
          AsyncStorage.getItem(VOTER_USER_STATUS),
          AsyncStorage.getItem(VOTER_STATE_STORAGE_KEY),
        ]);

        if (storedForm) {
          const parsedForm = JSON.parse(storedForm);
          setSavedForm(parsedForm);
          if (parsedForm.first_name) {
            setUserName(parsedForm.first_name);
          }
        }
        setStatus(Boolean(storesStatus) || false);
        if (storedState) {
          const parsedState = JSON.parse(storedState);
          setSavedState(parsedState);
        }
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
        <Text style={styles.text}>
          <Trans
            i18nKey={
              afterRegistration
                ? "native_local.dashboard.finished_onboarding"
                : "native_local.dashboard.returning"
            }
            values={{ firstname: userName }}
            components={{
              body: <Text style={styles.text} />,
              strong: <Text style={styles.bold} />,
            }}
          />
        </Text>
        <Text style={styles.text}>
          <Trans
            i18nKey={
              status
                ? t("native_local.dashboard.reg_status_active")
                : t("native_local.dashboard.reg_status_pending")
            }
            components={{
              body: <Text style={styles.text} />,
              strong: <Text style={styles.bold} />,
            }}
          />
        </Text>

        <ElectionData />

        <View style={styles.buttonContainer}>
          <CustomButton
            title={t("lookup_success_page.cta_learn_about", {
              state_abbr: savedState?.abbreviation,
            })}
            onPress={async () => {
              const url = savedState?.learn_about_url || "";
              if (url) openInAppUrl(url);

              const response = await submitEmailZip({
                email: savedForm.email,
                zip: savedForm.zip,
                locale: i18n.language,
                partner_id: savedForm.partner_id.toString(),
              });

              await AsyncStorage.setItem(
                "registration_uid",
                response.data.registration_uid,
              );

              await reportEvent({
                registration_uid: response.data.registration_uid ?? "",
                partner_id: savedForm.partner_id.toString() || "1",
                step: REPORT_EVENT_STEPS.EMPTY,
                event_name: "CTA clicked: " + url,
              });
            }}
          />
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
          {/* <CustomButton
            title={t("finish_with_state_page3.copy_button_text")}
            variant="outline-primary"
            onPress={handleCopyLink}
          /> */}

          <CustomButton
            title="Reset Test"
            onPress={async () => {
              try {
                await AsyncStorage.multiRemove([
                  VOTER_FORM_STORAGE_KEY,
                  FIRST_TIME_COMPLETED_KEY,
                  ONBOARDING_COMPLETED_KEY,
                  ONBOARDING2_COMPLETED_KEY,
                  VOTER_USER_STATUS,
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
      padding: 10,
    },
    text: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 16,
      fontWeight: "600",
      lineHeight: 22,
      color: theme.textPrimary,
      marginBottom: 5,
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
    link: {
      color: theme.link,
      fontSize: 15,
      textDecorationLine: "underline",
    },
  });
