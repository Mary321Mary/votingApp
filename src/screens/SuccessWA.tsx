import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Linking,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Header from "@/layout/Header";
import { ThemeContext } from "@/styles/ThemeProvider";
import { RootStackParamList } from "@/components/organisms/Navigation";
import { StateData } from "@/utils/types";

interface SuccessWAScreenProps {
  route: {
    params?: {
      state: StateData;
    };
  };
}

type SuccessWAScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "SuccessWA"
>;

export const SuccessWAScreen = ({ route }: SuccessWAScreenProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<SuccessWAScreenNavigation>();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  const params = route.params;

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
      <Header text={t("washington.success_title")} />
      <View style={styles.body}>
        <Text style={styles.bodyText}>{t("washington.success_text_1")}</Text>
        <Text style={styles.bodyText}>{t("washington.success_text_2")}</Text>
        <View style={styles.buttonGroup}>
          <Button
            title={t("washington.success_button_1")}
            color={theme.primary}
            onPress={handleLearnAbout}
          />
          <View style={styles.buttonSpacer} />
          <Button
            title={t("washington.success_button_2")}
            color={theme.primary}
            onPress={() => {}}
          />
          <View style={styles.buttonSpacer} />
          <Button
            title={t("washington.success_button_3")}
            color={theme.primary}
            onPress={() => {}}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const getStyles = (theme: { primary: string }) =>
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
    },
    buttonSpacer: {
      height: 12,
    },
  });
