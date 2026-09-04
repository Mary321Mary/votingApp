import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  Linking,
  TouchableOpacity,
  ScrollView,
  Platform,
  ToastAndroid,
  Alert,
} from "react-native";
import { Trans, useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Header from "@/layout/Header";
import { filterRegistrant } from "@/utils/constants";
import { downloadPdf } from "@/utils/downloadFile";
import { RegisterFormState, StateData } from "@/utils/types";
import { ThemeContext } from "@/styles/ThemeProvider";
import { RootStackParamList } from "@/components/organisms/Navigation";
import { requestNvraFormWithPolling } from "@/utils/nvra-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUIConfig } from "@/contexts/UIConfigContext";
import Clipboard from "@react-native-clipboard/clipboard";

interface SuccessScreenProps {
  route: {
    params: {
      form: RegisterFormState;
      state: StateData;
      workflow_type?: string;
      finish_with_state: boolean;
    };
  };
}

type SuccessScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Success"
>;

export default function SuccessScreen({ route }: SuccessScreenProps) {
  const { t } = useTranslation();
  const navigation = useNavigation<SuccessScreenNavigation>();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { config } = useUIConfig();

  const { form, state, workflow_type, finish_with_state } = route.params;
  const hasRouteState = !!(form && state);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copyNotification, setCopyNotification] = useState("");

  const isMounted = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    async function fetchData() {
      isMounted.current = true;
      abortControllerRef.current = new AbortController();

      const cleanRegistrant = filterRegistrant(form);
      const registration_uid = await AsyncStorage.getItem(`registration_uid`);

      requestNvraFormWithPolling({
        payload: {
          registrant: {
            ...cleanRegistrant,
            registration_uid,
            name_suffix: form.suffix,
            has_no_ssn: !!form.has_no_ssn,
            has_no_state_license: !!form.has_no_state_license,
            phone_type: "Mobile",
          },
          workflow_type: workflow_type ?? "ovr",
          finish_with_state: finish_with_state,
        },
        signal: abortControllerRef.current.signal,
        onError: title => {
          if (isMounted.current) {
            navigation.replace("ApiError", { state, title });
          }
        },
        onReady: downloadUrl => {
          if (isMounted.current) {
            setPdfUrl(downloadUrl);
            setLoading(false);
          }
        },
      });
    }
    fetchData();
    return () => {
      isMounted.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleDownload = async () => {
    if (!pdfUrl) return;
    downloadPdf(pdfUrl, "form_placeholder.pdf");
  };

  if (!hasRouteState) {
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>
          {t("print_form_page.pdf_not_supported_in_preview")}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Header text={t("nvra_form_page.register_in") + `${state.name}`} />

      <View style={styles.body}>
        <Text style={styles.title}>{t("mail_form_page.should_receive")}</Text>
        <Text>
          <Trans
            i18nKey="mail_form_page.dont_want_to_wait"
            components={{ strong: <strong /> }}
          />
        </Text>

        <View style={styles.section}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" />
              <Text style={styles.loadingText}>Loading your form...</Text>
            </View>
          ) : (
            <Button
              title={t("mail_form_page.print_button_text")}
              disabled={!pdfUrl}
              onPress={handleDownload}
            />
          )}
        </View>

        {/* Printer */}
        <Text>
          <Trans
            i18nKey="mail_form_page.you_will_need_to_sign"
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
          <Button
            title={t("print_form_page.learn_button_text", {
              state_abbr: form.state,
            })}
            onPress={() => Linking.openURL(state.learn_about_url || "")}
          />
        </View>

        <Text style={styles.title}>{t("print_form_page.encourage")}</Text>

        <View style={styles.shareButtons}>
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() =>
              Linking.openURL(config?.share?.registrations?.facebook || "")
            }
          >
            <Text style={styles.outlineButtonText}>
              {t("print_form_page.share_fb_button_text")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() =>
              Linking.openURL(config?.share?.registrations?.x || "")
            }
          >
            <Text style={styles.outlineButtonText}>
              {t("print_form_page.share_x_button_text")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineButton}
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
              } catch (err) {
                console.error("Failed to copy link:", err);
              }
            }}
          >
            <Text style={styles.outlineButtonText}>
              {t("print_form_page.copy_link")}
            </Text>
          </TouchableOpacity>
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

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1, padding: 20 },
    titleText: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      color: "#212529",
    },

    body: { marginTop: 30, alignItems: "center" },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
    bodyText: { fontSize: 18, textAlign: "center", marginVertical: 20 },
    section: {
      marginVertical: 16,
    },
    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    loadingText: {
      marginLeft: 8,
      fontSize: 16,
    },
    boldText: {
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 16,
      color: "#000",
    },

    divider: {
      width: "100%",
      height: 1,
      backgroundColor: theme.background,
      marginVertical: 16,
    },
    shareButtons: {
      marginTop: 16,
      gap: 12,
    },
    outlineButton: {
      borderWidth: 1,
      borderColor: theme.primary,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    outlineButtonText: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: "600",
    },
    secondaryText: {
      marginBottom: 8,
    },
    linkText: {
      color: theme.link,
      textDecorationLine: "underline",
    },
  });
