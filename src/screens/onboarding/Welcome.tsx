import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Image,
} from "react-native";
import { useTranslation } from "react-i18next";
import RenderHTML from "react-native-render-html";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import black_logo from "@/assets/images/mobile_black_logo.png";
import { CustomButton } from "@/components/atoms/CustomButton";
import { FIRST_TIME_COMPLETED_KEY } from "@/utils/constants";
import { ThemeContext } from "@/styles/ThemeProvider";
import { RootStackParamList } from "@/components/Navigation";
import { LANGUAGE_KEY } from "@/i18n";
import LanguageSelector from "@/components/atoms/LanguageSelector";

type WelcomeScreenProps = NativeStackScreenProps<RootStackParamList, "Welcome">;

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { width } = useWindowDimensions();

  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const currentLangRef = useRef(currentLang);

  const [remoteContent, setRemoteContent] = useState<any>(null);

  useEffect(() => {
    currentLangRef.current = currentLang;
  }, [currentLang]);

  useEffect(() => {
    const fetchRemoteData = async () => {
      try {
        throw new Error("API not available yet");
      } catch (error) {
        console.error("Failed to load data:", error);
        setRemoteContent(null);
      }
    };

    fetchRemoteData();
  }, []);

  const handleGetStarted = async () => {
    const activeLanguage = i18n.language || "en";

    try {
      await Promise.all([
        AsyncStorage.setItem(FIRST_TIME_COMPLETED_KEY, "true"),
        AsyncStorage.setItem(LANGUAGE_KEY, activeLanguage),
      ]);
    } catch (e) {
      console.error("Failed to save preferences", e);
    }

    navigation.replace("CheckVoterStatus", {
      form: {
        partner_id: 1,
        first_name: "",
        last_name: "",
        email: "",
        city: "",
        zip: "",
        aptunit: "",
        address: "",
        birthMonth: "",
        birthDay: "",
        birthYear: "",
        date_of_birth: "",
        phone: "",
        opt_in_email: false,
        opt_in_sms: true,
        volunteer: false,
        survey_question_1: "",
        survey_answer_1: "",
        survey_question_2: "",
        survey_answer_2: "",
        prefType1: true,
        prefType2: true,
        prefType3: true,
      },
    });
  };

  useEffect(() => {
    return () => {
      AsyncStorage.setItem(LANGUAGE_KEY, currentLangRef.current).catch(err =>
        console.error("Failed to persist language on unmount", err),
      );
    };
  }, []);

  return (
    <View style={styles.container}>
      <Image source={black_logo} style={styles.logo} resizeMode="contain" />

      <View style={styles.content}>
        <Text style={styles.header}>{t("native_local.welcome.header")}</Text>

        <Text style={styles.text}>
          {t("native_local.welcome.description1")}
        </Text>

        <RenderHTML
          contentWidth={width}
          source={{
            html: t("native_local.welcome.description2"),
          }}
          tagsStyles={{
            body: {
              fontSize: 18,
              color: theme.textPrimary,
            },
            strong: {
              fontWeight: "bold",
            },
          }}
        />

        <CustomButton
          title={t("native_local.welcome.get_started")}
          variant="outline-primary"
          onPress={handleGetStarted}
        />
      </View>

      <LanguageSelector />
    </View>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      gap: 12,
      alignItems: "center",
      padding: 20,
      marginTop: 20,
    },
    logo: {
      width: "100%",
      height: 80,
      backgroundColor: "#000",
    },
    header: {
      fontSize: 22,
      fontWeight: "bold",
    },
    text: {
      fontSize: 18,
    },
  });
