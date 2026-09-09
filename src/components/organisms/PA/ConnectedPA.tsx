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
import { PrevAddressSection } from "../../modules/PrevAddressSection";
import { PhoneSection } from "../../modules/PhoneSection";

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
      <PhoneSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
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
          required={isRequired(formCongif, "date_of_birth")}
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
      <PrevAddressSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        showChangeOfAddress
        onChange={onChange}
        onChangeError={onChangeError}
      />

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
