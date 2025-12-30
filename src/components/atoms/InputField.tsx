import React, { useContext } from "react";
import { View, TextInput, Text } from "react-native";
import { StyleSheet } from "react-native";
import HelpTooltip from "./HelpTooltip";
import { ThemeContext } from "@/styles/ThemeProvider";

interface InputFieldProp {
  label?: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  secureTextEntry?: boolean;
  disabled?: boolean;
  numeric?: boolean;
  maxLength?: number;
  errorMessage?: string;
  helpText?: string;
  onChangeText?: (text: string) => void;
}

const InputField = ({
  label,
  value,
  placeholder,
  required = false,
  secureTextEntry = false,
  disabled = false,
  errorMessage = "",
  numeric = false,
  helpText = "",
  onChangeText,
}: InputFieldProp) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {label}
        {required && <Text style={styles.requiredStar}> *</Text>} {helpText && <HelpTooltip text={helpText} />}
      </Text>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      <TextInput
        value={value ?? ""}
        style={[styles.textInput, errorMessage && styles.inputError]}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        disableFullscreenUI={disabled}
        keyboardType={numeric ? "number-pad" : "default"}
        maxLength={numeric ? 5 : undefined}
        onChangeText={onChangeText}
      />
    </View>
  )
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    inputContainer: {
      marginTop: 10,
      width: "100%"
    },
    inputLabel: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      marginBottom: 5,
      color: theme.textPrimary,
    },
    requiredStar: {
      color: theme.secondary,
    },
    textInput: {
      height: 45,
      borderColor: theme.borderColor,
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 16,
      backgroundColor: theme.white,
    },
    inputError: {
      borderColor: theme.secondary,
    },
    errorText: {
      color: theme.secondary,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 12,
      marginTop: 5,
    },
  });

export default InputField;
