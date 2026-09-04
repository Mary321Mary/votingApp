import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Linking,
  Button,
  ScrollView,
} from "react-native";
import { Trans, useTranslation } from "react-i18next";
import { ThemeContext } from "@/styles/ThemeProvider";
import Header from "@/layout/Header";
import { RegisterFormState, StateData } from "@/utils/types";
import RenderHTML from "react-native-render-html";

// type LookupScreenNavigation = NativeStackNavigationProp<
//   RootStackParamList,
//   "Lookup"
// >;

interface LookupScreenProps {
  route: {
    params: {
      state: StateData;
      form: RegisterFormState;
    };
  };
}

export default function LookupScreen({ route }: LookupScreenProps) {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { width } = useWindowDimensions();
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
        <Text>
          <RenderHTML
            contentWidth={width}
            source={{
              html: t("lookup_success_page.success_statement", {
                user_first_name: form.first_name,
              }),
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
        </Text>
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
        <Text style={styles.textLi}>Voter Status: Active</Text>
        <Text>
          <RenderHTML
            contentWidth={width}
            source={{
              html: t("lookup_success_page.success_question"),
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
        </Text>
        <Button
          title={t("lookup_success_page.cta_learn_about", {
            state_abbr: state?.abbreviation,
          })}
          onPress={() => Linking.openURL(state?.learn_about_url || "")}
        />
        <Text style={styles.bold}>
          {t("lookup_success_page.something_wrong")}
        </Text>
        <View style={styles.divider} />
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
