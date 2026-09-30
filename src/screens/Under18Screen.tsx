import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Linking,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import RenderHTML from "react-native-render-html";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import Header from "@/layout/Header";
import { ThemeContext } from "@/styles/ThemeProvider";
import { RegisterFormState, StateData } from "@/utils/types";
import { reportEvent, setUnder18Reminder } from "@/utils/api";
import { getFlowType } from "@/utils/register/registerRouting";
import { REPORT_EVENT_STEPS } from "@/utils/report/eventReporting";
import { RootStackParamList } from "@/components/Navigation";
import { CustomButton } from "@/components/atoms/CustomButton";

interface Under18ScreenProps {
  route: {
    params: {
      state: StateData;
      form: RegisterFormState;
      workflow_type: string;
      registration_uid: string;
    };
  };
}

type Under18ScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Under18"
>;

export const Under18Screen = ({ route }: Under18ScreenProps) => {
  const { t } = useTranslation();
  const state = route?.params ?? null;
  const navigation = useNavigation<Under18ScreenNavigation>();
  const theme = useContext(ThemeContext);
  const { width } = useWindowDimensions();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { form, registration_uid, state: navState, workflow_type } = state;

  const flowType = getFlowType(navState?.ovr_type || "");
  const electionCenterUrl = `https://www.rockthevote.org/how-to-vote/${navState.name
    ?.toLowerCase()
    ?.replace(/\s+/g, "-")}/`;

  const rawCopy = t(navState?.under_18_page_copy || "", {
    state_name: navState.name,
    state_abbr: navState.abbreviation,
    electionCenter: electionCenterUrl,
  });

  const htmlContent = rawCopy
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>")
    .replace(/<electionCenter>/g, `<a href="${electionCenterUrl}">`)
    .replace(/<\/electionCenter>/g, "</a>");

  const handleContinue = async () => {
    const partnerParams = form.partner_id ? { partner: form.partner_id } : {};

    if (flowType === "ovr_state") {
      if (form.has_no_state_license) {
        navigation.navigate("Register", {
          status: { success: true, errors: [] },
          state: navState,
          zip: form.home_zip_code,
          email: form.email_address,
          form,
          initialStep: 2,
          pageFromLookup: "paper",
          workflowType: "nvra",
          showRedirectText: true,
          voluntaryPaperRedirect: true,
          isRedirectedCompressNVRA: true,
        });
      } else {
        navigation.navigate("Register", {
          ...partnerParams,
          status: { success: true, errors: [] },
          state: navState,
          zip: form.home_zip_code,
          email: form.email_address,
          form,
          initialStep: 2,
        });
      }
    } else if (
      flowType === "connected_PA" ||
      flowType === "connected_CA" ||
      flowType === "connected_WA"
    ) {
      navigation.navigate("Register", {
        ...partnerParams,
        status: { success: true, errors: [] },
        state: navState,
        zip: form.home_zip_code,
        email: form.email_address,
        form,
        initialStep: 2,
      });
    } else if (flowType === "connected_ovr") {
      if (workflow_type === "nvra") {
        if (form.mailForm) {
          navigation.replace("Success", {
            form,
            state: navState,
            workflow_type: workflow_type,
            finish_with_state: false,
          });
        } else {
          navigation.replace("Print", {
            form,
            state: navState,
            workflow_type: workflow_type,
            finish_with_state: false,
          });
        }
      } else {
        navigation.navigate("Register", {
          ...partnerParams,
          status: { success: true, errors: [] },
          state: navState,
          zip: form.home_zip_code,
          email: form.email_address,
          form,
          initialStep: 3,
        });
      }
    } else {
      if (form.mailForm) {
        navigation.replace("Success", {
          form,
          state: navState,
          workflow_type: workflow_type,
          finish_with_state: false,
        });
      } else {
        navigation.replace("Print", {
          form,
          state: navState,
          workflow_type: workflow_type,
          finish_with_state: false,
        });
      }
    }
  };

  const handleReminder = async () => {
    setIsSubmitting(true);
    try {
      await setUnder18Reminder({
        registration_uid,
        remind_when_18: true,
        opt_in_email: form.opt_in_email,
      });
      navigation.navigate("Under18Reminder", { state: navState, form });
    } catch (error) {
      console.error("set_under_18_reminder failed:", error);
      navigation.navigate("ApiError", {
        state: navState,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      await reportEvent({
        registration_uid,
        partner_id: form.partner_id.toString() || "1",
        step: REPORT_EVENT_STEPS.UNDER_18,
        event_name: "under-18 notification",
      });
    }
    fetchData();
  }, []);

  return (
    <View>
      <Header text={t("general.register_in") + navState.name} />
      {navState.under_18_page_copy && (
        <Text style={styles.description}>
          <RenderHTML
            contentWidth={width}
            source={{ html: htmlContent }}
            renderersProps={{
              a: {
                onPress: (_, href) => {
                  if (href) {
                    Linking.openURL(href).catch(err =>
                      console.error("Failed to open URL:", err),
                    );
                  }
                },
              },
            }}
            tagsStyles={{
              body: {
                fontSize: 15,
                color: theme.textPrimary,
                lineHeight: 22,
              },
              a: {
                color: theme.link,
                textDecorationLine: "underline",
                fontWeight: "bold",
              },
              strong: {
                fontWeight: "bold",
                color: theme.textPrimary,
              },
            }}
          />
        </Text>
      )}

      <View style={styles.buttonsContainer}>
        <CustomButton
          title={t("register_18_by_election_page.continue_button_text")}
          onPress={handleContinue}
        />
        <CustomButton
          title={t("register_18_by_election_page.remind_button_text")}
          disabled={isSubmitting}
          onPress={handleReminder}
        />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>
            {`< ${t("general.previous_step")}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  description: {
    fontSize: 14,
    lineHeight: 22,
    margin: 10,
  },
  buttonsContainer: {
    gap: 12,
    margin: 10,
    display: "flex",
    alignItems: "center",
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
