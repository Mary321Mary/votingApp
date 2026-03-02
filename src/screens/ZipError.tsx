import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ThemeContext } from "@/styles/ThemeProvider";
import Header from "@/components/modules/Header";

export default function ZipErrorScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const route = useRoute<any>();

  const state = route?.params ?? null;

  if (!state) {
    navigation.navigate("Home");
    return null;
  }

  const { text } = state;

  return (
    <View style={styles.container}>
      <Header text="Zip Code Error" />

      <View style={styles.content}>
        <Text style={styles.text}>{text}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>{t("restart")}</Text>
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
  });
