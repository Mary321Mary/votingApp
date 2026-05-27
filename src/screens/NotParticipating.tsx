import React, { useContext } from "react";
import { StateData } from "@/utils/types";
import { StyleSheet, Text } from "react-native";
import { ThemeContext } from "@/styles/ThemeProvider";
import RenderHTML from "react-native-render-html";
import { useTranslation } from "react-i18next";

export const NotParticipatingScreen = (state: StateData) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

  return (
    <>
      <RenderHTML
        source={{ html: state.not_participating_text || "" }}
        tagsStyles={{
          a: {
            color: theme.primary,
            textDecorationLine: "underline",
          },
        }}
      />
      <Text style={styles.text}>
        {t("more_info")}
        <RenderHTML source={{ html: state.sos_address || "" }} />
      </Text>
      <Text>{t("secretary")}</Text>
      <RenderHTML source={{ html: state.sos_address || "" }} />
      <RenderHTML source={{ html: state.sos_phone || "" }} />
    </>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    text: {
      display: "flex",
    },
  });
