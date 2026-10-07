import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, Linking, ScrollView } from "react-native";
import { Trans, useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ThemeContext } from "@/styles/ThemeProvider";
import Header from "@/layout/Header";
import { REPORT_EVENT_STEPS } from "@/utils/report/eventReporting";
import { reportEvent, submitEmailZip } from "@/utils/api";
import i18n from "@/i18n";
import { RootStackParamList } from "@/components/Navigation";
import { CustomButton } from "@/components/atoms/CustomButton";

type LookupNotFoundScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "LookupNotFound"
>;

export default function LookupNotFoundScreen({
  route,
  navigation,
}: LookupNotFoundScreenProps) {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { state, form } = route.params;

  const handleOpenLink = async () => {
    const url = state?.online_status_check_url;

    if (url) {
      await Linking.openURL(url);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const registration_uid =
        (await AsyncStorage.getItem(`registration_uid`)) || "";
      await reportEvent({
        registration_uid,
        partner_id: form.partner_id.toString() || "1",
        step: REPORT_EVENT_STEPS.EMPTY,
        event_name: "Voter Lookup no found",
      });
    }
    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Header
        text={t("lookup_not_found_page.failure_title", {
          state_abbr: state?.abbreviation,
        })}
      />
      <View style={styles.content}>
        <Text style={styles.header}>
          {form?.first_name}
          {t("lookup_not_found_page.failure_statement")}
        </Text>
        <Text>{t("lookup_not_found_page.failure_body")}</Text>
        <View style={styles.list}>
          {/* Item 1 */}
          <View style={styles.listItem}>
            <Text style={styles.number}>1.</Text>

            <Text style={styles.textLi}>
              <Trans
                i18nKey="lookup_not_found_page.failure_body1"
                components={{
                  strong: <Text style={styles.bold} />,
                }}
              />{" "}
              {t("lookup_not_found_page.failure_body1a")}{" "}
              <Text style={styles.bold}>{state?.recent_register_date}</Text>{" "}
              {t("lookup_not_found_page.failure_body1b")}
              <Text style={styles.link} onPress={handleOpenLink}>
                {t("lookup_not_found_page.failure_body1_url_text", {
                  state_abbr: state?.abbreviation,
                })}
              </Text>
            </Text>
          </View>

          {/* Item 2 */}
          <View style={styles.listItem}>
            <Text style={styles.number}>2.</Text>

            <Text style={styles.textLi}>
              {t("lookup_not_found_page.failure_body2")}
            </Text>
          </View>

          {/* Item 3 */}
          <View style={styles.listItem}>
            <Text style={styles.number}>3.</Text>

            <Text style={styles.textLi}>
              {t("lookup_not_found_page.failure_body3")}
            </Text>
          </View>
        </View>
        {state.ovr_type !== "not_participating" && (
          <CustomButton
            title={t("lookup_not_found_page.cta_register")}
            onPress={async () => {
              const response = await submitEmailZip({
                email: form.email,
                zip: form.zip,
                locale: i18n.language,
                partner_id: form.partner_id.toString(),
              });
              await AsyncStorage.setItem(
                "registration_uid",
                response.data.registration_uid,
              );

              await reportEvent({
                registration_uid: response.data.registration_uid ?? "",
                partner_id: form.partner_id.toString() || "1",
                step: REPORT_EVENT_STEPS.STEP_1,
                event_name: "redirect from lookup to OV",
              });

              navigation.replace("Register", {
                status: { success: true, errors: [] },
                state,
                zip: form.zip,
                email: form.email,
                form: form as any,
                pageFromLookup: "paper",
                workflowType: "nvra",
                showRedirectText: false,
                onboardingFlow: true,
              });
            }}
          />
        )}
        <CustomButton
          title={t("lookup_not_found_page.cta_try_again")}
          variant="outline-primary"
          onPress={() =>
            navigation.replace("CheckVoterStatus", {
              form,
              afterNotFound: true,
            })
          }
        />
      </View>
    </ScrollView>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.white,
    },

    content: {
      padding: 10,
      maxWidth: "100%",
      gap: 12,
    },
    header: {
      marginRight: 10,
      fontSize: 15,
      lineHeight: 22,
      fontWeight: "bold",
    },

    text: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 16,
      fontWeight: "regular",
      lineHeight: 22,
      color: theme.textPrimary,
      textTransform: "uppercase",
    },
    bold: {
      fontWeight: "bold",
    },
    divider: {
      height: 1,
      backgroundColor: theme.gray,
      marginVertical: 5,
    },
    list: {},
    listItem: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    number: {
      width: 20,
      fontSize: 14,
      lineHeight: 18,
    },
    textLi: {
      marginRight: 10,
      fontSize: 12,
      lineHeight: 16,
    },
    link: {
      color: theme.link,
      fontSize: 12,
      lineHeight: 16,
      textDecorationLine: "underline",
    },
  });
