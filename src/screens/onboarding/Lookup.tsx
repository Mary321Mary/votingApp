import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Linking,
  ScrollView,
} from "react-native";
import { Trans, useTranslation } from "react-i18next";
import RenderHTML from "react-native-render-html";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InAppBrowser } from "react-native-inappbrowser-reborn";

import { ThemeContext } from "@/styles/ThemeProvider";
import Header from "@/layout/Header";
import { reportEvent, submitEmailZip } from "@/utils/api";
import { REPORT_EVENT_STEPS } from "@/utils/report/eventReporting";
import i18n from "@/i18n";
import { useUIConfig } from "@/contexts/UIConfigContext";
import { RootStackParamList } from "@/components/Navigation";
import { CustomButton } from "@/components/atoms/CustomButton";

type LookupScreenProps = NativeStackScreenProps<RootStackParamList, "Lookup">;

export default function LookupScreen({ route, navigation }: LookupScreenProps) {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { width } = useWindowDimensions();
  const { state, form } = route.params;
  const { config } = useUIConfig();

  const handleOpenLink = async () => {
    const url = state?.online_registration_system_url;

    if (url) {
      await Linking.openURL(url);
    }
  };

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

  useEffect(() => {
    async function fetchData() {
      const registration_uid =
        (await AsyncStorage.getItem(`registration_uid`)) || "";
      await reportEvent({
        registration_uid,
        partner_id: form.partner_id.toString(),
        step: REPORT_EVENT_STEPS.STEP_5,
        event_name: "Voter Lookup success",
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
        <Text>
          <RenderHTML
            contentWidth={width}
            source={{
              html: t("lookup_success_page.success_statement", {
                user_first_name: form.first_name,
              }),
            }}
            tagsStyles={{
              body: {
                fontSize: 14,
                lineHeight: 18,
                marginVertical: 5,
              },
              strong: {
                fontWeight: "bold",
              },
              br: { height: 1 },
            }}
          />
        </Text>
        <Text style={styles.text}>
          {form.first_name} {form.last_name}
        </Text>
        <Text style={styles.text}>{form.address}</Text>
        <Text style={styles.text}>
          {form.city}, {state?.abbreviation} {form.zip}
        </Text>
        <Text style={styles.textLi}>
          {t("lookup_success_page.birth_date")}
          {new Date(
            Number(form.birthYear),
            Number(form.birthMonth) - 1,
            Number(form.birthDay),
          ).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
        <Text style={styles.textLi}>
          {t("lookup_success_page.voter_status")}
        </Text>
        <Text>
          <RenderHTML
            contentWidth={width}
            source={{
              html: t("lookup_success_page.success_question"),
            }}
            tagsStyles={{
              body: {
                fontSize: 14,
                lineHeight: 18,
                marginVertical: 5,
              },
              strong: {
                fontWeight: "bold",
              },
              br: { height: 1 },
            }}
          />
        </Text>
        <CustomButton
          title={t("lookup_success_page.cta_learn_about", {
            state_abbr: state?.abbreviation,
          })}
          onPress={async () => {
            const url = state?.learn_about_url || "";
            if (url) openInAppUrl(url);

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
              step: REPORT_EVENT_STEPS.EMPTY,
              event_name: "CTA clicked: " + url,
            });
          }}
        />
        <CustomButton
          title={t("general.calls_to_action.request_absentee_ballot")}
          variant="outline-primary"
          onPress={async () => {
            const url = config?.urls.abr_tool || "";
            if (url) openInAppUrl(url);
          }}
        />
        <CustomButton
          title={t("register_18_by_election_page.continue_button_text")}
          onPress={() =>
            navigation.navigate("Onboarding2", {
              form,
            })
          }
        />
        <Text style={styles.bold}>
          {t("lookup_success_page.something_wrong")}
        </Text>
        <View style={styles.divider} />
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
              />
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
            variant="outline-primary"
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
                status: { success: true },
                state,
                zip: form.zip,
                email: form.email,
                form,
                pageFromLookup: "paper",
                workflowType: "nvra",
                showRedirectText: false,
              } as any);
            }}
          />
        )}
        <CustomButton
          title={t("lookup_not_found_page.cta_try_again")}
          variant="outline-primary"
          onPress={() => navigation.goBack()}
        />
        {/* <View style={styles.divider} />
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
        </Text> */}
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
      paddingHorizontal: 10,
      paddingBottom: 20,
      maxWidth: "100%",
      gap: 12,
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
    list: {
      gap: 16,
    },
    listItem: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    number: {
      width: 24,
      fontSize: 16,
    },
    textLi: {
      marginRight: 10,
      fontSize: 15,
      lineHeight: 22,
    },
    link: {
      color: theme.link,
      fontSize: 15,
      textDecorationLine: "underline",
    },
  });
