import React, { useContext, useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { Settings, User, Bell } from "lucide-react-native";

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
  const navigation = useNavigation<any>();

  const [logoFailed, setLogoFailed] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const styles = useMemo(() => getStyles(theme), [theme]);

  const partnerLogo = config?.header_logo_url;
  const logoSource = partnerLogo && !logoFailed ? { uri: partnerLogo } : logo;

  useEffect(() => {
    setLogoFailed(false);
    if (partnerLogo) {
      fadeAnim.setValue(0);
    } else {
      fadeAnim.setValue(1);
    }
  }, [partnerLogo, fadeAnim]);

  const handleLoad = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleError = () => {
    setLogoFailed(true);
    fadeAnim.setValue(1);
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleNavigate = (screenName: string) => {
    setIsMenuVisible(false);
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.header}>
      <Animated.Image
        source={logoSource}
        accessibilityLabel={t("ovr_landing_page.register_vote")}
        style={[styles.logo, { opacity: fadeAnim }]}
        onLoad={handleLoad}
        onError={handleError}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{text?.replace(/<br\s*\/?>/gi, "\n")}</Text>
      </View>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={toggleMenu}
        activeOpacity={0.7}
        accessibilityLabel="Open menu"
      >
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
      </TouchableOpacity>

      <Modal
        visible={isMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={toggleMenu}
      >
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.modalOverlay}>
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigate("Settings")}
              >
                <Settings size={20} color={theme.textPrimary} />
                <Text style={styles.menuItemText}>Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigate("Profile")}
              >
                <User size={20} color={theme.textPrimary} />
                <Text style={styles.menuItemText}>Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigate("Notifications")}
              >
                <Bell size={20} color={theme.textPrimary} />
                <Text style={styles.menuItemText}>Notifications</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
      zIndex: 100,
    },
    titleContainer: {
      flex: 1,
      alignItems: "center",
    },
    logo: {
      width: 60,
      height: 60,
      resizeMode: "contain",
    },
    title: {
      fontSize: 28,
      fontWeight: "600",
      fontFamily: "Inter-VariableFont_opsz_wght",
      color: theme.textPrimary,
      textAlign: "center",
    },
    menuButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      padding: 8,
    },
    hamburgerLine: {
      width: 22,
      height: 2.5,
      backgroundColor: theme.textPrimary,
      marginVertical: 2,
      borderRadius: 2,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      justifyContent: "flex-start",
      alignItems: "flex-end",
      paddingTop: 60,
      paddingRight: 16,
    },
    menuContainer: {
      backgroundColor: theme.white,
      borderRadius: 12,
      width: 200,
      paddingVertical: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 5,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      gap: 10,
    },
    menuItemText: {
      fontSize: 15,
      fontWeight: "500",
    },
  });

export default Header;
