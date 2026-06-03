import React, { useContext } from "react";
import { FormProps, RegisterFormState } from "@/utils/types";
import { NameSection } from "../modules/NameSection";
import { AddressSection } from "../modules/AddressSection";
import { IDSection } from "../modules/IDSection";
import { ContactSection } from "../modules/ContactSection";
import { RaceAndParty } from "../modules/RaceAndParty";
import { isRequired, isVisible } from "@/utils/constants";
import { DateRow } from "../atoms/DateRow";
import { Checkbox } from "../atoms/Checkbox";
import { useTranslation } from "react-i18next";
import { PhoneSection } from "../modules/PhoneSection";
import { StyleSheet, Text } from "react-native";
import { ThemeContext } from "@/styles/ThemeProvider";

export const PaperOVR = ({
  state,
  value,
  formCongif,
  errorMessages,
  onChangeError,
  onChange,
  handleMainButton,
}: FormProps) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

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
      <NameSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        showChangeName
        onChange={onChange}
        onChangeError={onChangeError}
      />

      <AddressSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        showChangeOfAddress
        onChange={onChange}
        onChangeError={onChangeError}
      />

      <IDSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        onChange={onChange}
        onChangeError={onChangeError}
      />
      <RaceAndParty
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
      <PhoneSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        onChange={onChange}
        onChangeError={onChangeError}
      />
      <ContactSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        showQuestions
        onChange={onChange}
        onChangeError={onChangeError}
      />
      {(!value.age_eligibility || !value.has_no_state_license) && (
        <Checkbox
          label={t("nvra_form_page.mail_form")}
          value={value.mailForm}
          onValueChange={(checked: boolean) => updateField("mailForm", checked)}
        />
      )}
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
