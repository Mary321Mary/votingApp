import React, { useContext, useRef } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { ThemeContext } from "@/styles/ThemeProvider";
import HelpTooltip from "./HelpTooltip";
import { useFormScroll } from "../../contexts/FormScrollContext";

interface CheckboxProps {
  name: string;
  label: string;
  helpText?: string;
  value?: boolean;
  required?: boolean;
  errorText?: string | React.ReactNode;
  disabled?: boolean;
  onValueChange: (value: boolean) => void;
}

export const Checkbox = ({
  name,
  label,
  helpText,
  value = false,
  required,
  errorText,
  disabled = false,
  onValueChange,
}: CheckboxProps) => {
  const theme = useContext(ThemeContext);
  const { registerField } = useFormScroll();
  const switchRef = useRef<Switch | null>(null);

  const styles = getStyles(theme);

  if (!name) {
    return null;
  }

  return (
    <>
      <View
        ref={registerField(name, () => switchRef.current?.focus())}
        style={styles.checkbox}
      >
        <Switch
          ref={switchRef}
          value={value}
          disabled={disabled}
          onValueChange={onValueChange}
        />
        <Text style={styles.checkboxText} onPress={() => onValueChange(!value)}>
          {label} {required && <Text style={styles.required}>*</Text>}{" "}
          {helpText && <HelpTooltip text={helpText} />}
        </Text>
      </View>
      {errorText && <Text style={styles.errorText}>{errorText}</Text>}
    </>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    required: {
      color: theme.secondary,
    },
    checkbox: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
      marginBottom: 8,
    },
    checkboxText: {
      maxWidth: "85%",
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "regular",
      flex: 1,
    },
    errorText: {
      color: theme.secondary,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 11,
      fontWeight: "regular",
    },
  });
