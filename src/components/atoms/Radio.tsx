import { ThemeContext } from '@/styles/ThemeProvider';
import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Radio = ({ label, selected, onPress }: any) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  return (
    <TouchableOpacity style={styles.radio} onPress={onPress}>
      <View style={[styles.radioDot, selected && styles.radioDotActive]} />
      <Text style={styles.radioText}>{label}</Text>
    </TouchableOpacity>
  )
};


const getStyles = (theme: any) =>
  StyleSheet.create({
    radio: {
      flexDirection: "row",
      marginBottom: 8,
    },
    radioDot: {
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: theme.borderColor,
      marginRight: 6,
    },
    radioDotActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    radioText: {
      flexShrink: 1,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "regular",
      color: theme.textPrimary,
    }
  })
