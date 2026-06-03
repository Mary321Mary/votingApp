import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/components/organisms/Navigation";
import { RegisterFormState, StateData } from "@/utils/types";
import Header from "@/layout/Header";
import { ThemeContext } from "@/styles/ThemeProvider";
import RenderHTML from "react-native-render-html";

interface FailMIScreenProps {
  route: {
    params: {
      state: StateData;
      form: RegisterFormState;
    };
  };
}

type FailMIScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "FailMI"
>;

export default function FailMIScreen({ route }: FailMIScreenProps) {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<FailMIScreenNavigation>();
  const { state, form } = route.params;
  const { width } = useWindowDimensions();

  const handlePaperRegistration = () => {
    navigation.navigate("Register", {
      status: { success: true, errors: [] },
      state,
      zip: form.home_zip_code,
      email: form.email_address,
      form: {
        ...form,
        home_address:
          form.street_name +
          " " +
          form.street_number +
          " " +
          form.street_type +
          " " +
          form.street_direction,
      },
      pageFromLookup: "paper",
      workflowType: "nvra",
      showRedirectText: true,
    });
  };

  const handleOnlineRegistration = () => {
    navigation.navigate("Register", {
      status: { success: true, errors: [] },
      state,
      zip: form.home_zip_code,
      email: form.email_address,
      form,
      pageFromLookup: "connected_ovr",
      showRedirectText: true,
    });
  };

  return (
    <>
      <Header text={t("michigan.error_title")} />
      <View style={styles.block}>
        <Text style={styles.text}>{t("michigan.error_text_1")}</Text>

        <Text style={styles.text}>
          {t("michigan.error_text_2")}{" "}
          <Text style={styles.link} onPress={handleOnlineRegistration}>
            {t("michigan.error_text_3")}
          </Text>{" "}
          {t("michigan.error_text_4")}
        </Text>

        <RenderHTML
          contentWidth={width}
          source={{
            html: t("michigan.error_text_5", {
              rtv_paper_form_url: "paper-link",
            }),
          }}
          tagsStyles={{
            body: {
              fontSize: 14,
              lineHeight: 18,
              marginBottom: 20,
              textAlign: "center",
            },
            a: {
              color: theme.link,
              textDecorationLine: "underline",
            },
          }}
          renderersProps={{
            a: { onPress: handlePaperRegistration },
          }}
        />

        <Button
          title={t("michigan.error_text_3")}
          onPress={handlePaperRegistration}
        />
      </View>
    </>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    block: {
      margin: 10,
    },
    text: {
      fontSize: 14,
      lineHeight: 22,
      textAlign: "center",
      marginBottom: 20,
    },
    link: {
      color: theme.link,
      textDecorationLine: "underline",
      fontWeight: "600",
    },
  });
