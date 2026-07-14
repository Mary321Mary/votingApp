import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";
import { isRequired, isVisible, STATES } from "@/utils/constants";
import { ThemeContext } from "@/styles/ThemeProvider";
import { FormProps, RegisterFormState } from "@/utils/types";
import InputField from "../atoms/InputField";

export const StandardMailingAddress = ({
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

  return (
    <>
      <InputField
        label={t("michigan.mailing_street.number")}
        value={value.mailing_address_number}
        errorMessage={t(errorMessages.mailing_address_number)}
        required
        onChangeText={(text: string) =>
          updateField("mailing_address_number", text)
        }
      />

      <InputField
        label={t("michigan.mailing_street.name")}
        value={value.mailing_address_street_name}
        errorMessage={t(errorMessages.mailing_address_street_name)}
        required
        onChangeText={(text: string) =>
          updateField("mailing_address_street_name", text)
        }
      />

      <InputField
        label={t("michigan.mailing_street.type")}
        value={value.mailing_address_street_type}
        errorMessage={t(errorMessages.mailing_address_street_type)}
        onChangeText={(text: string) =>
          updateField("mailing_address_street_type", text)
        }
      />

      {isVisible(formCongif, "mailing_address") && (
        <InputField
          label={t("form_fields.address")}
          value={value.mailing_address}
          required={isRequired(formCongif, "mailing_address")}
          errorMessage={t(errorMessages.mailing_address)}
          onChangeText={(text: string) => updateField("mailing_address", text)}
        />
      )}

      <InputField
        label={t("michigan.street.apt")}
        value={value.mailing_unit}
        errorMessage={t(errorMessages.mailing_unit)}
        onChangeText={(text: string) => updateField("mailing_unit", text)}
      />

      {isVisible(formCongif, "mailing_city") && (
        <InputField
          label={t("form_fields.city")}
          value={value.mailing_city}
          required={isRequired(formCongif, "mailing_city")}
          errorMessage={t(errorMessages.mailing_city)}
          onChangeText={(text: string) => updateField("mailing_city", text)}
        />
      )}

      {isVisible(formCongif, "mailing_state") && (
        <View style={styles.inputBlock}>
          <Text style={styles.label}>
            {t("form_fields.state")}
            {isRequired(formCongif, "mailing_state") && (
              <Text style={styles.required}> *</Text>
            )}
          </Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={value.mailing_state}
              onValueChange={(text: string) =>
                updateField("mailing_state", text)
              }
            >
              {STATES.map(state_value => (
                <Picker.Item
                  key={state_value.value}
                  label={state_value.name}
                  value={state_value.value}
                />
              ))}
            </Picker>
          </View>
          {errorMessages.mailing_state && (
            <Text style={styles.required}>
              {t(errorMessages.mailing_state)}
            </Text>
          )}
        </View>
      )}

      {isVisible(formCongif, "mailing_zip_code") && (
        <InputField
          label={t("form_fields.zip")}
          value={value.mailing_zip_code}
          required={isRequired(formCongif, "mailing_zip_code")}
          errorMessage={t(errorMessages.mailing_zip_code)}
          numeric
          onChangeText={(text: string) => updateField("mailing_zip_code", text)}
        />
      )}
    </>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    required: {
      color: theme.secondary,
    },
    inputBlock: {
      marginTop: 5,
    },
    label: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      marginBottom: 6,
      textTransform: "uppercase",
    },
    pickerWrapper: {
      backgroundColor: theme.white,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 6,
      overflow: "hidden",
    },
  });
