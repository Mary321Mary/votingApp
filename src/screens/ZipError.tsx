import React, { useContext } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useTranslation } from "react-i18next";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import logo from "assets/images/warning-zone.jpg";
import { ThemeContext } from "@/styles/ThemeProvider";
import Header from "@/layout/Header";
import { CustomButton } from "@/components/atoms/CustomButton";
import { RootStackParamList } from "@/components/Navigation";

type ZipErrorScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ZipError"
>;

export default function ZipErrorScreen({
  route,
  navigation,
}: ZipErrorScreenProps) {
  const { t } = useTranslation();
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

      <CustomButton
        title={t("general.restart_test")}
        onPress={() => navigation.replace("Home")}
      />
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
