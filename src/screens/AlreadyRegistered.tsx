import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Button,
  ScrollView,
} from "react-native";
import { useTranslation } from "react-i18next";
import RenderHTML from "react-native-render-html";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ThemeContext } from "@/styles/ThemeProvider";
import Header from "@/layout/Header";
import { RegisterFormState, StateData } from "@/utils/types";
import type { RootStackParamList } from "@/components/organisms/Navigation";

interface AlreadyRegisteredScreenProps {
  route: {
    params: {
      state: StateData;
      form: RegisterFormState;
      workflow_type: string;
    };
  };
}

export default function AlreadyRegisteredScreen({
  route,
}: AlreadyRegisteredScreenProps) {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { width } = useWindowDimensions();
  const state = route.params?.state;
  const form = route.params?.form;

  useEffect(() => {
    if (!state || !form) {
      navigation.replace("Home");
    }
  }, [state, form, navigation]);

  if (!state || !form) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Header text={t("hidden_vr_lookup_found.hvr_title")} />
      <View style={styles.content}>
        <RenderHTML
          contentWidth={width}
          source={{
            html: t("hidden_vr_lookup_found.hvr_statement"),
          }}
          tagsStyles={{
            body: {
              fontSize: 14,
              lineHeight: 18,
              marginVertical: 5,
            },
            strong: {
              fontWeight: "bold",
            },
            br: { height: 1 },
          }}
        />
        <Text style={styles.text}>
          {form.first_name} {form.last_name}
          {form.suffix && ` ${form.suffix}`}
        </Text>
        <Text style={styles.text}>{form.home_address}</Text>
        <Text style={styles.text}>
          {form.home_city}, {state?.abbreviation} {form.home_zip_code}
        </Text>
        <Text style={styles.textLi}>
          {t("lookup_success_page.birth_date")}
          {new Date(
            Number(form.birthYear),
            Number(form.birthMonth) - 1,
            Number(form.birthDay),
          ).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
        <Text style={styles.textLi}>
          {t("lookup_success_page.voter_status")}
        </Text>
        <View style={styles.container_yellow}>
          <Text style={styles.text_yellow}>
            {t("hidden_vr_lookup_found.hvr_warning")}
          </Text>
        </View>

        <Button
          title={t("hidden_vr_lookup_found.hvr_yes_button_text")}
          onPress={() => {
            if (form.mailForm) {
              navigation.replace("Success", {
                form,
                state,
                workflow_type: route.params.workflow_type,
                finish_with_state: false,
              });
            } else {
              navigation.replace("Print", {
                form,
                state,
                workflow_type: route.params.workflow_type,
                finish_with_state: false,
              });
            }
          }}
        />
        <Button
          title={t("hidden_vr_lookup_found.hvr_no_button_text")}
          onPress={() => {
            if (form.mailForm) {
              navigation.replace("Success", {
                form,
                state,
                workflow_type: route.params.workflow_type,
                finish_with_state: false,
              });
            } else {
              navigation.replace("Print", {
                form,
                state,
                workflow_type: route.params.workflow_type,
                finish_with_state: false,
              });
            }
          }}
        />
      </View>
    </ScrollView>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.white,
    },

    content: {
      paddingHorizontal: 10,
      paddingBottom: 20,
      maxWidth: "100%",
      gap: 12,
    },

    text: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 16,
      fontWeight: "regular",
      lineHeight: 22,
      color: theme.textPrimary,
      textTransform: "uppercase",
    },
    bold: {
      fontWeight: "bold",
    },
    divider: {
      height: 1,
      backgroundColor: theme.gray,
      marginVertical: 5,
    },
    list: {
      gap: 16,
    },
    listItem: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    number: {
      width: 24,
      fontSize: 16,
    },

    textLi: {
      marginRight: 10,
      fontSize: 15,
      lineHeight: 22,
    },
    container_yellow: {
      backgroundColor: "#fff3cd", // bg-warning-subtle
      borderLeftWidth: 4, // border-start border-4
      borderLeftColor: "#ffc107", // border-warning
      borderTopRightRadius: 6, // rounded-end
      borderBottomRightRadius: 6, // rounded-end
      padding: 12, // p-3
    },
    text_yellow: {
      color: "#212529", // text-dark
      fontSize: 14,
    },

    link: {
      color: theme.link,
      fontSize: 15,
      textDecorationLine: "underline",
    },
  });
