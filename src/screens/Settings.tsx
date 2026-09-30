import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemeContext } from "@/styles/ThemeProvider";
import Header from "@/layout/Header";
import i18n from "i18n";
import { useUIConfig } from "../contexts/UIConfigContext";
import { CheckRegistrationStatus } from "../utils/types";
import { getSurveyQuestions } from "../utils/api";
import { CustomButton } from "../components/atoms/CustomButton";
import { VOTER_FORM_STORAGE_KEY } from "../utils/constants";
import { Checkbox } from "../components/atoms/Checkbox";
import InputField from "../components/atoms/InputField";
import RenderHTML from "react-native-render-html";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { config } = useUIConfig();
  const { width } = useWindowDimensions();

  const [form, setForm] = useState<CheckRegistrationStatus>({
    partner_id: 1,

    first_name: "",
    last_name: "",
    email: "",
    city: "",
    zip: "",

    aptunit: "",
    address: "",
    birthMonth: "",
    birthDay: "",
    birthYear: "",
    date_of_birth: "",
    phone: "",

    opt_in_email: false,
    opt_in_sms: true,
    volunteer: false,

    survey_question_1: "",
    survey_answer_1: "",
    survey_question_2: "",
    survey_answer_2: "",

    prefType1: true,
    prefType2: true,
    prefType3: true,
  });
  const [loading, setLoading] = useState(false);

  const updateField = (key: string, fieldValue: any) => {
    setForm({ ...form, [key]: fieldValue });
  };

  const handleContinue = async () => {
    await AsyncStorage.setItem(VOTER_FORM_STORAGE_KEY, JSON.stringify(form));
    navigation.replace("WelcomeBack");
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [storedForm] = await Promise.all([
          AsyncStorage.getItem(VOTER_FORM_STORAGE_KEY),
        ]);

        if (storedForm) {
          const parsedForm = JSON.parse(storedForm);
          setForm(parsedForm);
        }
      } catch (error) {
        console.error("Failed to load user data from AsyncStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getSurveyQuestions({
          partner_id: "1",
          locale: i18n.language,
        });
        const data = response.data;
        setForm({
          ...form,
          survey_question_1: data.survey_question_1,
          survey_question_2: data.survey_question_2,
        });
      } catch (err) {
        console.error("Failed to fetch Data configuration:", err);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header text={t("native_local.onboarding2.title")} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Subtitle */}
        <Text style={styles.bodyText}>
          {t("native_local.onboarding2.body")}
        </Text>

        {/* ================= BLOCK 1: Communication Preferences ================= */}
        <View>
          <Text style={styles.headerText}>
            {t("native_local.onboarding2.comm_preferences_header")}
          </Text>

          {/* Segment 1 */}
          <Text style={styles.subBodyText}>
            {t("native_local.onboarding2.comm_preferences_body1")}
          </Text>

          <View style={styles.checkboxGroup}>
            <Checkbox
              name="comm_preferences_type1"
              label={t("native_local.onboarding2.comm_preferences_type1")}
              value={form.prefType1}
              onValueChange={() => updateField("prefType1", !form.prefType1)}
            />

            <Checkbox
              name="comm_preferences_type2"
              label={t("native_local.onboarding2.comm_preferences_type2")}
              value={form.prefType2}
              onValueChange={() => updateField("prefType2", !form.prefType2)}
            />

            <Checkbox
              name="comm_preferences_type3"
              label={t("native_local.onboarding2.comm_preferences_type3")}
              value={form.prefType3}
              onValueChange={() => updateField("prefType3", !form.prefType3)}
            />
          </View>

          {/* Segment 2 */}
          <Text style={styles.subBodyText}>
            {t("native_local.onboarding2.comm_preferences_body2")}
          </Text>
        </View>
        <View style={styles.divider} />
        <Text style={styles.title}>
          {t("nvra_form_page.questions_for_you")}
        </Text>

        <InputField
          name="survey_answer_1"
          value={form.survey_answer_1}
          label={form.survey_question_1}
          onChangeText={(text: string) => updateField("survey_answer_1", text)}
        />

        <InputField
          name="survey_answer_2"
          value={form.survey_answer_2}
          label={form.survey_question_2}
          onChangeText={(text: string) => updateField("survey_answer_2", text)}
        />

        <View style={styles.divider} />

        <Checkbox
          name="opt_in_email"
          label={t("general.opt_ins.email_opt_in")}
          value={form.opt_in_email}
          onValueChange={(checked: boolean) =>
            updateField("opt_in_email", checked)
          }
        />

        <Checkbox
          name="opt_in_sms"
          label={t("general.opt_ins.sms_opt_in")}
          value={form.opt_in_sms}
          onValueChange={(checked: boolean) =>
            updateField("opt_in_sms", checked)
          }
        />

        <Checkbox
          name="volunteer"
          label={t("general.opt_ins.volunteer")}
          value={form.volunteer}
          onValueChange={(checked: boolean) =>
            updateField("volunteer", checked)
          }
        />

        <RenderHTML
          contentWidth={width}
          source={{
            html: t("general.opt_ins.sms_disclaimer", {
              rtv_terms_url: config?.urls?.terms,
              rtv_privacy_url: config?.urls?.privacy,
            }),
          }}
          tagsStyles={{
            body: {
              fontSize: 14,
              lineHeight: 18,
              marginVertical: 15,
            },
            a: {
              color: theme.link,
              textDecorationLine: "underline",
            },
          }}
          renderersProps={{
            a: {
              onPress: (_, href) => {
                if (href) {
                  Linking.openURL(href);
                }
              },
            },
          }}
        />

        <CustomButton
          title={t("register_18_by_election_page.continue_button_text")}
          onPress={handleContinue}
        />
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.white,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
    },
    bodyText: {
      fontSize: 16,
      marginBottom: 20,
      lineHeight: 22,
    },
    headerText: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 12,
    },
    subBodyText: {
      fontSize: 14,
      marginBottom: 10,
      lineHeight: 20,
    },
    checkboxGroup: {
      gap: 6,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
    },
    divider: {
      height: 1,
      backgroundColor: theme.gray,
      marginVertical: 16,
    },
  });
