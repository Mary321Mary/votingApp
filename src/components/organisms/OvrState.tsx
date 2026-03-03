import React from "react";
import { FormProps } from "@/utils/types";
import { NameSection } from "../modules/NameSection";
import { AddressSection } from "../modules/AddressSection";
import { IDSection } from "../modules/IDSection";
import { ContactSection } from "../modules/ContactSection";

export const OvrState = ({
  state,
  value,
  formCongif,
  errorMessages,
  showChangeName,
  showDifferentMailAddress,
  showChangedAddress,
  showIsAdultBlock,
  handleCheckbox,
  onChangeError,
  onChange,
}: FormProps) => {
  return (
    <>
      {/* NAME */}
      <NameSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        showChangeName={showChangeName}
        showIsAdultBlock={showIsAdultBlock}
        showAgeEligibility
        onChange={onChange}
        onChangeError={onChangeError}
        handleCheckbox={handleCheckbox}
      />

      {/* ADDRESS */}
      <AddressSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        showChangedAddress={showChangedAddress}
        showDifferentMailAddress={showDifferentMailAddress}
        showIsAdultBlock={showIsAdultBlock}
        showRadioButtons
        onChange={onChange}
        onChangeError={onChangeError}
      />

      {/* ID */}
      <IDSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        showIsAdultBlock={showIsAdultBlock}
        onChange={onChange}
        onChangeError={onChangeError}
        handleCheckbox={handleCheckbox}
      />

      <ContactSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        showIsAdultBlock={showIsAdultBlock}
        onChange={onChange}
        onChangeError={onChangeError}
        handleCheckbox={handleCheckbox}
      />
    </>
  );
};
