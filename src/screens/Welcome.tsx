import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomButton } from "@/components/atoms/CustomButton";
import black_logo from "@/assets/images/mobile_black_logo.png";
import { ONBOARDING_COMPLETED_KEY } from "@/utils/constants";
import { ThemeContext } from "@/styles/ThemeProvider";
import { Globe } from "lucide-react-native";
import RenderHTML from "react-native-render-html";

const ALL_LOCALES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "tl", label: "Tagalog" },
];

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { width } = useWindowDimensions();

  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const [remoteContent, setRemoteContent] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchRemoteData = async () => {
      try {
        throw new Error("API not available yet");
      } catch (error) {
        setRemoteContent(null);
      }
    };

    fetchRemoteData();
  }, []);

  const sortedLocales = [
    ...ALL_LOCALES.filter(l => l.code === currentLang),
    ...ALL_LOCALES.filter(l => l.code !== currentLang),
  ];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsDropdownOpen(false);
  };

  const handleGetStarted = async () => {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
    navigation.replace("CheckVoterStatus", {
      zip: "",
      email: "",
      form: {
        partner_id: 1,
        first_name: "",
        last_name: "",
        email: "",
        city: "",
        zip: "",
        aptunit: "",
        address: "",
        birthMonth: "",
        birthDay: "",
        birthYear: "",
        date_of_birth: "",
        phone: "",
        opt_in_email: false,
        opt_in_sms: true,
        volunteer: false,
        survey_question_1: "",
        survey_answer_1: "",
        survey_question_2: "",
        survey_answer_2: "",
      },
    });
  };

  return (
    <View style={styles.container}>
      <Image source={black_logo} style={styles.logo} resizeMode="contain" />

      <View style={styles.content}>
        <Text style={styles.header}>{t("misc.welcome.header")}</Text>

        <Text style={styles.text}>{t("misc.welcome.description1")}</Text>

        <RenderHTML
          contentWidth={width}
          source={{
            html: t("misc.welcome.description2"),
          }}
          tagsStyles={{
            body: {
              fontSize: 18,
              color: theme.textPrimary,
            },
            strong: {
              fontWeight: "bold",
            },
          }}
        />

        <CustomButton
          title={t("misc.welcome.get_started")}
          variant="outline-primary"
          onPress={handleGetStarted}
        />
      </View>

      <View style={styles.localeSelectorContainer}>
        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <View style={styles.dropdownHeaderContent}>
            <Globe size={16} color={theme.white} />
            <Text style={styles.dropdownText}>{sortedLocales[0].label}</Text>
            <Text style={styles.dropdownIcon}>
              {isDropdownOpen ? "▲" : "▼"}
            </Text>
          </View>
        </TouchableOpacity>

        {isDropdownOpen && (
          <View style={styles.dropdownMenu}>
            {sortedLocales.map(locale => (
              <TouchableOpacity
                key={locale.code}
                style={styles.dropdownItem}
                onPress={() => handleLanguageChange(locale.code)}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    locale.code === currentLang && styles.activeLocaleText,
                  ]}
                >
                  {locale.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      gap: 12,
      alignItems: "center",
      padding: 20,
      marginTop: 20,
    },
    logo: {
      width: "100%",
      height: 80,
      backgroundColor: "#000",
    },
    header: {
      fontSize: 22,
      fontWeight: "bold",
    },
    text: {
      fontSize: 18,
    },
    localeSelectorContainer: {
      alignSelf: "flex-end",
      marginRight: 10,
    },
    dropdownHeader: {
      padding: 8,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 6,
      backgroundColor: theme.gray,
    },
    dropdownHeaderContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    dropdownText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.white,
    },
    dropdownIcon: {
      fontSize: 8,
      color: theme.white,
    },
    dropdownMenu: {
      position: "absolute",
      top: 40,
      right: 0,
      backgroundColor: theme.white,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 6,
      width: 120,
      elevation: 3,
      shadowColor: theme.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
    },
    dropdownItem: {
      padding: 10,
    },
    dropdownItemText: {
      fontSize: 14,
    },
    activeLocaleText: {
      fontWeight: "bold",
      color: theme.primary,
    },
  });
