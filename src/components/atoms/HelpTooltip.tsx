import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ThemeContext } from "@/styles/ThemeProvider";

type HelpTooltipProps = {
  text: string;
};

const HelpTooltip: React.FC<HelpTooltipProps> = ({ text }) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setVisible((prev) => !prev)}
        style={styles.questionMarkContainer}
      >
        <Text style={styles.questionMark}>?</Text>
      </TouchableOpacity>

      {visible && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>{text}</Text>
        </View>
      )}
    </View>
  );
};

export default HelpTooltip;

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      marginLeft: 4,
      position: "relative",
    },
    questionMarkContainer: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    questionMark: {
      color: theme.white,
      fontWeight: "bold",
      fontSize: 12,
    },
    tooltip: {
      position: "absolute",
      top: 24,
      left: -50,
      backgroundColor: theme.textPrimary,
      padding: 8,
      borderRadius: 6,
      minWidth: 200,
      zIndex: 999,
    },
    tooltipText: {
      color: theme.white,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontWeight: "regular",
      fontSize: 12,
    },
  });
