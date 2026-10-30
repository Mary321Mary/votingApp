import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  VOTER_USER_STORAGE_KEY,
  VOTER_STATE_STORAGE_KEY,
} from "@/utils/constants";
import { UserData, StateData } from "@/utils/types";
import { cancelMailReminderNotification } from "@/utils/notifications/notificationService";
import { useTranslation } from "react-i18next";
import { COLORS } from "@/styles/colors";
import { ThemeContext } from "@/styles/ThemeProvider";
import { Checkbox } from "../../atoms/Checkbox";

export function MailReminderModal(route: { pdfUrl?: string }) {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  const [voter, setVoter] = useState<UserData | null>(null);
  const [stateData, setStateData] = useState<StateData | null>(null);
  const [previousOvrState, setPreviousOvrState] = useState<{
    status: string;
    date: string;
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [storedUser, storedState] = await Promise.all([
        AsyncStorage.getItem(VOTER_USER_STORAGE_KEY),
        AsyncStorage.getItem(VOTER_STATE_STORAGE_KEY),
      ]);

      if (storedUser) {
        const parsedUser: UserData = JSON.parse(storedUser);
        setVoter(parsedUser);
        setPreviousOvrState({
          status: parsedUser.ovr_status || "",
          date: parsedUser.ovr_status_date || "",
        });
      }

      if (storedState) {
        setStateData(JSON.parse(storedState));
      }
    };

    loadData();
  }, []);

  const handleSliderChange = async (value: boolean) => {
    if (!voter) return;

    const today = new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

    let updatedUser: UserData;

    if (value) {
      updatedUser = {
        ...voter,
        ovr_status: "nvra_form_mailed",
        ovr_status_date: today,
      };
      await cancelMailReminderNotification();
    } else {
      updatedUser = {
        ...voter,
        ovr_status: previousOvrState?.status || "nvra_form_provided",
        ovr_status_date: previousOvrState?.date || today,
      };
    }

    setVoter(updatedUser);
    await AsyncStorage.setItem(
      VOTER_USER_STORAGE_KEY,
      JSON.stringify(updatedUser),
    );
  };

  const firstName = voter?.first_name || "Voter";
  const pdfUrl = route?.pdfUrl || "";
  const sosPhone = stateData?.sos_phone || "your Secretary of State";
  const sosUrl = stateData?.sos_url || "";

  const handleOpenPdf = () => {
    if (pdfUrl) {
      Linking.openURL(pdfUrl).catch(err =>
        console.error("Could not open PDF URL", err),
      );
    }
  };

  const handleOpenSosUrl = () => {
    if (sosUrl) {
      const formattedUrl = sosUrl.startsWith("http")
        ? sosUrl
        : `https://${sosUrl}`;
      Linking.openURL(formattedUrl).catch(err =>
        console.error("Could not open SOS URL", err),
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.modalScrollContent}>
      <Text style={styles.text}>
        {firstName} Thanks for completing your voter registration application!
        But you are not registered until you have turned in your form to your
        election officials. If you haven’t done so already, you must PRINT,
        SIGN, STAMP, and MAIL your form to the address provided on the form. If
        you have not already done so, please download your application form.
      </Text>

      {!!pdfUrl && (
        <TouchableOpacity onPress={handleOpenPdf} style={styles.linkContainer}>
          <Text style={styles.linkText}>
            Download your application form (PDF)
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.linkContainer}>
        <Text style={styles.text}>
          If you have already mailed in your form, please tap below to stop
          receiving reminders.
        </Text>
      </View>

      <Text style={styles.text}>
        After mailing your form, you should receive confirmation of your
        registration from your election officials. Sometimes processing can take
        several weeks. If you want to check on the status of your voter
        registration application, call your Secretary of State at{" "}
        <Text style={styles.boldText}>{sosPhone}</Text>
        {sosUrl ? (
          <>
            , or check online at{" "}
            <Text style={styles.linkText} onPress={handleOpenSosUrl}>
              {sosUrl}
            </Text>
            .
          </>
        ) : (
          "."
        )}
      </Text>

      <View style={styles.sliderRow}>
        <Checkbox
          name="mailed_form"
          label={t("native_local.notifications.mailed_form")}
          value={voter?.ovr_status === "nvra_form_mailed"}
          onValueChange={handleSliderChange}
        />
      </View>
    </ScrollView>
  );
}

const getStyles = (theme: typeof COLORS) =>
  StyleSheet.create({
    content: {
      padding: 10,
    },
    modalScrollContent: { paddingBottom: 20 },
    text: {
      fontSize: 15,
      lineHeight: 22,
      color: theme.textPrimary,
    },
    boldText: {
      fontWeight: "bold",
    },
    linkContainer: {
      marginVertical: 10,
    },
    linkText: {
      fontSize: 15,
      color: theme.primary,
      textDecorationLine: "underline",
      fontWeight: "600",
    },
    sliderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: "#E0E0E0",
    },
    sliderLabel: {
      flex: 1,
      fontSize: 14,
      fontWeight: "600",
      color: "#111111",
      marginRight: 10,
    },
  });
