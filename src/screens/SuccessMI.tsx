import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Linking } from "react-native";
import { useTranslation } from "react-i18next";
import Header from "@/layout/Header";
import { StateData } from "@/utils/types";
import { checkMICovr } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [savedUid, setSavedUid] = useState<string | null>(null);

  const openUrl = async (url?: string) => {
    if (!url) return;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    }
  };

  useEffect(() => {
    const loadUid = async () => {
      try {
        const uid = await AsyncStorage.getItem("rtv_registrant_uid");
        setSavedUid(uid);
      } catch (error) {
        console.error("Failed to load UID:", error);
      }
    };

    loadUid();
  }, []);

  useEffect(() => {
    if (!savedUid) {
      return;
    }

    const intervalId = setInterval(async () => {
      try {
        const response = await checkMICovr({ registrant_uid: savedUid });

        if (
          response.status === 404 ||
          response.data.status === "success" ||
          response.data.status === "failure"
        ) {
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Error check MI:", error);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [savedUid]);

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
