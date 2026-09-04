import React, { useContext } from "react";
import { FormProps, RegisterFormState } from "@/utils/types";
import { NameSection } from "../../modules/NameSection";
import { ContactSection } from "../../modules/ContactSection";
import { isRequired, isVisible, STATES } from "@/utils/constants";
import { StyleSheet, View } from "react-native";
import { DateRow } from "../../atoms/DateOfBirth/DateRow";
import { ThemeContext } from "@/styles/ThemeProvider";
import { useTranslation } from "react-i18next";
import { RaceAndParty } from "../../modules/RaceAndParty";
import InputField from "../../atoms/InputField";
import { Checkbox } from "../../atoms/Checkbox";
import { SelectField } from "../../atoms/SelectField";

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

  const UNIT_OPTIONS = [
    { name: "", value: "" },
    ...(formCongif.fields.home_unit_type?.options?.map((option: string) => ({
      name: option,
      value: option,
    })) || []),
  ];
  const COUNTY_OPTIONS = [
    { name: "", value: "" },
    ...(formCongif.fields.home_county?.options?.map((option: string) => ({
      name: option,
      value: option,
    })) || []),
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
        onChange={onChange}
        onChangeError={onChangeError}
      />

      {isVisible(formCongif, "date_of_birth") && (
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
      )}

      {/* ADDRESS */}
      <InputField
        name="home_address"
        label={t("form_fields.address")}
        value={value.home_address}
        helpText={t("register_page.address_help")}
        required={isRequired(formCongif, "home_address")}
        errorMessage={t(errorMessages.home_address)}
        onChangeText={(text: string) => updateField("home_address", text)}
      />
      <InputField
        name="address_line_2"
        label={t("michigan.international.address_line_2")}
        value={value.address_line_2}
        errorMessage={t(errorMessages.address_line_2)}
        onChangeText={(text: string) => updateField("address_line_2", text)}
      />
      <SelectField
        name="home_unit_type"
        label={t("form_fields.unit_type")}
        value={value.home_unit_type}
        options={UNIT_OPTIONS}
        required={isRequired(formCongif, "home_unit_type")}
        errorMessage={errorMessages.home_unit_type}
        onValueChange={itemValue => updateField("home_unit_type", itemValue)}
      />
      <InputField
        name="home_unit"
        label={t("form_fields.unit_number")}
        value={value.home_unit}
        required={hasSecondaryAddressValue}
        errorMessage={t(errorMessages.home_unit)}
        onChangeText={(text: string) => updateField("home_unit", text)}
      />
      <InputField
        name="home_city"
        label={t("form_fields.city")}
        value={value.home_city}
        required={isRequired(formCongif, "home_city")}
        errorMessage={t(errorMessages.home_city)}
        onChangeText={(text: string) => updateField("home_city", text)}
      />
      <InputField
        name="home_state"
        label={t("form_fields.state")}
        disabled
        value={state.abbreviation}
        required={isRequired(formCongif, "home_state")}
        errorMessage={t(errorMessages.state)}
      />
      <InputField
        name="home_zip_code"
        label={t("form_fields.zip")}
        disabled
        value={value.home_zip_code}
        required={isRequired(formCongif, "home_zip_code")}
        errorMessage={t(errorMessages.home_zip_code)}
      />
      <SelectField
        name="home_county"
        label={t("form_fields.county")}
        value={value.home_county}
        options={[
          { name: "", value: "" },
          ...(formCongif.fields.home_county?.options?.map((option: string) => ({
            name: option,
            value: option,
          })) ?? COUNTY_OPTIONS),
        ]}
        required={isRequired(formCongif, "home_county")}
        errorMessage={errorMessages.home_county}
        onValueChange={itemValue => updateField("home_county", itemValue)}
      />
      {(!value.age_eligibility || !value.has_no_state_license) &&
        isVisible(formCongif, "has_mailing_address") && (
          <Checkbox
            name="has_mailing_address"
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
                  name="mailing_address"
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
                  name="mailing_unit"
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
                  name="mailing_city"
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
                <SelectField
                  name="mailing_state"
                  label={t("form_fields.state")}
                  value={value.mailing_state}
                  options={STATES}
                  required={isRequired(formCongif, "mailing_state")}
                  errorMessage={errorMessages.mailing_state}
                  onValueChange={itemValue =>
                    updateField("mailing_state", itemValue)
                  }
                />
              )}
              {isVisible(formCongif, "mailing_zip_code") && (
                <InputField
                  name="mailing_zip_code"
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
            name="change_of_address"
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
                  name="prev_address"
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
                  name="prev_unit"
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
                  name="prev_city"
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
                <SelectField
                  name="prev_state"
                  label={t("form_fields.state")}
                  value={value.prev_state}
                  options={STATES}
                  required={isRequired(formCongif, "prev_state")}
                  errorMessage={errorMessages.prev_state}
                  onValueChange={itemValue =>
                    updateField("prev_state", itemValue)
                  }
                />
              )}
              {isVisible(formCongif, "prev_zip_code") && (
                <InputField
                  name="prev_zip_code"
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
        name="changed_party"
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

      <ContactSection
        showQuestions
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
    row: {
      flexDirection: "row",
      flexWrap: "wrap",
      width: "100%",
      marginBottom: 10,
      alignItems: "flex-end",
    },
  });
