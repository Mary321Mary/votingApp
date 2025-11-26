import React, { ReactNode } from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { COLORS } from "@/styles/colors";
import LanguageSelector from "@/components/modules/LanguageSelector";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.footer}>
      <View style={styles.footerLinks}>
        <Text style={styles.footerLink}>{t("home")}</Text>
        <Text style={styles.footerLink}>{t("terms")}</Text>
        <Text style={styles.footerLink}>{t("policy")}</Text>
        <Text style={styles.footerLink}>{t("shortcode")}</Text>
      </View>
      <LanguageSelector />
    </View>
  );
};

const styles = StyleSheet.create({
  // --- FOOTER STYLES ---
  footer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
  },
  footerLinks: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerLink: {
    fontSize: 12,
    color: COLORS.link,
    marginRight: 10,
    textDecorationLine: "underline",
  },
});

export default Footer;
