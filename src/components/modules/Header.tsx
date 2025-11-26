import React from "react";
import { View, Image, Text } from "react-native";
import { StyleSheet } from "react-native";
import { COLORS } from "@/styles/colors";
import logo from "@/assets/images/logo.png";

interface HeaderProp {
  text: string;
}

const Header = ({ text }: HeaderProp) => (
  <View style={styles.header}>
    {/* <View style={styles.logoContainer}></View> */}
    <Image source={logo} style={styles.logo} />
    <Text style={styles.title}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
    backgroundColor: COLORS.white,
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
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginLeft: "20%",
  },
});

export default Header;
