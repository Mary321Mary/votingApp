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
          {t("register_page.military.box.box_group_type")}
          <Text style={styles.required}> *</Text>
        </Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={value.boxGroupType}
            onValueChange={(text: string) => updateField("boxGroupType", text)}
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
        {errorMessages.boxGroupType && (
          <Text style={styles.required}>{errorMessages.boxGroupType}</Text>
        )}
      </View>

      <InputField
        label={t("register_page.military.box_group_number")}
        // required
        value={value.boxGroupNumber}
        errorMessage={errorMessages.boxGroupNumber}
        onChangeText={(text: string) => updateField("boxGroupNumber", text)}
      />

      <InputField
        label={t("register_page.military.box_number")}
        value={value.boxNumber}
        errorMessage={errorMessages.boxNumber}
        // required
        onChangeText={(text: string) => updateField("boxNumber", text)}
      />

      <View style={styles.inputBlock}>
        <Text style={styles.label}>
          APO/FPO/DPO
          <Text style={styles.required}> *</Text>
        </Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={value.apoFpoDpo}
            onValueChange={(text: string) => updateField("apoFpoDpo", text)}
          >
            <Picker.Item label="" value="" />
            <Picker.Item label="APO" value="APO" />
            <Picker.Item label="FPO" value="FPO" />
            <Picker.Item label="DPO" value="DPO" />
          </Picker>
        </View>
        {errorMessages.apoFpoDpo && (
          <Text style={styles.required}>{errorMessages.apoFpoDpo}</Text>
        )}
      </View>

      <View style={styles.inputBlock}>
        <Text style={styles.label}>
          AA/AE/AP
          <Text style={styles.required}> *</Text>
        </Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={value.aaAeAp}
            onValueChange={(text: string) => updateField("aaAeAp", text)}
          >
            <Picker.Item label="" value="" />
            <Picker.Item label="AA" value="AA" />
            <Picker.Item label="AE" value="AE" />
            <Picker.Item label="AP" value="AP" />
          </Picker>
        </View>
        {errorMessages.aaAeAp && (
          <Text style={styles.required}>{errorMessages.aaAeAp}</Text>
        )}
      </View>

      {isVisible(formCongif, "mailing_zip_code") && (
        <InputField
          label={t("zip")}
          value={value.mailingZip}
          required={isRequired(formCongif, "mailing_zip_code")}
          errorMessage={errorMessages.mailingZip}
          numeric
          onChangeText={(text: string) => updateField("mailingZip", text)}
        />
      )}
    </>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    fieldset: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      marginTop: 24,
      marginBottom: 8,
      textTransform: "uppercase",
    },
    disclaimer: {
      fontSize: 12,
      marginVertical: 12,
      color: "#555",
    },

    inputBlock: {
      marginBottom: 16,
    },
    label: {
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
