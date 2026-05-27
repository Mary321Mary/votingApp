import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ThemeContext } from "@/styles/ThemeProvider";
import Popover from "react-native-popover-view";

type HelpTooltipProps = {
  text: string;
};

const HelpTooltip: React.FC<HelpTooltipProps> = ({ text }) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <Popover
        isVisible={visible}
        arrowSize={{ width: 0, height: 0 }}
        onRequestClose={() => setVisible(false)}
        from={
          <TouchableOpacity
            onPress={() => setVisible(true)}
            style={styles.questionMarkContainer}
          >
            <Text style={styles.questionMark}>?</Text>
          </TouchableOpacity>
        }
      >
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>{text}</Text>
        </View>
      </Popover>
    </View>
  );
};

export default HelpTooltip;

const getStyles = (theme: any) =>
  StyleSheet.create({
    questionMarkContainer: {
      marginLeft: 5,
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
      padding: 8,
      maxWidth: 260,
    },
    tooltipText: {
      color: theme.textPrimary,
      lineHeight: 20,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontWeight: "regular",
      fontSize: 12,
    },
  });
