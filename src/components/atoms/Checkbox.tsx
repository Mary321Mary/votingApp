import React, { useContext } from "react";
import { Text, Switch, StyleSheet, View } from "react-native";
import { ThemeContext } from "@/styles/ThemeProvider";
import { COLORS } from "@/styles/colors";
import HelpTooltip from "./HelpTooltip";
import { useFormScroll } from "@/contexts/FormScrollContext";

interface CheckboxProps {
  name: string;
  label: string;
  helpText?: string;
  value?: boolean;
  required?: boolean;
  errorText?: string | React.ReactNode;
  disabled?: boolean;
  size?: "default" | "small";
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
  size = "default",
  onValueChange,
}: CheckboxProps) => {
  const theme = useContext(ThemeContext);
  const { registerField } = useFormScroll();
  const styles = getStyles(theme);

  if (!name) return null;

  const isSmall = size === "small";

  const handleToggle = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <>
      <View ref={registerField(name)} style={styles.checkbox}>
        <View style={isSmall ? styles.switchContainerSmall : undefined}>
          <Switch
            value={value}
            disabled={disabled}
            onValueChange={onValueChange}
            style={isSmall ? styles.switchSmall : undefined}
          />
        </View>
        <Text
          style={[styles.checkboxText, isSmall && styles.checkboxTextSmall]}
          onPress={handleToggle}
        >
          {label} {required && <Text style={styles.required}>*</Text>}{" "}
          {helpText && <HelpTooltip text={helpText} />}
        </Text>
      </View>
      {errorText && <Text style={styles.errorText}>{errorText}</Text>}
    </>
  );
};

const getStyles = (theme: typeof COLORS) =>
  StyleSheet.create({
    required: {
      color: theme.secondary,
    },
    checkbox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    },
    switchSmall: {
      transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }],
    },
    switchContainerSmall: {
      marginRight: -6,
      marginLeft: -4,
    },
    checkboxText: {
      maxWidth: "85%",
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "400",
      flex: 1,
    },
    checkboxTextSmall: {
      fontSize: 12,
      lineHeight: 16,
      color: theme.gray,
    },
    errorText: {
      color: theme.secondary,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 11,
      fontWeight: "400",
    },
  });
