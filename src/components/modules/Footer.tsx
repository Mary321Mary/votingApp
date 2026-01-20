import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import { StyleSheet } from "react-native";
import LanguageSelector from "@/components/atoms/LanguageSelector";
import { useTranslation } from "react-i18next";
import { useUIConfig } from "@/contexts/UIConfigContext";
import Spinner from "../atoms/Spinner";
import logo from "@/assets/images/AWS logo.png";
import { ThemeContext } from "@/styles/ThemeProvider";

const Footer = () => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const { config, isLoading } = useUIConfig();
  const sources = config?.urls ?? null;

  const openUrl = (url: string) => {
    if (url) Linking.openURL(url);
  };

  return (
    <View style={styles.footer}>
      <View style={styles.linksBlock}>
        {sources && (
          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={() => openUrl(sources.homepage)}>
              <Text style={styles.link}>{t("home")}</Text>
            </TouchableOpacity>
            <Text style={styles.separator}> | </Text>
            <TouchableOpacity onPress={() => openUrl(sources.terms)}>
              <Text style={styles.link}>{t("terms")}</Text>
            </TouchableOpacity>
            <Text style={styles.separator}> | </Text>
            <TouchableOpacity onPress={() => openUrl(sources.privacy)}>
              <Text style={styles.link}>{t("policy")}</Text>
            </TouchableOpacity>
            <Text style={styles.separator}> | </Text>
            <TouchableOpacity onPress={() => openUrl(sources.shortcode)}>
              <Text style={styles.link}>{t("shortcode")}</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text style={styles.copyright}>
          © Copyright 2025, Rock the Vote
        </Text>
      </View>
      {isLoading && <Spinner />}
      <View style={styles.rightBlock}>
        <LanguageSelector />
        <View style={styles.awsBlock}>
          <Text style={styles.poweredText}>Powered By</Text>
          <Image source={logo} style={styles.awsLogo} resizeMode="contain" />
        </View>
      </View>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    // --- FOOTER STYLES ---
    footer: {
      width: "100%",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 10,
      padding: 15,
      borderTopWidth: 1,
      borderTopColor: theme.borderColor,
    },
    linksBlock: {
      flex: 1,
      alignItems: "center",
    },
    linksContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center"
    },
    link: {
      color: theme.textPrimary,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 12,
      fontWeight: "medium"
    },
    separator: {
      fontSize: 14,
      color: theme.textPrimary,
    },
    copyright: {
      marginVertical: 10,
      fontSize: 12,
      fontFamily: "times",
      fontStyle: "italic",
      color: theme.textPrimary,
    },
    rightBlock: {
      alignItems: "center",
      gap: 10,
    },
    awsBlock: {
      flexDirection: "row",
      alignItems: "center",
    },
    poweredText: {
      fontSize: 12,
      marginRight: 6,
      color: theme.textPrimary,
    },
    awsLogo: {
      width: 50,
      height: 20
    }
  });

export default Footer;
