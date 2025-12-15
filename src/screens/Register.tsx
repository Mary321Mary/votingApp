import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/components/organisms/Navigation";
import Header from "@/components/modules/Header";
import { ThemeContext } from "@/styles/ThemeProvider";

type RegisterScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

export default function RegisterScreen() {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<RegisterScreenNavigation>();
  const route = useRoute<any>();

  const state = route?.params ?? null;

  const [title, setTitle] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (state !== null) {
      setTitle(
        state.status.success
          ? `Register in ${state.state.name}`
          : "Zip Code Error",
      );
      setIsSuccess(state.status.success);
      setErrors(state.status.errors);
    } else {
      setErrors([]);
    }
  }, [state]);

  return (
    <>
      <Header text={title} />
      <View style={styles.box}>
        {isSuccess ? (
          <View>
            <Text style={styles.text}>{state.state.ovr_type}</Text>
            <Text style={styles.text}>
              {state.state.not_participating_text}
            </Text>

            <Text style={[styles.text, styles.bold]}>User:</Text>
            <Text style={styles.text}>
              {state.user.first_name} {state.user.last_name}
            </Text>
          </View>
        ) : (
          <View>
            {errors.map((err: string, index: number) => (
              <Text key={index} style={styles.errorText}>
                {err}
              </Text>
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>{t("return")}</Text>
      </TouchableOpacity>
    </>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    box: {
      marginVertical: 20,
      padding: 15,
      backgroundColor: theme.background,
      borderRadius: 10,
    },
    text: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      marginBottom: 6,
      color: theme.textPrimary,
    },
    bold: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontWeight: "700",
    },
    errorText: {
      color: theme.secondary,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 12,
      marginBottom: 6,
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderRadius: 5,
      marginLeft: 10,
      height: 45,
      justifyContent: "center",
    },
    buttonText: {
      color: theme.white,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 16,
      fontWeight: "600",
    },
  });
