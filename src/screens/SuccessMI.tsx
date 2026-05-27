import React from "react";
import { View, Text, StyleSheet, Button, Linking } from "react-native";
import { useTranslation } from "react-i18next";
import Header from "@/layout/Header";
import { StateData } from "@/utils/types";

interface SuccessMIScreenProps {
  route: {
    params: {
      state: StateData;
    };
  };
}

export const SuccessMIScreen = ({ route }: SuccessMIScreenProps) => {
  const { t } = useTranslation();
  const state = route?.params?.state;

  const openUrl = async (url?: string) => {
    if (!url) return;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <>
      <Header text={t("michigan.success_title")} />
      <View style={styles.buttonsContainer}>
        <Text style={styles.description}>{t("michigan.success_text_1")}</Text>
        <Text style={styles.description}>{t("michigan.success_text_2")}</Text>

        <Button
          title={t("michigan.success_button_1")}
          onPress={() => openUrl(state?.learn_about_url)}
        />
        <Button title={t("michigan.success_button_2")} onPress={() => {}} />
        <Button title={t("michigan.success_button_3")} onPress={() => {}} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  description: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
  buttonsContainer: {
    gap: 12,
    margin: 10,
  },
});
