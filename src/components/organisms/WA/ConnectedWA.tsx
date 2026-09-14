import React, { useContext } from "react";
import { FormProps, RegisterFormState } from "@/utils/types";
import { NameSection } from "../../modules/NameSection";
import { AddressSection } from "../../modules/AddressSection";
import { isRequired, isVisible } from "@/utils/constants";
import { DateRow } from "../../atoms/DateOfBirth/DateRow";
import { PhoneSection } from "../../modules/PhoneSection";
import { useTranslation } from "react-i18next";
import { ContactSection } from "../../modules/ContactSection";
import InputField from "../../atoms/InputField";
import { StyleSheet, Text } from "react-native";
import { Checkbox } from "../../atoms/Checkbox";
import { ThemeContext } from "@/styles/ThemeProvider";

export const ConnectedWA = ({
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

  const onlyDigits = (text: string) => text.replace(/\D/g, "");

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

      {/* ADDRESS */}
      <AddressSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        showChangeOfAddress
        checkZipValidation
        changedAddressLabel={t("washington.prev_address_statement")}
        onChange={onChange}
        onChangeError={onChangeError}
      />
      {isVisible(formCongif, "state_id_number") && (
        <>
          <InputField
            name="state_id_number"
            label={t("washington.wdl_number")}
            value={value.state_id_number}
            required={isRequired(formCongif, "state_id_number")}
            disabled={!!value.has_no_state_license}
            maxLength={
              formCongif.fields.state_id_number?.validations?.max_length
            }
            errorMessage={t(errorMessages.state_id_number)}
            onChangeText={(text: string) => {
              const digits = onlyDigits(text);
              const lastFour = digits.slice(-4);

              // Batch all updates together to prevent overwriting
              onChange({
                ...value,
                state_id_number: text,
                has_no_state_license: false,
                last_four_ss_number: lastFour,
              });

              // Clear errors for updated fields
              const clearedErrors = { ...errorMessages };
              if (errorMessages.state_id_number?.length) {
                clearedErrors.state_id_number = "";
              }
              if (errorMessages.last_four_ss_number?.length) {
                clearedErrors.last_four_ss_number = "";
              }
              onChangeError(clearedErrors);
            }}
          />
          <Text style={styles.hint}>
            If you have one, you must provide your Washington driver's license
            number or ID number. If you do not have one, please provide the last
            four digits of your Social Security number. If you do not have a
            Social Security number, please write 'NONE' so that a unique
            identifying number can be assigned to you by the Secretary of State.
          </Text>
          <Text style={styles.help}>{t("washington.wdl_help")}</Text>
          <DateRow
            name="issue_date"
            legend={t("washington.wdl_issue_date")}
            required={value.has_no_state_license === false}
            value={{
              month: {
                name: "issueMonth",
                value: value.issueMonth,
                errorText: t(errorMessages.issueMonth),
              },
              day: {
                name: "issueDay",
                value: value.issueDay,
                errorText: t(errorMessages.issueDay),
              },
              year: {
                name: "issueYear",
                value: value.issueYear,
                errorText: t(errorMessages.issueYear),
              },
            }}
            disabled={!!value.has_no_state_license}
            updateField={updateField}
          />
          <Checkbox
            name="has_no_state_license"
            value={value.has_no_state_license === true}
            label={t("washington.wdl_none")}
            required={isRequired(formCongif, "has_no_state_license")}
            onValueChange={checked => {
              onChange({
                ...value,
                has_no_state_license: checked,
                state_id_number: "",
                issueYear: "",
                issueDay: "",
                issueMonth: "",
              });
            }}
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
    hint: {
      color: theme.gray,
    },
    help: {
      marginVertical: 10,
    },
  });
