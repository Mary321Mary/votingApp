import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Linking,
  ScrollView,
  Platform,
  ToastAndroid,
  Alert,
} from "react-native";
import { Trans, useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Clipboard from "@react-native-clipboard/clipboard";

import Header from "@/layout/Header";
import { useUIConfig } from "@/contexts/UIConfigContext";
import { ThemeContext } from "@/styles/ThemeProvider";
import { COLORS } from "@/styles/colors";
import { RootStackParamList } from "@/components/Navigation";
import { CustomButton } from "@/components/atoms/CustomButton";

import {
  filterRegistrant,
  ONBOARDING2_COMPLETED_KEY,
  VOTER_STATE_STORAGE_KEY,
  VOTER_USER_STORAGE_KEY,
} from "@/utils/constants";
import { downloadPdf } from "@/utils/downloadFile";
import { requestNvraFormWithPolling } from "@/utils/nvra-form";
import { INTERNAL_ERRORS } from "@/utils/internal-errors";
import { REPORT_EVENT_STEPS } from "@/utils/report/eventReporting";
import { reportEvent } from "@/utils/api";
import { mapRegisterFormToUserForm } from "@/utils/register/registerRouting";
import { UserData } from "@/utils/types";
import { scheduleMailReminderNotification } from "@/utils/notifications/notificationService";

type PrintScreenProps = NativeStackScreenProps<RootStackParamList, "Print">;

export default function PrintScreen({ route, navigation }: PrintScreenProps) {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { config } = useUIConfig();

  const { form, state, workflow_type, finish_with_state, onboardingFlow } =
    route.params;

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isMounted = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    isMounted.current = true;
    abortControllerRef.current = new AbortController();

    const cleanRegistrant = filterRegistrant(form);
    requestNvraFormWithPolling({
      payload: {
        registrant: {
          ...cleanRegistrant,
          has_ssn: !form.has_no_ssn,
          has_state_license: !form.has_no_state_license,
          phone_type: "Mobile",
        },
        workflow_type: workflow_type ?? "ovr",
        finish_with_state: finish_with_state,
      },
      signal: abortControllerRef.current.signal,
      onError: title => {
        if (isMounted.current) {
          if (title === INTERNAL_ERRORS.GET_NVRA_FORM_TIMEOUT) {
            navigation.replace("ApiError", {
              state,
              title: t("print_form_page.pdf_gen_delayed"),
            });
          } else {
            navigation.replace("ApiError", { state, title });
          }
        }
      },
      onReady: downloadUrl => {
        if (isMounted.current) {
          setPdfUrl(downloadUrl);
          setLoading(false);
        }
      },
    });

    return () => {
      isMounted.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      const registration_uid =
        (await AsyncStorage.getItem(`registration_uid`)) || "";
      await reportEvent({
        registration_uid,
        partner_id: form.partner_id.toString() || "1",
        step: REPORT_EVENT_STEPS.STEP_2,
        event_name: "NVRA print",
      });

      const onboarding2CompletedKey = await AsyncStorage.getItem(
        ONBOARDING2_COMPLETED_KEY,
      );
      if (onboarding2CompletedKey === "true") {
        await AsyncStorage.setItem(
          VOTER_USER_STORAGE_KEY,
          JSON.stringify(mapRegisterFormToUserForm(form)),
        );
      } else {
        await AsyncStorage.setItem(
          VOTER_STATE_STORAGE_KEY,
          JSON.stringify(state),
        );
      }

      const storedUser = await AsyncStorage.getItem(VOTER_USER_STORAGE_KEY);
      if (!storedUser) return;
      const parsedUser = JSON.parse(storedUser);

      const updatedUser: UserData = {
        ...parsedUser,
        email: form.email_address,
        first_name: form.first_name,
        last_name: form.last_name,
        address: form.home_address,
        aptunit: form.home_unit_type + " " + form.home_unit,
        city: form.home_city,
        zip: form.home_zip_code,
        date_of_birth: form.date_of_birth,
        phone: form.phone,

        survey_question_1: form.survey_question_1,
        survey_answer_1: form.survey_answer_1,
        survey_question_2: form.survey_question_2,
        survey_answer_2: form.survey_answer_2,

        opt_in_email: form.opt_in_email,
        opt_in_sms: form.opt_in_sms,
        opt_in_volunteer: form.volunteer,

        registration_status: "pending",
        registration_status_date: new Date().toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        }),
        ovr_status: "nvra_form_provided",
        ovr_status_date: new Date().toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        }),
      };

      await AsyncStorage.setItem(
        VOTER_USER_STORAGE_KEY,
        JSON.stringify(updatedUser),
      );

      if (updatedUser.lookup_status === "catalist_no_match") {
        await scheduleMailReminderNotification(
          t("native_local.notifications.remind_mail_short", {
            firstname: updatedUser.first_name || "Voter",
          }),
          {
            url: pdfUrl || "",
          },
        );
      }
    }
    fetchData();
  }, [form, state, pdfUrl]);

  const handleDownload = async () => {
    if (!pdfUrl) return;

    downloadPdf(pdfUrl, "form_placeholder.pdf");

    const registration_uid =
      (await AsyncStorage.getItem(`registration_uid`)) || "";
    await reportEvent({
      registration_uid,
      partner_id: form.partner_id.toString() || "1",
      step: REPORT_EVENT_STEPS.STEP_5,
      event_name: "NVRA form download",
    });

    const storedUser = await AsyncStorage.getItem(VOTER_USER_STORAGE_KEY);
    if (!storedUser) return;
    const parsedUser = JSON.parse(storedUser);
    await AsyncStorage.setItem(
      VOTER_USER_STORAGE_KEY,
      JSON.stringify({
        ...parsedUser,
        registration_status: "pending",
        registration_status_date: new Date().toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        }),
        ovr_status: "nvra_form_downloaded",
        ovr_status_date: new Date().toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        }),
      }),
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Header text={t("nvra_form_page.register_in") + `${state.name}`} />

      <View style={styles.body}>
        <Text style={styles.title}>
          {t("print_form_page.must_print_sign_mail")}
        </Text>

        {/* Download */}
        <View style={styles.section}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" />
              <Text style={styles.loadingText}>Loading your form...</Text>
            </View>
          ) : (
            <CustomButton
              title={t("print_form_page.print_button_text")}
              disabled={!pdfUrl}
              onPress={handleDownload}
            />
          )}
        </View>

        {/* Printer */}
        <Text>
          <Trans
            i18nKey="print_form_page.dont_have_printer"
            components={{
              strong: <Text style={styles.boldText} />,
            }}
          />
        </Text>
        <View style={styles.divider} />
        {/* Learn more */}
        <Text>
          <Trans
            i18nKey="print_form_page.have_questions_find_out"
            components={{
              strong: <Text style={styles.boldText} />,
            }}
          />
        </Text>

        <View style={styles.section}>
          <CustomButton
            title={t("print_form_page.learn_button_text", {
              state_abbr: form.state,
            })}
            variant="outline-primary"
            onPress={async () => {
              Linking.openURL(state.learn_about_url || "");

              const registration_uid =
                (await AsyncStorage.getItem(`registration_uid`)) || "";
              await reportEvent({
                registration_uid,
                partner_id: form.partner_id.toString(),
                step: REPORT_EVENT_STEPS.EMPTY,
                event_name: "CTA clicked: " + state?.learn_about_url,
              });
            }}
          />
        </View>

        <View style={styles.shareButtons}>
          {onboardingFlow ? (
            <CustomButton
              title={t("register_18_by_election_page.continue_button_text")}
              onPress={async () => {
                const onboarding2CompletedKey = await AsyncStorage.getItem(
                  ONBOARDING2_COMPLETED_KEY,
                );
                if (onboarding2CompletedKey === "true") {
                  navigation.navigate("Dashboard", {});
                } else
                  navigation.navigate("Onboarding2", {
                    form: {
                      ...mapRegisterFormToUserForm(form),
                      opt_in_email: false,
                      opt_in_sms: false,
                    },
                  });
              }}
            />
          ) : (
            <>
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
                    event_name:
                      "CTA clicked: " + config?.share?.registrations?.x,
                  });
                }}
              />
              <CustomButton
                title={t("print_form_page.copy_link")}
                variant="outline-primary"
                onPress={async () => {
                  const targetUrl =
                    config?.share?.registrations?.copy_link || "";

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
            </>
          )}

          {/* Footer */}
          {!onboardingFlow && (
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
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const getStyles = (theme: typeof COLORS) =>
  StyleSheet.create({
    container: { flex: 1 },
    body: { padding: 10 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
    section: { marginVertical: 10 },
    loadingContainer: { flexDirection: "row" },
    loadingText: { marginLeft: 8, fontSize: 16 },
    boldText: { fontWeight: "bold", fontSize: 16 },

    divider: {
      width: "100%",
      height: 1,
      backgroundColor: theme.gray,
      marginVertical: 16,
    },
    shareButtons: { gap: 10 },
    secondaryText: { marginBottom: 8 },
    linkText: { color: theme.link, textDecorationLine: "underline" },
  });
