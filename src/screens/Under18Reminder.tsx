import React, { useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Linking,
  useWindowDimensions,
  Button,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import RenderHTML from "react-native-render-html";
import Share from "react-native-share";
import Header from "@/layout/Header";
import { ThemeContext } from "@/styles/ThemeProvider";

type StateData = {
  name: string;
  learn_about_url?: string;
};

type RegisterFormState = {
  state: string;
};

type RouteParams = {
  state: StateData;
  form: RegisterFormState;
};

type Under18ReminderScreenRouteProp = RouteProp<
  { Under18ReminderPage: RouteParams },
  "Under18ReminderPage"
>;

export default function Under18ReminderScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<Under18ReminderScreenRouteProp>();
  const { width } = useWindowDimensions();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  const navState = route.params;

  useEffect(() => {
    if (!navState?.state || !navState?.form) {
      navigation.replace("Home");
    }
  }, [navState, navigation]);

  const { state, form } = navState;

  const handleShare = async (customUrl?: string) => {
    const shareOptions = {
      message: t("print_form_page.encourage"),
      url: customUrl || state.learn_about_url || "https://rockthevote.com",
    };

    try {
      await Share.open(shareOptions);
    } catch (error) {
      console.log("Sharing error: ", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Header text={`${t("general.register_in")}${state.name}`} />

        <View style={styles.content}>
          <Text style={styles.notificationText}>
            {t("register_18_by_election_page.reminder_success")}
          </Text>

          <View style={styles.divider} />

          <RenderHTML
            contentWidth={width}
            source={{ html: t("print_form_page.have_questions_find_out") }}
            tagsStyles={htmlTagsStyles}
          />
          <View style={styles.buttonWrapper}>
            <Button
              title={t("print_form_page.learn_button_text", {
                state_abbr: form.state,
              })}
              onPress={() => {
                if (state.learn_about_url)
                  Linking.openURL(state.learn_about_url);
              }}
            />
          </View>
          <Text style={styles.boldText}>{t("print_form_page.encourage")}</Text>
          <View style={styles.shareButtonsGroup}>
            <Button
              title={t("print_form_page.share_fb_button_text", {
                state_abbr: form.state,
              })}
              onPress={() => handleShare()}
            />
            <Button
              title={t("print_form_page.share_x_button_text", {
                state_abbr: form.state,
              })}
              onPress={() => handleShare()}
            />
            <Button
              title={t("print_form_page.copy_link", { state_abbr: form.state })}
              onPress={() => handleShare()}
            />
          </View>
          <View style={styles.footerBlock}>
            <Text style={styles.boldText}>
              {t("print_form_page.get_this_tool")}
            </Text>

            <RenderHTML
              contentWidth={width}
              source={{ html: t("print_form_page.send_us") }}
              tagsStyles={htmlTagsStyles}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const htmlTagsStyles = {
  p: {
    margin: 0,
    padding: 0,
    fontSize: 14,
    color: "#333333",
    textAlign: "center" as const,
    lineHeight: 20,
  },
  strong: {
    fontWeight: "bold" as const,
    color: "#000000",
  },
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    scrollContainer: {
      justifyContent: "center",
    },
    container: {
      flex: 1,
      alignSelf: "center",
      width: "100%",
    },
    content: {
      marginHorizontal: 10,
      alignItems: "center",
    },
    notificationText: {
      fontSize: 16,
      textAlign: "center",
      color: theme.textPrimary,
      marginVertical: 16,
      lineHeight: 22,
    },
    divider: {
      width: "100%",
      height: 1,
      backgroundColor: theme.gray,
      marginVertical: 16,
    },
    buttonWrapper: {
      width: "100%",
      marginVertical: 16,
      alignItems: "center",
    },
    boldText: {
      fontSize: 15,
      fontWeight: "bold",
      color: theme.textPrimary,
      textAlign: "center",
      marginBottom: 8,
    },
    shareButtonsGroup: {
      width: "100%",
      alignItems: "center",
      gap: 10,
      marginVertical: 16,
    },
    footerBlock: {
      alignItems: "center",
      gap: 4,
      marginTop: 16,
      width: "100%",
    },
  });
