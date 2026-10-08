import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useUIConfig } from "@/contexts/UIConfigContext";
import Spinner from "../components/atoms/Spinner";
import { ThemeContext } from "@/styles/ThemeProvider";
import LanguageSelector from "../components/atoms/LanguageSelector";

interface FooterProps {
  showLanguageSelector?: boolean;
}

const Footer = ({ showLanguageSelector = false }: FooterProps) => {
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
        {isLoading && <Spinner />}
        {!isLoading && sources && (
          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={() => openUrl(sources.faq)}>
              <Text style={styles.link}>{t("general.footer.faq")}</Text>
            </TouchableOpacity>
            <Text style={styles.separator}> | </Text>
            <TouchableOpacity onPress={() => openUrl(sources.privacy)}>
              <Text style={styles.link}>
                {t("general.footer.privacy_policy")}
              </Text>
            </TouchableOpacity>
            <Text style={styles.separator}> | </Text>
            <TouchableOpacity onPress={() => openUrl(sources.contact)}>
              <Text style={styles.link}>{t("general.footer.contact")}</Text>
            </TouchableOpacity>
            <Text style={styles.separator}> | </Text>
            <TouchableOpacity onPress={() => openUrl(sources.about)}>
              <Text style={styles.link}>{t("general.footer.about")}</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text style={styles.copyright}>
          © Copyright {new Date().getFullYear()}, Rock the Vote
        </Text>
      </View>
      {showLanguageSelector && (
        <View style={styles.rightBlock}>
          <LanguageSelector dropUp />
        </View>
      )}
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
      padding: 15,
      borderTopWidth: 1,
      borderTopColor: theme.borderColor,
      backgroundColor: theme.background,
    },
    linksBlock: {
      width: "100%",
      alignItems: "center",
    },
    linksContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
    },
    link: {
      color: theme.textPrimary,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 10,
      fontWeight: "medium",
      lineHeight: 14,
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
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
  });

export default Footer;
