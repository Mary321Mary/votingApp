import React, { useContext, useEffect, useRef, useState, useMemo } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useUIConfig } from "../contexts/UIConfigContext";
import logo from "@/assets/images/logo.png";
import { ThemeContext } from "@/styles/ThemeProvider";

interface HeaderProp {
  text: string;
}

const Header = ({ text }: HeaderProp) => {
  const { t } = useTranslation();
  const { config } = useUIConfig();
  const theme = useContext(ThemeContext);

  const [logoFailed, setLogoFailed] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const styles = useMemo(() => getStyles(theme), [theme]);

  const partnerLogo = config?.header_logo_url;
  const logoSource = partnerLogo && !logoFailed ? { uri: partnerLogo } : logo;

  useEffect(() => {
    setLogoFailed(false);
    fadeAnim.setValue(0);
  }, [partnerLogo, fadeAnim]);

  const handleLoad = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.header}>
      <Animated.Image
        source={logoSource}
        accessibilityLabel={t("ovr_landing_page.register_vote")}
        style={[styles.logo, { opacity: fadeAnim }]}
        onLoad={handleLoad}
        onError={() => setLogoFailed(true)}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{text?.replace(/<br\s*\/?>/gi, "\n")}</Text>
      </View>
      <View style={styles.logoPlaceholder} />
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    header: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme?.borderColor,
      backgroundColor: theme?.white,
      paddingHorizontal: 10,
    },
    titleContainer: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: 10,
    },
    logo: {
      width: 60,
      height: 60,
      resizeMode: "contain",
    },
    logoPlaceholder: {
      width: 60,
      height: 60,
    },
    title: {
      fontSize: 28,
      fontWeight: "600",
      fontFamily: "Inter-VariableFont_opsz_wght",
      color: theme?.textPrimary,
      textAlign: "center",
    },
  });

export default Header;
