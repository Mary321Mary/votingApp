import React, { useContext } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { ThemeContext } from '@/styles/ThemeProvider';

export const Checkbox = ({
  label,
  defaultValue = false,
  required,
}: any) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const [value, setValue] = React.useState(defaultValue);

  return (
    <>
      <View style={styles.checkbox}>
        <Switch value={value} onValueChange={setValue} />
        <Text style={styles.checkboxText}>
          {label} {required && <Text style={styles.required}>*</Text>}
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