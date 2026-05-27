import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import InputField from "./InputField";
import i18n from "@/i18n";
import { getSurveyQuestions } from "@/utils/api";
import { RegisterFormState, RegisterFormStateError } from "@/utils/types";
import { ThemeContext } from "@/styles/ThemeProvider";

interface Props {
  value: any;
  errorMessages: any;
  onChange: (value: RegisterFormState) => void;
  onChangeError: (value: RegisterFormStateError) => void;
}

const QuestionsSection = ({
  value,
  errorMessages,
  onChange,
  onChangeError,
}: Props) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getSurveyQuestions({
          partner_id: value.partner_id.toString(),
          locale: i18n.language,
        });
        const data = response.data;
        onChange({
          ...value,
          survey_question_1: data.survey_question_1,
          survey_question_2: data.survey_question_2,
        });
      } catch (err) {
        console.error("Failed to fetch Data configuration:", err);
      }
    };

    fetchQuestions();
  }, []);

  const updateField = <K extends keyof RegisterFormState>(
    key: K,
    fieldValue: RegisterFormState[K],
  ) => {
    onChange({ ...value, [key]: fieldValue });
    if (errorMessages[key].length) {
      onChangeError({
        ...errorMessages,
        [key]: "",
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <Text style={styles.title}>{t("nvra_form_page.questions_for_you")}</Text>

      <View style={styles.fieldWrapper}>
        <InputField
          value={value.survey_answer_1}
          errorMessage={t(errorMessages.survey_question_1)}
          label={value.survey_question_1}
          onChangeText={(text: string) => updateField("survey_answer_1", text)}
        />
      </View>

      <View style={styles.fieldWrapper}>
        <InputField
          value={value.survey_answer_2}
          errorMessage={t(errorMessages.survey_question_2)}
          label={value.survey_question_2}
          onChangeText={(text: string) => updateField("survey_answer_2", text)}
        />
      </View>

      <View style={styles.divider} />
    </View>
  );
};

export default QuestionsSection;

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
    },

    divider: {
      height: 1,
      backgroundColor: theme.gray,
      marginVertical: 16,
    },

    title: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: "600",
      color: "#111827",
      marginBottom: 16,
    },

    fieldWrapper: {
      marginBottom: 16,
    },
  });
