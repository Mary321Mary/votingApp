import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { FormProps } from "@/utils/types";
import { ThemeContext } from "@/styles/ThemeProvider";
import QuestionsSection from "../atoms/QuestionsSection";
import { RegisterScreenNavigation } from "./RegisterResult/RegisterResult";
import { allowsPaperFallback } from "@/utils/register/registerRouting";
import { CustomButton } from "../atoms/CustomButton";

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

      {allowsPaperFallback(state) && (
        <Text style={styles.description}>
          {t("finish_with_state_page2.notice2")}
        </Text>
      )}

      <QuestionsSection
        state={state}
        value={value}
        errorMessages={errorMessages}
        onChange={onChange}
        onChangeError={onChangeError}
      />

      <View style={styles.buttons}>
        <CustomButton
          title={t("finish_with_state_page2.state_button", {
            state_abbr: state.abbreviation,
          })}
          onPress={handleMainButtonClick}
        />
        {allowsPaperFallback(state) && (
          <CustomButton
            title={t("finish_with_state_page2.paper_button")}
            variant="outline-primary"
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
          />
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
    buttons: {
      gap: 16,
      alignItems: "center",
    },
  });

export default FinishWithState;
