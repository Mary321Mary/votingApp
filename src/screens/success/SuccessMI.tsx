import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  Platform,
  ToastAndroid,
  Alert,
} from "react-native";
import { Trans, useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Clipboard from "@react-native-clipboard/clipboard";

import Header from "@/layout/Header";
import { useUIConfig } from "@/contexts/UIConfigContext";
import { ThemeContext } from "@/styles/ThemeProvider";
import { RegisterFormState, StateData } from "@/utils/types";
import { reportEvent } from "@/utils/api";
import { REPORT_EVENT_STEPS } from "@/utils/report/eventReporting";
import { RootStackParamList } from "@/components/Navigation";
import { CustomButton } from "@/components/atoms/CustomButton";

interface SuccessMIScreenProps {
  route: {
    params?: {
      state: StateData;
      form: RegisterFormState;
    };
  };
}

type SuccessMIScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "SuccessMI"
>;

export const SuccessMIScreen = ({ route }: SuccessMIScreenProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<SuccessMIScreenNavigation>();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { config } = useUIConfig();

  const params = route.params;
  const [copyNotification, setCopyNotification] = useState("");

  useEffect(() => {
    if (!params?.state) {
      navigation.replace("Home");
    }
  }, [navigation, params]);

  useEffect(() => {
    async function fetchData() {
      const registration_uid =
        (await AsyncStorage.getItem(`registration_uid`)) || "";
      await reportEvent({
        registration_uid,
        partner_id: params?.form.partner_id.toString() || "1",
        step: REPORT_EVENT_STEPS.STEP_5,
        event_name: "MI covr success",
      });
    }
    fetchData();
  }, []);

  if (!params?.state) {
    return null;
  }

  const { state, form } = params;

  const handleLearnAbout = async () => {
    if (state.learn_about_url) {
      Linking.openURL(state.learn_about_url);
    }

    const registration_uid =
      (await AsyncStorage.getItem(`registration_uid`)) || "";
    await reportEvent({
      registration_uid,
      partner_id: form.partner_id.toString(),
      step: REPORT_EVENT_STEPS.EMPTY,
      event_name: "CTA clicked: " + state.learn_about_url,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header text={t("michigan.success_title")} />{" "}
      <View style={styles.bodyWrapper}>
        <Text style={styles.bodyText}>{t("michigan.success_text_1")}</Text>
        <Text style={styles.bodyText}>{t("michigan.success_text_2")}</Text>
        <View style={styles.buttonGroup}>
          <CustomButton
            title={t("michigan.success_button_1")}
            onPress={handleLearnAbout}
          />
          <View style={styles.buttonSpacer} />
          <CustomButton
            title={t("print_form_page.share_fb_button_text")}
            variant="outline-primary"
            onPress={async () => {
              Linking.openURL(config?.share?.registrations?.facebook || "");

              const registration_uid =
                (await AsyncStorage.getItem(`registration_uid`)) || "";
              await reportEvent({
                registration_uid,
                partner_id: form.partner_id.toString(),
                step: REPORT_EVENT_STEPS.EMPTY,
                event_name:
                  "CTA clicked: " + config?.share?.registrations?.facebook,
              });
            }}
          />

          <CustomButton
            title={t("print_form_page.share_x_button_text")}
            variant="outline-primary"
            onPress={async () => {
              Linking.openURL(config?.share?.registrations?.x || "");

              const registration_uid =
                (await AsyncStorage.getItem(`registration_uid`)) || "";
              await reportEvent({
                registration_uid,
                partner_id: form.partner_id.toString(),
                step: REPORT_EVENT_STEPS.EMPTY,
                event_name: "CTA clicked: " + config?.share?.registrations?.x,
              });
            }}
          />

          <CustomButton
            title={t("print_form_page.copy_link")}
            variant="outline-primary"
            onPress={async () => {
              const targetUrl = config?.share?.registrations?.copy_link || "";

              try {
                Clipboard.setString(targetUrl);

                if (Platform.OS === "android") {
                  ToastAndroid.show(
                    t(`pennsylvania.link_copied`),
                    ToastAndroid.SHORT,
                  );
                } else {
                  Alert.alert("Success", t(`pennsylvania.link_copied`));
                }
                setCopyNotification(t(`pennsylvania.link_copied`));

                const registration_uid =
                  (await AsyncStorage.getItem(`registration_uid`)) || "";
                await reportEvent({
                  registration_uid,
                  partner_id: form.partner_id.toString(),
                  step: REPORT_EVENT_STEPS.EMPTY,
                  event_name:
                    "CTA clicked: copy link " +
                    config?.share?.registrations?.copy_link,
                });
              } catch (err) {
                console.error("Failed to copy link:", err);
              }
            }}
          />
          {copyNotification && <Text>{copyNotification}</Text>}

          {/* Footer */}
          <View>
            <View style={styles.divider} />
            <Text style={styles.secondaryText}>
              {t("general.calls_to_action.building_site")}
            </Text>

            <Text>
              <Trans
                i18nKey="general.calls_to_action.get_tool_reg"
                components={{
                  a: (
                    <Text
                      key="email-link"
                      style={styles.linkText}
                      onPress={() =>
                        Linking.openURL("mailto:civictech@rockthevote.org")
                      }
                    >
                      {0}
                    </Text>
                  ),
                }}
              />
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      paddingBottom: 24,
    },
    bodyWrapper: {
      paddingHorizontal: 20,
      marginTop: 16,
    },
    bodyText: {
      fontSize: 16,
      lineHeight: 24,
      marginTop: 16,
    },
    buttonGroup: {
      marginTop: 24,
      display: "flex",
      gap: 10,
    },
    buttonSpacer: {
      height: 12,
    },

    divider: {
      width: "100%",
      height: 1,
      backgroundColor: theme.background,
      marginVertical: 16,
    },
    secondaryText: {
      marginBottom: 8,
    },
    linkText: {
      color: theme.link,
      textDecorationLine: "underline",
    },
  });
