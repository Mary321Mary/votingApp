import React, { useEffect, useRef, useState, useContext } from "react";
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
import { RegisterFormState, StateData } from "@/utils/types";
import { ThemeContext } from "@/styles/ThemeProvider";
import { downloadPdf } from "@/utils/downloadFile";
import { requestNvraFormWithPolling } from "@/utils/nvra-form";

interface PrintScreenProps {
  route: {
    params: {
      form: RegisterFormState;
      state: StateData;
      workflow_type?: string;
      finish_with_state: boolean;
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

  const { form, state, workflow_type, finish_with_state } = route.params;

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

    return () => {
      isMounted.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleDownload = async () => {
    if (!pdfUrl) return;

    downloadPdf(pdfUrl, "form_placeholder.pdf");
  };

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
