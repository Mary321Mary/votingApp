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
import { useNavigation } from "@react-navigation/native";

import {
  getFormattedElectionTitle,
  VOTER_FORM_STORAGE_KEY,
  VOTER_STATE_STORAGE_KEY,
} from "@/utils/constants";
import { submitBallotLookup, submitElectionsLookup } from "@/utils/api";

import { ThemeContext } from "@/styles/ThemeProvider";
import { CheckRegistrationStatus, Election } from "@/utils/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Navigation";

interface ElectionData {
  id: number;
  type: string;
  date: string;
  description: string;
}

function getNextElection(elections: ElectionData[]): ElectionData | null {
  if (!elections.length) return null;

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return elections.reduce<ElectionData | null>((closest, current) => {
    const currentDate = new Date(current.date);

    if (currentDate < now) {
      return closest;
    }

    if (!closest) {
      return current;
    }

    const closestDate = new Date(closest.date);

    if (currentDate < closestDate) {
      return current;
    }

    if (currentDate.getTime() === closestDate.getTime()) {
      const isCurrentGeneral = current.type.toLowerCase().includes("general");
      const isClosestGeneral = closest.type.toLowerCase().includes("general");

      if (isCurrentGeneral && !isClosestGeneral) {
        return current;
      }
    }

    return closest;
  }, null);
}

type DashboardScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Dashboard"
>;

export default function ElectionData() {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const navigation = useNavigation<DashboardScreenNavigation>();

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
  const [elections, setElections] = useState<ElectionData | null>(null);
  const [ballotData, setBallotData] = useState<{
    longitude: number;
    latitude: number;
    elections: Election[];
  }>({
    longitude: 0,
    latitude: 0,
    elections: [],
  });

  const handleNavigateToLocation = () => {
    navigation.navigate("Location");
  };

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
          let election = getNextElection(apiElectionsResponse.data.elections);

          if (election) {
            const ballotResponse = await submitBallotLookup({
              id: election.id,
            });

            setBallotData(ballotResponse.data.ballot);
          }
          setElections(election);
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

  const handleNavigateToBallot = async () => {
    let state = await AsyncStorage.getItem(VOTER_STATE_STORAGE_KEY);
    let stateData = null;
    if (state) stateData = JSON.parse(state);

    navigation.navigate("Ballot", {
      ballotData: ballotData,
      form: savedForm,
      stateData,
      electionTitle: getFormattedElectionTitle(elections),
      savedSelections: [],
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.bold}>
        {t("native_local.dashboard.upcoming_election")}
      </Text>
      <View style={styles.elections}>
        <Text style={styles.text}>{getFormattedElectionTitle(elections)}</Text>
        {ballotData.elections.length === 0 ? (
          <Text>{t("native_local.dashboard.ballot_none")}</Text>
        ) : (
          <Text style={styles.text}>
            <Trans
              i18nKey="native_local.dashboard.ballot_prompt"
              components={{
                ballotLink: (
                  <Text style={styles.link} onPress={handleNavigateToBallot} />
                ),
              }}
            />
          </Text>
        )}
        <Text style={styles.text}>
          <Trans
            i18nKey="native_local.dashboard.location_prompt"
            components={{
              locationLink: (
                <Text style={styles.link} onPress={handleNavigateToLocation} />
              ),
            }}
          />
        </Text>
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
      </View>
    </ScrollView>
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
    content: {},
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
    elections: {
      marginLeft: 30,
    },
    link: {
      color: theme.link,
      fontSize: 15,
      textDecorationLine: "underline",
    },
  });
