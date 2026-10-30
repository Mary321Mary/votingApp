import React, { useContext, useEffect, useState } from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import { Trans, useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import {
  getFormattedElectionTitle,
  INITIAL_USER_STATE,
  VOTER_STATE_STORAGE_KEY,
  VOTER_USER_STORAGE_KEY,
} from "@/utils/constants";
import { Election, UserData } from "@/utils/types";
import { submitBallotLookup, submitElectionsLookup } from "@/utils/api";
import { ThemeContext } from "@/styles/ThemeProvider";
import { ElectionData, getNextElection } from "../../organisms/ElectionData";
import { RootStackParamList } from "../../Navigation";

interface BallotReminderModalProps {}

type NotificationsScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Notifications"
>;

export default function BallotReminderModal({}: BallotReminderModalProps) {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const navigation = useNavigation<NotificationsScreenNavigation>();

  const [voter, setVoter] = useState<UserData>(INITIAL_USER_STATE);

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

  useEffect(() => {
    const loadData = async () => {
      const [storedUser] = await Promise.all([
        AsyncStorage.getItem(VOTER_USER_STORAGE_KEY),
      ]);

      if (storedUser) {
        const parsedUser: UserData = JSON.parse(storedUser);
        setVoter(parsedUser);

        const apiElectionsResponse = await submitElectionsLookup(parsedUser);
        let election = getNextElection(apiElectionsResponse.data.elections);

        if (election) {
          const ballotResponse = await submitBallotLookup({
            id: election.id,
          });

          setBallotData(ballotResponse.data.ballot);
        }
        setElections(election);
      }
    };

    loadData();
  }, []);

  const handleNavigateToBallot = async () => {
    let state = await AsyncStorage.getItem(VOTER_STATE_STORAGE_KEY);
    let stateData = null;
    if (state) stateData = JSON.parse(state);

    navigation.navigate("Ballot", {
      ballotData: ballotData,
      form: voter,
      stateData,
      electionTitle: getFormattedElectionTitle(elections),
      savedSelections: [],
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.text}>
        <Trans
          i18nKey="native_local.notifications.remind_ballot_full"
          defaults="{{fname}} It’s time to double check <ballotLink>your ballot</ballotLink> for the {{electionName}}. You can view your sample ballot, see your voting choices on all your ballot items, get info about candidates and ballot questions, and save your choices. Then you can review your sample ballot’s choices when you mark your ballot."
          values={{
            fname: voter.first_name,
            electionName: getFormattedElectionTitle(elections),
          }}
          components={{
            ballotLink: (
              <Text style={styles.linkText} onPress={handleNavigateToBallot} />
            ),
          }}
        />
      </Text>
    </ScrollView>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    content: {
      paddingBottom: 20,
    },
    text: {
      fontSize: 14,
      lineHeight: 22,
      color: theme.textPrimary || "#333333",
      marginBottom: 16,
    },
    boldText: {
      fontWeight: "700",
    },
    linkText: {
      fontSize: 14,
      color: theme.primary || "#0066CC",
      textDecorationLine: "underline",
      fontWeight: "600",
    },
    buttonContainer: {
      marginTop: 12,
    },
  });
