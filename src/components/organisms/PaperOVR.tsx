import React, { useContext } from 'react';
import { View, Text, Linking, StyleSheet } from 'react-native';
import { StateData } from '@/utils/types';
import { ThemeContext } from '@/styles/ThemeProvider';
import { useTranslation } from 'react-i18next';

type Props = {
  state: StateData;
};

export const PaperOVR = ({ state }: Props) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

  return (
    <View style={styles.block}>
      <Text style={styles.text}>
        {t("register_page.info.paperRegistration", { state: state.name })}
      </Text>

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
    bold: {
      fontWeight: "bold"
    },
    link: {
      color: theme.link,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "medium"
    }
  })