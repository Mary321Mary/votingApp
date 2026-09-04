import React, { useContext, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

import InputField from "../../atoms/InputField";
import { Checkbox } from "../../atoms/Checkbox";

import { RegisterStepHeader } from "../../modules/RegisterStepHeader";
import { StandardMailingAddress } from "../../modules/StandardMailingAddress";
import { PoBoxMailingAddress } from "../../modules/PoBoxMailingAddress";
import { MilitaryMailingAddress } from "../../modules/MilitaryMailingAddress";
import { InternationalMailingAddress } from "../../modules/InternationalMailingAddress";
import { PhoneSection } from "@/components/modules/PhoneSection";

import { ThemeContext } from "@/styles/ThemeProvider";
import { isRequired, isVisible } from "@/utils/constants";
import { FormProps, RegisterFormState } from "@/utils/types";
import { ContactSection } from "../../modules/ContactSection";
import { SelectField } from "../../atoms/SelectField";

export default function ConnectedOVRStep3({
  state,
  value,
  formCongif,
  errorMessages,
  onChange,
  onChangeError,
  handleMainButton,
}: FormProps) {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

  const MAILING_TYPE = [
    { name: t("michigan.mailing_address_type.standard"), value: "STANDARD" },
    { name: t("michigan.mailing_address_type.po_box"), value: "PO_BOX" },
    { name: t("michigan.mailing_address_type.military"), value: "MILITARY" },
    {
      name: t("michigan.mailing_address_type.international"),
      value: "INTERNATIONAL",
    },
  ];

  const streetTypeOptions = useMemo(
    () =>
      formCongif.fields.street_type?.options?.map((option: string) => ({
        name: option,
        value: option,
      })) ?? [],
    [formCongif.fields.street_type?.options],
  );

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

  const renderMailingAddressFields = () => {
    switch (value.mailing_address_type) {
      case "STANDARD":
        return (
          <StandardMailingAddress
            errorMessages={errorMessages}
            state={state}
            value={value}
            formCongif={formCongif}
            onChange={onChange}
            onChangeError={onChangeError}
          />
        );

      case "PO_BOX":
        return (
          <PoBoxMailingAddress
            errorMessages={errorMessages}
            state={state}
            value={value}
            formCongif={formCongif}
            onChange={onChange}
            onChangeError={onChangeError}
          />
        );

      case "MILITARY":
        return (
          <MilitaryMailingAddress
            errorMessages={errorMessages}
            state={state}
            value={value}
            formCongif={formCongif}
            onChange={onChange}
            onChangeError={onChangeError}
          />
        );

      case "INTERNATIONAL":
        return (
          <InternationalMailingAddress
            errorMessages={errorMessages}
            state={state}
            value={value}
            formCongif={formCongif}
            onChange={onChange}
            onChangeError={onChangeError}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Header */}
      <RegisterStepHeader
        titleKey="form_fields.address"
        completedSteps={3}
        currentStep={4}
      />

      {isVisible(formCongif, "street_number") && (
        <InputField
          name="street_number"
          label={t("michigan.street.number")}
          value={value.street_number}
          required={isRequired(formCongif, "street_number")}
          helpText={t("form_fields.home_address_help")}
          errorMessage={t(errorMessages.street_number)}
          onChangeText={(text: string) => updateField("street_number", text)}
        />
      )}

      {isVisible(formCongif, "street_name") && (
        <InputField
          name="street_name"
          label={t("michigan.street.name")}
          value={value.street_name}
          required={isRequired(formCongif, "street_name")}
          errorMessage={t(errorMessages.street_name)}
          onChangeText={(text: string) => updateField("street_name", text)}
        />
      )}

      {isVisible(formCongif, "street_type") && (
        <SelectField
          searchable
          name="street_type"
          label={t("michigan.street.type")}
          value={value.street_type}
          options={streetTypeOptions}
          required={isRequired(formCongif, "street_type")}
          errorMessage={errorMessages.street_type}
          onValueChange={itemValue => updateField("street_type", itemValue)}
        />
      )}

      {isVisible(formCongif, "street_direction") && (
        <SelectField
          searchable
          name="street_direction"
          label={t("michigan.street.direction")}
          value={value.street_direction}
          options={
            formCongif.fields.street_direction.options?.map(
              (option: string) => ({
                name: option,
                value: option,
              }),
            ) || []
          }
          required={isRequired(formCongif, "street_direction")}
          errorMessage={errorMessages.street_direction}
          onValueChange={itemValue =>
            updateField("street_direction", itemValue)
          }
        />
      )}

      {isVisible(formCongif, "street_apt_unit") && (
        <InputField
          name="home_unit"
          label={t("michigan.street.apt")}
          value={value.home_unit}
          required={isRequired(formCongif, "street_apt_unit")}
          errorMessage={t(errorMessages.home_unit)}
          onChangeText={(text: string) => updateField("home_unit", text)}
        />
      )}

      {isVisible(formCongif, "city") && (
        <InputField
          name="home_city"
          label={t("form_fields.city")}
          value={value.home_city}
          required={isRequired(formCongif, "city")}
          errorMessage={t(errorMessages.home_city)}
          onChangeText={(text: string) => updateField("home_city", text)}
        />
      )}

      {isVisible(formCongif, "state") && (
        <InputField
          name="state"
          label={t("form_fields.state")}
          value={value.state}
          required={isRequired(formCongif, "state")}
          disabled
        />
      )}

      {isVisible(formCongif, "zip_code") && (
        <InputField
          name="zip_code"
          label={t("zip")}
          value={value.home_zip_code}
          required={isRequired(formCongif, "zip_code")}
          disabled
        />
      )}

      {/* Mailing Address Toggle */}
      {isVisible(formCongif, "has_mailing_address") && (
        <View style={styles.inputBlock}>
          <Checkbox
            name="has_mailing_address"
            label={t("nvra_form_page.different_mail_address")}
            value={value.has_mailing_address}
            onValueChange={(checked: boolean) => {
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
                  mailing_address_type: "STANDARD",
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
        </View>
      )}

      {/* Mailing Address */}
      {value.has_mailing_address && (
        <>
          {isVisible(formCongif, "mailing_address_type") && (
            <SelectField
              name="mailing_address_type"
              label={t("michigan.mailing_type")}
              value={value.mailing_address_type}
              options={MAILING_TYPE}
              required={isRequired(formCongif, "mailing_address_type")}
              errorMessage={errorMessages.mailing_address_type}
              onValueChange={itemValue =>
                updateField("mailing_address_type", itemValue)
              }
            />
          )}

          {renderMailingAddressFields()}
        </>
      )}

      <PhoneSection
        label={t("michigan.phone_election")}
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
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    inputBlock: {
      marginTop: 10,
    },
  });
