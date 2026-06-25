import React, { useContext } from "react";
import { FormProps, RegisterFormState } from "@/utils/types";
import { NameSection } from "../../modules/NameSection";
import { ContactSection } from "../../modules/ContactSection";
import { isRequired, isVisible, STATES } from "@/utils/constants";
import { StyleSheet, Text, View } from "react-native";
import { DateRow } from "../../atoms/DateOfBirth/DateRow";
import { ThemeContext } from "@/styles/ThemeProvider";
import { useTranslation } from "react-i18next";
import { RaceAndParty } from "../../modules/RaceAndParty";
import InputField from "../../atoms/InputField";
import { Picker } from "@react-native-picker/picker";
import { Checkbox } from "../../atoms/Checkbox";
import QuestionsSection from "@/components/atoms/QuestionsSection";

export const ConnectedPA = ({
  state,
  value,
  formCongif,
  errorMessages,
  onChangeError,
  onChange,
  handleMainButton,
}: FormProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

  const hasSecondaryAddressValue = [
    value.home_unit_type?.trim(),
    value.home_unit?.trim(),
  ].some(Boolean);

  const paCounties = t("pennsylvania.counties", { returnObjects: true });
  const paUnitTypes = t("pennsylvania.unit_types", { returnObjects: true });

  const UNIT_OPTIONS = [
    { name: "", value: "" },
    ...(Array.isArray(paUnitTypes)
      ? paUnitTypes.map(unitType => ({ name: unitType, value: unitType }))
      : []),
  ];
  const COUNTY_OPTIONS = [
    { name: "", value: "" },
    ...(Array.isArray(paCounties)
      ? paCounties.map(county => ({ name: county, value: county }))
      : []),
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
    <>
      {/* NAME */}
      <NameSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        showChangeName
        showWillBe18ByElection
        onChange={onChange}
        onChangeError={onChangeError}
      />

      {isVisible(formCongif, "date_of_birth") && (
        <>
          <Text style={styles.label}>
            {t("form_fields.dob")}
            {isRequired(formCongif, "date_of_birth") && (
              <Text style={styles.required}> *</Text>
            )}
          </Text>
          <DateRow
            value={{
              month: {
                name: "birthMonth",
                value: value.birthMonth,
                errorText: t(errorMessages.birthMonth),
              },
              day: {
                name: "birthDay",
                value: value.birthDay,
                errorText: t(errorMessages.birthDay),
              },
              year: {
                name: "birthYear",
                value: value.birthYear,
                errorText: t(errorMessages.birthYear),
              },
            }}
            updateField={updateField}
          />
        </>
      )}

      {/* ADDRESS */}
      <InputField
        label={t("form_fields.address")}
        value={value.home_address}
        helpText={t("register_page.address_help")}
        required={isRequired(formCongif, "home_address")}
        errorMessage={t(errorMessages.home_address)}
        onChangeText={(text: string) => updateField("home_address", text)}
      />
      <InputField
        label={t("michigan.international.address_line_2")}
        value={value.address_line_2}
        errorMessage={t(errorMessages.address_line_2)}
        onChangeText={(text: string) => updateField("address_line_2", text)}
      />
      <Text style={styles.inputLabel}>
        {t("form_fields.unit_type")}
        {hasSecondaryAddressValue && <Text style={styles.required}> *</Text>}
      </Text>
      <View style={styles.pickerWrapper}>
        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={value.home_unit_type}
          onValueChange={itemValue => updateField("home_unit_type", itemValue)}
        >
          {UNIT_OPTIONS.map((state_value: { value: string; name: string }) => (
            <Picker.Item
              key={state_value.name}
              label={state_value.name}
              value={state_value.value}
            />
          ))}
        </Picker>
      </View>
      {errorMessages.home_unit_type && (
        <Text style={styles.required}>{t(errorMessages.home_unit_type)}</Text>
      )}
      <InputField
        label={t("form_fields.unit_number")}
        value={value.home_unit}
        required={hasSecondaryAddressValue}
        errorMessage={t(errorMessages.home_unit)}
        onChangeText={(text: string) => updateField("home_unit", text)}
      />
      <InputField
        label={t("form_fields.city")}
        value={value.home_city}
        required={isRequired(formCongif, "home_city")}
        errorMessage={t(errorMessages.home_city)}
        onChangeText={(text: string) => updateField("home_city", text)}
      />
      <InputField
        label={t("form_fields.state")}
        disabled
        value={state.abbreviation}
        required={isRequired(formCongif, "home_state")}
        errorMessage={t(errorMessages.state)}
      />
      <InputField
        label={t("form_fields.zip")}
        disabled
        value={value.home_zip_code}
        required={isRequired(formCongif, "home_zip_code")}
        errorMessage={t(errorMessages.home_zip_code)}
      />
      <Text style={styles.inputLabel}>
        {t("form_fields.county")}
        {isRequired(formCongif, "home_county") && (
          <Text style={styles.required}> *</Text>
        )}
      </Text>
      <View style={styles.pickerWrapper}>
        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={value.home_county}
          onValueChange={itemValue => updateField("home_county", itemValue)}
        >
          {[
            { name: "", value: "" },
            ...(formCongif.fields.home_county?.options?.map(
              (option: string) => ({
                name: option,
                value: option,
              }),
            ) ?? COUNTY_OPTIONS),
          ].map((state_value: { value: string; name: string }) => (
            <Picker.Item
              key={state_value.name}
              label={state_value.name}
              value={state_value.value}
            />
          ))}
        </Picker>
      </View>
      {errorMessages.home_county && (
        <Text style={styles.required}>{t(errorMessages.home_county)}</Text>
      )}

      {(!value.age_eligibility || !value.has_no_state_license) &&
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
                  required={isRequired(formCongif, "mailing_address")}
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
                  required={isRequired(formCongif, "mailing_unit")}
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
                  required={isRequired(formCongif, "mailing_city")}
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
                    {isRequired(formCongif, "mailing_state") && (
                      <Text style={styles.required}> *</Text>
                    )}
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
                  required={isRequired(formCongif, "mailing_zip_code")}
                  onChangeText={(text: string) =>
                    updateField("mailing_zip_code", text)
                  }
                />
              )}
            </View>
          </>
        )}
      {(!value.age_eligibility || !value.has_no_state_license) &&
        isVisible(formCongif, "change_of_address") && (
          <Checkbox
            label={t("nvra_form_page.changed_address")}
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
                  required={isRequired(formCongif, "prev_address")}
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
                  required={isRequired(formCongif, "prev_unit")}
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
                  required={isRequired(formCongif, "prev_city")}
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
                    {isRequired(formCongif, "prev_state") && (
                      <Text style={styles.required}> *</Text>
                    )}
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

      <Checkbox
        label={t("pennsylvania.changed_party_checkbox")}
        value={value.changed_party}
        onValueChange={checked => updateField("changed_party", checked)}
      />
      <RaceAndParty
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        onChange={onChange}
        onChangeError={onChangeError}
      />
      <QuestionsSection
        value={value}
        errorMessages={errorMessages}
        onChange={onChange}
        onChangeError={onChangeError}
      />

      <ContactSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        onChange={onChange}
        onChangeError={onChangeError}
      />
      {handleMainButton}
    </>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    label: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "medium",
      textTransform: "uppercase",
    },
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
      marginTop: 5,
    },
    pickerWrapper: {
      flexBasis: "18%",
      minWidth: "100%",
      height: 48,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 6,
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
    divider: {
      height: 1,
      backgroundColor: theme.gray,
      marginVertical: 16,
    },
  });
