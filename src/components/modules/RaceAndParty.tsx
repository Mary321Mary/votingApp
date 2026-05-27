import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";
import { ThemeContext } from "@/styles/ThemeProvider";
import { FormProps, RegisterFormState } from "@/utils/types";
import HelpTooltip from "../atoms/HelpTooltip";
import { isRequired, isVisible } from "@/utils/constants";

interface IDSectionProps extends FormProps {
  showRadioButtons?: boolean;
}

export const RaceAndParty = ({
  value,
  formCongif,
  errorMessages,
  onChange,
  onChangeError,
}: IDSectionProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

  const RACES = [
    { name: "", value: "" },
    { name: t("general.race.asian"), value: "asian" },
    { name: t("general.race.black"), value: "black" },
    { name: t("general.race.hispanic"), value: "hispanic" },
    { name: t("general.race.native_american"), value: "native_american" },
    { name: t("general.race.pacific"), value: "pacific" },
    { name: t("general.race.other"), value: "other" },
    { name: t("general.race.multiple"), value: "multiple" },
    { name: t("general.race.white"), value: "white" },
    { name: t("general.race.decline"), value: "decline" },
  ];

  const updateField = <K extends keyof RegisterFormState>(
    key: K,
    fieldValue: RegisterFormState[K],
  ) => {
    onChange({ ...value, [key]: fieldValue });
    if (errorMessages[key].length) {
      onChangeError({
        ...errorMessages,
        [key]: "",
      });
    }
  };

  return (
    <View style={styles.section}>
      {(!value.age_eligibility || !value.has_no_state_license) &&
        isVisible(formCongif, "race") && (
          <>
            <Text style={styles.inputLabel}>
              {t("form_fields.race")}
              {isRequired(formCongif, "race") && (
                <Text style={styles.required}> *</Text>
              )}
              <HelpTooltip text={formCongif.fields.race.tooltip || ""} />
            </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                style={styles.picker}
                itemStyle={styles.pickerItem}
                selectedValue={value.race}
                onValueChange={itemValue => updateField("race", itemValue)}
              >
                {RACES.map(race => (
                  <Picker.Item
                    key={race.value}
                    label={race.name}
                    value={race.value}
                  />
                ))}
              </Picker>
            </View>
            {errorMessages.race && (
              <Text style={styles.required}>{t(errorMessages.race)}</Text>
            )}
          </>
        )}
      {(!value.age_eligibility || !value.has_no_state_license) &&
        isVisible(formCongif, "party") && (
          <>
            <Text style={styles.inputLabel}>
              {t("form_fields.party")}
              {isRequired(formCongif, "party") && (
                <Text style={styles.required}> *</Text>
              )}
              <HelpTooltip text={formCongif.fields.party.tooltip || ""} />
            </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                style={styles.picker}
                itemStyle={styles.pickerItem}
                selectedValue={value.party}
                onValueChange={itemValue => updateField("party", itemValue)}
              >
                <Picker.Item label="" value="" />
                {formCongif.fields.party.options?.map((option: string) => (
                  <Picker.Item key={option} label={t(option)} value={option} />
                ))}
              </Picker>
            </View>
            {errorMessages.party && (
              <Text style={styles.required}>{t(errorMessages.party)}</Text>
            )}
          </>
        )}
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    section: {},
    inputLabel: {
      textTransform: "uppercase",
      marginVertical: 5,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      color: theme.textPrimary,
    },
    pickerWrapper: {
      flexBasis: "18%",
      minWidth: 70,
      height: 48,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 6,
      justifyContent: "center",
      backgroundColor: theme.white,
    },
    picker: {
      // height: 48,
      width: "100%",
    },
    pickerItem: {
      fontSize: 14,
    },
    required: {
      color: theme.secondary,
    },
  });
