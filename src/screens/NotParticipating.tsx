import React, { useContext } from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import RenderHTML from "react-native-render-html";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { StateData } from "@/utils/types";
import { ThemeContext } from "@/styles/ThemeProvider";
import Header from "@/layout/Header";
import { RootStackParamList } from "@/components/organisms/Navigation";
import { CustomButton } from "@/components/atoms/CustomButton";

type NotParticipatingScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "NotParticipating"
>;

interface NotParticipatingScreenProps {
  route: {
    params: {
      state: StateData;
    };
  };
}

export const NotParticipatingScreen = ({
  route,
}: NotParticipatingScreenProps) => {
  const navigation = useNavigation<NotParticipatingScreenNavigation>();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const { state } = route.params;

  return (
    <ScrollView>
      <Header text={t("general.register_in") + state.name} />
      <View style={styles.section}>
        <RenderHTML
          source={{ html: state.not_participating_text || "" }}
          tagsStyles={{
            a: {
              color: theme.link,
              textDecorationLine: "underline",
            },
          }}
        />
        <Text>
          {t("not_participating_page.more_info")}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL(state.sos_url || "")}
          >
            {state.sos_url}
          </Text>
        </Text>
        <Text>
          {t("not_participating_page.contact_the_secretary_of_state")}
        </Text>
        <RenderHTML source={{ html: state.sos_address || "" }} />
        <RenderHTML source={{ html: state.sos_phone || "" }} />
        <CustomButton
          title={t("not_participating_page.learn_about_btn_text", {
            state_abbr: state.abbreviation,
          })}
          onPress={() => {
            if (state?.learn_about_url) {
              Linking.openURL(state.learn_about_url);
            }
          }}
        />

        {state?.show_vr_check_button && (
          <CustomButton
            title={t("not_participating_page.check_btn_text")}
            onPress={() => navigation.navigate("Lookup", {})}
          />
        )}
      </View>
    </ScrollView>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    section: {
      margin: 10,
      display: "flex",
      gap: 10,
    },
    link: {
      color: theme.link,
      textDecorationLine: "underline",
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 12,
      fontWeight: "medium",
    },
  });
