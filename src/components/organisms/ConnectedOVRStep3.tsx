import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { useTranslation } from "react-i18next";

import InputField from "../atoms/InputField";
import { Picker } from "@react-native-picker/picker";
import { RegisterStepHeader } from "../modules/RegisterStepHeader";
import { FormProps, RegisterFormState } from "@/utils/types";
import HelpTooltip from "../atoms/HelpTooltip";
import { Checkbox } from "../atoms/Checkbox";
import { ThemeContext } from "@/styles/ThemeProvider";
import { DIRECTIONS, MAILING_TYPE } from "@/utils/constants";
import { StandardMailingAddress } from "../modules/StandardMailingAddress";
import { PoBoxMailingAddress } from "../modules/PoBoxMailingAddress";
import { MilitaryMailingAddress } from "../modules/MilitaryMailingAddress";
import { InternationalMailingAddress } from "../modules/InternationalMailingAddress";

export default function ConnectedOVRStep3({ state, errorMessages, value, onChange }: FormProps) {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

  const [showMailingAddress, setShowMailingAddress] = useState(false);

  const updateField = <K extends keyof RegisterFormState>(
    key: K,
    fieldValue: RegisterFormState[K]
  ) => {
    onChange({ ...value, [key]: fieldValue });
  };

  const renderMailingAddressFields = () => {
    switch (value.mailingAddressType) {
      case "STANDARD":
        return <StandardMailingAddress errorMessages={errorMessages} state={state} value={value} onChange={onChange} />;

      case "PO_BOX":
        return <PoBoxMailingAddress errorMessages={errorMessages} state={state} value={value} onChange={onChange} />;

      case "MILITARY":
        return <MilitaryMailingAddress errorMessages={errorMessages} state={state} value={value} onChange={onChange} />;

      case "INTERNATIONAL":
        return <InternationalMailingAddress errorMessages={errorMessages} state={state} value={value} onChange={onChange} />;

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

      <InputField
        label={t('register_page.street.number')}
        value={value.streetNumber}
        errorMessage={errorMessages.streetNumber}
        required
        onChangeText={(text: string) => updateField("streetNumber", text)}
      />

      <InputField
        label={t('register_page.street.name')}
        value={value.streetName}
        errorMessage={errorMessages.streetName}
        required
        onChangeText={(text: string) => updateField("streetName", text)}
      />

      <InputField
        label={t('register_page.street.type')}
        value={value.streetType}
        errorMessage={errorMessages.streetType}
        onChangeText={(text: string) => updateField("streetType", text)}
      />

      <View style={styles.inputBlock}>
        <Text style={styles.label}>
          {t("register_page.street.direction")}
        </Text>

        <View style={styles.pickerWrapper}>
          <Picker selectedValue={value.streetDirection} onValueChange={(text: string) => updateField("streetDirection", text)}>
            {DIRECTIONS.map((state_value: { value: string, name: string }) => (
              <Picker.Item key={state_value.name} label={state_value.name} value={state_value.value} />
            ))}
          </Picker>
        </View>
      </View>

      <InputField
        label={t('register_page.street.apt')}
        value={value.unit}
        errorMessage={errorMessages.unit}
        onChangeText={(text: string) => updateField("unit", text)}
      />

      <InputField
        label={t('register_page.city')}
        value={value.city}
        errorMessage={errorMessages.city}
        required
        onChangeText={(text: string) => updateField("city", text)}
      />

      <InputField
        label={t('register_page.state')}
        value={value.state}
        required
        disabled
      />

      <InputField
        label={t('zip')}
        value={value.zip}
        required
        disabled
      />

      {/* Mailing Address Toggle */}
      <Checkbox
        label={t("register_page.mailing_address_2")}
        value={showMailingAddress}
        onValueChange={(checked: boolean) => setShowMailingAddress(checked)}
      />

      {/* Mailing Address */}
      {showMailingAddress && (
        <>
          <Text style={styles.sectionTitle}>
            {t("register_page.mailing_address")}
            <HelpTooltip text={t("register_page.mailing_address_help")} />
          </Text>

          <View style={styles.inputBlock}>
            <Text style={styles.label}>
              {t("register_page.street.mailing_type")}
              <Text style={styles.required}> *</Text>
            </Text>

            <View style={styles.pickerWrapper}>
              <Picker selectedValue={value.mailingAddressType} onValueChange={(text: string) => updateField("mailingAddressType", text)}>
                {MAILING_TYPE.map((state_value: { value: string, name: string }) => (
                  <Picker.Item key={state_value.name} label={t(state_value.name)} value={state_value.value} />
                ))}
              </Picker>
            </View>
          </View>

          {renderMailingAddressFields()}
        </>
      )}

      {/* Phone & Consents */}
      <InputField
        label={t('register_page.phone_election')}
        value={value.phone}
        errorMessage={errorMessages.phone}
        numeric
        onChangeText={(text: string) => updateField("phone", text)}
      />

      <Checkbox
        label={t("register_page.sms_opt_in")}
        value={value.smsConsent}
        onValueChange={(checked: boolean) => updateField("smsConsent", checked)}
      />

      <Text style={styles.disclaimer}>
        {t("register_page.sms_disclaimer")}
      </Text>

      <InputField
        label={t('email')}
        value={value.email}
        errorMessage={errorMessages.email}
        onChangeText={(text: string) => updateField("email", text)}
      />

      <Checkbox
        label={t("register_page.email_opt_in")}
        value={value.emailConsent}
        onValueChange={(checked: boolean) => updateField("emailConsent", checked)}
      />

      <Checkbox
        label={t("register_page.volunteer")}
        value={value.volunteer}
        onValueChange={(checked: boolean) => updateField("volunteer", checked)}
      />
    </View>
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
