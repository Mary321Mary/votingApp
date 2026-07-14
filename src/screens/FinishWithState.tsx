import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  Dimensions,
  Button,
} from "react-native";
import { Trans, useTranslation } from "react-i18next";
import Header from "@/layout/Header";
import { StateData } from "@/utils/types";

const { width } = Dimensions.get("window");

interface FinishWithStateScreenProps {
  route: {
    params: {
      state: StateData;
    };
  };
}

const FinishWithStateScreen = ({ route }: FinishWithStateScreenProps) => {
  const { t } = useTranslation();
  const navState = route?.params ?? null;

  const handleOpenUrl = async () => {
    const targetUrl =
      navState.state?.learn_about_url ||
      navState.state?.online_registration_system_url;
    if (targetUrl) {
      const supported = await Linking.canOpenURL(targetUrl);
      if (supported) {
        await Linking.openURL(targetUrl);
      } else {
        console.warn(`Cannot open URL: ${targetUrl}`);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header
        text={`${t("general.register_in")} ${navState.state?.name || ""}`}
      />

      <View style={styles.content}>
        <Text>
          <Trans
            i18nKey="finish_with_state_page3.have_questions"
            components={{
              strong: <Text style={styles.boldText} />,
            }}
          />
        </Text>

        <Button
          title={t("finish_with_state_page3.learn_about_button_text", {
            state_abbr: navState.state?.abbreviation,
          })}
          onPress={handleOpenUrl}
        />

        <Text style={[styles.boldText, styles.textCenter]}>
          {t("finish_with_state_page3.encourage")}
        </Text>

        <View style={styles.shareContainer}>
          <Button title={t("finish_with_state_page3.fb_button_text")} />
          <Button title={t("finish_with_state_page3.x_button_text")} />
          <Button title={t("finish_with_state_page3.copy_button_text")} />
        </View>

        <View style={styles.footerInfo}>
          <Text style={styles.boldText}>
            {t("finish_with_state_page3.get this")}
          </Text>
          <Text style={styles.textCenter}>
            {t("finish_with_state_page3.send us").replace(/<[^>]*>/g, "")}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 15,
    alignSelf: "center",
    width: "100%",
    maxWidth: 600,
  },
  content: {
    flexDirection: "column",
    alignItems: "center",
    gap: 24,
    marginTop: 15,
    marginHorizontal: 10,
  },
  textCenter: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },
  boldText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    color: "#000",
  },
  shareContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    width: width * 0.75,
  },
  footerInfo: {
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
});

export default FinishWithStateScreen;
