import React, { useState, useContext, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import i18n from "i18n";
import { ThemeContext } from "@/styles/ThemeProvider";
import Header from "@/layout/Header";
import { CheckRegistrationStatus } from "@/utils/types";
import { VOTER_FORM_STORAGE_KEY } from "@/utils/constants";
import { getSurveyQuestions } from "@/utils/api";

import { Checkbox } from "@/components/atoms/Checkbox";
import { CustomButton } from "@/components/atoms/CustomButton";
import InputField from "@/components/atoms/InputField";
import { RootStackParamList } from "@/components/Navigation";
import LanguageSelector from "@/components/atoms/LanguageSelector";

type Onboarding2ScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Onboarding2"
>;

export default function Onboarding2Screen({
  route,
  navigation,
}: Onboarding2ScreenProps) {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

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
        routes: [{ name: "Dashboard" }],
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
        </View>

        <View style={styles.divider} />
        {/* Segment 2 */}
        <View>
          <Text style={styles.subBodyText}>
            {t("native_local.onboarding2.comm_preferences_body2")}
          </Text>

          <Checkbox
            name="opt_in_email"
            label={t("native_local.onboarding2.comm_preferences_option_email")}
            value={form.opt_in_email}
            onValueChange={(checked: boolean) =>
              updateField("opt_in_email", checked)
            }
          />

          <Checkbox
            name="opt_in_sms"
            label={t("native_local.onboarding2.comm_preferences_option_sms")}
            value={form.opt_in_sms}
            onValueChange={(checked: boolean) =>
              updateField("opt_in_sms", checked)
            }
          />

          <View style={styles.language_block}>
            <Text style={styles.language_text}>
              {t("native_local.onboarding2.language_pref")}
            </Text>
            <LanguageSelector dropUp />
          </View>
          <View style={styles.divider} />

          <Text style={styles.headerText}>
            {t("native_local.onboarding2.about_you_header")}
          </Text>

          <Text style={styles.title}>
            {t("nvra_form_page.questions_for_you")}
          </Text>

          <InputField
            name="survey_answer_1"
            value={form.survey_answer_1}
            label={form.survey_question_1}
            onChangeText={(text: string) =>
              updateField("survey_answer_1", text)
            }
          />

          <InputField
            name="survey_answer_2"
            value={form.survey_answer_2}
            label={form.survey_question_2}
            onChangeText={(text: string) =>
              updateField("survey_answer_2", text)
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
        </View>

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
      padding: 10,
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
    language_block: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 10,
    },
    language_text: {
      fontSize: 16,
      lineHeight: 22,
    },
  });
