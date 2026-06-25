import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button, Linking, StyleSheet, Text, View } from "react-native";
import { FormProps } from "@/utils/types";
import { ThemeContext } from "@/styles/ThemeProvider";
import QuestionsSection from "../atoms/QuestionsSection";

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

      <QuestionsSection
        value={value}
        errorMessages={errorMessages}
        onChange={onChange}
        onChangeError={onChangeError}
      />

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
