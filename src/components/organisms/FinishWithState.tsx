import { FormProps, RegisterFormState } from "@/utils/types";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button, Linking, StyleSheet, Text, View } from "react-native";
import InputField from "../atoms/InputField";
import { ThemeContext } from "@/styles/ThemeProvider";

function FinishWithState({
  state,
  value,
  errorMessages,
  onChangeError,
  onChange,
  handleMainButton,
}: FormProps) {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

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

  const handleOpenStateWebsite = async () => {
    const url = state.online_registration_system_url || "";
    if (!url) return;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.notice}>
        {t("finish_with_state_page2.notice", {
          state_abbr: state.abbreviation,
        })}
      </Text>

      <Text style={styles.description}>
        {t("finish_with_state_page2.notice2")}
      </Text>

      <Text style={styles.questionLabel}>
        {t("finish_with_state_page2.question_label")}
      </Text>

      <View style={styles.inputs}>
        <InputField
          value={value.survey_answer_1}
          errorMessage={t(errorMessages.survey_question_1)}
          label={value.survey_question_1}
          onChangeText={(text: string) => updateField("survey_answer_1", text)}
        />

        <InputField
          value={value.survey_answer_2}
          errorMessage={t(errorMessages.survey_question_2)}
          label={value.survey_question_2}
          onChangeText={(text: string) => updateField("survey_answer_2", text)}
        />
      </View>

      <View style={styles.buttons}>
        <Button
          title={t("finish_with_state_page2.state_button", {
            state_abbr: state.abbreviation,
          })}
          onPress={handleOpenStateWebsite}
        />

        {handleMainButton}
      </View>
    </View>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
    },

    notice: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "700",
      color: theme.textColor,
      marginBottom: 16,
    },

    description: {
      fontSize: 14,
      lineHeight: 22,
      color: theme.textColor,
      marginBottom: 20,
    },

    questionLabel: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: "700",
      color: theme.textColor,
      marginBottom: 16,
    },

    inputs: {
      gap: 16,
      marginBottom: 32,
    },

    buttons: {
      gap: 16,
      alignItems: "center",
    },
  });

export default FinishWithState;
