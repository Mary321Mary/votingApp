import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "@/styles/ThemeProvider";
import { FormProps, RegisterFormState } from "@/utils/types";

import InputField from "../atoms/InputField";
import { isRequired, isVisible } from "@/utils/constants";
import { PrevAddressSection } from "./PrevAddressSection";

interface AddressSectionProps extends FormProps {
  showChangeOfAddress?: boolean;
  changedAddressLabel?: string;
  isCompressed?: boolean;
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
        {isVisible(formCongif, "home_address") && (
          <InputField
            name="home_address"
            label={t("form_fields.address")}
            value={value.home_address}
            helpText={t("form_fields.home_address_help")}
            required={isRequired(formCongif, "home_address")}
            errorMessage={t(errorMessages.home_address)}
            onChangeText={(text: string) => updateField("home_address", text)}
          />
        )}
        {isVisible(formCongif, "home_unit") && (
          <InputField
            name="home_unit"
            label={t("form_fields.unit_lot")}
            value={value.home_unit}
            required={isRequired(formCongif, "home_unit")}
            errorMessage={t(errorMessages.home_unit)}
            onChangeText={(text: string) => updateField("home_unit", text)}
          />
        )}
        {isVisible(formCongif, "home_city") && (
          <InputField
            name="home_city"
            label={t("form_fields.city")}
            value={value.home_city}
            required={isRequired(formCongif, "home_city")}
            errorMessage={t(errorMessages.home_city)}
            onChangeText={(text: string) => updateField("home_city", text)}
          />
        )}
        {isVisible(formCongif, "home_state") && (
          <InputField
            name="home_state"
            label={t("form_fields.state")}
            disabled
            value={state.abbreviation}
            required={isRequired(formCongif, "home_state")}
            errorMessage={t(errorMessages.state)}
          />
        )}
        {isVisible(formCongif, "home_zip_code") && (
          <InputField
            name="home_zip_code"
            label={t("form_fields.zip")}
            disabled
            value={value.home_zip_code}
            required={isRequired(formCongif, "home_zip_code")}
            errorMessage={t(errorMessages.home_zip_code)}
          />
        )}
      </View>

      <PrevAddressSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        showChangeOfAddress={showChangeOfAddress}
        changedAddressLabel={changedAddressLabel}
        onChange={onChange}
        onChangeError={onChangeError}
      />
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
