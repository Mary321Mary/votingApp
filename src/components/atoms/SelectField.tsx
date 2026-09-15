import React, { useContext, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../styles/ThemeProvider";
import { useFormScroll } from "../../contexts/FormScrollContext";
import HelpTooltip from "./HelpTooltip";

export interface SelectOption {
  name: string;
  value: string;
}

export interface SelectFieldProps {
  name: string;
  label: string;
  value?: string;
  options: SelectOption[];
  required?: boolean;
  errorMessage?: string;
  helpText?: string;
  searchable?: boolean;
  placeholder?: string;
  disabled?: boolean;
  onValueChange: (itemValue: string) => void;
}

export const SelectField = ({
  name,
  label,
  value,
  options = [],
  required = false,
  errorMessage,
  helpText = "",
  searchable = false,
  placeholder = "",
  disabled = false,
  onValueChange,
}: SelectFieldProps) => {
  const theme = useContext(ThemeContext);
  const { t } = useTranslation();
  const { registerField } = useFormScroll();
  const styles = getStyles(theme);

  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedOption = useMemo(
    () => options.find(opt => opt.value === value),
    [options, value],
  );

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(
      opt =>
        opt.name.toLowerCase().includes(query) ||
        opt.value.toLowerCase().includes(query),
    );
  }, [options, searchQuery]);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setModalVisible(false);
    setSearchQuery("");
  };

  const handleOpenModal = () => {
    if (!disabled) {
      setModalVisible(true);
    }
  };

  return (
    <View>
      {/* Label */}
      <Text style={styles.inputLabel}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
        {helpText ? <HelpTooltip text={helpText} /> : null}
      </Text>

      {errorMessage && <Text style={styles.required}>{t(errorMessage)}</Text>}

      <TouchableOpacity
        ref={registerField(name, handleOpenModal)}
        disabled={disabled}
        style={[
          styles.pickerWrapper,
          disabled && styles.disabledWrapper,
          errorMessage ? styles.errorBorder : null,
        ]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.selectedText,
            !selectedOption && styles.placeholderText,
          ]}
          numberOfLines={1}
        >
          {selectedOption ? selectedOption.name : placeholder}
        </Text>
        <Text style={styles.arrowIcon}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSearchQuery("");
                }}
              >
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {searchable && (
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor={theme.gray}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                clearButtonMode="while-editing"
              />
            )}

            <FlatList
              data={filteredOptions}
              keyExtractor={item => item.value}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      isSelected && styles.selectedOptionItem,
                    ]}
                    onPress={() => handleSelect(item.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No results found</Text>
              }
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    inputLabel: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "bold",
      color: theme.textPrimary,
      marginTop: 5,
      marginBottom: 4,
    },
    required: {
      color: theme.secondary || "red",
    },
    pickerWrapper: {
      minWidth: "100%",
      height: 45,
      backgroundColor: theme.white,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 5,
      paddingHorizontal: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    disabledWrapper: {
      backgroundColor: theme.disabledBg || "#f0f0f0",
      opacity: 0.7,
    },
    errorBorder: {
      borderColor: theme.secondary || "red",
    },
    selectedText: {
      fontSize: 14,
      color: theme.textPrimary,
      flex: 1,
    },
    placeholderText: {
      color: theme.textSecondary || "#888",
    },
    arrowIcon: {
      fontSize: 10,
      color: theme.textPrimary,
      marginLeft: 8,
    },
    /* Модальное окно */
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: theme.white,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      maxHeight: "80%",
      padding: 16,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.textPrimary,
    },
    closeButton: {
      fontSize: 18,
      color: theme.textPrimary,
      padding: 4,
    },
    searchInput: {
      height: 40,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 8,
      paddingHorizontal: 10,
      fontSize: 14,
      color: theme.textPrimary,
      marginBottom: 12,
      backgroundColor: theme.white,
    },
    optionItem: {
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.borderColor,
    },
    selectedOptionItem: {
      backgroundColor: theme.activeBg || "#f0f7ff",
    },
    optionText: {
      fontSize: 14,
      color: theme.textPrimary,
    },
    selectedOptionText: {
      fontWeight: "bold",
      color: theme.primary || "#0066cc",
    },
    emptyText: {
      textAlign: "center",
      padding: 20,
      color: theme.textSecondary || "#888",
      fontSize: 14,
    },
  });
