import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
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
  errorMessage?: React.ReactNode;
  helpText?: string;
  showEye?: boolean;
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
  maxLength = undefined,
  helpText = "",
  showEye = false,
  onChangeText,
}: InputFieldProp) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const [isMasked, setIsMasked] = useState(true);

  const toggleMask = () => {
    if (!disabled) setIsMasked(prev => !prev);
  };

  const shouldSecureText = showEye ? isMasked : secureTextEntry;

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {label}
        {required && <Text style={styles.requiredStar}> *</Text>}{" "}
        {helpText && <HelpTooltip text={helpText} />}
      </Text>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          value={value ?? ""}
          style={[
            styles.textInput,
            !!errorMessage && styles.inputError,
            disabled && { backgroundColor: theme.borderColor },
            showEye && styles.textInputWithEye,
          ]}
          placeholder={placeholder}
          secureTextEntry={shouldSecureText}
          editable={!disabled}
          keyboardType={numeric ? "number-pad" : "default"}
          maxLength={maxLength}
          onChangeText={onChangeText}
        />

        {showEye && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggleMask}
            disabled={disabled}
            style={styles.eyeButton}
            accessibilityLabel={isMasked ? "Show password" : "Hide password"}
          >
            {isMasked ? (
              <EyeOff
                size={20}
                color={errorMessage ? theme.secondary : theme.gray}
              />
            ) : (
              <Eye
                size={20}
                color={errorMessage ? theme.secondary : theme.gray}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    inputContainer: {
      marginTop: 10,
      width: "100%",
    },
    inputLabel: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 5,
      color: theme.textPrimary,
      textTransform: "uppercase",
    },
    requiredStar: {
      color: theme.secondary,
    },
    inputWrapper: {
      position: "relative",
      justifyContent: "center",
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
      marginBottom: 5,
    },
    textInputWithEye: {
      paddingRight: 45,
    },
    eyeButton: {
      position: "absolute",
      right: 0,
      height: "100%",
      width: 45,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 5,
    },
  });

export default InputField;
