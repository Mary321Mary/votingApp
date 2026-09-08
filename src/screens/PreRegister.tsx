import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Button,
} from "react-native";
import { Trans, useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "@/styles/ThemeProvider";
import Header from "@/layout/Header";
import {
  DataCollectionConfiguration,
  RegisterFormState,
  StateData,
} from "@/utils/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/components/organisms/Navigation";
import { useUIConfig } from "@/contexts/UIConfigContext";
import { getFlowType } from "@/utils/register/registerRouting";
import { reportEvent, setUnder18Reminder } from "@/utils/api";
import { newlinesToBr } from "../utils/stateCopy";
import { REPORT_EVENT_STEPS } from "../utils/report/eventReporting";

interface PreRegisterScreenProps {
  route: {
    params: {
      state: StateData;
      form: RegisterFormState;
      workflow_type: string;
      formCongif: DataCollectionConfiguration;
      registration_uid: string;
    };
  };
}

type PreRegisterScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "PreRegister"
>;

const PRIMARIES_CAUCUSES_URL =
  "https://www.rockthevote.org/how-to-vote/nationwide-voting-info/primaries-and-caucuses/";

export default function PreRegisterScreen({ route }: PreRegisterScreenProps) {
  const { t } = useTranslation();
  const navigation = useNavigation<PreRegisterScreenNavigation>();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { config } = useUIConfig();

  const navState = route?.params ?? null;

  useEffect(() => {
    if (!navState?.state || !navState?.form) {
      navigation.replace("Home");
    }
  }, [navState, navigation]);

  useEffect(() => {
    async function fetchData() {
      await reportEvent({
        registration_uid,
        partner_id: navState?.form.partner_id.toString() || "1",
        step: REPORT_EVENT_STEPS.UNDER_18,
        event_name: "pre-reg notification",
      });
    }
    fetchData();
  }, []);

  if (!navState?.state || !navState?.form) {
    return null;
  }

  const { state, form, workflow_type, formCongif, registration_uid } = navState;

  const preRegCopy =
    state.pre_registration_statement ||
    formCongif?.eligibility?.pre_registration_statement ||
    undefined;

  const electionCenterUrl =
    state.learn_about_url || config?.urls.election_center;
  const primariesUrl = config?.urls.primaries ?? PRIMARIES_CAUCUSES_URL;

  const copyValues = {
    state_abbr: state.abbreviation,
    state_name: state.name,
    min_pre_reg_age: formCongif.eligibility.min_pre_reg_age,
    electionCenter: electionCenterUrl,
    rtv_primaries_url: primariesUrl,
  };

  const openLink = (url?: string) => {
    if (url) {
      Linking.openURL(url).catch(err =>
        console.error("Couldn't load page", err),
      );
    }
  };

  const copyComponents = {
    strong: <Text style={styles.boldText} />,
    br: <Text>{"\n"}</Text>,
    a: <Text style={styles.linkText} onPress={(e: any) => openLink(e?.href)} />,
    electionCenter: (
      <Text
        style={styles.linkText}
        onPress={() => openLink(electionCenterUrl)}
      />
    ),
    primariesLink: (
      <Text style={styles.linkText} onPress={() => openLink(primariesUrl)} />
    ),
  };

  const flowType = getFlowType(state?.ovr_type || "");

  const handleContinue = async () => {
    await setUnder18Reminder({
      registration_uid,
      remind_when_18: true,
      opt_in_email: form.opt_in_email,
    });

    const partnerParams = form.partner_id ? { partner: form.partner_id } : {};

    if (flowType === "ovr_state") {
      if (form.has_no_state_license) {
        navigation.navigate("Register", {
          status: { success: true, errors: [] },
          state,
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
          state,
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
        state,
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
            state,
            workflow_type: workflow_type,
            finish_with_state: false,
          });
        } else {
          navigation.replace("Print", {
            form,
            state,
            workflow_type: workflow_type,
            finish_with_state: false,
          });
        }
      } else {
        navigation.navigate("Register", {
          ...partnerParams,
          status: { success: true, errors: [] },
          state,
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
          state,
          workflow_type: workflow_type,
          finish_with_state: false,
        });
      } else {
        navigation.replace("Print", {
          form,
          state,
          workflow_type: workflow_type,
          finish_with_state: false,
        });
      }
    }
  };

  return (
    <ScrollView>
      <Header text={`${t("general.register_in")} ${state.name}`} />

      <View style={styles.container}>
        {preRegCopy && (
          <View style={styles.copyContainer}>
            <Text style={styles.copyText}>
              <Trans
                defaults={newlinesToBr(preRegCopy)}
                values={copyValues}
                components={copyComponents}
              />
            </Text>
          </View>
        )}

        <View style={styles.actionsContainer}>
          <Button
            title={t("pre_register_page.continue_button_text")}
            onPress={handleContinue}
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
    </ScrollView>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      padding: 16,
    },
    copyContainer: {
      marginVertical: 12,
    },
    copyText: {
      fontSize: 15,
      lineHeight: 22,
    },
    boldText: {
      fontWeight: "bold",
    },
    linkText: {
      color: theme.link,
      textDecorationLine: "underline",
    },
    mt3: {
      marginTop: 16,
    },
    actionsContainer: {
      alignItems: "center",
      gap: 16,
      marginVertical: 16,
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
