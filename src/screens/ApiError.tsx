import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Header from "@/layout/Header";
import { ThemeContext } from "@/styles/ThemeProvider";
import type { RootStackParamList } from "@/components/organisms/Navigation";
import { StateData } from "@/utils/types";
import { CustomButton } from "@/components/atoms/CustomButton";

interface ApiErrorScreenProps {
  route: {
    params: { state: StateData; title?: string };
  };
}

export default function ApiErrorScreen({ route }: ApiErrorScreenProps) {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  const { title, state } = route.params;

  return (
    <View style={styles.container}>
      <Header
        text={title || t("nvra_form_page.register_in") + `${state.name}`}
      />
      <View style={styles.content}>
        <Text style={styles.errorText}>
          Something went wrong or page under construction.
        </Text>
        <CustomButton
          title={t("general.restart_test")}
          onPress={() => navigation.navigate("Home" as never)}
        />
      </View>
    </View>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1 },
    content: { marginHorizontal: 10 },
    errorText: { color: "red", textAlign: "center", marginVertical: 20 },
  });
