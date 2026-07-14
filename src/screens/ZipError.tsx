import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "@/styles/ThemeProvider";
import Header from "@/layout/Header";
import logo from "assets/images/warning-zone.jpg";
import { UserData } from "@/utils/types";

interface ZipErrorScreenProps {
  route: {
    params: {
      text: string;
      header?: string;
      showImage?: boolean;
      user: UserData | null;
    };
  };
}

export default function ZipErrorScreen({ route }: ZipErrorScreenProps) {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  const state = route?.params ?? null;

  if (!state) {
    navigation.navigate("Home");
    return null;
  }

  const { text, header, showImage } = state;

  return (
    <View style={styles.container}>
      <Header text={header || "Zip Code Error"} />

      <View style={styles.content}>
        <Text style={styles.text}>{text}</Text>
        {state.user && (
          <View>
            <Text>Address {state.user.address}</Text>
            <Text>City: {state.user.city}</Text>
            <Text>Zip: {state.user.zip}</Text>
            <Text>Date of birth: {state.user.date_of_birth}</Text>
            <Text>Email: {state.user.email}</Text>
          </View>
        )}
        {showImage && <Image source={logo} style={styles.logo} />}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace("Home")}
      >
        <Text style={styles.buttonText}>{t("general.restart_test")}</Text>
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
      alignItems: "center",
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
