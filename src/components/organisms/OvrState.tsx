import React from 'react';
import { FormProps } from '@/utils/types';
import { NameSection } from '../modules/NameSection';
import { AddressSection } from '../modules/AddressSection';
import { IDSection } from '../modules/IDSection';
import { ContactSection } from '../modules/ContactSection';

export const OvrState = ({ state, value, onChange }: FormProps) => {

  return (
    <>
      {/* NAME */}
      <NameSection
        value={value}
        showAgeEligibility
        onChange={onChange}
      />

      {/* ADDRESS */}
      <AddressSection
        value={value}
        state={state}
        showRadioButtons
        onChange={onChange}
      />

      {/* ID */}
      <IDSection
        value={value}
        onChange={onChange}
        state={state}
      />

      <ContactSection
        value={value}
        onChange={onChange}
      />
    </>
  );
};
