import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
} from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  FIRST_TIME_COMPLETED_KEY,
  INITIAL_USER_STATE,
  ONBOARDING2_COMPLETED_KEY,
  ONBOARDING_COMPLETED_KEY,
  VOTER_STATE_STORAGE_KEY,
  VOTER_USER_STORAGE_KEY,
} from "@/utils/constants";

import { ThemeContext } from "@/styles/ThemeProvider";
import { COLORS } from "@/styles/colors";
import Header from "@/layout/Header";
import { CustomButton } from "@/components/atoms/CustomButton";
import { RootStackParamList } from "@/components/Navigation";
import { UserData } from "../../utils/types";
import { submitLookup } from "../../utils/api";

type ResetScreenProps = NativeStackScreenProps<RootStackParamList, "Reset">;

export default function ResetScreen({ navigation }: ResetScreenProps) {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  const [savedUser, setSavedUser] = useState<UserData>(INITIAL_USER_STATE);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [storedUser] = await Promise.all([
          AsyncStorage.getItem(VOTER_USER_STORAGE_KEY),
        ]);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setSavedUser(parsedUser);
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
      <Header showMenu text={t("native_local.restart.title")} />

      <ScrollView contentContainerStyle={styles.content}>
        {savedUser && (
          <View>
            <Text style={styles.text}>
              <Text style={styles.bold}>uid:</Text> {savedUser.uid || "No uid"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Name:</Text> {savedUser.first_name}{" "}
              {savedUser.last_name}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Email:</Text> {savedUser.email}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Phone:</Text> {savedUser.phone}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>DOB:</Text> {savedUser.date_of_birth}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Location:</Text> {savedUser.address},{" "}
              {savedUser.city}
              {savedUser.zip && ` ${savedUser.zip}`}
            </Text>
            <View style={styles.divider} />
            <Text style={styles.text}>
              <Text style={styles.bold}>Opt in email:</Text>{" "}
              {savedUser.opt_in_email ? "On" : "Off"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Opt in sms:</Text>{" "}
              {savedUser.opt_in_sms ? "On" : "Off"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Opt in volunteer:</Text>{" "}
              {savedUser.opt_in_volunteer ? "On" : "Off"}
            </Text>
            <View style={styles.divider} />
            <Text style={styles.text}>
              <Text style={styles.bold}>Survey question 1:</Text>{" "}
              {savedUser.survey_question_1 || "No data"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Survey answer 1:</Text>{" "}
              {savedUser.survey_answer_1 || "No data"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Survey question 2:</Text>{" "}
              {savedUser.survey_question_2 || "No data"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Survey answer 2:</Text>{" "}
              {savedUser.survey_answer_2 || "No data"}
            </Text>
            <View style={styles.divider} />
            <Text style={styles.text}>
              <Text style={styles.bold}>Partner opt in email:</Text>{" "}
              {savedUser.partner_opt_in_email ? "On" : "Off"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Partner opt in sms:</Text>{" "}
              {savedUser.partner_opt_in_sms ? "On" : "Off"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Partner opt in volunteer:</Text>{" "}
              {savedUser.partner_opt_in_volunteer ? "On" : "Off"}
            </Text>
            <View style={styles.divider} />
            <Text style={styles.text}>
              <Text style={styles.bold}>Registration Status:</Text>{" "}
              {savedUser.registration_status || "No status"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Registration Status Date:</Text>{" "}
              {savedUser.registration_status_date || "No date"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Registration Date:</Text>{" "}
              {savedUser.registration_date || "No date"}
            </Text>
            <View style={styles.divider} />
            <Text style={styles.text}>
              <Text style={styles.bold}>Lookup Status:</Text>{" "}
              {savedUser.lookup_status || "No status"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Lookup Status Date:</Text>{" "}
              {savedUser.lookup_status_date || "No date"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Pledge Status:</Text>{" "}
              {savedUser.pledge_status || "No status"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Pledge Status Date:</Text>{" "}
              {savedUser.pledge_status_date || "No date"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Pledge Date:</Text>{" "}
              {savedUser.pledge_date || "No date"}
            </Text>
            <View style={styles.divider} />
            <Text style={styles.text}>
              <Text style={styles.bold}>Ovr Status:</Text>{" "}
              {savedUser.ovr_status || "No status"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Ovr Status Date:</Text>{" "}
              {savedUser.ovr_status_date || "No date"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Ballot Status:</Text>{" "}
              {savedUser.ballot_status || "No status"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Ballot Status Date:</Text>{" "}
              {savedUser.ballot_status_date || "No date"}
            </Text>
            <View style={styles.divider} />
            <Text style={styles.text}>
              <Text style={styles.bold}>Abr Status:</Text>{" "}
              {savedUser.abr_status || "No status"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Abr Status Date:</Text>{" "}
              {savedUser.abr_status_date || "No date"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Location Status:</Text>{" "}
              {savedUser.location_status || "No status"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Location Status Date:</Text>{" "}
              {savedUser.location_status_date || "No date"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Create Date:</Text>{" "}
              {savedUser.create_date || "No date"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Modified Date:</Text>{" "}
              {savedUser.modified_date || "No date"}
            </Text>
          </View>
        )}
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Full Reset"
            onPress={async () => {
              try {
                await AsyncStorage.multiRemove([
                  VOTER_USER_STORAGE_KEY,
                  FIRST_TIME_COMPLETED_KEY,
                  ONBOARDING_COMPLETED_KEY,
                  ONBOARDING2_COMPLETED_KEY,
                  VOTER_STATE_STORAGE_KEY,
                ]);
              } catch (error) {
                console.error("Failed to clear saved data:", error);
              }
              navigation.replace("Welcome");
            }}
          />

          <CustomButton
            title="Reset to Voter 1"
            onPress={async () => {
              setLoading(true);
              try {
                await AsyncStorage.multiRemove([
                  VOTER_USER_STORAGE_KEY,
                  FIRST_TIME_COMPLETED_KEY,
                  ONBOARDING_COMPLETED_KEY,
                  ONBOARDING2_COMPLETED_KEY,
                  VOTER_STATE_STORAGE_KEY,
                ]);

                const responseLookup = await submitLookup({
                  first_name: "Janet",
                  last_name: "Doe",
                  email: "janet.doe@me.com",
                  zip: "94301",

                  address: "340 University Ave",
                  aptunit: "",
                  city: "Palo Alto",
                  phone: "8085551212",

                  date_of_birth: "1-1-1901",
                } as UserData);

                await Promise.all([
                  AsyncStorage.setItem(
                    VOTER_USER_STORAGE_KEY,
                    JSON.stringify({
                      ...(responseLookup.data.voter || {}),

                      uid: "1",
                      first_name: "Janet",
                      last_name: "Doe",
                      email: "janet.doe@me.com",
                      zip: "94301",

                      formattedAddress: "340 University Ave. Palo Alto 94301",
                      address: "340 University Ave",
                      aptunit: "42",
                      city: "Palo Alto",
                      phone: "8085551212",

                      birthMonth: "01",
                      birthDay: "1",
                      birthYear: "1901",
                      date_of_birth: "1-1-1901",

                      registration_date: "2000-0-01",
                      registration_status: "active",
                      registration_status_date: new Date().toLocaleDateString(
                        "en-US",
                        {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        },
                      ),
                      lookup_status: "catalist_match",
                      lookup_status_date: new Date().toLocaleDateString(
                        "en-US",
                        {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        },
                      ),
                      pledge_status: "pledged",
                      pledge_status_date: new Date().toLocaleDateString(
                        "en-US",
                        {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        },
                      ),
                      ballot_status: "ballot_selections_saved",
                      ballot_status_date: new Date().toLocaleDateString(
                        "en-US",
                        {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        },
                      ),

                      abr_status: "abr_begun",
                      abr_status_date: new Date().toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      }),

                      location_status: "location_viewed",
                      location_status_date: new Date().toLocaleDateString(
                        "en-US",
                        {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        },
                      ),

                      survey_question_1:
                        "If you are in school, where do you go?",
                      survey_answer_1: "school",
                      survey_question_2: "What issue do you care most about?",
                      survey_answer_2: "school",

                      opt_in_email: true,
                      opt_in_sms: false,
                      partner_opt_in_email: null,
                      partner_opt_in_sms: null,
                      opt_in_volunteer: true,
                      partner_opt_in_volunteer: null,

                      ovr_status: "",
                      ovr_status_date: "",

                      prefType1: true,
                      prefType2: true,
                      prefType3: true,

                      // comm_pref_email: false,
                      // comm_pref_sms: false,
                      create_date: "2026-03-03",
                      modified_date: new Date().toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      }),
                    } as UserData),
                  ),
                  AsyncStorage.setItem(FIRST_TIME_COMPLETED_KEY, "true"),
                  AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true"),
                  AsyncStorage.setItem(ONBOARDING2_COMPLETED_KEY, "true"),
                  AsyncStorage.setItem(
                    VOTER_STATE_STORAGE_KEY,
                    JSON.stringify(responseLookup.data.state),
                  ),
                ]);
              } catch (error) {
                console.error("Failed to clear saved data:", error);
              } finally {
                setLoading(false);
              }
              navigation.replace("Dashboard", {});
            }}
          />

          <CustomButton
            title="Reset to Voter 2"
            onPress={async () => {
              setLoading(true);
              try {
                await AsyncStorage.multiRemove([
                  VOTER_USER_STORAGE_KEY,
                  FIRST_TIME_COMPLETED_KEY,
                  ONBOARDING_COMPLETED_KEY,
                  ONBOARDING2_COMPLETED_KEY,
                  VOTER_STATE_STORAGE_KEY,
                ]);

                const responseLookup = await submitLookup({
                  first_name: "Joanie",
                  last_name: "Doe",
                  email: "joanie.doe@me.com",
                  zip: "38111",

                  address: "42 North Larchmont Drive",
                  aptunit: "",
                  city: "Memphis",
                  phone: "9015551212",

                  date_of_birth: "2-2-1902",
                } as UserData);

                await Promise.all([
                  AsyncStorage.setItem(
                    VOTER_USER_STORAGE_KEY,
                    JSON.stringify({
                      ...(responseLookup.data.voter || {}),

                      uid: "2",
                      first_name: "Joanie",
                      last_name: "Doe",
                      email: "joanie.doe@me.com",
                      zip: "38111",

                      formattedAddress:
                        "42 North Larchmont Drive, Memphis TN 38111",
                      address: "42 North Larchmont Drive",
                      aptunit: "",
                      city: "Memphis",
                      phone: "9015551212",

                      birthMonth: "02",
                      birthDay: "2",
                      birthYear: "1902",
                      date_of_birth: "2-2-1902",

                      registration_date: "",
                      registration_status: "",
                      registration_status_date: new Date().toLocaleDateString(
                        "en-US",
                        {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        },
                      ),
                      lookup_status: "catalist_no_match",
                      lookup_status_date: new Date().toLocaleDateString(
                        "en-US",
                        {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        },
                      ),
                      pledge_status: "",
                      pledge_status_date: new Date().toLocaleDateString(
                        "en-US",
                        {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        },
                      ),
                      ballot_status: "",
                      ballot_status_date: new Date().toLocaleDateString(
                        "en-US",
                        {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        },
                      ),
                      abr_status: "",
                      abr_status_date: "",
                      location_status: "",
                      location_status_date: new Date().toLocaleDateString(
                        "en-US",
                        {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        },
                      ),

                      survey_question_1:
                        "If you are in school, where do you go?",
                      survey_answer_1: "no",
                      survey_question_2: "What issue do you care most about?",
                      survey_answer_2: "",

                      opt_in_email: false,
                      opt_in_sms: false,
                      partner_opt_in_email: null,
                      partner_opt_in_sms: null,
                      opt_in_volunteer: false,
                      partner_opt_in_volunteer: null,

                      ovr_status: "used_state_ovr",
                      ovr_status_date: new Date().toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      }),

                      prefType1: true,
                      prefType2: true,
                      prefType3: true,

                      create_date: "2026-03-03",
                      modified_date: new Date().toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      }),
                    } as UserData),
                  ),
                  AsyncStorage.setItem(FIRST_TIME_COMPLETED_KEY, "true"),
                  AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true"),
                  AsyncStorage.setItem(ONBOARDING2_COMPLETED_KEY, "true"),
                  AsyncStorage.setItem(
                    VOTER_STATE_STORAGE_KEY,
                    JSON.stringify(responseLookup.data.state),
                  ),
                ]);
              } catch (error) {
                console.error("Failed to clear saved data:", error);
              } finally {
                setLoading(false);
              }
              navigation.replace("Dashboard", {});
            }}
          />

          <CustomButton
            title="Reset to Voter 3"
            onPress={async () => {
              setLoading(true);
              try {
                await AsyncStorage.multiRemove([
                  VOTER_USER_STORAGE_KEY,
                  FIRST_TIME_COMPLETED_KEY,
                  ONBOARDING_COMPLETED_KEY,
                  ONBOARDING2_COMPLETED_KEY,
                  VOTER_STATE_STORAGE_KEY,
                ]);

                const responseLookup = await submitLookup({
                  first_name: "Johann",
                  last_name: "Doe",
                  email: "johann.doe@me.com",
                  zip: "57501",

                  address: "500 East Capitol Ave",
                  aptunit: "",
                  city: "Pierre",
                  phone: "6055551212",

                  date_of_birth: "3-3-1903",
                } as UserData);

                await Promise.all([
                  AsyncStorage.setItem(
                    VOTER_USER_STORAGE_KEY,
                    JSON.stringify({
                      ...(responseLookup.data.voter || {}),

                      uid: "3",
                      first_name: "Johann",
                      last_name: "Doe",
                      email: "johann.doe@me.com",
                      zip: "57501",

                      formattedAddress: "500 East Capitol Ave. Pierre SD 57501",
                      address: "500 East Capitol Ave",
                      aptunit: "",
                      city: "Pierre",
                      phone: "6055551212",

                      birthMonth: "03",
                      birthDay: "3",
                      birthYear: "1903",
                      date_of_birth: "3-3-1903",

                      registration_date: "",
                      registration_status: "pending",
                      registration_status_date: new Date().toLocaleDateString(
                        "en-US",
                        {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        },
                      ),
                      lookup_status: "catalist_no_match",
                      lookup_status_date: new Date().toLocaleDateString(
                        "en-US",
                        {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        },
                      ),
                      pledge_status: "",
                      pledge_status_date: new Date().toLocaleDateString(
                        "en-US",
                        {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        },
                      ),
                      ballot_status: "",
                      ballot_status_date: "",
                      abr_status: "",
                      abr_status_date: "",
                      location_status: "",
                      location_status_date: "",
                      ovr_status: "nvra_form_downloaded",
                      ovr_status_date: new Date().toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      }),

                      survey_question_1:
                        "If you are in school, where do you go?",
                      survey_answer_1: "",
                      survey_question_2: "What issue do you care most about?",
                      survey_answer_2: "",

                      opt_in_email: false,
                      opt_in_sms: false,
                      partner_opt_in_email: null,
                      partner_opt_in_sms: null,
                      opt_in_volunteer: false,
                      partner_opt_in_volunteer: null,

                      prefType1: false,
                      prefType2: true,
                      prefType3: false,

                      create_date: "2026-03-03",
                      modified_date: new Date().toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      }),
                    } as UserData),
                  ),
                  AsyncStorage.setItem(FIRST_TIME_COMPLETED_KEY, "true"),
                  AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true"),
                  AsyncStorage.setItem(ONBOARDING2_COMPLETED_KEY, "true"),
                  AsyncStorage.setItem(
                    VOTER_STATE_STORAGE_KEY,
                    JSON.stringify(responseLookup.data.state),
                  ),
                ]);
              } catch (error) {
                console.error("Failed to clear saved data:", error);
              } finally {
                setLoading(false);
              }
              navigation.replace("Dashboard", {});
            }}
          />

          <CustomButton
            title="Return Without Reset"
            onPress={() => navigation.goBack()}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: typeof COLORS) =>
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
      alignItems: "center",
    },
    bold: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontWeight: "bold",
      fontSize: 16,
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
    buttonContainer: {
      width: "100%",
      marginTop: 10,
    },

    divider: {
      height: 1,
      backgroundColor: theme.gray,
      marginVertical: 5,
    },
  });
