import React from "react";
import { View, TextInput, Text } from "react-native";
import { StyleSheet } from "react-native";
import { COLORS } from "@/styles/colors";

interface InputFieldProp {
  label: string;
  placeholder: string;
  required?: boolean;
  secureTextEntry?: boolean;
  disabled?: boolean;
  numeric?: boolean;
  errorMessage?: string;
  onChangeText: (text: string) => void;
}

const InputField = ({
  label,
  placeholder,
  required = false,
  secureTextEntry = false,
  disabled = false,
  errorMessage = "",
  numeric = false,
  onChangeText,
}: InputFieldProp) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>
      {label}
      {required && <Text style={styles.requiredStar}> *</Text>}
    </Text>
    {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    <TextInput
      style={[styles.textInput, errorMessage && styles.inputError]}
      placeholder={placeholder}
      placeholderTextColor={COLORS.textSecondary}
      secureTextEntry={secureTextEntry}
      disableFullscreenUI={disabled}
      keyboardType={numeric ? "number-pad" : "default"}
      onChangeText={onChangeText}
    />
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 10,
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  requiredStar: {
    color: COLORS.secondary,
  },
  textInput: {
    height: 45,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: COLORS.white,
  },
  inputError: {
    borderColor: COLORS.secondary,
  },
  errorText: {
    color: COLORS.secondary,
    fontSize: 12,
    marginTop: 5,
  },
});

export default InputField;
