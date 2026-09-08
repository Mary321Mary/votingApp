import React, { useContext, useEffect } from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import { Trans, useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Header from "@/layout/Header";
import { ThemeContext } from "@/styles/ThemeProvider";
import { RootStackParamList } from "@/components/organisms/Navigation";
import { RegisterFormState, StateData } from "@/utils/types";
import { useCovrFailReportEvent } from "../utils/hooks/useCovrFailReportEvent";
import { CovrCheckMethodName } from "../utils/report/covrFailReporting";

interface FailMIScreenProps {
  route: {
    params?: {
      state: StateData;
      zip: string;
      email: string;
      form: RegisterFormState;
      apiTimeoutMethod?: CovrCheckMethodName;
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
  const params = route.params;

  useCovrFailReportEvent(
    "MI covr error",
    params?.form,
    params?.apiTimeoutMethod,
  );

  useEffect(() => {
    if (!params?.state || !params?.form) {
      navigation.replace("Home");
    }
  }, [navigation, params]);

  if (!params?.state || !params?.form) {
    return null;
  }

  const { state, form } = params;

  const handlePaperRegistration = () => {
    navigation.replace("Register", {
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
    navigation.replace("Register", {
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header text={t("michigan.error_title")} />
      <Text style={styles.bodyText}>
        <Trans
          i18nKey="michigan.error_text"
          components={{
            p: <Text style={styles.bodyText} />,
            personalInfoLink: (
              <Text style={styles.link} onPress={handleOnlineRegistration} />
            ),
            paperFormLink: (
              <Text style={styles.link} onPress={handlePaperRegistration} />
            ),
          }}
        />
      </Text>
    </ScrollView>
  );
}

const getStyles = (theme: { primary: string }) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      paddingBottom: 24,
    },
    bodyText: {
      paddingHorizontal: 20,
      fontSize: 16,
      lineHeight: 24,
      marginTop: 16,
    },
    link: {
      color: theme.primary,
      textDecorationLine: "underline",
    },
  });
