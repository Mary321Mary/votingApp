import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Trans, useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  getFormattedElectionTitle,
  VOTER_FORM_STORAGE_KEY,
} from "@/utils/constants";
import { submitElectionsLookup } from "@/utils/api";

import { ThemeContext } from "@/styles/ThemeProvider";
import Header from "@/layout/Header";
import { RootStackParamList } from "@/components/Navigation";
import { CheckRegistrationStatus } from "../utils/types";

type BallotScreenProps = NativeStackScreenProps<RootStackParamList, "Ballot">;

export default function BallotScreen({ navigation }: BallotScreenProps) {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  const [savedForm, setSavedForm] = useState<CheckRegistrationStatus>({
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
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [elections, setElections] = useState<
    {
      id: number;
      type: string;
      date: string;
      description: string;
    }[]
  >([]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [storedForm] = await Promise.all([
          AsyncStorage.getItem(VOTER_FORM_STORAGE_KEY),
        ]);

        if (storedForm) {
          const parsedForm = JSON.parse(storedForm);
          setSavedForm(parsedForm);
          const apiElectionsResponse = await submitElectionsLookup(parsedForm);
          setElections(apiElectionsResponse.data.elections);
        }
      } catch (error) {
        console.error("Failed to load user data from AsyncStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header showMenu text={t("native_local.dashboard.title")} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.bold}>
          {t("native_local.dashboard.upcoming_election")}
        </Text>
        {elections.map(election => (
          <Text key={election.id}>{getFormattedElectionTitle(election)}</Text>
        ))}

        {savedForm.zip === "38111" && (
          <Text style={styles.text}>
            <Trans
              i18nKey="native_local.dashboard.abr_prompt"
              components={{
                abrLink: <Text style={styles.link} onPress={() => {}} />,
              }}
            />
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      flex: 1,
      backgroundColor: theme.white,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      padding: 10,
    },
    bold: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 16,
      fontWeight: "bold",
      lineHeight: 22,
      color: theme.textPrimary,
    },
    text: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 16,
      fontWeight: "600",
      lineHeight: 22,
      color: theme.textPrimary,
    },
    link: {
      color: theme.link,
      fontSize: 15,
      textDecorationLine: "underline",
    },
  });
