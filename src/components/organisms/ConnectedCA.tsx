import React from "react";
import { FormProps, RegisterFormState } from "@/utils/types";
import { NameSection } from "../modules/NameSection";
import { AddressSection } from "../modules/AddressSection";
import { ContactSection } from "../modules/ContactSection";
import { isRequired, isVisible } from "@/utils/constants";
import { DateRow } from "../atoms/DateOfBirth/DateRow";
import { useTranslation } from "react-i18next";

export const ConnectedCA = ({
  state,
  value,
  formCongif,
  errorMessages,
  onChangeError,
  onChange,
  handleMainButton,
}: FormProps) => {
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
