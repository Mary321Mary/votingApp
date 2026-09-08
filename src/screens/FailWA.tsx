import React, { useContext, useEffect } from "react";
import { StyleSheet, ScrollView, useWindowDimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RenderHTML from "react-native-render-html";
import Header from "@/layout/Header";
import { ThemeContext } from "@/styles/ThemeProvider";
import { RootStackParamList } from "@/components/organisms/Navigation";
import {
  RegisterFormState,
  StateData,
  SubmitEmailZipResponseProps,
} from "@/utils/types";
import { CovrCheckMethodName } from "../utils/report/covrFailReporting";
import { useCovrFailReportEvent } from "../utils/hooks/useCovrFailReportEvent";

const PERSONAL_INFO_LINK = "app://personal-info-link/";
const PAPER_FORM_LINK = "app://paper-link/";

interface FailWAScreenProps {
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

type FailWAScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "FailWA"
>;

export default function FailWAScreen({ route }: FailWAScreenProps) {
  const { t } = useTranslation();
  const navigation = useNavigation<FailWAScreenNavigation>();
  const theme = useContext(ThemeContext);
  const { width } = useWindowDimensions();
  const styles = getStyles();

  const params = route.params;

  useCovrFailReportEvent(
    "WA covr error",
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

  const { state, zip, email, form } = params;

  const handleLinkPress = (_event: unknown, href?: string) => {
    const defaultStatus = { success: true, errors: null };

    if (href === PERSONAL_INFO_LINK) {
      navigation.goBack();
    } else if (href === PAPER_FORM_LINK) {
      const navigationState: SubmitEmailZipResponseProps = {
        status: defaultStatus,
        state: state,
        zip: zip,
        email: email,
        form: form,
        pageFromLookup: "paper",
        workflowType: "nvra",
        initialStep: 1,
      };

      navigation.replace("Register", navigationState);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header text={t("washington.error_title")} />
      <RenderHTML
        contentWidth={width}
        baseStyle={styles.bodyText}
        source={{
          html: t("washington.error_text", {
            wa_personal_info_url: PERSONAL_INFO_LINK,
            rtv_paper_form_url: PAPER_FORM_LINK,
          }),
        }}
        tagsStyles={{
          a: {
            color: theme.link,
            textDecorationLine: "underline",
          },
        }}
        renderersProps={{
          a: { onPress: handleLinkPress },
        }}
      />
    </ScrollView>
  );
}

const getStyles = () =>
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
  });
