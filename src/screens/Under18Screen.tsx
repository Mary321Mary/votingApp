import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useTranslation } from "react-i18next";
import Header from "@/layout/Header";
import { StateData } from "@/utils/types";

interface Under18ScreenProps {
  route: {
    params: {
      state: StateData;
    };
  };
}

export const Under18Screen = ({ route }: Under18ScreenProps) => {
  const { t } = useTranslation();
  const state = route?.params?.state;

  return (
    <View>
      <Header text={t("general.register_in") + state.name} />
      <Text style={styles.description}>
        {t("register_18_by_election_page.top_stmt")}
      </Text>

      <View style={styles.buttonsContainer}>
        <Button
          title={t("register_18_by_election_page.continute_button_text")}
          onPress={() => {}}
        />
        <Button
          title={t("register_18_by_election_page.remind_button_text")}
          onPress={() => {}}
        />
      </View>
    </View>
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
