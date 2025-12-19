import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { StateData } from '@/utils/types';
import { ThemeContext } from '@/styles/ThemeProvider';
import { useTranslation } from 'react-i18next';

type Props = {
  state: StateData;
};

export const ConnectedOVR = ({ state }: Props) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

  return (
    <View style={styles.block}>
      <Text style={styles.text}>{t("register_page.eligibility.citizen")}</Text>
      <Text style={styles.text}>{t("register_page.eligibility.age")}</Text>
      <Text style={styles.text}>{t("register_page.eligibility.residency", { state: state.name })}</Text>
      <Text style={styles.text}>{t("register_page.eligibility.cancelPrevious")}</Text>
      <Text style={styles.text}>{t("register_page.eligibility.digitalSignature")}</Text>
      <Text style={styles.gray}>{t("register_page.eligibility.licenseUpdate")}</Text>
      <Text style={styles.gray}>{t("register_page.eligibility.duplicateLicense")}</Text>

      {state.online_registration_system_url && (
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(state.online_registration_system_url || "")
          }
        >
          <Text style={styles.link}>
            {t("register_page.actions.registerOnline", { state: state.name })}
          </Text>
        </TouchableOpacity>
      )}

      {state.sos_address && (
        <View style={styles.block}>
          <Text style={styles.text}>{t("register_page.info.whereToSend")}</Text>
          <Text style={styles.text}>
            {state.sos_address.replace(/<br\s*\/?>/gi, '\n')}
          </Text>
        </View>
      )}

      {state.sos_phone && (
        <Text style={styles.text}>
          <Text style={styles.bold}>{t("register_page.info.phone")}</Text>
          {state.sos_phone}
        </Text>
      )}

      {state.sos_url && (
        <Text
          style={styles.link}
          onPress={() => Linking.openURL(state.sos_url || "")}
        >
          {t("register_page.actions.visitElectionSite")}
        </Text>
      )}
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    block: {
      minWidth: "100%"
    },
    text: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "regular"
    },
    gray: {
      color: theme.gray,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "regular"
    },
    bold: {
      fontWeight: "bold"
    },
    link: {
      color: theme.link,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "regular"
    }
  })
