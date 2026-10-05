import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Globe } from "lucide-react-native";
import i18n, { LANGUAGE_KEY } from "@/i18n";
import { ThemeContext } from "@/styles/ThemeProvider";

const LanguageSelector: React.FC = () => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const [selectedLanguage, setSelectedLanguage] = useState(
    i18n.language.split("-")[0],
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleLanguageChanged = (language: string) => {
      setSelectedLanguage(language.split("-")[0]);
    };

    i18n.on("languageChanged", handleLanguageChanged);
    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, []);

  const changeLanguage = async (lang: string) => {
    if (selectedLanguage === lang) return;

    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    setIsDropdownOpen(false);
  };

  const languages = [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
    { code: "tl", label: "Tagalog" },
  ];
  const orderedLanguages = [
    ...languages.filter(language => language.code === selectedLanguage),
    ...languages.filter(language => language.code !== selectedLanguage),
  ];

  return (
    <View style={styles.localeSelectorContainer}>
      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <View style={styles.dropdownHeaderContent}>
          <Globe size={16} color={theme.white} />
          <Text style={styles.dropdownText}>{orderedLanguages[0].label}</Text>
          <Text style={styles.dropdownIcon}>{isDropdownOpen ? "▲" : "▼"}</Text>
        </View>
      </TouchableOpacity>
      {isDropdownOpen && (
        <View style={styles.dropdownMenu}>
          {orderedLanguages.map(locale => (
            <TouchableOpacity
              key={locale.code}
              style={styles.dropdownItem}
              onPress={() => changeLanguage(locale.code)}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  locale.code === selectedLanguage && styles.activeLocaleText,
                ]}
              >
                {locale.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      padding: 10,
      backgroundColor: theme.background,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.borderColor,
      marginBottom: 20,
      width: 300,
      alignSelf: "center",
    },
    block: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 10,
    },
    option: {
      color: theme.textPrimary,
    },
    activeOption: {
      fontWeight: "bold",
      textDecorationLine: "none",
    },
    inactiveOption: {
      fontWeight: "normal",
      textDecorationLine: "underline",
    },
    pickerWrapper: {
      backgroundColor: theme.white,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: theme.borderColor,
      overflow: "hidden",
    },
    picker: {
      width: "100%",
      color: theme.textPrimary,
    },
    pickerItem: {
      // Эти стили применяются в основном на iOS
      fontSize: 16,
      height: 50,
      // Стилизация активного элемента, как в вашем примере (fontWeight: 'bold'),
      // в Picker для Android и iOS реализуется очень сложно или не поддерживается.
      // Обычно используется стандартный внешний вид системы.
    },

    localeSelectorContainer: {
      alignSelf: "flex-end",
      marginRight: 10,
      marginBottom: 10,
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

export default LanguageSelector;
