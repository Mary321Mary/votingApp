import React from 'react';
import { FormProps } from '@/utils/types';
import { NameSection } from '../modules/NameSection';
import { AddressSection } from '../modules/AddressSection';
import { IDSection } from '../modules/IDSection';
import { ContactSection } from '../modules/ContactSection';

export const PaperOVR = ({ state, value, onChange }: FormProps) => {
  const [showChangeName, setShowChangeName] = React.useState(false);

  return (
    <>
      <NameSection
        value={value}
        onChange={onChange}
        showChangeName={showChangeName}
        onChangeNameToggle={setShowChangeName}
      />

      <AddressSection
        value={value}
        onChange={onChange}
        state={state}
      />

      <IDSection
        value={value}
        onChange={onChange}
        state={state}
        showParty
      />

      <ContactSection
        value={value}
        onChange={onChange}
      />
    </>
  );
};
