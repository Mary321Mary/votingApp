import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/components/organisms/Navigation";
import Header from "@/components/modules/Header";
import { COLORS } from "@/styles/colors";

type RegisterScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

export default function RegisterScreen() {
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
    <ScrollView contentContainerStyle={styles.container}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: COLORS.white,
  },
  box: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: COLORS.background,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
    color: COLORS.textPrimary,
  },
  bold: {
    fontWeight: "700",
  },
  errorText: {
    color: COLORS.secondary,
    fontSize: 16,
    marginBottom: 6,
  },
  button: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
});
