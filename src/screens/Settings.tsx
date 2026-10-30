import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ThemeContext } from "@/styles/ThemeProvider";
import { COLORS } from "@/styles/colors";
import Header from "@/layout/Header";
import i18n from "i18n";
import { UserData } from "@/utils/types";
import { getSurveyQuestions } from "@/utils/api";
import { INITIAL_USER_STATE, VOTER_USER_STORAGE_KEY } from "@/utils/constants";

import { CustomButton } from "../components/atoms/CustomButton";
import { Checkbox } from "../components/atoms/Checkbox";
import InputField from "../components/atoms/InputField";
import { RootStackParamList } from "../components/Navigation";
import LanguageSelector from "../components/atoms/LanguageSelector";

type SettingsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Settings"
>;

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  const [form, setForm] = useState<UserData>(INITIAL_USER_STATE);
  const [loading, setLoading] = useState(true);

  const updateField = (key: string, fieldValue: any) => {
    setForm({ ...form, [key]: fieldValue });
  };

  const handleContinue = async () => {
    await AsyncStorage.setItem(VOTER_USER_STORAGE_KEY, JSON.stringify(form));
    navigation.replace("Dashboard", {});
  };

  useEffect(() => {
    const initData = async () => {
      try {
        const [storedForm, questionsResponse] = await Promise.all([
          AsyncStorage.getItem(VOTER_USER_STORAGE_KEY),
          getSurveyQuestions({
            partner_id: "1",
            locale: i18n.language,
          }).catch(() => null),
        ]);

        let initialForm = storedForm ? JSON.parse(storedForm) : form;

        if (questionsResponse?.data) {
          initialForm = {
            ...initialForm,
            survey_question_1: questionsResponse.data.survey_question_1,
            survey_question_2: questionsResponse.data.survey_question_2,
          };
        }

        setForm(initialForm);
      } catch (error) {
        console.error("Failed to load initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    initData();
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
      <Header text={t("native_local.preferences.title")} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
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
            value={form.opt_in_volunteer}
            onValueChange={(checked: boolean) =>
              updateField("opt_in_volunteer", checked)
            }
          />
        </View>

        <CustomButton
          title={t("register_18_by_election_page.continue_button_text")}
          onPress={handleContinue}
        />
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: typeof COLORS) =>
  StyleSheet.create({
    container: {
      width: "100%",
      flex: 1,
      backgroundColor: theme.white,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    scrollContent: {
      padding: 10,
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
