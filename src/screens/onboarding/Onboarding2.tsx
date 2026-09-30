import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  useWindowDimensions,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemeContext } from "@/styles/ThemeProvider";
import Header from "@/layout/Header";
import { CheckRegistrationStatus } from "../../utils/types";
import { VOTER_FORM_STORAGE_KEY } from "../../utils/constants";
import { Checkbox } from "../../components/atoms/Checkbox";
import { CustomButton } from "../../components/atoms/CustomButton";
import RenderHTML from "react-native-render-html";
import InputField from "../../components/atoms/InputField";
import { useUIConfig } from "../../contexts/UIConfigContext";
import { getSurveyQuestions } from "../../utils/api";
import i18n from "i18n";

type RouteParams = {
  form: CheckRegistrationStatus;
};

type Onboarding2RouteProp = RouteProp<
  { Onboarding2: RouteParams },
  "Onboarding2"
>;

export default function Onboarding2Screen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<Onboarding2RouteProp>();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { config } = useUIConfig();
  const { width } = useWindowDimensions();

  const initialForm: CheckRegistrationStatus = route.params?.form || {};
  const [form, setForm] = useState<CheckRegistrationStatus>(initialForm);

  const updateField = (key: string, fieldValue: any) => {
    setForm({ ...form, [key]: fieldValue });
  };

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem(VOTER_FORM_STORAGE_KEY, JSON.stringify(form));

      navigation.reset({
        index: 0,
        routes: [{ name: "WelcomeBack" }],
      });
    } catch (error) {
      console.error("Failed to save final onboarding data:", error);
    }
  };

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

        <CustomButton title="Finish" onPress={handleFinish} />
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
