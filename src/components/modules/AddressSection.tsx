import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";
import { ThemeContext } from "@/styles/ThemeProvider";
import { FormProps, RegisterFormState } from "@/utils/types";

import InputField from "../atoms/InputField";
import { Checkbox } from "../atoms/Checkbox";
import { isRequired, isVisible, STATES } from "@/utils/constants";

interface AddressSectionProps extends FormProps {
  showChangeOfAddress?: boolean;
  changedAddressLabel?: string;
}

export const AddressSection = ({
  state,
  value,
  formCongif,
  errorMessages,
  showChangeOfAddress = false,
  changedAddressLabel = "",
  onChange,
  onChangeError,
}: AddressSectionProps) => {
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
    <View style={styles.section}>
      <View style={styles.row}>
        {/* {isVisible(formCongif, "home_address") && ( */}
        <InputField
          label={t("form_fields.address")}
          value={value.home_address}
          helpText={t("form_fields.home_address_help")}
          required={isRequired(formCongif, "home_address")}
          errorMessage={t(errorMessages.home_address)}
          onChangeText={(text: string) => updateField("home_address", text)}
        />
        {/* )} */}
        {/* {isVisible(formCongif, "home_unit") && ( */}
        <InputField
          label={t("form_fields.unit_lot")}
          value={value.home_unit}
          required={isRequired(formCongif, "home_unit")}
          errorMessage={t(errorMessages.home_unit)}
          onChangeText={(text: string) => updateField("home_unit", text)}
        />
        {/* )} */}
        {/* {isVisible(formCongif, "home_city") && ( */}
        <InputField
          label={t("form_fields.city")}
          value={value.home_city}
          required={isRequired(formCongif, "home_city")}
          errorMessage={t(errorMessages.home_city)}
          onChangeText={(text: string) => updateField("home_city", text)}
        />
        {/* )} */}
        {/* {isVisible(formCongif, "home_state") && ( */}
        <InputField
          label={t("form_fields.state")}
          disabled
          value={state.abbreviation}
          required={isRequired(formCongif, "home_state")}
          errorMessage={t(errorMessages.state)}
        />
        {/* )} */}
        {/* {isVisible(formCongif, "home_zip_code") && ( */}
        <InputField
          label={t("form_fields.zip")}
          disabled
          value={value.home_zip_code}
          required={isRequired(formCongif, "home_zip_code")}
          errorMessage={t(errorMessages.home_zip_code)}
        />
        {/* )} */}
      </View>

      {(!value.age_eligibility || !value.has_no_state_license) &&
        showChangeOfAddress &&
        isVisible(formCongif, "has_mailing_address") && (
          <Checkbox
            label={t("nvra_form_page.different_mail_address")}
            value={value.has_mailing_address}
            required={isRequired(formCongif, "has_mailing_address")}
            onValueChange={checked => {
              if (!checked) {
                // Update has_mailing_address and clear all mailing_* fields in one batch
                onChange({
                  ...value,
                  has_mailing_address: checked,
                  mailing_address: "",
                  mailing_unit: "",
                  mailing_city: "",
                  mailing_state: "",
                  mailing_zip_code: "",
                });
                // Clear errors for mailing_* fields
                const clearedErrors = { ...errorMessages };
                clearedErrors.mailing_address = "";
                clearedErrors.mailing_unit = "";
                clearedErrors.mailing_city = "";
                clearedErrors.mailing_state = "";
                clearedErrors.mailing_zip_code = "";
                onChangeError(clearedErrors);
              } else {
                updateField("has_mailing_address", checked);
              }
            }}
          />
        )}
      {(!value.age_eligibility || !value.has_no_state_license) &&
        value.has_mailing_address && (
          <>
            <View style={styles.row}>
              {isVisible(formCongif, "mailing_address") && (
                <InputField
                  label={t("form_fields.address")}
                  value={value.mailing_address}
                  helpText={t("form_fields.mailing_address_help")}
                  required={isRequired(
                    formCongif,
                    "mailing_address",
                    value.has_mailing_address,
                  )}
                  errorMessage={t(errorMessages.mailing_address)}
                  onChangeText={(text: string) =>
                    updateField("mailing_address", text)
                  }
                />
              )}
              {isVisible(formCongif, "mailing_unit") && (
                <InputField
                  label={t("form_fields.unit_lot")}
                  value={value.mailing_unit}
                  errorMessage={t(errorMessages.mailing_unit)}
                  required={isRequired(
                    formCongif,
                    "mailing_unit",
                    value.has_mailing_address,
                  )}
                  onChangeText={(text: string) =>
                    updateField("mailing_unit", text)
                  }
                />
              )}
            </View>
            <View style={styles.row}>
              {isVisible(formCongif, "mailing_city") && (
                <InputField
                  label={t("form_fields.city")}
                  value={value.mailing_city}
                  required={isRequired(
                    formCongif,
                    "mailing_city",
                    value.has_mailing_address,
                  )}
                  errorMessage={t(errorMessages.mailing_city)}
                  onChangeText={(text: string) =>
                    updateField("mailing_city", text)
                  }
                />
              )}
              {isVisible(formCongif, "mailing_state") && (
                <View>
                  <Text style={styles.inputLabel}>
                    {t("form_fields.state")}
                    {isRequired(
                      formCongif,
                      "mailing_state",
                      value.has_mailing_address,
                    ) && <Text style={styles.required}> *</Text>}
                  </Text>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      style={styles.picker}
                      itemStyle={styles.pickerItem}
                      selectedValue={value.mailing_state}
                      onValueChange={itemValue =>
                        updateField("mailing_state", itemValue)
                      }
                    >
                      {STATES.map(
                        (state_value: { value: string; name: string }) => (
                          <Picker.Item
                            key={state_value.name}
                            label={state_value.name}
                            value={state_value.value}
                          />
                        ),
                      )}
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
                  numeric
                  value={value.mailing_zip_code}
                  errorMessage={t(errorMessages.mailing_zip_code)}
                  required={isRequired(
                    formCongif,
                    "mailing_zip_code",
                    value.has_mailing_address,
                  )}
                  onChangeText={(text: string) =>
                    updateField("mailing_zip_code", text)
                  }
                />
              )}
            </View>
          </>
        )}
      {(!value.age_eligibility || !value.has_no_state_license) &&
        showChangeOfAddress &&
        isVisible(formCongif, "change_of_address") && (
          <Checkbox
            label={changedAddressLabel || t("nvra_form_page.changed_address")}
            value={value.change_of_address}
            helpText={t("form_fields.changed_address_help")}
            required={isRequired(formCongif, "change_of_address")}
            onValueChange={checked => {
              if (!checked) {
                // Update change_of_address and clear all prev_* fields in one batch
                onChange({
                  ...value,
                  change_of_address: checked,
                  prev_address: "",
                  prev_unit: "",
                  prev_city: "",
                  prev_state: "",
                  prev_zip_code: "",
                });
                // Clear errors for prev_* fields
                const clearedErrors = { ...errorMessages };
                clearedErrors.prev_address = "";
                clearedErrors.prev_unit = "";
                clearedErrors.prev_city = "";
                clearedErrors.prev_state = "";
                clearedErrors.prev_zip_code = "";
                onChangeError(clearedErrors);
              } else {
                updateField("change_of_address", checked);
              }
            }}
          />
        )}
      {(!value.age_eligibility || !value.has_no_state_license) &&
        value.change_of_address && (
          <>
            <View style={styles.row}>
              {isVisible(formCongif, "prev_address") && (
                <InputField
                  label={t("form_fields.address")}
                  value={value.prev_address}
                  required={isRequired(
                    formCongif,
                    "prev_address",
                    value.change_of_address,
                  )}
                  errorMessage={t(errorMessages.prev_address)}
                  onChangeText={(text: string) =>
                    updateField("prev_address", text)
                  }
                />
              )}
              {isVisible(formCongif, "prev_unit") && (
                <InputField
                  label={t("form_fields.unit_lot")}
                  value={value.prev_unit}
                  required={isRequired(
                    formCongif,
                    "prev_unit",
                    value.change_of_address,
                  )}
                  errorMessage={t(errorMessages.prev_unit)}
                  onChangeText={(text: string) =>
                    updateField("prev_unit", text)
                  }
                />
              )}
              {isVisible(formCongif, "prev_city") && (
                <InputField
                  label={t("form_fields.city")}
                  value={value.prev_city}
                  required={isRequired(
                    formCongif,
                    "prev_city",
                    value.change_of_address,
                  )}
                  errorMessage={t(errorMessages.prev_city)}
                  onChangeText={(text: string) =>
                    updateField("prev_city", text)
                  }
                />
              )}
              {isVisible(formCongif, "prev_state") && (
                <View>
                  <Text style={styles.inputLabel}>
                    {t("form_fields.state")}
                    {isRequired(
                      formCongif,
                      "prev_state",
                      value.change_of_address,
                    ) && <Text style={styles.required}> *</Text>}
                  </Text>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      style={styles.picker}
                      itemStyle={styles.pickerItem}
                      selectedValue={value.prev_state}
                      onValueChange={itemValue =>
                        updateField("prev_state", itemValue)
                      }
                    >
                      {STATES.map(
                        (state_value: { value: string; name: string }) => (
                          <Picker.Item
                            key={state_value.name}
                            label={state_value.name}
                            value={state_value.value}
                          />
                        ),
                      )}
                    </Picker>
                  </View>
                  {errorMessages.prev_state && (
                    <Text style={styles.required}>
                      {t(errorMessages.prev_state)}
                    </Text>
                  )}
                </View>
              )}
              {isVisible(formCongif, "prev_zip_code") && (
                <InputField
                  label={t("form_fields.zip")}
                  required
                  numeric
                  value={value.prev_zip_code}
                  errorMessage={t(errorMessages.prev_zip_code)}
                  onChangeText={(text: string) =>
                    updateField("prev_zip_code", text)
                  }
                />
              )}
            </View>
          </>
        )}
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    section: {},
    row: {
      flexDirection: "row",
      flexWrap: "wrap",
      width: "100%",
      marginBottom: 10,
      alignItems: "flex-end",
    },

    inputLabel: {
      textTransform: "uppercase",
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      color: theme.textPrimary,
    },
    pickerWrapper: {
      flexBasis: "18%",
      minWidth: "100%",
      height: 48,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 8,
      justifyContent: "center",
      backgroundColor: theme.white,
    },
    picker: {
      width: "100%",
    },
    pickerItem: {
      fontSize: 14,
    },
    required: {
      color: theme.secondary,
    },
  });
