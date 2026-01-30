import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "@/styles/ThemeProvider";
import Header from "@/components/modules/Header";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/components/organisms/Navigation";

type LookupScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

export default function LookupScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<LookupScreenNavigation>();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Header text="Sorry, John!" />

      <View style={styles.content}>
        <Text style={styles.text}>{t("sorry_text1")}</Text>
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
      marginTop: "auto",
      marginHorizontal: 20,
      marginBottom: 30,
      backgroundColor: theme.primary,
      paddingVertical: 14,
      borderRadius: 6,
      alignItems: "center",
    },

    buttonText: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      color: "green",
      fontSize: 16,
      fontWeight: "semibold",
    },
  });
