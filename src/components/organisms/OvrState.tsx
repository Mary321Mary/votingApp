import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { isRequired, isVisible } from "@/utils/constants";
import { FormProps, RegisterFormState } from "@/utils/types";

import { NameSection } from "../modules/NameSection";
import { AddressSection } from "../modules/AddressSection";
import { IDSection } from "../modules/IDSection";
import { ContactSection } from "../modules/ContactSection";
import { RaceAndParty } from "../modules/RaceAndParty";
import { DateRow } from "../atoms/DateOfBirth/DateRow";
import { PhoneSection } from "../modules/PhoneSection";
import { ThemeContext } from "@/styles/ThemeProvider";

export const OvrState = ({
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
        showChangeName={!value.age_eligibility || !value.has_no_state_license}
        onChange={onChange}
        onChangeError={onChangeError}
      />
      {/* ADDRESS */}
      <AddressSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        showChangeOfAddress={
          !value.age_eligibility || !value.has_no_state_license
        }
        onChange={onChange}
        onChangeError={onChangeError}
      />
      {/* ID */}
      <RaceAndParty
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
      <PhoneSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        onChange={onChange}
        onChangeError={onChangeError}
      />
      <IDSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        showRadioButtons
        onChange={onChange}
        onChangeError={onChangeError}
      />
      <View style={styles.divider} />
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
    divider: {
      height: 2,
      backgroundColor: theme.borderColor,
      marginVertical: 5,
    },
  });
