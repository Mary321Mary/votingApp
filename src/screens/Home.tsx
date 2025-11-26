import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { COLORS } from "@/styles/colors";
import InputField from "@/components/modules/InputField";
import { RootStackParamList } from "@/components/organisms/Navigation";
import { submitEmailZipFake } from "@/utils/api";
import { SubmitEmailZipResponse } from "@/utils/types";
import Header from "@/components/modules/Header";
import Footer from "@/components/modules/Footer";
import Config from "react-native-config";

const { width } = Dimensions.get("window");

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [errors, setErrors] = useState<{ email?: string; zip?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Validation logic
  const validate = () => {
    const newErrors: { email?: string; zip?: string } = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!zipCode) {
      newErrors.zip = "Zip is required";
    } else if (zipCode.length !== 5) {
      newErrors.zip = "Zip must be 5 numbers";
    } else if (!/^\d{5}$/.test(zipCode)) {
      newErrors.zip = "Zip must be number";
    }
    return newErrors;
  };

  // Handle input changes and clear errors
  const handleEmailChange = (text: string) => {
    setEmail(text);
    setErrors(prev => ({ ...prev, email: undefined }));
  };

  const handleZipCode = (text: string) => {
    setZipCode(text);
    setErrors(prev => ({ ...prev, zip: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      try {
        const response = await submitEmailZipFake({ email, zip: zipCode });
        navigation.navigate("Register", response as SubmitEmailZipResponse);
      } catch (error) {
        console.error("Login failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Header text={t("register_vote")} />
        <View style={styles.card}>
          <Text style={styles.instructionText}>{t("register_text1")}</Text>
          <Text style={[styles.instructionText, styles.mbLarge]}>
            {t("register_text2")}
          </Text>
          <InputField
            label={t("email")}
            placeholder="you@example.com"
            required
            disabled={isLoading}
            errorMessage={errors.email}
            onChangeText={handleEmailChange}
          />
          <View style={styles.zipCodeRow}>
            <InputField
              label={t("zip")}
              placeholder="12345"
              required
              numeric
              disabled={isLoading}
              errorMessage={errors.zip}
              onChangeText={handleZipCode}
            />
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>{t("register_vote")}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.privacyNote}>{t("accept")}</Text>
          <View style={styles.registeredSection}>
            <View style={styles.textColumn}>
              <Text style={styles.sectionTitle}>{t("registered")}</Text>
            </View>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => console.log("Continue pressed")}
            >
              <Text style={styles.buttonText}>{t("continue")}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.noteSmall}>
            {t("note")}{" "}
            <Text
              style={styles.linkText}
              onPress={() =>
                Linking.openURL(Config.REACT_APP_LEARN_MORE || "*")
              }
            >
              {t("learn_more")}
            </Text>
          </Text>
          <Text style={styles.extraLink}>
            {t("living_abroad")}{" "}
            <Text
              style={styles.linkText}
              onPress={() => Linking.openURL(Config.REACT_APP_OVERSEAS || "*")}
            >
              {t("overseas")}
            </Text>
          </Text>
        </View>
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 40,
  },
  // --- CARD STYLES ---
  card: {
    width: width > 600 ? 500 : "90%",
    paddingTop: 30,
  },
  instructionText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 10,
  },
  mbLarge: {
    marginBottom: 30,
  },
  // --- ROW STYLES ---
  zipCodeRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
    height: 45,
    justifyContent: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  privacyNote: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 30,
  },
  // --- REGISTERED SECTION STYLES ---
  registeredSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
    paddingTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  textColumn: {
    flex: 1,
    paddingRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  noteSmall: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  linkText: {
    fontSize: 12,
    color: COLORS.primary,
    textDecorationLine: "underline",
    fontWeight: "bold",
    lineHeight: 18,
  },
  bold: {
    fontWeight: "700",
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    minHeight: 45,
    justifyContent: "center",
  },
  extraLink: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 40,
  },
});

export default HomeScreen;
