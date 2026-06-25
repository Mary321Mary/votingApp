import React, { useContext } from "react";
import { FormProps, RegisterFormState } from "@/utils/types";
import { NameSection } from "../modules/NameSection";
import { AddressSection } from "../modules/AddressSection";
import { ContactSection } from "../modules/ContactSection";
import { isRequired, isVisible } from "@/utils/constants";
import { DateRow } from "../atoms/DateOfBirth/DateRow";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "@/styles/ThemeProvider";
import { StyleSheet, Text } from "react-native";

export const ConnectedCA = ({
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
        onChange={onChange}
        onChangeError={onChangeError}
      />

      {/* ADDRESS */}
      <AddressSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
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
    required: {
      color: theme.secondary,
    },
  });
