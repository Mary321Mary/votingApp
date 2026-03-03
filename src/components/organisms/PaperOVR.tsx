import React from "react";
import { FormProps } from "@/utils/types";
import { NameSection } from "../modules/NameSection";
import { AddressSection } from "../modules/AddressSection";
import { IDSection } from "../modules/IDSection";
import { ContactSection } from "../modules/ContactSection";

export const PaperOVR = ({
  state,
  value,
  formCongif,
  errorMessages,
  showChangeName,
  showDifferentMailAddress,
  showChangedAddress,
  showIsAdultBlock,
  onChangeError,
  onChange,
  handleCheckbox,
}: FormProps) => {
  return (
    <>
      <NameSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        showChangeName={showChangeName}
        showIsAdultBlock={showIsAdultBlock}
        onChange={onChange}
        onChangeError={onChangeError}
        handleCheckbox={handleCheckbox}
      />

      <AddressSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        showChangedAddress={showChangedAddress}
        showDifferentMailAddress={showDifferentMailAddress}
        showIsAdultBlock={showIsAdultBlock}
        onChange={onChange}
        onChangeError={onChangeError}
      />

      <IDSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        showIsAdultBlock={showIsAdultBlock}
        onChange={onChange}
        onChangeError={onChangeError}
      />

      <ContactSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        showIsAdultBlock={showIsAdultBlock}
        onChange={onChange}
        onChangeError={onChangeError}
      />
    </>
  );
};
