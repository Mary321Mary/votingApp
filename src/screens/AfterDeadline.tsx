import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Button,
  useWindowDimensions,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Header from "@/layout/Header";
import { REPORT_EVENT_STEPS } from "../utils/report/eventReporting";
import { reportEvent } from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RenderHTML from "react-native-render-html";

type RouteParams = {
  response: {
    state?: {
      name: string;
    };
  };
  zip: string;
  email: string;
  partner?: string;
};

type AfterDeadlineScreenRouteProp = RouteProp<
  { AfterDeadlinePage: RouteParams },
  "AfterDeadlinePage"
>;

export default function AfterDeadlineScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<AfterDeadlineScreenRouteProp>();
  const { width } = useWindowDimensions();

  const { response, zip, email } = route.params || {};

  useEffect(() => {
    async function fetchData() {
      const registration_uid =
        (await AsyncStorage.getItem("registration_uid")) || "";
      await reportEvent({
        registration_uid,
        partner_id: "1",
        step: REPORT_EVENT_STEPS.EMPTY,
        event_name: "after deadline notification",
      });
    }
    fetchData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Header
        text={`${t("general.register_in")}${response?.state?.name || ""}`}
      />
      <View style={styles.container}>
        <RenderHTML
          contentWidth={width}
          source={{ html: t("after_vr_deadline.notification") }}
          tagsStyles={{
            body: {
              fontSize: 14,
              lineHeight: 18,
              marginVertical: 5,
            },
            strong: { fontWeight: "bold" },
            br: { height: 1 },
          }}
        />

        <Button
          title={t("after_vr_deadline.continue_button_text")}
          onPress={() => {
            navigation.replace("Register", {
              ...response,
              zip,
              email,
            });
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {},
  container: {
    flex: 1,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width: "100%",
  },
});
