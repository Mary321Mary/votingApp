import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StateData } from '@/utils/types';
import { ThemeContext } from '@/styles/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '../modules/Checkbox';
import { Radio } from '../modules/Radio';

export const ConnectedOVR = ({ state }: { state: StateData; }) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

  const [licenseUpdate, setLicenseUpdate] = useState<null | boolean>(null);
  const [duplicateLicense, setDuplicateLicense] = useState<null | boolean>(null);

  return (
    <View style={styles.block}>
      <Checkbox
        label={t("register_page.eligibility.citizen")}
        required
      />
      <Checkbox
        label={t("register_page.eligibility.age")}
        required
      />
      <Checkbox
        label={t("register_page.eligibility.residency", {
          state: state.name,
        })}
      />
      <Checkbox
        label={t("register_page.eligibility.cancelPrevious")}
        required
      />
      <Checkbox
        label={t("register_page.eligibility.digitalSignature")}
        required
      />

      {/* LICENSE UPDATE */}
      <Text style={styles.gray}>
        {t("register_page.questions.licenseUpdate")}
        <Text style={styles.required}> *</Text>
      </Text>

      <Radio
        label="No"
        selected={licenseUpdate === false}
        onPress={() => setLicenseUpdate(false)}
      />
      <Radio
        label="Yes"
        selected={licenseUpdate === true}
        onPress={() => setLicenseUpdate(true)}
      />

      {/* DUPLICATE LICENSE */}
      <Text style={styles.gray}>
        {t("register_page.questions.duplicateLicense")}
        <Text style={styles.required}> *</Text>
      </Text>

      <Radio
        label="No"
        selected={duplicateLicense === false}
        onPress={() => setDuplicateLicense(false)}
      />
      <Radio
        label="Yes"
        selected={duplicateLicense === true}
        onPress={() => setDuplicateLicense(true)}
      />
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    block: {
      maxWidth: "90%",
      minWidth: "80%"
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
      fontWeight: "regular",
      marginTop: 12,
      marginBottom: 4,
    },
    bold: {
      fontWeight: "bold"
    },
    link: {
      color: theme.link,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "regular"
    },
    checkbox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    checkboxText: {
      fontSize: 14,
      flex: 1,
    },
    required: {
      color: "red",
    }
  })
