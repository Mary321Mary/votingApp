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
import { useFormScroll } from "../../contexts/FormScrollContext";

interface InputFieldProp {
  name: string;
  label?: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  secureTextEntry?: boolean;
  disabled?: boolean;
  numeric?: boolean;
  email?: boolean;
  maxLength?: number;
  errorMessage?: React.ReactNode;
  afterLabel?: React.ReactNode;
  helpText?: string;
  showEye?: boolean;
  onChangeText?: (text: string) => void;
}

const InputField = ({
  name,
  label,
  value,
  placeholder,
  required = false,
  secureTextEntry = false,
  disabled = false,
  errorMessage = "",
  afterLabel = "",
  email = false,
  numeric = false,
  maxLength = undefined,
  helpText = "",
  showEye = false,
  onChangeText,
}: InputFieldProp) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { registerField } = useFormScroll();
  const [isMasked, setIsMasked] = useState(true);

  const toggleMask = () => {
    if (!disabled) setIsMasked(prev => !prev);
  };

  const shouldSecureText = showEye ? isMasked : secureTextEntry;

  return (
    <View style={styles.inputContainer}>
      {!!label && (
        <Text style={styles.inputLabel}>
          {label}
          {required && <Text style={styles.requiredStar}> *</Text>}{" "}
          {helpText && <HelpTooltip text={helpText} />}
        </Text>
      )}
      {afterLabel}
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          ref={registerField(name)}
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
          keyboardType={
            numeric ? "number-pad" : email ? "email-address" : "default"
          }
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
      marginVertical: 5,
      width: "100%",
    },
    inputLabel: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 5,
      color: theme.textPrimary,
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
