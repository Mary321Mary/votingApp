import React, { useContext } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { ThemeContext } from "../../styles/ThemeProvider";

export type ButtonVariant =
  | "primary"
  | "outline-primary"
  | "tertiary-cta"
  | "link";

interface CustomButtonProps {
  title: string | React.ReactNode;
  variant?: ButtonVariant;
  disabled?: boolean;
  icon?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  variant = "primary",
  disabled = false,
  icon,
  onPress,
  style,
  textStyle,
}) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const isOutline = variant === "outline-primary" || variant === "tertiary-cta";
  const isLink = variant === "link";

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.baseButton,
        isOutline && styles.outlineButton,
        isLink && styles.linkButton,
        disabled && styles.disabledButton,
        style,
      ]}
    >
      <View style={styles.contentContainer}>
        {typeof title === "string" ? (
          <Text
            style={[
              styles.baseText,
              isOutline && styles.outlineText,
              isLink && styles.linkText,
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
        ) : (
          title
        )}
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    baseButton: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 6,
      borderWidth: 1,
      marginVertical: 5,
      borderColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    outlineButton: {
      backgroundColor: "transparent",
      borderColor: theme.primary,
    },
    linkButton: {
      backgroundColor: "transparent",
      borderColor: "transparent",
      paddingVertical: 4,
      paddingHorizontal: 0,
    },
    disabledButton: {
      opacity: 0.5,
    },
    contentContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    baseText: {
      color: theme.white,
      fontSize: 16,
      fontWeight: "600",
    },
    outlineText: {
      color: theme.primary,
    },
    linkText: {
      color: theme.primary,
      textDecorationLine: "underline",
    },
    disabledText: {
      color: theme.gray,
    },
    iconContainer: {
      marginLeft: 8,
    },
  });
