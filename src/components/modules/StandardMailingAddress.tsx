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
      {/* <InputField
        label={t("register_page.street.number")}
        value={value.mailingStreetNumber}
        errorMessage={errorMessages.mailingStreetNumber}
        required
        onChangeText={(text: string) =>
          updateField("mailingStreetNumber", text)
        }
      />

      <InputField
        label={t("register_page.street.name")}
        value={value.mailingStreetName}
        errorMessage={errorMessages.mailingStreetName}
        required
        onChangeText={(text: string) => updateField("mailingStreetName", text)}
      />

      <InputField
        label={t("register_page.street.type")}
        value={value.mailingStreetType}
        errorMessage={errorMessages.mailingStreetType}
        onChangeText={(text: string) => updateField("mailingStreetType", text)}
      /> */}

      {isVisible(formCongif, "mailing_address") && (
        <InputField
          label={t("register_page.address")}
          value={value.mailingStreetAddress}
          required={isRequired(formCongif, "mailing_address")}
          errorMessage={errorMessages.mailingStreetAddress}
          onChangeText={(text: string) =>
            updateField("mailingStreetAddress", text)
          }
        />
      )}

      <InputField
        label={t("register_page.street.apt")}
        value={value.mailingUnit}
        errorMessage={errorMessages.mailingUnit}
        onChangeText={(text: string) => updateField("mailingUnit", text)}
      />

      {isVisible(formCongif, "mailing_city") && (
        <InputField
          label={t("register_page.city")}
          value={value.mailingCity}
          required={isRequired(formCongif, "mailing_city")}
          errorMessage={errorMessages.mailingCity}
          onChangeText={(text: string) => updateField("mailingCity", text)}
        />
      )}

      {isVisible(formCongif, "mailing_state") && (
        <View style={styles.inputBlock}>
          <Text style={styles.label}>
            {t("register_page.state")}
            {isRequired(formCongif, "mailing_state") && (
              <Text style={styles.required}> *</Text>
            )}
          </Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={value.mailingState}
              onValueChange={(text: string) =>
                updateField("mailingState", text)
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
          {errorMessages.mailingState && (
            <Text style={styles.required}>{errorMessages.mailingState}</Text>
          )}
        </View>
      )}

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
    required: {
      color: theme.secondary,
    },
    inputBlock: {
      marginBottom: 16,
    },
    label: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      marginBottom: 6,
    },
    pickerWrapper: {
      backgroundColor: theme.white,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 6,
      overflow: "hidden",
    },
  });
