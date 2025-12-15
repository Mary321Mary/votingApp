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
      {/* <View style={styles.logoContainer}></View> */}
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>{text}</Text>
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
    logoContainer: {
      flexDirection: "row",
      marginBottom: 15,
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
      marginLeft: "15%",
      color: theme.textPrimary,
    },
  });

export default Header;
