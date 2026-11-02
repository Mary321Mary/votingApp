import React, { useContext, useEffect, useState } from "react";
import { Text, StyleSheet, ScrollView, Linking } from "react-native";
import { Trans } from "react-i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import { ThemeContext } from "@/styles/ThemeProvider";
import { COLORS } from "@/styles/colors";
import { StateData, UserData } from "@/utils/types";
import {
  getFormattedElectionTitle,
  VOTER_STATE_STORAGE_KEY,
  VOTER_USER_STORAGE_KEY,
} from "@/utils/constants";
import { submitElectionsLookup } from "@/utils/api";
import { ElectionData, getNextElection } from "../../organisms/ElectionData";
import { RootStackParamList } from "../../Navigation";

type NotificationsScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Notifications"
>;

export default function VoterRegistrationReminderModal() {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const navigation = useNavigation<NotificationsScreenNavigation>();

  const [voter, setVoter] = useState<UserData | null>(null);
  const [stateData, setStateData] = useState<StateData | null>(null);
  const [elections, setElections] = useState<ElectionData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [storedUser, storedState] = await Promise.all([
        AsyncStorage.getItem(VOTER_USER_STORAGE_KEY),
        AsyncStorage.getItem(VOTER_STATE_STORAGE_KEY),
      ]);

      if (storedUser) {
        const parsedUser: UserData = JSON.parse(storedUser);
        setVoter(parsedUser);

        const apiElectionsResponse = await submitElectionsLookup(parsedUser);
        let election = getNextElection(apiElectionsResponse.data.elections);
        setElections(election);
      }

      if (storedState) {
        setStateData(JSON.parse(storedState));
      }
    };

    loadData();
  }, []);

  const handleOpenSosUrl = () => {
    if (stateData?.sos_url) {
      Linking.openURL(stateData.sos_url).catch(err =>
        console.error("Could not open SOS URL", err),
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.text}>
        <Trans
          i18nKey="native_local.notifications.remind_status_full_part1"
          values={{
            fname: voter?.first_name,
            electionName: getFormattedElectionTitle(elections),
          }}
        />
      </Text>

      <Text style={styles.text}>
        <Trans
          i18nKey="native_local.notifications.remind_status_full_part2"
          values={{
            sosUrl: stateData?.sos_url || "online",
            sosPhone: stateData?.sos_phone || "your Secretary of State",
          }}
          components={{
            profileLink: (
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate("Profile")}
              />
            ),
            sosLink: (
              <Text style={styles.linkText} onPress={handleOpenSosUrl} />
            ),
            phoneText: <Text style={styles.boldText} />,
          }}
        />
      </Text>
    </ScrollView>
  );
}

const getStyles = (theme: typeof COLORS) =>
  StyleSheet.create({
    content: {
      paddingBottom: 20,
    },
    text: {
      fontSize: 14,
      lineHeight: 22,
      color: theme.textPrimary || "#333333",
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
  });
