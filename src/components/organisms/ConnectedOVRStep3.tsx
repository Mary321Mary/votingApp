import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

import InputField from "../atoms/InputField";
import { Picker } from "@react-native-picker/picker";
import { RegisterStepHeader } from "../modules/RegisterStepHeader";
import { FormProps, RegisterFormState } from "@/utils/types";
import HelpTooltip from "../atoms/HelpTooltip";
import { Checkbox } from "../atoms/Checkbox";
import { ThemeContext } from "@/styles/ThemeProvider";
import {
  DIRECTIONS,
  isRequired,
  isVisible,
  MAILING_TYPE,
} from "@/utils/constants";
import { StandardMailingAddress } from "../modules/StandardMailingAddress";
import { PoBoxMailingAddress } from "../modules/PoBoxMailingAddress";
import { MilitaryMailingAddress } from "../modules/MilitaryMailingAddress";
import { InternationalMailingAddress } from "../modules/InternationalMailingAddress";

export default function ConnectedOVRStep3({
  state,
  value,
  formCongif,
  errorMessages,
  showMailingAddress,
  onChange,
  onChangeError,
  handleCheckbox,
}: FormProps) {
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

  const renderMailingAddressFields = () => {
    switch (value.mailingAddressType) {
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
    <View style={styles.fieldset}>
      {/* Header */}
      <RegisterStepHeader
        titleKey="register_page.address"
        completedSteps={3}
        currentStep={4}
      />

      {/* Residential Address */}
      <Text style={styles.sectionTitle}>
        {t("register_page.residential_address")}
        <HelpTooltip text={t("register_page.residential_address_help")} />
      </Text>

      {isVisible(formCongif, "street_number") && (
        <InputField
          label={t("register_page.street.number")}
          value={value.streetNumber}
          required={isRequired(formCongif, "street_number")}
          errorMessage={errorMessages.streetNumber}
          onChangeText={(text: string) => updateField("streetNumber", text)}
        />
      )}

      {isVisible(formCongif, "street_name") && (
        <InputField
          label={t("register_page.street.name")}
          value={value.streetName}
          required={isRequired(formCongif, "street_name")}
          errorMessage={errorMessages.streetName}
          onChangeText={(text: string) => updateField("streetName", text)}
        />
      )}

      {isVisible(formCongif, "street_type") && (
        <InputField
          label={t("register_page.street.type")}
          value={value.streetType}
          required={isRequired(formCongif, "street_type")}
          errorMessage={errorMessages.streetType}
          onChangeText={(text: string) => updateField("streetType", text)}
        />
      )}

      {isVisible(formCongif, "street_direction") && (
        <View style={styles.inputBlock}>
          <Text style={styles.label}>
            {t("register_page.street.direction")}{" "}
            {isRequired(formCongif, "street_direction") && (
              <Text style={styles.required}> *</Text>
            )}
          </Text>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={value.streetDirection}
              onValueChange={(text: string) =>
                updateField("streetDirection", text)
              }
            >
              {DIRECTIONS.map(
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
          {errorMessages.streetDirection && (
            <Text style={styles.required}>{errorMessages.streetDirection}</Text>
          )}
        </View>
      )}

      {isVisible(formCongif, "street_apt_unit") && (
        <InputField
          label={t("register_page.street.apt")}
          value={value.unit}
          required={isRequired(formCongif, "street_apt_unit")}
          errorMessage={errorMessages.unit}
          onChangeText={(text: string) => updateField("unit", text)}
        />
      )}

      {isVisible(formCongif, "city") && (
        <InputField
          label={t("register_page.city")}
          value={value.city}
          required={isRequired(formCongif, "city")}
          errorMessage={errorMessages.city}
          onChangeText={(text: string) => updateField("city", text)}
        />
      )}

      {isVisible(formCongif, "state") && (
        <InputField
          label={t("register_page.state")}
          value={value.state}
          required={isRequired(formCongif, "state")}
          disabled
        />
      )}

      {isVisible(formCongif, "zip_code") && (
        <InputField
          label={t("zip")}
          value={value.zip}
          required={isRequired(formCongif, "zip_code")}
          disabled
        />
      )}

      {/* Mailing Address Toggle */}
      {isVisible(formCongif, "mailing_same_as_residential") && (
        <Checkbox
          label={t("register_page.mailing_address_2")}
          value={showMailingAddress}
          onValueChange={(checked: boolean) => {
            if (handleCheckbox) handleCheckbox(checked, "showMailingAddress");
            if (checked) {
              updateField("mailingStreetName", "");
              updateField("mailingStreetNumber", "");
              updateField("mailingStreetType", "");
              updateField("mailingUnit", "");
              updateField("mailingCity", "");
              updateField("mailingState", "");
              updateField("mailingZip", "");
              updateField("mailingAddressType", "STANDARD");
            }
          }}
        />
      )}

      {/* Mailing Address */}
      {!showMailingAddress && (
        <>
          <Text style={styles.sectionTitle}>
            {t("register_page.mailing_address")}
            <HelpTooltip text={t("register_page.mailing_address_help")} />
          </Text>

          {isVisible(formCongif, "mailing_address_type") && (
            <View style={styles.inputBlock}>
              <Text style={styles.label}>
                {t("register_page.street.mailing_type")}
                {isRequired(formCongif, "mailing_address_type") && (
                  <Text style={styles.required}> *</Text>
                )}
              </Text>

              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={value.mailingAddressType}
                  onValueChange={(text: string) =>
                    updateField("mailingAddressType", text)
                  }
                >
                  {MAILING_TYPE.map(
                    (state_value: { value: string; name: string }) => (
                      <Picker.Item
                        key={state_value.name}
                        label={t(state_value.name)}
                        value={state_value.value}
                      />
                    ),
                  )}
                </Picker>
              </View>
              {errorMessages.mailingAddressType && (
                <Text style={styles.required}>
                  {errorMessages.mailingAddressType}
                </Text>
              )}
            </View>
          )}

          {renderMailingAddressFields()}
        </>
      )}

      {/* Phone & Consents */}
      {isVisible(formCongif, "phone_number") && (
        <InputField
          label={t("register_page.phone_election")}
          value={value.phone}
          required={isRequired(formCongif, "phone_number")}
          errorMessage={errorMessages.phone}
          numeric
          onChangeText={(text: string) => updateField("phone", text)}
        />
      )}

      {isVisible(formCongif, "opt_in_sms") && (
        <Checkbox
          label={t("register_page.sms_opt_in")}
          value={value.smsConsent}
          required={isRequired(formCongif, "opt_in_sms")}
          onValueChange={(checked: boolean) =>
            updateField("smsConsent", checked)
          }
        />
      )}

      <Text style={styles.disclaimer}>{t("register_page.sms_disclaimer")}</Text>

      {isVisible(formCongif, "email") && (
        <InputField
          label={t("email")}
          value={value.email}
          required={isRequired(formCongif, "email")}
          errorMessage={errorMessages.email}
          onChangeText={(text: string) => updateField("email", text)}
        />
      )}

      {isVisible(formCongif, "opt_in_email") && (
        <Checkbox
          label={t("register_page.email_opt_in")}
          value={value.emailConsent}
          required={isRequired(formCongif, "opt_in_email")}
          onValueChange={(checked: boolean) =>
            updateField("emailConsent", checked)
          }
        />
      )}

      {isVisible(formCongif, "opt_in_volunteer") && (
        <Checkbox
          label={t("register_page.volunteer")}
          value={value.volunteer}
          required={isRequired(formCongif, "opt_in_volunteer")}
          onValueChange={(checked: boolean) =>
            updateField("volunteer", checked)
          }
        />
      )}
    </View>
  );
}

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
