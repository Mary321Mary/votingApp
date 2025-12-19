import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { StateData } from '@/utils/types';
import { ThemeContext } from '@/styles/ThemeProvider';
import { useTranslation } from 'react-i18next';

type Props = {
  state: StateData;
};

export const OvrState = ({ state }: Props) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

  return (
    <View style={styles.block}>
      <Text style={styles.text}>{t("register_page.info.finishOnline", { state: state.name })}
      </Text>

      {state.online_registration_system_url && (
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(state.online_registration_system_url || "")
          }
        >
          <Text style={styles.link}>{t("register_page.actions.continueOnline", { state: state.name })}
          </Text>
        </TouchableOpacity>
      )}

      {state.sos_url && (
        <Text
          style={styles.link}
          onPress={() => Linking.openURL(state.sos_url || "")}
        >
          {t("register_page.actions.checkStatus")}
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