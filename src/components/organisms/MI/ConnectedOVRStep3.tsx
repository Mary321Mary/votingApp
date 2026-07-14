import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  useWindowDimensions,
} from "react-native";
import { useTranslation } from "react-i18next";

import InputField from "../../atoms/InputField";
import { Picker } from "@react-native-picker/picker";
import { RegisterStepHeader } from "../../modules/RegisterStepHeader";
import { FormProps, RegisterFormState } from "@/utils/types";
import HelpTooltip from "../../atoms/HelpTooltip";
import { Checkbox } from "../../atoms/Checkbox";
import { ThemeContext } from "@/styles/ThemeProvider";
import { DIRECTIONS, isRequired, isVisible } from "@/utils/constants";
import { StandardMailingAddress } from "../../modules/StandardMailingAddress";
import { PoBoxMailingAddress } from "../../modules/PoBoxMailingAddress";
import { MilitaryMailingAddress } from "../../modules/MilitaryMailingAddress";
import { InternationalMailingAddress } from "../../modules/InternationalMailingAddress";
import { useUIConfig } from "@/contexts/UIConfigContext";
import RenderHTML from "react-native-render-html";
import { PhoneSection } from "@/components/modules/PhoneSection";

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
  const { config } = useUIConfig();
  const { width } = useWindowDimensions();

  const MAILING_TYPE = [
    { name: t("michigan.mailing_address_type.standard"), value: "STANDARD" },
    { name: t("michigan.mailing_address_type.po_box"), value: "PO_BOX" },
    { name: t("michigan.mailing_address_type.military"), value: "MILITARY" },
    {
      name: t("michigan.mailing_address_type.international"),
      value: "INTERNATIONAL",
    },
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
          label={t("michigan.street.name")}
          value={value.street_name}
          required={isRequired(formCongif, "street_name")}
          errorMessage={t(errorMessages.street_name)}
          onChangeText={(text: string) => updateField("street_name", text)}
        />
      )}

      {isVisible(formCongif, "street_type") && (
        <InputField
          label={t("michigan.street.type")}
          value={value.street_type}
          required={isRequired(formCongif, "street_type")}
          errorMessage={t(errorMessages.street_type)}
          onChangeText={(text: string) => updateField("street_type", text)}
        />
      )}

      {isVisible(formCongif, "street_direction") && (
        <View>
          <Text style={styles.label}>
            {t("michigan.street.direction")}{" "}
            {isRequired(formCongif, "street_direction") && (
              <Text style={styles.required}> *</Text>
            )}
          </Text>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={value.street_direction}
              onValueChange={(text: string) =>
                updateField("street_direction", text)
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
          {errorMessages.street_direction && (
            <Text style={styles.required}>
              {t(errorMessages.street_direction)}
            </Text>
          )}
        </View>
      )}

      {isVisible(formCongif, "street_apt_unit") && (
        <InputField
          label={t("michigan.street.apt")}
          value={value.home_unit}
          required={isRequired(formCongif, "street_apt_unit")}
          errorMessage={t(errorMessages.home_unit)}
          onChangeText={(text: string) => updateField("home_unit", text)}
        />
      )}

      {isVisible(formCongif, "city") && (
        <InputField
          label={t("form_fields.city")}
          value={value.home_city}
          required={isRequired(formCongif, "city")}
          errorMessage={t(errorMessages.home_city)}
          onChangeText={(text: string) => updateField("home_city", text)}
        />
      )}

      {isVisible(formCongif, "state") && (
        <InputField
          label={t("form_fields.state")}
          value={value.state}
          required={isRequired(formCongif, "state")}
          disabled
        />
      )}

      {isVisible(formCongif, "zip_code") && (
        <InputField
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
            <View>
              <Text style={styles.label}>
                {t("michigan.mailing_type")}
                {isRequired(formCongif, "mailing_address_type") && (
                  <Text style={styles.required}> *</Text>
                )}
                <HelpTooltip text={t("form_fields.mailing_address_help")} />
              </Text>

              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={value.mailing_address_type}
                  onValueChange={(text: string) =>
                    updateField("mailing_address_type", text)
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
              {errorMessages.mailing_address_type && (
                <Text style={styles.required}>
                  {t(errorMessages.mailing_address_type)}
                </Text>
              )}
            </View>
          )}

          {renderMailingAddressFields()}
        </>
      )}

      <PhoneSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        onChange={onChange}
        onChangeError={onChangeError}
      />

      {isVisible(formCongif, "opt_in_sms") && (
        <View style={styles.inputBlock}>
          <Checkbox
            label={t("general.opt_ins.sms_opt_in")}
            value={value.opt_in_sms}
            required={isRequired(formCongif, "opt_in_sms")}
            onValueChange={(checked: boolean) =>
              updateField("opt_in_sms", checked)
            }
          />
        </View>
      )}

      <RenderHTML
        contentWidth={width}
        source={{
          html: t("general.opt_ins.sms_disclaimer", {
            rtv_terms_url: config?.urls?.terms,
            rtv_privacy_url: config?.urls?.privacy,
          }),
        }}
        tagsStyles={{
          body: {
            fontSize: 14,
            color: theme.gray,
            lineHeight: 18,
            marginVertical: 5,
          },
          a: {
            color: theme.link,
            textDecorationLine: "underline",
          },
        }}
        renderersProps={{
          a: {
            onPress: (_, href) => {
              if (href) {
                Linking.openURL(href);
              }
            },
          },
        }}
      />

      {isVisible(formCongif, "email") && (
        <InputField
          label={t("form_fields.email")}
          value={value.email_address}
          required={isRequired(formCongif, "email")}
          errorMessage={t(errorMessages.email_address)}
          onChangeText={(text: string) => updateField("email_address", text)}
        />
      )}

      {isVisible(formCongif, "opt_in_email") && (
        <View style={styles.inputBlock}>
          <Checkbox
            label={t("general.opt_ins.email_opt_in")}
            value={value.opt_in_email}
            required={isRequired(formCongif, "opt_in_email")}
            onValueChange={(checked: boolean) =>
              updateField("opt_in_email", checked)
            }
          />
        </View>
      )}

      {isVisible(formCongif, "opt_in_volunteer") && (
        <Checkbox
          label={t("general.opt_ins.volunteer")}
          value={value.volunteer}
          required={isRequired(formCongif, "opt_in_volunteer")}
          onValueChange={(checked: boolean) =>
            updateField("volunteer", checked)
          }
        />
      )}
      {handleMainButton}
    </>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      marginTop: 24,
      marginBottom: 8,
      textTransform: "uppercase",
    },
    required: {
      color: theme.secondary,
    },

    inputBlock: {
      marginTop: 10,
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
