import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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

interface PreRegisterScreenProps {
  route: {
    params: {
      state: StateData;
      form: RegisterFormState;
      workflow_type: string;
      formCongif: DataCollectionConfiguration;
    };
  };
}

type PreRegisterScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "PreRegister"
>;

export default function PreRegisterScreen({ route }: PreRegisterScreenProps) {
  const { t } = useTranslation();
  const navigation = useNavigation<PreRegisterScreenNavigation>();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  const navState = route?.params ?? null;

  useEffect(() => {
    if (!navState?.state || !navState?.form) {
      navigation.replace("Home");
    }
  }, [navState, navigation]);

  if (!navState?.state || !navState?.form) {
    return null;
  }

  const { state, form, workflow_type, formCongif } = navState;

  const handleContinue = () => {
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
  };

  return (
    <View style={styles.container}>
      <Header text={t("general.register_in") + state.name} />
      <Trans
        i18nKey="pre_register_page.top_stmt"
        values={{
          state_abbr: state.abbreviation,
          min_pre_reg_age: formCongif.eligibility.min_pre_reg_age,
        }}
        components={{ strong: <strong /> }}
      />

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>
          {t("pre_register_page.continue_button_text")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.white,
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 30,
      gap: 12,
    },

    text: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 16,
      fontWeight: "regular",
      lineHeight: 22,
      color: theme.textPrimary,
    },

    button: {
      marginTop: 10,
      marginHorizontal: 20,
      marginBottom: 30,
      backgroundColor: "green",
      paddingVertical: 14,
      borderRadius: 6,
      alignItems: "center",
    },

    buttonText: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: "semibold",
    },

    logo: {
      width: 200,
      height: 200,
      resizeMode: "contain",
      marginBottom: 20,
    },
  });
