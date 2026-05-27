import React, { useContext } from "react";
import { Picker } from "@react-native-picker/picker";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "@/styles/ThemeProvider";
import { FormProps, RegisterFormState } from "@/utils/types";
import InputField from "../atoms/InputField";
import { isRequired, isVisible } from "@/utils/constants";

export const MilitaryMailingAddress = ({
  errorMessages,
  value,
  formCongif,
  onChange,
  onChangeError,
}: FormProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

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

  const BOX_GROUP_TYPE = [
    { name: "", value: "" },
    { name: "UNIT", value: "unit" },
    { name: "CMR", value: "cmr" },
    { name: "PSC", value: "psc" },
  ];

  return (
    <>
      <View style={styles.inputBlock}>
        <Text style={styles.label}>
          {t("michigan.military.box_group_type")}
          <Text style={styles.required}> *</Text>
        </Text>
        {isVisible(formCongif, "mailing_box_group_type") && (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={value.mailing_box_group_type}
              onValueChange={(text: string) =>
                updateField("mailing_box_group_type", text)
              }
            >
              {BOX_GROUP_TYPE.map(item => (
                <Picker.Item
                  key={item.value}
                  label={item.name}
                  value={item.value}
                />
              ))}
            </Picker>
          </View>
        )}
        {errorMessages.mailing_box_group_type && (
          <Text style={styles.required}>
            {errorMessages.mailing_box_group_type}
          </Text>
        )}
      </View>

      {isVisible(formCongif, "mailing_box_group_number") && (
        <InputField
          label={t("michigan.military.box_group_number")}
          required={isRequired(formCongif, "mailing_box_group_number")}
          value={value.mailing_box_group_number}
          errorMessage={errorMessages.mailing_box_group_number}
          onChangeText={(text: string) =>
            updateField("mailing_box_group_number", text)
          }
        />
      )}

      {isVisible(formCongif, "mailing_box_number") && (
        <InputField
          label={t("michigan.military.box_number")}
          value={value.mailing_box_number}
          errorMessage={errorMessages.mailing_box_number}
          required={isRequired(formCongif, "mailing_box_number")}
          onChangeText={(text: string) =>
            updateField("mailing_box_number", text)
          }
        />
      )}

      {isVisible(formCongif, "mailing_apo") && (
        <View style={styles.inputBlock}>
          <Text style={styles.label}>
            {t("michigan.military.apo_fpo_dpo")}
            {isRequired(formCongif, "mailing_apo") && (
              <Text style={styles.required}> *</Text>
            )}
          </Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={value.mailing_apo}
              onValueChange={(text: string) => updateField("mailing_apo", text)}
            >
              <Picker.Item label="" value="" />
              <Picker.Item label="APO" value="APO" />
              <Picker.Item label="FPO" value="FPO" />
              <Picker.Item label="DPO" value="DPO" />
            </Picker>
          </View>
          {errorMessages.mailing_apo && (
            <Text style={styles.required}>{errorMessages.mailing_apo}</Text>
          )}
        </View>
      )}

      {isVisible(formCongif, "mailing_ap") && (
        <View style={styles.inputBlock}>
          <Text style={styles.label}>
            {t("michigan.military.aa_ae_ap")}
            {isRequired(formCongif, "mailing_ap") && (
              <Text style={styles.required}> *</Text>
            )}
          </Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={value.mailing_ap}
              onValueChange={(text: string) => updateField("mailing_ap", text)}
            >
              <Picker.Item label="" value="" />
              <Picker.Item label="AA" value="AA" />
              <Picker.Item label="AE" value="AE" />
              <Picker.Item label="AP" value="AP" />
            </Picker>
          </View>
          {errorMessages.mailing_ap && (
            <Text style={styles.required}>{errorMessages.mailing_ap}</Text>
          )}
        </View>
      )}

      {isVisible(formCongif, "mailing_zip_code") && (
        <InputField
          label={t("form_fields.zip")}
          value={value.mailing_zip_code}
          required={isRequired(formCongif, "mailing_zip_code")}
          errorMessage={errorMessages.mailing_zip_code}
          numeric
          onChangeText={(text: string) => updateField("mailing_zip_code", text)}
        />
      )}
    </>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    inputBlock: {
      marginTop: 10,
    },
    label: {
      textTransform: "uppercase",
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      marginBottom: 6,
    },
    required: {
      color: theme.secondary,
    },
    pickerWrapper: {
      backgroundColor: theme.white,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 6,
      overflow: "hidden",
    },
  });
