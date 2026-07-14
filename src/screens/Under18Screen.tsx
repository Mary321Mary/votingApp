import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Trans, useTranslation } from "react-i18next";
import Header from "@/layout/Header";
import { RegisterFormState, StateData } from "@/utils/types";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { RootStackParamList } from "@/components/organisms/Navigation";
// import { useNavigation } from "@react-navigation/native";

interface Under18ScreenProps {
  route: {
    params: {
      state: StateData;
      form: RegisterFormState;
      zip: string;
      email: string;
      workflow_type: string;
      registration_uid: string;
    };
  };
}

// type Under18ScreenNavigation = NativeStackNavigationProp<
//   RootStackParamList,
//   "Under18"
// >;

export const Under18Screen = ({ route }: Under18ScreenProps) => {
  const { t } = useTranslation();
  const state = route?.params?.state;
  // const navigation = useNavigation<Under18ScreenNavigation>();
  // const [isSubmitting, setIsSubmitting] = useState(false);

  // const handleReminder = async () => {
  //   setIsSubmitting(true);
  //   try {
  //     const response = await setUnder18Reminder({
  //       registration_uid,
  //       remind_when_18: true,
  //       opt_in_email: form.opt_in_email,
  //     });
  //     navigation.navigate(PATH.UNDER_18_REMINDER, { state: { state, form } });
  //   } catch (error) {
  //     console.error("set_under_18_reminder failed:", error);
  //     navigation.navigate("ApiError", {
  //       state: navState.state,
  //       form: navState.form,
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  return (
    <View>
      <Header text={t("general.register_in") + state.name} />
      <Text style={styles.description}>
        <Trans
          i18nKey="register_18_by_election_page.top_stmt"
          components={{
            strong: <strong />,
            electionCenter: (
              <a
                href={`https://www.rockthevote.org/how-to-vote/${state.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}/`}
                target="_blank"
                rel="noopener noreferrer"
              />
            ),
          }}
        />
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
