import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Linking,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  Alert,
} from "react-native";
import { Trans, useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Header from "@/layout/Header";
import { ThemeContext } from "@/styles/ThemeProvider";
import { RootStackParamList } from "@/components/organisms/Navigation";
import { StateData } from "@/utils/types";
import { useUIConfig } from "@/contexts/UIConfigContext";
import Clipboard from "@react-native-clipboard/clipboard";

interface SuccessPAScreenProps {
  route: {
    params?: {
      state: StateData;
    };
  };
}

type SuccessPAScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "SuccessPA"
>;

export const SuccessPAScreen = ({ route }: SuccessPAScreenProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<SuccessPAScreenNavigation>();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { config } = useUIConfig();

  const params = route.params;
  const [copyNotification, setCopyNotification] = useState("");

  useEffect(() => {
    if (!params?.state) {
      navigation.replace("Home");
    }
  }, [navigation, params]);

  if (!params?.state) {
    return null;
  }

  const { state } = params;

  const handleLearnAbout = () => {
    if (state.learn_about_url) {
      Linking.openURL(state.learn_about_url);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header text={t("pennsylvania.success_title")} />{" "}
      <View style={styles.body}>
        <Text style={styles.bodyText}>{t("pennsylvania.success_text_1")}</Text>
        <Text style={styles.bodyText}>{t("pennsylvania.success_text_2")}</Text>
        <View style={styles.buttonGroup}>
          <Button
            title={t("pennsylvania.success_button_1")}
            color={theme.primary}
            onPress={handleLearnAbout}
          />
          <View style={styles.buttonSpacer} />
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() =>
              Linking.openURL(config?.share?.registrations?.facebook || "")
            }
          >
            <Text style={styles.outlineButtonText}>
              {t("print_form_page.share_fb_button_text")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() =>
              Linking.openURL(config?.share?.registrations?.x || "")
            }
          >
            <Text style={styles.outlineButtonText}>
              {t("print_form_page.share_x_button_text")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={async () => {
              const targetUrl = config?.share?.registrations?.copy_link || "";

              try {
                Clipboard.setString(targetUrl);

                if (Platform.OS === "android") {
                  ToastAndroid.show(
                    t(`pennsylvania.link_copied`),
                    ToastAndroid.SHORT,
                  );
                } else {
                  Alert.alert("Success", t(`pennsylvania.link_copied`));
                }
                setCopyNotification(t(`pennsylvania.link_copied`));
              } catch (err) {
                console.error("Failed to copy link:", err);
              }
            }}
          >
            <Text style={styles.outlineButtonText}>
              {t("print_form_page.copy_link")}
            </Text>
          </TouchableOpacity>{" "}
          {copyNotification && <Text>{copyNotification}</Text>}
          {/* Footer */}
          <View>
            <View style={styles.divider} />
            <Text style={styles.secondaryText}>
              {t("general.calls_to_action.building_site")}
            </Text>

            <Text>
              <Trans
                i18nKey="general.calls_to_action.get_tool_reg"
                components={{
                  a: (
                    <Text
                      key="email-link"
                      style={styles.linkText}
                      onPress={() => {
                        Linking.openURL("mailto:civictech@rockthevote.org");
                      }}
                    >
                      {0}
                    </Text>
                  ),
                }}
              />
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      paddingBottom: 24,
    },
    body: {
      paddingHorizontal: 20,
    },
    bodyText: {
      fontSize: 16,
      lineHeight: 24,
      marginTop: 16,
    },
    buttonGroup: {
      marginTop: 24,
      display: "flex",
      gap: 10,
    },
    buttonSpacer: {
      height: 12,
    },

    divider: {
      width: "100%",
      height: 1,
      backgroundColor: theme.background,
      marginVertical: 16,
    },
    shareButtons: {
      marginTop: 16,
      gap: 12,
    },
    outlineButton: {
      borderWidth: 1,
      borderColor: theme.primary,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    outlineButtonText: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: "600",
    },
    secondaryText: {
      marginBottom: 8,
    },
    linkText: {
      color: theme.link,
      textDecorationLine: "underline",
    },
  });
