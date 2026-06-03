import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  ScrollView,
  Button,
} from "react-native";
import { Trans, useTranslation } from "react-i18next";
import { ThemeContext } from "@/styles/ThemeProvider";
import Header from "@/layout/Header";
import { RegisterFormState, StateData } from "@/utils/types";
import { RootStackParamList } from "@/components/organisms/Navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type LookupNotFoundScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "LookupNotFound"
>;

interface LookupNotFoundScreenProps {
  route: {
    params: {
      state: StateData;
      form: RegisterFormState;
    };
  };
}

export default function LookupNotFoundScreen({
  route,
}: LookupNotFoundScreenProps) {
  const { t } = useTranslation();
  const navigation = useNavigation<LookupNotFoundScreenNavigation>();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { state, form } = route.params;

  const handleOpenLink = async () => {
    const url = state?.online_registration_system_url;

    if (url) {
      await Linking.openURL(url);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header
        text={t("lookup_not_found_page.failure_title", {
          state_abbr: state?.abbreviation,
        })}
      />
      <View style={styles.content}>
        <Text style={styles.textLi}>
          {form?.first_name}
          {t("lookup_not_found_page.failure_statement")}
        </Text>
        <Text>{t("lookup_not_found_page.failure_body")}</Text>
        <View style={styles.list}>
          {/* Item 1 */}
          <View style={styles.listItem}>
            <Text style={styles.number}>1.</Text>

            <Text style={styles.textLi}>
              <Trans
                i18nKey="lookup_not_found_page.failure_body1"
                components={{
                  strong: <Text style={styles.bold} />,
                }}
              />{" "}
              {t("lookup_not_found_page.failure_body1a")}{" "}
              <Text style={styles.bold}>{state?.recent_register_date}</Text>{" "}
              {t("lookup_not_found_page.failure_body1b")}
              <Text style={styles.link} onPress={handleOpenLink}>
                {t("lookup_not_found_page.failure_body1_url_text", {
                  state_abbr: state?.abbreviation,
                })}
              </Text>
            </Text>
          </View>

          {/* Item 2 */}
          <View style={styles.listItem}>
            <Text style={styles.number}>2.</Text>

            <Text style={styles.textLi}>
              {t("lookup_not_found_page.failure_body2")}
            </Text>
          </View>

          {/* Item 3 */}
          <View style={styles.listItem}>
            <Text style={styles.number}>3.</Text>

            <Text style={styles.textLi}>
              {t("lookup_not_found_page.failure_body3")}
            </Text>
          </View>
        </View>
        <Button
          title={t("lookup_not_found_page.cta_register")}
          onPress={() => {
            navigation.replace("Register", {
              status: { success: true },
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
              showRedirectText: false,
            } as any);
          }}
        />
        <Button
          title={t("lookup_not_found_page.cta_try_again")}
          onPress={() => navigation.goBack()}
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

    linkRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
      gap: 4,
    },

    link: {
      color: theme.link,
      fontSize: 15,
      textDecorationLine: "underline",
    },
  });
