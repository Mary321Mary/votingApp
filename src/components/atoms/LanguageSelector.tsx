import React, { useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import i18n from "@/i18n";
import { ThemeContext } from "@/styles/ThemeProvider";
import { loadRemoteTranslations } from "@/i18n/loader";
import { clearTranslationsCache } from "@/i18n/cache";

const LanguageSelector: React.FC = () => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  const changeLanguage = async (lang: string) => {
    if (i18n.language === lang) return;

    await loadRemoteTranslations(lang);
    await i18n.changeLanguage(lang);
  };

  const getOptionStyle = (langCode: string) => [
    styles.option,
    i18n.language === langCode ? styles.activeOption : styles.inactiveOption
  ];

  return (
    // <View style={styles.container}>
    <>
      <View style={styles.block}>
        <TouchableOpacity onPress={() => changeLanguage("en")}>
          <Text style={getOptionStyle("en")}>
            English
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeLanguage("es")}>
          <Text style={getOptionStyle("es")}>
            Español
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeLanguage("tl")}>
          <Text style={getOptionStyle("tl")}>
            Tagalog
          </Text>
        </TouchableOpacity>
        {/* <Picker
          selectedValue={i18n.language}
          style={styles.picker}
          onValueChange={itemValue => changeLanguage(itemValue)}
          itemStyle={styles.pickerItem}
        >
          {LANGUAGES.map(lang => (
            <Picker.Item
              key={lang.code}
              label={lang.label}
              value={lang.code}
            // Примечание: Style для Picker.Item обычно работает только на iOS.
            // Для Android стилизация текста внутри Item ограничена.
            />
          ))}
        </Picker> */}

      </View>
      <Button
        title="Refresh translations"
        onPress={async () => {
          const lang = i18n.language;

          await clearTranslationsCache(lang);
          await loadRemoteTranslations(lang);
          await i18n.changeLanguage(lang);
        }}
      />
    </>
    // </View>
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
      borderRadius: 4,
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
  });

export default LanguageSelector;
