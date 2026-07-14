import React from "react";
import { StyleSheet, View, Text, ScrollView, Button } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Header from "@/layout/Header";

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

  const { response, zip, email } = route.params || {};

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Header
        text={`${t("general.register_in")}${response?.state?.name || ""}`}
      />
      <View style={styles.container}>
        <Text style={styles.notificationText}>
          {t("after_vr_deadline.notification")}
        </Text>

        <View style={styles.buttonContainer}>
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
    paddingHorizontal: 10,
    width: "100%",
  },
  notificationText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333333",
    marginVertical: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    gap: 8,
    marginVertical: 16,
  },
});
