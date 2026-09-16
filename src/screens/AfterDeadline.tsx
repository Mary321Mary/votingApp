import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  useWindowDimensions,
  Linking,
  Text,
} from "react-native";
import { useTranslation } from "react-i18next";
import RenderHTML from "react-native-render-html";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Header from "@/layout/Header";
import { CustomButton } from "@/components/atoms/CustomButton";
import { REPORT_EVENT_STEPS } from "@/utils/report/eventReporting";
import { reportEvent } from "@/utils/api";
import { interpolateStateCopy } from "@/utils/stateCopy";
import { SubmitEmailZipResponse } from "@/utils/types";

type RouteParams = {
  response: SubmitEmailZipResponse;
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
  const stateData = response?.state;
  const sameDayCopy = stateData?.same_day_registration_statement
    ? interpolateStateCopy(stateData.same_day_registration_statement, {
        state_name: stateData.name,
        state_abbr: stateData.abbreviation,
      })
    : null;

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
    <ScrollView>
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
            },
            strong: { fontWeight: "bold" },
            br: { height: 1 },
          }}
        />
        <Text>{sameDayCopy}</Text>

        <CustomButton
          title={t("after_vr_deadline.continue_button_text")}
          onPress={() => {
            navigation.replace("Register", {
              ...response,
              zip,
              email,
            });
          }}
        />
        <CustomButton
          title={t("after_vr_deadline.cta_learn_about", {
            state_abbr: stateData?.abbreviation,
          })}
          variant="outline-primary"
          onPress={() => {
            if (stateData?.learn_about_url) {
              Linking.openURL(stateData.learn_about_url);
            }
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
