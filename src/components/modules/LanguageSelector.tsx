import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import i18n from "@/i18n";
import { COLORS } from "@/styles/colors";

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

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    margin: 20,
    width: 300,
    alignSelf: "center",
  },
  pickerWrapper: {
    backgroundColor: COLORS.white,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#333",
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
