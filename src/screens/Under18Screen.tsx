import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  useWindowDimensions,
  Linking,
} from "react-native";
import { useTranslation } from "react-i18next";
import Header from "@/layout/Header";
import { RegisterFormState, StateData } from "@/utils/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/components/organisms/Navigation";
import { useNavigation } from "@react-navigation/native";
import { setUnder18Reminder } from "@/utils/api";
import RenderHTML from "react-native-render-html";
import { ThemeContext } from "@/styles/ThemeProvider";

interface Under18ScreenProps {
  route: {
    params: {
      state: StateData;
      form: RegisterFormState;
      workflow_type: string;
      registration_uid: string;
    };
  };
}

type Under18ScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Under18"
>;

export const Under18Screen = ({ route }: Under18ScreenProps) => {
  const { t } = useTranslation();
  const state = route?.params ?? null;
  const navigation = useNavigation<Under18ScreenNavigation>();
  const theme = useContext(ThemeContext);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { form, registration_uid, state: navState, workflow_type } = state;

  const handleContinue = () => {
    if (form.mailForm) {
      navigation.replace("Success", {
        form,
        state: navState,
        workflow_type: workflow_type,
        finish_with_state: false,
      });
    } else {
      navigation.replace("Print", {
        form,
        state: navState,
        workflow_type: workflow_type,
        finish_with_state: false,
      });
    }
  };

  const handleReminder = async () => {
    setIsSubmitting(true);
    try {
      await setUnder18Reminder({
        registration_uid,
        remind_when_18: true,
        opt_in_email: form.opt_in_email,
      });
      navigation.navigate("Under18Reminder", { state: navState, form });
    } catch (error) {
      console.error("set_under_18_reminder failed:", error);
      navigation.navigate("ApiError", {
        state: navState,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View>
      <Header text={t("general.register_in") + navState.name} />
      <Text style={styles.description}>
        <RenderHTML
          contentWidth={useWindowDimensions().width}
          source={{
            html: t("register_18_by_election_page.top_stmt")
              .replace(
                "<electionCenter>",
                `<a href="https://www.rockthevote.org/how-to-vote/${navState.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}/">`,
              )
              .replace("</electionCenter>", "</a>"),
          }}
          renderersProps={{
            a: {
              onPress: (_, href) =>
                href && Linking.openURL(href).catch(err => console.error(err)),
            },
          }}
          tagsStyles={{
            body: {
              fontSize: 15,
              color: theme.textPrimary,
              textAlign: "center",
              lineHeight: 22,
            },
            a: {
              color: theme.link,
              textDecorationLine: "underline",
              fontWeight: "bold",
            },
            strong: {
              fontWeight: "bold",
              color: theme.textPrimary,
            },
          }}
        />
      </Text>

      <View style={styles.buttonsContainer}>
        <Button
          title={t("register_18_by_election_page.continue_button_text")}
          onPress={handleContinue}
        />
        <Button
          title={t("register_18_by_election_page.remind_button_text")}
          disabled={isSubmitting}
          onPress={handleReminder}
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
    margin: 10,
  },
  buttonsContainer: {
    gap: 12,
    margin: 10,
  },
});
