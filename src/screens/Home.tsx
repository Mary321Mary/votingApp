import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Linking,
} from "react-native";
import { useTranslation } from "react-i18next";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import InputField from "@/components/atoms/InputField";
import { RootStackParamList } from "@/components/organisms/Navigation";
import { submitEmailZipFake, submitEmailZip } from "@/utils/api";
import Header from "@/components/modules/Header";
import Config from "react-native-config";
import { useUIConfig } from "@/contexts/UIConfigContext";
import { ThemeContext } from "@/styles/ThemeProvider";
import i18n from "i18n";

const { width } = Dimensions.get("window");

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const { config } = useUIConfig();
  const policyUrl = config?.urls?.privacy || '';

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
        const response = await submitEmailZip({ email, zip: zipCode, locale: i18n.language });
        navigation.navigate("Register", response.data);
      } catch (error) {
        console.error("Register failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
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
          helpText="We will email you a copy of your voter registration form"
          onChangeText={handleEmailChange}
        />
        <View style={styles.zipCodeRow}>
          <View style={{ flex: 1 }}>
            <InputField
              label={t("zip")}
              placeholder="12345"
              required
              numeric
              disabled={isLoading}
              errorMessage={errors.zip}
              helpText="Enter ZIP code for the address where you live, even if you don't receive mail there"
              onChangeText={handleZipCode}
            />
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>{t("register")}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.privacyNote}>{t("accept1")}{" "}
          <Text style={styles.linkText} onPress={() =>
            Linking.openURL(policyUrl)}>
            {t("policy")}
          </Text>
          {t("accept2")}</Text>
        <View style={styles.registeredSection}>
          <View style={styles.textColumn}>
            <Text style={styles.sectionTitle}>{t("registered")}</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => console.log("Continue pressed")}
          >
            <Text style={styles.buttonText}>{t("continue")}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.noteSmall}>
          <Text style={styles.noteBold}>{t('note')}</Text>{t('note_text')}{" "}
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
    </>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    // --- CARD STYLES ---
    card: {
      width: width > 600 ? 500 : "90%",
      paddingTop: 30,
    },
    instructionText: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 16,
      textAlign: "center",
      marginBottom: 10,
      color: theme.textPrimary,
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
      fontWeight: "semibold",
    },
    privacyNote: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      textAlign: "center",
      marginBottom: 30,
      color: theme.textPrimary,
    },
    // --- REGISTERED SECTION STYLES ---
    registeredSection: {
      borderTopWidth: 1,
      borderTopColor: theme.borderColor,
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
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 16,
      marginBottom: 5,
      color: theme.textPrimary,
    },
    noteSmall: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 12,
      marginBottom: 10,
      color: theme.textPrimary,
    },
    noteBold: {
      fontWeight: "bold",
    },
    linkText: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      color: theme.link,
      textDecorationLine: "underline",
      fontWeight: "medium",
    },
    bold: {
      fontWeight: "bold",
    },
    extraLink: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      color: theme.textPrimary,
    },
  });

export default HomeScreen;
