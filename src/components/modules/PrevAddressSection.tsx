import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "@/styles/ThemeProvider";
import { FormProps, RegisterFormState } from "@/utils/types";

import InputField from "../atoms/InputField";
import { Checkbox } from "../atoms/Checkbox";
import { isRequired, isVisible, STATES } from "@/utils/constants";
import { SelectField } from "../atoms/SelectField";
import { submitEmailZip } from "../../utils/api";
import i18n from "../../i18n";

interface PrevAddressSectionProps extends FormProps {
  checkZipValidation?: boolean;
  showChangeOfAddress?: boolean;
  changedAddressLabel?: string;
}

export const PrevAddressSection = ({
  value,
  formCongif,
  errorMessages,
  showChangeOfAddress = false,
  checkZipValidation = false,
  changedAddressLabel = "",
  onChange,
  onChangeError,
}: PrevAddressSectionProps) => {
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

  const handleZipValidation = async (zipValue: string) => {
    if (zipValue && zipValue.length === 5) {
      try {
        const response = await submitEmailZip({
          email: value.email_address,
          zip: zipValue,
          locale: i18n.language,
          partner_id: value.partner_id.toString(),
        });

        if (response && response.data.state?.abbreviation !== "WA") {
          onChangeError({
            ...errorMessages,
            prev_zip_code: "washington.previous_address_zip_error",
          });
        } else {
          onChangeError({ ...errorMessages, prev_zip_code: "" });
        }
      } catch (error) {
        console.error("ZIP validation failed", error);
        onChangeError({
          ...errorMessages,
          prev_zip_code: "washington.previous_address_zip_error",
        });
      }
    }
  };

  return (
    <View style={styles.section}>
      {showChangeOfAddress && isVisible(formCongif, "has_mailing_address") && (
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

      {value.has_mailing_address && (
        <>
          <View style={styles.row}>
            {isVisible(formCongif, "mailing_address") && (
              <InputField
                name="mailing_address"
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
                name="mailing_unit"
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
                name="mailing_city"
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
              <SelectField
                name="name_title"
                label={t("form_fields.state")}
                value={value.mailing_state}
                options={STATES}
                required={isRequired(
                  formCongif,
                  "mailing_state",
                  value.has_mailing_address,
                )}
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

      {showChangeOfAddress && isVisible(formCongif, "change_of_address") && (
        <Checkbox
          name="change_of_address"
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
      {value.change_of_address && (
        <View style={styles.row}>
          {isVisible(formCongif, "prev_address") && (
            <InputField
              name="prev_address"
              label={t("form_fields.address")}
              value={value.prev_address}
              required={isRequired(
                formCongif,
                "prev_address",
                value.change_of_address,
              )}
              errorMessage={t(errorMessages.prev_address)}
              onChangeText={(text: string) => updateField("prev_address", text)}
            />
          )}
          {isVisible(formCongif, "prev_unit") && (
            <InputField
              name="prev_unit"
              label={t("form_fields.unit_lot")}
              value={value.prev_unit}
              required={isRequired(
                formCongif,
                "prev_unit",
                value.change_of_address,
              )}
              errorMessage={t(errorMessages.prev_unit)}
              onChangeText={(text: string) => updateField("prev_unit", text)}
            />
          )}
          {isVisible(formCongif, "prev_city") && (
            <InputField
              name="prev_city"
              label={t("form_fields.city")}
              value={value.prev_city}
              required={isRequired(
                formCongif,
                "prev_city",
                value.change_of_address,
              )}
              errorMessage={t(errorMessages.prev_city)}
              onChangeText={(text: string) => updateField("prev_city", text)}
            />
          )}
          {isVisible(formCongif, "prev_state") && (
            <SelectField
              name="prev_state"
              label={t("form_fields.state")}
              value={value.prev_state}
              options={STATES}
              required={isRequired(
                formCongif,
                "prev_state",
                value.change_of_address,
              )}
              errorMessage={errorMessages.prev_state}
              onValueChange={itemValue => updateField("prev_state", itemValue)}
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
              onChangeText={(text: string) => {
                updateField("prev_zip_code", text);

                if (text.length === 5 && checkZipValidation) {
                  handleZipValidation(text);
                }
              }}
            />
          )}
        </View>
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
  });
