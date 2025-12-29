import React, { useContext } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { ThemeContext } from '@/styles/ThemeProvider';
import HelpTooltip from './HelpTooltip';

export const Checkbox = ({
  label,
  helpText,
  value = false,
  required,
  onValueChange
}: any) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  return (
    <>
      <View style={styles.checkbox} >
        <Switch value={value} onValueChange={onValueChange} />
        <Text style={styles.checkboxText} onPress={onValueChange}>
          {label} {required && <Text style={styles.required}>*</Text>}
          {helpText && <HelpTooltip text={helpText} />}
        </Text>
      </View>
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
  });