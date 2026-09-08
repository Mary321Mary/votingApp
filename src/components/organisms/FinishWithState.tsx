import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FormProps } from "@/utils/types";
import { ThemeContext } from "@/styles/ThemeProvider";
import QuestionsSection from "../atoms/QuestionsSection";
import { useNavigation } from "@react-navigation/native";
import { RegisterScreenNavigation } from "./RegisterResult/RegisterResult";
import { allowsPaperFallback } from "../../utils/register/registerRouting";

interface FinishWithStateProps extends FormProps {
  handleMainButtonClick: () => void;
}

function FinishWithState({
  state,
  value,
  errorMessages,
  onChangeError,
  onChange,
  handleMainButtonClick,
}: FinishWithStateProps) {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<RegisterScreenNavigation>();

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
          onPress={handleMainButtonClick}
        />
        {allowsPaperFallback(state) && (
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() =>
              navigation.navigate("Register", {
                status: { success: true, errors: [] },
                state,
                zip: value.home_zip_code,
                email: value.email_address,
                form: value,
                pageFromLookup: "paper",
                workflowType: "nvra",
                showRedirectText: true,
                voluntaryPaperRedirect: true,
                isRedirectedCompressNVRA: true,
              })
            }
          >
            <Text style={styles.outlineButtonText}>
              {t("finish_with_state_page2.paper_button")}
            </Text>
          </TouchableOpacity>
        )}
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
    outlineButton: {
      borderWidth: 1,
      borderColor: theme.primary,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 10,
    },
    outlineButtonText: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: "600",
    },
  });

export default FinishWithState;
