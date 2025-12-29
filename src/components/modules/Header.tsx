import React, { useContext } from "react";
import { View, Image, Text } from "react-native";
import { StyleSheet } from "react-native";
import logo from "@/assets/images/logo.png";
import { ThemeContext } from "@/styles/ThemeProvider";

interface HeaderProp {
  text: string;
}

const Header = ({ text }: HeaderProp) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  return (
    <View style={styles.header}>
      <Image source={logo} style={styles.logo} />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{text}</Text>
      </View>
    </View>
  )
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    header: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderColor,
      backgroundColor: theme.white,
      paddingHorizontal: 15,
    },
    titleContainer: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: 10,
    },
    logo: {
      width: 50,
      height: 50,
      resizeMode: "contain",
    },
    title: {
      fontSize: 28,
      fontWeight: "semibold",
      fontFamily: "Inter-VariableFont_opsz_wght",
      color: theme.textPrimary,
    },
  });

export default Header;
