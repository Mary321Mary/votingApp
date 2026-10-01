import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Linking,
  useWindowDimensions,
  Platform,
  ToastAndroid,
  Alert,
} from "react-native";
import { Trans, useTranslation } from "react-i18next";
import RenderHTML from "react-native-render-html";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Clipboard from "@react-native-clipboard/clipboard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import Header from "@/layout/Header";
import { ThemeContext } from "@/styles/ThemeProvider";
import { useUIConfig } from "@/contexts/UIConfigContext";
import { reportEvent } from "@/utils/api";
import { REPORT_EVENT_STEPS } from "@/utils/report/eventReporting";
import { CustomButton } from "@/components/atoms/CustomButton";
import { RootStackParamList } from "@/components/Navigation";

type Under18ReminderProps = NativeStackScreenProps<
  RootStackParamList,
  "Under18Reminder"
>;

export default function Under18ReminderScreen({
  route,
  navigation,
}: Under18ReminderProps) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { config } = useUIConfig();

  const navState = route.params;
  const [copyNotification, setCopyNotification] = useState("");

  useEffect(() => {
    if (!navState?.state || !navState?.form) {
      navigation.replace("Home");
    }
  }, [navState, navigation]);

  const { state, form } = navState;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Header text={`${t("general.register_in")}${state.name}`} />

        <View style={styles.content}>
          <Text style={styles.notificationText}>
            {t("register_18_by_election_page.reminder_success")}
          </Text>

          <View style={styles.divider} />

          <RenderHTML
            contentWidth={width}
            source={{ html: t("print_form_page.have_questions_find_out") }}
            tagsStyles={htmlTagsStyles}
          />
          <View style={styles.buttonWrapper}>
            <CustomButton
              title={t("print_form_page.learn_button_text", {
                state_abbr: form.state,
              })}
              onPress={async () => {
                if (state.learn_about_url)
                  Linking.openURL(state.learn_about_url);

                const registration_uid =
                  (await AsyncStorage.getItem("registration_uid")) || "";
                await reportEvent({
                  registration_uid,
                  partner_id: navState.form.partner_id.toString(),
                  step: REPORT_EVENT_STEPS.EMPTY,
                  event_name: "CTA clicked: " + state.learn_about_url,
                });
              }}
            />
          </View>
          <Text style={styles.boldText}>{t("print_form_page.encourage")}</Text>
          <View style={styles.shareButtonsGroup}>
            <CustomButton
              title={t("print_form_page.share_fb_button_text", {
                state_abbr: form.state,
              })}
              onPress={async () => {
                Linking.openURL(config?.share?.registrations?.facebook || "");

                const registration_uid =
                  (await AsyncStorage.getItem("registration_uid")) || "";
                await reportEvent({
                  registration_uid,
                  partner_id: navState.form.partner_id.toString(),
                  step: REPORT_EVENT_STEPS.EMPTY,
                  event_name:
                    "CTA clicked: " + config?.share?.registrations?.facebook,
                });
              }}
            />
            <CustomButton
              title={t("print_form_page.share_x_button_text", {
                state_abbr: form.state,
              })}
              onPress={async () => {
                Linking.openURL(config?.share?.registrations?.x || "");

                const registration_uid =
                  (await AsyncStorage.getItem("registration_uid")) || "";
                await reportEvent({
                  registration_uid,
                  partner_id: navState.form.partner_id.toString(),
                  step: REPORT_EVENT_STEPS.EMPTY,
                  event_name: "CTA clicked: " + config?.share?.registrations?.x,
                });
              }}
            />
            <CustomButton
              title={t("print_form_page.copy_link", { state_abbr: form.state })}
              onPress={async () => {
                try {
                  Clipboard.setString(
                    config?.share?.registrations?.copy_link || "",
                  );

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
                    (await AsyncStorage.getItem("registration_uid")) || "";
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
          </View>
          <View style={styles.footerBlock}>
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
                      onPress={() => {
                        Linking.openURL("mailto:civictech@rockthevote.org");
                      }}
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
}

const htmlTagsStyles = {
  p: {
    margin: 0,
    padding: 0,
    fontSize: 14,
    color: "#333333",
    textAlign: "center" as const,
    lineHeight: 20,
  },
  strong: {
    fontWeight: "bold" as const,
    color: "#000000",
  },
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    scrollContainer: {
      justifyContent: "center",
    },
    container: {
      flex: 1,
      alignSelf: "center",
      width: "100%",
    },
    content: {
      marginHorizontal: 10,
      alignItems: "center",
    },
    notificationText: {
      fontSize: 16,
      textAlign: "center",
      color: theme.textPrimary,
      marginVertical: 16,
      lineHeight: 22,
    },
    divider: {
      width: "100%",
      height: 1,
      backgroundColor: theme.gray,
      marginVertical: 16,
    },
    buttonWrapper: {
      width: "100%",
      marginVertical: 16,
      alignItems: "center",
    },
    boldText: {
      fontSize: 15,
      fontWeight: "bold",
      color: theme.textPrimary,
      textAlign: "center",
      marginBottom: 8,
    },
    shareButtonsGroup: {
      width: "100%",
      alignItems: "center",
      gap: 10,
      marginVertical: 16,
    },

    footerBlock: {
      alignItems: "center",
      gap: 4,
      marginTop: 16,
      width: "100%",
    },
    secondaryText: {
      marginBottom: 8,
    },
    linkText: {
      color: theme.link,
      textDecorationLine: "underline",
    },
  });
