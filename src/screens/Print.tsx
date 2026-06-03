import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  Linking,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import Header from "@/layout/Header";
import { filterRegistrant } from "@/utils/constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/components/organisms/Navigation";
import { requestTokenDoc, requestTokenPDF } from "@/utils/api";
import { ThemeContext } from "@/styles/ThemeProvider";
import { RegisterFormState, StateData } from "@/utils/types";
import { downloadPdf } from "@/utils/downloadFile";

interface PrintScreenProps {
  route: {
    params: {
      form: RegisterFormState;
      state: StateData;
      workflow_type?: string;
      finish_with_state: boolean;
      under_construction?: boolean;
    };
  };
}

type PrintScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Print"
>;

export default function PrintScreen({ route }: PrintScreenProps) {
  const { t } = useTranslation();
  const navigation = useNavigation<PrintScreenNavigation>();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  const { form, state, workflow_type, finish_with_state } = route.params as any;

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    startProcess();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const startProcess = async () => {
    try {
      const cleanRegistrant = filterRegistrant(form);
      const responseToken = await requestTokenPDF({
        registrant: {
          ...cleanRegistrant,
          has_ssn: !state.form.has_no_ssn,
          has_state_license: !state.form.has_no_state_license,
          phone_type: "Mobile",
        },
        workflow_type: workflow_type,
        finish_with_state: finish_with_state,
      });

      if (responseToken.data.status.success && responseToken.data.pdf_token) {
        pollForPdf(responseToken.data.pdf_token);
      } else {
        setError(true);
        setLoading(false);
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError(true);
      setLoading(false);
    }
  };

  const pollForPdf = async (token: string) => {
    const maxAttempts = 10;
    let attempts = 0;

    const checkStatus = async () => {
      if (!isMounted.current) return;
      try {
        const responseDoc = await requestTokenDoc({ pdf_token: token });

        if (responseDoc.data.pdf_ready && responseDoc.data.download_url) {
          setPdfUrl(responseDoc.data.download_url);
          setLoading(false);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkStatus, 2000);
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (err) {
        console.error("Submit error:", err);
        setError(true);
        setLoading(false);
      }
    };
    checkStatus();
  };
  const handleDownload = async () => {
    if (!pdfUrl) return;

    downloadPdf(pdfUrl, "form_placeholder.pdf");
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Header text={t("nvra_form_page.register_in") + `${state.name}`} />
        <Text style={styles.errorText}>
          Something went wrong or page under construction.
        </Text>
        <Button
          title={t("general.restart_test")}
          onPress={() => navigation.navigate("Home" as never)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
            <Button
              title={t("print_form_page.print_button_text")}
              disabled={!pdfUrl}
              onPress={handleDownload}
            />
          )}
        </View>

        {/* Printer */}
        <Text style={styles.title}>
          {t("print_form_page.dont_have_printer")}
        </Text>
        <View style={styles.divider} />
        {/* Learn more */}
        <Text style={styles.title}>
          {t("print_form_page.have_questions_find_out")}
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
          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>
              {t("print_form_page.share_fb_button_text")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>
              {t("print_form_page.share_x_button_text")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>
              {t("print_form_page.copy_link")}
            </Text>
          </TouchableOpacity>
          {/* Footer */}
          <Text style={styles.title}>{t("print_form_page.get_this_tool")}</Text>
        </View>
      </View>
    </View>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1 },
    body: { padding: 10, alignItems: "center" },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
    subtitle: { fontSize: 16, textAlign: "center" },
    bodyText: { fontSize: 18, textAlign: "center", marginVertical: 20 },
    errorText: { color: "red", textAlign: "center", marginVertical: 20 },
    actionArea: { marginVertical: 20, alignItems: "center" },
    footer: { marginTop: "auto" },

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

    divider: {
      width: "100%",
      height: 1,
      backgroundColor: theme.gray,
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
  });
