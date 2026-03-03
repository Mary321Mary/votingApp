import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";
import { ThemeContext } from "@/styles/ThemeProvider";
import { FormProps, RegisterFormState } from "@/utils/types";

import InputField from "../atoms/InputField";
import HelpTooltip from "../atoms/HelpTooltip";
import { Checkbox } from "../atoms/Checkbox";
import { Radio } from "../atoms/Radio";
import { isRequired, isVisible, STATES } from "@/utils/constants";

interface AddressSectionProps extends FormProps {
  showRadioButtons?: boolean;
}

export const AddressSection = ({
  state,
  showRadioButtons = false,
  value,
  formCongif,
  errorMessages,
  showChangedAddress,
  showDifferentMailAddress,
  showIsAdultBlock,
  onChange,
  onChangeError,
  handleCheckbox,
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
      <Text style={styles.sectionTitle}>
        {t("register_page.section_home_address")}
        <HelpTooltip text={t("register_page.address_help")} />
      </Text>

      <View style={styles.row}>
        {isVisible(formCongif, "home_address") && (
          <InputField
            label={t("register_page.address")}
            value={value.address}
            required={isRequired(formCongif, "home_address")}
            errorMessage={errorMessages.address}
            onChangeText={(text: string) => updateField("address", text)}
          />
        )}
        {isVisible(formCongif, "home_unit") && (
          <InputField
            label={t("register_page.unit_lot")}
            value={value.unit}
            required={isRequired(formCongif, "home_unit")}
            errorMessage={errorMessages.unit}
            onChangeText={(text: string) => updateField("unit", text)}
          />
        )}
      </View>

      <View style={styles.row}>
        {isVisible(formCongif, "home_city") && (
          <InputField
            label={t("register_page.city")}
            value={value.city}
            required={isRequired(formCongif, "home_city")}
            errorMessage={errorMessages.city}
            onChangeText={(text: string) => updateField("city", text)}
          />
        )}
        {isVisible(formCongif, "home_state") && (
          <InputField
            label={t("register_page.state")}
            disabled
            value={state.abbreviation}
            required={isRequired(formCongif, "home_state")}
            errorMessage={errorMessages.state}
          />
        )}
        {isVisible(formCongif, "home_zip_code") && (
          <InputField
            label={t("zip")}
            disabled
            value={value.zip}
            required={isRequired(formCongif, "home_zip_code")}
            errorMessage={errorMessages.zip}
          />
        )}
      </View>

      {(!showIsAdultBlock || !value.hasStateId) &&
        isVisible(formCongif, "has_mailing_address") && (
          <Checkbox
            label={t("register_page.different_mail_address")}
            value={showDifferentMailAddress}
            required={isRequired(formCongif, "has_mailing_address")}
            onValueChange={checked => {
              if (handleCheckbox)
                handleCheckbox(checked, "showDifferentMailAddress");
              if (!checked) {
                updateField("differentAddress", "");
                updateField("differentUnit", "");
                updateField("differentCity", "");
                updateField("differentState", "");
                updateField("differentZip", "");
              }
            }}
          />
        )}
      {(!showIsAdultBlock || !value.hasStateId) && showDifferentMailAddress && (
        <>
          <Text>
            {t("register_page.mailing_address")}
            <HelpTooltip text={t("register_page.mailing_address_help")} />
          </Text>
          <View style={styles.row}>
            {isVisible(formCongif, "mailing_address") && (
              <InputField
                label={t("register_page.address")}
                value={value.differentAddress}
                required={isRequired(formCongif, "mailing_address")}
                errorMessage={errorMessages.differentAddress}
                onChangeText={(text: string) =>
                  updateField("differentAddress", text)
                }
              />
            )}
            {isVisible(formCongif, "mailing_unit") && (
              <InputField
                label={t("register_page.unit_lot")}
                value={value.differentUnit}
                errorMessage={errorMessages.differentUnit}
                required={isRequired(formCongif, "mailing_unit")}
                onChangeText={(text: string) =>
                  updateField("differentUnit", text)
                }
              />
            )}
          </View>
          <View style={styles.row}>
            {isVisible(formCongif, "mailing_city") && (
              <InputField
                label={t("register_page.city")}
                value={value.differentCity}
                required={isRequired(formCongif, "mailing_city")}
                errorMessage={errorMessages.differentCity}
                onChangeText={(text: string) =>
                  updateField("differentCity", text)
                }
              />
            )}
            {isVisible(formCongif, "mailing_state") && (
              <View>
                <Text style={styles.inputLabel}>
                  {t("register_page.state")}
                  {isRequired(formCongif, "mailing_state") && (
                    <Text style={styles.required}> *</Text>
                  )}
                </Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                    selectedValue={value.differentState}
                    onValueChange={itemValue =>
                      updateField("differentState", itemValue)
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
                {errorMessages.differentState && (
                  <Text style={styles.required}>
                    {errorMessages.differentState}
                  </Text>
                )}
              </View>
            )}
            {isVisible(formCongif, "mailing_zip_code") && (
              <InputField
                label={t("zip")}
                numeric
                value={value.differentZip}
                errorMessage={errorMessages.differentZip}
                required={isRequired(formCongif, "mailing_zip_code")}
                onChangeText={(text: string) =>
                  updateField("differentZip", text)
                }
              />
            )}
          </View>
        </>
      )}
      {(!showIsAdultBlock || !value.hasStateId) &&
        isVisible(formCongif, "change_of_address") && (
          <Checkbox
            label={t("register_page.changed_address")}
            value={showChangedAddress}
            required={isRequired(formCongif, "change_of_address")}
            onValueChange={checked => {
              if (handleCheckbox) handleCheckbox(checked, "showChangedAddress");
              if (!checked) {
                updateField("changedAddress", "");
                updateField("changedUnit", "");
                updateField("changedCity", "");
                updateField("changedState", "");
                updateField("changedZip", "");
              }
            }}
          />
        )}
      {(!showIsAdultBlock || !value.hasStateId) && showChangedAddress && (
        <>
          <Text>{t("register_page.previous_address")}</Text>
          <View style={styles.row}>
            {isVisible(formCongif, "prev_address") && (
              <InputField
                label={t("register_page.address")}
                value={value.changedAddress}
                required={isRequired(formCongif, "prev_address")}
                errorMessage={errorMessages.changedAddress}
                onChangeText={(text: string) =>
                  updateField("changedAddress", text)
                }
              />
            )}
            {isVisible(formCongif, "prev_unit") && (
              <InputField
                label={t("register_page.unit_lot")}
                value={value.changedUnit}
                required={isRequired(formCongif, "prev_unit")}
                errorMessage={errorMessages.changedUnit}
                onChangeText={(text: string) =>
                  updateField("changedUnit", text)
                }
              />
            )}
          </View>
          <View style={styles.row}>
            {isVisible(formCongif, "prev_city") && (
              <InputField
                label={t("register_page.city")}
                value={value.changedCity}
                required={isRequired(formCongif, "prev_city")}
                errorMessage={errorMessages.changedCity}
                onChangeText={(text: string) =>
                  updateField("changedCity", text)
                }
              />
            )}
            {isVisible(formCongif, "prev_state") && (
              <View>
                <Text style={styles.inputLabel}>
                  {t("register_page.state")}
                  {isRequired(formCongif, "prev_state") && (
                    <Text style={styles.required}> *</Text>
                  )}
                </Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                    selectedValue={value.changedState}
                    onValueChange={itemValue =>
                      updateField("changedState", itemValue)
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
                {errorMessages.changedState && (
                  <Text style={styles.required}>
                    {errorMessages.changedState}
                  </Text>
                )}
              </View>
            )}
            {isVisible(formCongif, "prev_zip_code") && (
              <InputField
                label={t("zip")}
                required
                numeric
                value={value.changedZip}
                errorMessage={errorMessages.changedZip}
                onChangeText={(text: string) => updateField("changedZip", text)}
              />
            )}
          </View>
        </>
      )}

      {isVisible(formCongif, "has_state_license") && showRadioButtons && (
        <>
          <Radio
            label={t("register_page.has_id", {
              abbreviation: state.abbreviation,
            })}
            selected={value.hasStateId === true}
            onPress={() => updateField("hasStateId", true)}
          />
          {value.hasStateId && showIsAdultBlock ? (
            <Text style={styles.required}>
              {t("register_page.license_age_eligibility")}
            </Text>
          ) : (
            ""
          )}
          <Radio
            label={t("register_page.no_id", {
              abbreviation: state.abbreviation,
            })}
            selected={value.hasStateId === false}
            onPress={() => updateField("hasStateId", false)}
          />
        </>
      )}
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    section: {
      marginBottom: 10,
      paddingHorizontal: 5,
    },
    sectionTitle: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 18,
      fontWeight: "semibold",
      marginBottom: 12,
    },
    row: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      width: "100%",
      marginBottom: 16,
      alignItems: "flex-end",
    },

    inputLabel: {
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
