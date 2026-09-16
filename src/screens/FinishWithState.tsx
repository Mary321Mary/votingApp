import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  Dimensions,
  Platform,
  ToastAndroid,
  Alert,
} from "react-native";
import { Trans, useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Clipboard from "@react-native-clipboard/clipboard";

import Header from "@/layout/Header";
import { RegisterFormState, StateData } from "@/utils/types";
import { useUIConfig } from "@/contexts/UIConfigContext";
import { reportEvent } from "@/utils/api";
import { REPORT_EVENT_STEPS } from "@/utils/report/eventReporting";
import { ThemeContext } from "../styles/ThemeProvider";
import { CustomButton } from "@/components/atoms/CustomButton";

const { width } = Dimensions.get("window");

interface FinishWithStateScreenProps {
  route: {
    params: {
      state: StateData;
      form: RegisterFormState;
    };
  };
}

const FinishWithStateScreen = ({ route }: FinishWithStateScreenProps) => {
  const { t } = useTranslation();
  const { config } = useUIConfig();
  const navState = route?.params ?? null;
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  const [copyNotification, setCopyNotification] = useState("");

  const handleOpenUrl = async () => {
    const targetUrl =
      navState.state?.learn_about_url ||
      navState.state?.online_registration_system_url;
    if (targetUrl) {
      const supported = await Linking.canOpenURL(targetUrl);
      if (supported) {
        await Linking.openURL(targetUrl);

        const registration_uid =
          (await AsyncStorage.getItem("registration_uid")) || "";
        await reportEvent({
          registration_uid,
          partner_id: navState.form.partner_id.toString(),
          step: REPORT_EVENT_STEPS.EMPTY,
          event_name: "CTA clicked: " + targetUrl,
        });
      } else {
        console.warn(`Cannot open URL: ${targetUrl}`);
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      Clipboard.setString(config?.share?.registrations?.copy_link || "");

      if (Platform.OS === "android") {
        ToastAndroid.show(t(`pennsylvania.link_copied`), ToastAndroid.SHORT);
      } else {
        Alert.alert("Success", t(`pennsylvania.link_copied`));
      }
      setCopyNotification(t(`pennsylvania.link_copied`));

      const registration_uid =
        (await AsyncStorage.getItem("registration_uid")) || "";
      await reportEvent({
        registration_uid,
        partner_id: navState.form.partner_id.toString(),
        step: REPORT_EVENT_STEPS.EMPTY,
        event_name:
          "CTA clicked: copy link " + config?.share?.registrations?.copy_link,
      });
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const registration_uid =
        (await AsyncStorage.getItem("registration_uid")) || "";
      await reportEvent({
        registration_uid,
        partner_id: navState.form.partner_id.toString() || "1",
        step: REPORT_EVENT_STEPS.STEP_5,
        event_name: "finish with state selected",
      });
    }
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Header
        text={`${t("general.register_in")} ${navState.state?.name || ""}`}
      />

      <View style={styles.content}>
        <Text>
          <Trans
            i18nKey="finish_with_state_page3.not_registered_yet"
            values={{ state_abbr: navState.state.abbreviation }}
            components={{
              strong: <Text style={styles.boldText} />,
            }}
          />
        </Text>

        <View style={styles.divider} />

        <Text>
          <Trans
            i18nKey="finish_with_state_page3.have_questions"
            components={{
              strong: <Text style={styles.boldText} />,
            }}
          />
        </Text>

        <CustomButton
          title={t("finish_with_state_page3.learn_about_button_text", {
            state_abbr: navState.state?.abbreviation,
          })}
          onPress={handleOpenUrl}
        />

        <Text style={[styles.boldText, styles.textCenter]}>
          {t("finish_with_state_page3.encourage")}
        </Text>

        <View style={styles.shareContainer}>
          <CustomButton
            title={t("finish_with_state_page3.fb_button_text")}
            onPress={async () => {
              const targetUrl = config?.share?.registrations?.facebook || "";
              const supported = await Linking.canOpenURL(targetUrl);
              if (supported) {
                await Linking.openURL(targetUrl);

                const registration_uid =
                  (await AsyncStorage.getItem("registration_uid")) || "";
                await reportEvent({
                  registration_uid,
                  partner_id: navState.form.partner_id.toString(),
                  step: REPORT_EVENT_STEPS.EMPTY,
                  event_name:
                    "CTA clicked: " + config?.share?.registrations?.facebook,
                });
              } else {
                console.warn(`Cannot open URL: ${targetUrl}`);
              }
            }}
          />
          <CustomButton
            title={t("finish_with_state_page3.x_button_text")}
            onPress={async () => {
              const targetUrl = config?.share?.registrations?.x || "";
              const supported = await Linking.canOpenURL(targetUrl);
              if (supported) {
                await Linking.openURL(targetUrl);

                const registration_uid =
                  (await AsyncStorage.getItem("registration_uid")) || "";
                await reportEvent({
                  registration_uid,
                  partner_id: navState.form.partner_id.toString(),
                  step: REPORT_EVENT_STEPS.EMPTY,
                  event_name: "CTA clicked: " + config?.share?.registrations?.x,
                });
              } else {
                console.warn(`Cannot open URL: ${targetUrl}`);
              }
            }}
          />
          <CustomButton
            title={t("finish_with_state_page3.copy_button_text")}
            onPress={handleCopyLink}
          />
        </View>
        {copyNotification && <Text>{copyNotification}</Text>}

        <View style={styles.footerInfo}>
          <Text style={styles.boldText}>
            {t("finish_with_state_page3.get this")}
          </Text>
          <Text style={styles.textCenter}>
            {t("finish_with_state_page3.send us").replace(/<[^>]*>/g, "")}
          </Text>
        </View>
      </View>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      paddingVertical: 15,
      alignSelf: "center",
      width: "100%",
      maxWidth: 600,
    },
    divider: {
      height: 1,
      backgroundColor: theme.gray,
      marginVertical: 16,
    },
    content: {
      flexDirection: "column",
      alignItems: "center",
      gap: 24,
      marginTop: 15,
      marginHorizontal: 10,
    },
    textCenter: {
      textAlign: "center",
      fontSize: 16,
      color: "#333",
    },
    boldText: {
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 16,
      color: "#000",
    },
    shareContainer: {
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
      width: width * 0.75,
    },
    footerInfo: {
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
    },
  });

export default FinishWithStateScreen;
