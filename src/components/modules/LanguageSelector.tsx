import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import i18n from "@/i18n";
import { ThemeContext } from "@/styles/ThemeProvider";

interface LanguageOption {
  code: string;
  label: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "ph", label: "Tagalog" },
];

const LanguageSelector: React.FC = () => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerWrapper}>
        <Picker
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
        </Picker>
      </View>
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
      marginTop: 20,
      width: 300,
      alignSelf: "center",
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
