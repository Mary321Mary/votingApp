import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "@/styles/ThemeProvider";
import Header from "@/layout/Header";
import { CustomButton } from "../components/atoms/CustomButton";

interface WelcomeBackScreenProps {
  route: {
    params: {
      header: string;
      text: string;
    };
  };
}

export default function WelcomeBackScreen({ route }: WelcomeBackScreenProps) {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  const state = route?.params ?? null;

  if (!state) {
    navigation.navigate("Home");
    return null;
  }

  const { text, header } = state;

  return (
    <View style={styles.container}>
      <Header text={header} />

      <View style={styles.content}>
        <Text style={styles.text}>{text}</Text>

        <CustomButton
          title={t("general.restart_test")}
          onPress={() => navigation.replace("Home")}
        />
      </View>
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
      alignItems: "center",
    },

    text: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 16,
      fontWeight: "regular",
      lineHeight: 22,
      color: theme.textPrimary,
    },
    logo: {
      width: 200,
      height: 200,
      resizeMode: "contain",
      marginBottom: 20,
    },
  });
