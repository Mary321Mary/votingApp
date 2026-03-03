import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import {
  DataCollectionConfiguration,
  OVR_TYPE_MAP,
  RegisterFormState,
  RegisterFormStateError,
  StateData,
} from "@/utils/types";
import { PaperOVR } from "./PaperOVR";
import { OvrState } from "./OvrState";
import { ConnectedOVR } from "./ConnectedOVR";
import { ThemeContext } from "@/styles/ThemeProvider";
import { RootStackParamList } from "./Navigation";
import ConnectedOVRStep2 from "./ConnectedOVRStep2";
import ConnectedOVRStep3 from "./ConnectedOVRStep3";
import { NotParticipating } from "./NotParticipating";
import { useNavigation } from "@react-navigation/native";
import i18n from "@/i18n";
import { fetchDataConfiguration } from "@/utils/api";
import { isRequired } from "@/utils/constants";

function getFlowType(ovrType: string) {
  return OVR_TYPE_MAP[ovrType] ?? "paper";
}

type RegisterScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

interface RegisterResultProps {
  state: StateData;
  zip: string;
  email: string;
}

const EMPTY_ERROR_MESSAGES = {
  title: "",
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  changedTitle: "",
  changedFirstName: "",
  changedMiddleName: "",
  changedLastName: "",
  changedSuffix: "",
  isCitizen: "",
  isAdult: "",
  email: "",

  address: "",
  unit: "",
  city: "",
  state: "",
  zip: "",
  differentAddress: "",
  differentUnit: "",
  differentCity: "",
  differentState: "",
  differentZip: "",
  changedAddress: "",
  changedUnit: "",
  changedCity: "",
  changedState: "",
  changedZip: "",
  hasStateId: "",

  idNumber: "",
  has_state_license: "",
  has_ssn: "",

  race: "",
  party: "",

  birthMonth: "",
  birthDay: "",
  birthYear: "",
  phone: "",
  phoneType: "",

  smsConsent: "",
  emailConsent: "",
  volunteer: "",
  mailForm: "",

  residency: "",
  cancelPrevious: "",
  digitalSignature: "",
  licenseUpdated: "",
  duplicateLicense: "",

  fullName: "",
  licenseNumber: "",
  eyeColor: "",
  ssnLast4: "",

  streetName: "",
  streetNumber: "",
  streetType: "",
  streetDirection: "",
  mailingStreetName: "",
  mailingStreetNumber: "",
  mailingStreetType: "",
  mailingStreetAddress: "",
  mailingUnit: "",
  mailingCity: "",
  mailingState: "",
  mailingZip: "",
  mailingAddressType: "",
  isAdultBlock: "",

  poBoxNumber: "",
  boxGroupType: "",
  boxGroupNumber: "",
  boxNumber: "",
  apoFpoDpo: "",
  aaAeAp: "",
  addressLine1: "",
  addressLine2: "",
  addressLine3: "",
  mailingCountry: "",
};

export const RegisterResult = ({ state, zip, email }: RegisterResultProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<RegisterScreenNavigation>();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const flowType = getFlowType(state?.ovr_type || "");
  const [formCongif, setFormCongif] = useState<DataCollectionConfiguration>({
    fields: {},
    validations: {
      po_box_allowed: false,
      min_age: 18,
    },
  });
  const [errMsg, setErrMsg] =
    useState<RegisterFormStateError>(EMPTY_ERROR_MESSAGES);

  const [form, setForm] = useState<RegisterFormState>({
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    changedTitle: "",
    changedFirstName: "",
    changedMiddleName: "",
    changedLastName: "",
    changedSuffix: "",
    isCitizen: false,
    isAdult: false,
    email,

    address: "",
    unit: "",
    city: "",
    state: state.abbreviation,
    zip,
    differentAddress: "",
    differentUnit: "",
    differentCity: "",
    differentState: state.abbreviation,
    differentZip: "",
    changedAddress: "",
    changedUnit: "",
    changedCity: "",
    changedState: "",
    changedZip: "",
    hasStateId: true,

    idNumber: "",
    has_state_license: false,
    has_ssn: false,

    race: "",
    party: "",

    birthMonth: "",
    birthDay: "",
    birthYear: "",
    phone: "",
    phoneType: "Mobile",

    smsConsent: false,
    emailConsent: true,
    volunteer: false,
    mailForm: false,

    residency: false,
    cancelPrevious: false,
    digitalSignature: false,
    licenseUpdated: null,
    duplicateLicense: null,

    fullName: "",
    licenseNumber: "",
    eyeColor: "",
    ssnLast4: "",

    streetName: "",
    streetNumber: "",
    streetType: "",
    streetDirection: "",
    mailingStreetName: "",
    mailingStreetNumber: "",
    mailingStreetType: "",
    mailingStreetAddress: "",
    mailingUnit: "",
    mailingCity: "",
    mailingState: "",
    mailingZip: "",
    mailingAddressType: "STANDARD",
    poBoxNumber: "",
    boxGroupType: "",
    boxGroupNumber: "",
    boxNumber: "",
    apoFpoDpo: "",
    aaAeAp: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    mailingCountry: "",
  });

  const [showChangeName, setShowChangeName] = useState(false);
  const [showDifferentMailAddress, setShowDifferentMailAddress] =
    useState(false);
  const [showChangedAddress, setShowChangedAddress] = useState(false);
  const [showIsAdultBlock, setShowIsAdultBlock] = useState(false);
  const [showMailingAddress, setShowMailingAddress] = useState(true);

  const handleCheckbox = (newVal: boolean, name: string) => {
    if (name === "showChangeName") {
      setShowChangeName(newVal);
    } else if (name === "showDifferentMailAddress") {
      setShowDifferentMailAddress(newVal);
    } else if (name === "showChangedAddress") {
      setShowChangedAddress(newVal);
    } else if (name === "showIsAdultBlock") {
      setShowIsAdultBlock(newVal);
    } else if (name === "showMailingAddress") {
      setShowMailingAddress(newVal);
    }
  };

  const renderContent = () => {
    if (flowType === "connected_ovr") {
      if (step === 1)
        return (
          <ConnectedOVR
            state={state}
            value={form}
            formCongif={formCongif}
            errorMessages={errMsg}
            onChange={setForm}
            onChangeError={setErrMsg}
          />
        );
      if (step === 2)
        return (
          <ConnectedOVRStep2
            state={state}
            value={form}
            formCongif={formCongif}
            errorMessages={errMsg}
            onChange={setForm}
            onChangeError={setErrMsg}
          />
        );
      if (step === 3)
        return (
          <ConnectedOVRStep3
            state={state}
            value={form}
            formCongif={formCongif}
            showMailingAddress={showMailingAddress}
            errorMessages={errMsg}
            onChange={setForm}
            onChangeError={setErrMsg}
            handleCheckbox={handleCheckbox}
          />
        );
    }

    switch (flowType) {
      case "not_participating":
        return (
          <NotParticipating
            state={state}
            value={form}
            formCongif={formCongif}
            errorMessages={errMsg}
            onChange={setForm}
            onChangeError={setErrMsg}
          />
        );
      case "ovr_state":
        return (
          <OvrState
            state={state}
            value={form}
            formCongif={formCongif}
            showChangeName={showChangeName}
            showDifferentMailAddress={showDifferentMailAddress}
            showChangedAddress={showChangedAddress}
            showIsAdultBlock={showIsAdultBlock}
            errorMessages={errMsg}
            onChange={setForm}
            onChangeError={setErrMsg}
            handleCheckbox={handleCheckbox}
          />
        );
      case "paper":
      default:
        return (
          <PaperOVR
            state={state}
            value={form}
            formCongif={formCongif}
            showChangeName={showChangeName}
            showDifferentMailAddress={showDifferentMailAddress}
            showChangedAddress={showChangedAddress}
            showIsAdultBlock={showIsAdultBlock}
            errorMessages={errMsg}
            onChange={setForm}
            onChangeError={setErrMsg}
            handleCheckbox={handleCheckbox}
          />
        );
    }
  };

  const validatePaper = () => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    const fullPhoneRegex = /^\d{3}-\d{3}-\d{4}$/;

    let errorMessage = { ...EMPTY_ERROR_MESSAGES };
    if (!form.title.trim() && isRequired(formCongif, "name_title")) {
      errorMessage.title = t("register_page.required");
    }
    if (!form.firstName.trim() && isRequired(formCongif, "first_name")) {
      errorMessage.firstName = t("register_page.required");
    }
    if (!form.middleName.trim() && isRequired(formCongif, "middle_name")) {
      errorMessage.middleName = t("register_page.required");
    }
    if (!form.lastName.trim() && isRequired(formCongif, "last_name")) {
      errorMessage.lastName = t("register_page.required");
    }
    if (!form.suffix.trim() && isRequired(formCongif, "name_suffix")) {
      errorMessage.suffix = t("register_page.required");
    }
    if (showChangeName || isRequired(formCongif, "change_of_name")) {
      if (
        !form.changedTitle.trim() &&
        isRequired(formCongif, "prev_name_title")
      ) {
        errorMessage.changedTitle = t("register_page.required");
      }
      if (
        !form.changedFirstName.trim() &&
        isRequired(formCongif, "prev_first_name")
      ) {
        errorMessage.changedFirstName = t("register_page.required");
      }
      if (
        !form.changedMiddleName.trim() &&
        isRequired(formCongif, "prev_middle_name")
      ) {
        errorMessage.changedMiddleName = t("register_page.required");
      }
      if (
        !form.changedLastName.trim() &&
        isRequired(formCongif, "prev_last_name")
      ) {
        errorMessage.changedLastName = t("register_page.required");
      }
      if (
        !form.changedSuffix.trim() &&
        isRequired(formCongif, "prev_name_suffix")
      ) {
        errorMessage.changedSuffix = t("register_page.required");
      }
    }
    if (!form.isCitizen && isRequired(formCongif, "us_citizen")) {
      errorMessage.isCitizen = t("register_page.us_citizen");
    }
    if (!form.address.trim() && isRequired(formCongif, "home_address")) {
      errorMessage.address = t("register_page.required");
    }
    if (!form.unit.trim() && isRequired(formCongif, "home_unit")) {
      errorMessage.unit = t("register_page.required");
    }
    if (!form.city.trim() && isRequired(formCongif, "home_city")) {
      errorMessage.city = t("register_page.required");
    }
    if (!form.state.trim() && isRequired(formCongif, "home_state")) {
      errorMessage.state = t("register_page.required");
    }
    if (!form.zip.trim() && isRequired(formCongif, "home_zip_code")) {
      errorMessage.zip = t("register_page.required");
    } else if (!zipRegex.test(form.zip.trim())) {
      errorMessage.zip = t("register_page.invalid_zip");
    }
    if (
      showDifferentMailAddress ||
      isRequired(formCongif, "has_mailing_address")
    ) {
      if (
        !form.differentAddress.trim() &&
        isRequired(formCongif, "mailing_address")
      ) {
        errorMessage.differentAddress = t("register_page.required");
      }
      if (
        !form.differentUnit.trim() &&
        isRequired(formCongif, "mailing_unit")
      ) {
        errorMessage.differentUnit = t("register_page.required");
      }
      if (
        !form.differentCity.trim() &&
        isRequired(formCongif, "mailing_city")
      ) {
        errorMessage.differentCity = t("register_page.required");
      }
      if (
        !form.differentState.trim() &&
        isRequired(formCongif, "mailing_state")
      ) {
        errorMessage.differentState = t("register_page.required");
      }
      if (
        !form.differentZip.trim() &&
        isRequired(formCongif, "mailing_zip_code")
      ) {
        errorMessage.differentZip = t("register_page.required");
      } else if (!zipRegex.test(form.differentZip.trim())) {
        errorMessage.differentZip = t("register_page.invalid_zip");
      }
    }
    if (showChangedAddress || isRequired(formCongif, "change_of_address")) {
      if (
        !form.changedAddress.trim() &&
        isRequired(formCongif, "prev_address")
      ) {
        errorMessage.changedAddress = t("register_page.required");
      }
      if (!form.changedUnit.trim() && isRequired(formCongif, "prev_unit")) {
        errorMessage.changedUnit = t("register_page.required");
      }
      if (!form.changedCity.trim() && isRequired(formCongif, "prev_city")) {
        errorMessage.changedCity = t("register_page.required");
      }
      if (!form.changedState.trim() && isRequired(formCongif, "prev_state")) {
        errorMessage.changedState = t("register_page.required");
      }
      if (!form.changedZip.trim() && isRequired(formCongif, "prev_zip_code")) {
        errorMessage.changedZip = t("register_page.required");
      } else if (!zipRegex.test(form.changedZip.trim())) {
        errorMessage.changedZip = t("register_page.invalid_zip");
      }
    }
    if (!form.has_state_license)
      if (!form.idNumber.trim() && isRequired(formCongif, "state_id_number")) {
        errorMessage.idNumber = t("register_page.required");
      }
    if (form.has_state_license && !form.has_ssn)
      if (
        !form.ssnLast4.trim() &&
        isRequired(formCongif, "last_four_ss_number")
      ) {
        errorMessage.ssnLast4 = t("register_page.required");
      }
    if (!form.race.trim() && isRequired(formCongif, "race")) {
      errorMessage.race = t("register_page.required");
    }
    if (!form.party.trim() && isRequired(formCongif, "party")) {
      errorMessage.party = t("register_page.required");
    }
    if (!form.birthMonth.trim() && isRequired(formCongif, "date_of_birth")) {
      errorMessage.birthMonth = t("register_page.required");
    }
    if (!form.birthDay.trim() && isRequired(formCongif, "date_of_birth")) {
      errorMessage.birthDay = t("register_page.required");
    }
    if (!form.birthYear.trim() && isRequired(formCongif, "date_of_birth")) {
      errorMessage.birthYear = t("register_page.required");
    } else if (Number(form.birthYear) < 1900) {
      errorMessage.birthYear = t("register_page.invalid_year");
    }
    if (
      form.birthYear.trim() &&
      form.birthMonth.trim() &&
      form.birthDay.trim() &&
      isRequired(formCongif, "date_of_birth")
    ) {
      const year = Number(form.birthYear);
      const month = Number(form.birthMonth) - 1;
      const day = Number(form.birthDay);

      const date = new Date(year, month, day);

      const isInvalidDate =
        date.getFullYear() !== year ||
        date.getMonth() !== month ||
        date.getDate() !== day;

      if (isInvalidDate) {
        errorMessage.birthDay = t("register_page.invalid_birth_date");
      } else {
        const today = new Date();
        let age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        const dayDiff = today.getDate() - date.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age--;
        }

        if (age < formCongif.validations.min_age) {
          errorMessage.birthDay = t("register_page.under_18_error");
        }
      }
    }
    if (
      form.smsConsent &&
      !form.phone.trim() &&
      isRequired(formCongif, "phone_number")
    ) {
      errorMessage.phone = t("register_page.required_phone");
    } else if (form.smsConsent && !fullPhoneRegex.test(form.phone.trim())) {
      errorMessage.phone = t("register_page.invalid_phone");
    }
    if (form.emailConsent && isRequired(formCongif, "opt_in_email")) {
      errorMessage.emailConsent = t("register_page.required");
    }
    if (form.volunteer && isRequired(formCongif, "opt_in_volunteer")) {
      errorMessage.volunteer = t("register_page.required");
    }

    console.log("!!! errorMessage", errorMessage);
    setErrMsg(errorMessage);

    return !Object.values(errorMessage).some(value => value.trim() !== "");
  };
  const validateOvrState = () => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    const fullPhoneRegex = /^\d{3}-\d{3}-\d{4}$/;

    let errorMessage = { ...EMPTY_ERROR_MESSAGES };

    if (!form.title.trim() && isRequired(formCongif, "name_title")) {
      errorMessage.title = t("register_page.required");
    }
    if (!form.firstName.trim() && isRequired(formCongif, "first_name")) {
      errorMessage.firstName = t("register_page.required");
    }
    if (!form.middleName.trim() && isRequired(formCongif, "middle_name")) {
      errorMessage.middleName = t("register_page.required");
    }
    if (!form.lastName.trim() && isRequired(formCongif, "last_name")) {
      errorMessage.lastName = t("register_page.required");
    }
    if (!form.suffix.trim() && isRequired(formCongif, "name_suffix")) {
      errorMessage.suffix = t("register_page.required");
    }
    if (showChangeName || isRequired(formCongif, "change_of_name")) {
      if (
        !form.changedTitle.trim() &&
        isRequired(formCongif, "prev_name_title")
      ) {
        errorMessage.changedTitle = t("register_page.required");
      }
      if (
        !form.changedFirstName.trim() &&
        isRequired(formCongif, "prev_first_name")
      ) {
        errorMessage.changedFirstName = t("register_page.required");
      }
      if (
        !form.changedMiddleName.trim() &&
        isRequired(formCongif, "prev_middle_name")
      ) {
        errorMessage.changedMiddleName = t("register_page.required");
      }
      if (
        !form.changedLastName.trim() &&
        isRequired(formCongif, "prev_last_name")
      ) {
        errorMessage.changedLastName = t("register_page.required");
      }
      if (
        !form.changedSuffix.trim() &&
        isRequired(formCongif, "prev_name_suffix")
      ) {
        errorMessage.changedSuffix = t("register_page.required");
      }
    }
    if (!form.isCitizen && isRequired(formCongif, "us_citizen")) {
      errorMessage.isCitizen = t("register_page.us_citizen");
    }
    if (!form.address.trim() && isRequired(formCongif, "home_address")) {
      errorMessage.address = t("register_page.required");
    }
    if (!form.city.trim() && isRequired(formCongif, "home_city")) {
      errorMessage.city = t("register_page.required");
    }
    if (!form.unit.trim() && isRequired(formCongif, "home_unit")) {
      errorMessage.unit = t("register_page.required");
    }
    if (!form.state.trim() && isRequired(formCongif, "home_state")) {
      errorMessage.state = t("register_page.required");
    }
    if (!form.zip.trim() && isRequired(formCongif, "home_zip_code")) {
      errorMessage.zip = t("register_page.required");
    } else if (!zipRegex.test(form.zip.trim())) {
      errorMessage.zip = t("register_page.invalid_zip");
    }
    if (!form.birthMonth.trim() && isRequired(formCongif, "date_of_birth")) {
      errorMessage.birthMonth = t("register_page.required");
    }
    if (!form.birthDay.trim() && isRequired(formCongif, "date_of_birth")) {
      errorMessage.birthDay = t("register_page.required");
    }
    if (!form.birthYear.trim() && isRequired(formCongif, "date_of_birth")) {
      errorMessage.birthYear = t("register_page.required");
    } else if (Number(form.birthYear) < 1900) {
      errorMessage.birthYear = t("register_page.invalid_year");
    }
    if (
      form.birthYear.trim() &&
      form.birthMonth.trim() &&
      form.birthDay.trim() &&
      isRequired(formCongif, "date_of_birth")
    ) {
      const year = Number(form.birthYear);
      const month = Number(form.birthMonth) - 1;
      const day = Number(form.birthDay);

      const date = new Date(year, month, day);

      const isInvalidDate =
        date.getFullYear() !== year ||
        date.getMonth() !== month ||
        date.getDate() !== day;

      if (isInvalidDate) {
        errorMessage.birthDay = t("register_page.invalid_birth_date");
      }
    }
    if (
      form.smsConsent &&
      !form.phone.trim() &&
      isRequired(formCongif, "phone_number")
    ) {
      errorMessage.phone = t("register_page.required_phone");
    } else if (form.smsConsent && !fullPhoneRegex.test(form.phone.trim())) {
      errorMessage.phone = t("register_page.invalid_phone");
    }
    if (!showIsAdultBlock) {
      errorMessage.isAdultBlock = t("register_page.age_eligibility_error");
    }
    if (!form.hasStateId) {
      if (showChangeName || isRequired(formCongif, "change_of_name")) {
        if (
          !form.changedTitle.trim() &&
          isRequired(formCongif, "prev_name_title")
        ) {
          errorMessage.changedTitle = t("register_page.required");
        }
        if (
          !form.changedFirstName.trim() &&
          isRequired(formCongif, "prev_first_name")
        ) {
          errorMessage.changedFirstName = t("register_page.required");
        }
        if (
          !form.changedMiddleName.trim() &&
          isRequired(formCongif, "prev_middle_name")
        ) {
          errorMessage.changedMiddleName = t("register_page.required");
        }
        if (
          !form.changedLastName.trim() &&
          isRequired(formCongif, "prev_last_name")
        ) {
          errorMessage.changedLastName = t("register_page.required");
        }
        if (
          !form.changedSuffix.trim() &&
          isRequired(formCongif, "prev_name_suffix")
        ) {
          errorMessage.changedSuffix = t("register_page.required");
        }
      }
      if (
        showDifferentMailAddress ||
        isRequired(formCongif, "has_mailing_address")
      ) {
        if (
          !form.differentAddress.trim() &&
          isRequired(formCongif, "mailing_address")
        ) {
          errorMessage.differentAddress = t("register_page.required");
        }
        if (
          !form.differentUnit.trim() &&
          isRequired(formCongif, "mailing_unit")
        ) {
          errorMessage.differentUnit = t("register_page.required");
        }
        if (
          !form.differentCity.trim() &&
          isRequired(formCongif, "mailing_city")
        ) {
          errorMessage.differentCity = t("register_page.required");
        }
        if (
          !form.differentState.trim() &&
          isRequired(formCongif, "mailing_state")
        ) {
          errorMessage.differentState = t("register_page.required");
        }
        if (
          !form.differentZip.trim() &&
          isRequired(formCongif, "mailing_zip_code")
        ) {
          errorMessage.differentZip = t("register_page.required");
        } else if (!zipRegex.test(form.differentZip.trim())) {
          errorMessage.differentZip = t("register_page.invalid_zip");
        }
      }
      if (showChangedAddress || isRequired(formCongif, "change_of_address")) {
        if (
          !form.changedAddress.trim() &&
          isRequired(formCongif, "prev_address")
        ) {
          errorMessage.changedAddress = t("register_page.required");
        }
        if (!form.changedUnit.trim() && isRequired(formCongif, "prev_unit")) {
          errorMessage.changedUnit = t("register_page.required");
        }
        if (!form.changedCity.trim() && isRequired(formCongif, "prev_city")) {
          errorMessage.changedCity = t("register_page.required");
        }
        if (!form.changedState.trim() && isRequired(formCongif, "prev_state")) {
          errorMessage.changedState = t("register_page.required");
        }
        if (
          !form.changedZip.trim() &&
          isRequired(formCongif, "prev_zip_code")
        ) {
          errorMessage.changedZip = t("register_page.required");
        } else if (!zipRegex.test(form.changedZip.trim())) {
          errorMessage.changedZip = t("register_page.invalid_zip");
        }
      }
      if (!form.idNumber.trim() && isRequired(formCongif, "state_id_number")) {
        errorMessage.idNumber = t("register_page.required");
      }
    }
    if (!showIsAdultBlock || !form.hasStateId) {
      if (!form.race.trim() && isRequired(formCongif, "race")) {
        errorMessage.race = t("register_page.required");
      }
      if (!form.party.trim() && isRequired(formCongif, "party")) {
        errorMessage.party = t("register_page.required");
      }
    }
    if (
      form.smsConsent &&
      !form.phone.trim() &&
      isRequired(formCongif, "phone_number")
    ) {
      errorMessage.phone = t("register_page.phone_election_error");
    }
    if (form.emailConsent && isRequired(formCongif, "opt_in_email")) {
      errorMessage.emailConsent = t("register_page.required");
    }
    if (form.volunteer && isRequired(formCongif, "opt_in_volunteer")) {
      errorMessage.volunteer = t("register_page.required");
    }

    setErrMsg(errorMessage);

    return !Object.values(errorMessage).some(value => value.trim() !== "");
  };
  const validateConnectedOvr = () => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    const miIdRegex = /^[A-Z]\d{12}$/i;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let errorMessage = { ...EMPTY_ERROR_MESSAGES };
    if (step === 1) {
      if (!form.isCitizen && isRequired(formCongif, "us_citizen")) {
        errorMessage.isCitizen = t("register_page.us_citizen_2");
      }
      if (!form.isAdult && isRequired(formCongif, "will_be_18_by_election")) {
        errorMessage.isAdult = t("register_page.age_eligibility_error_2", {
          state: state.name,
        });
      }
      if (!form.residency && isRequired(formCongif, "residency_duration_ack")) {
        errorMessage.residency = "show";
      }
      if (
        !form.cancelPrevious &&
        isRequired(formCongif, "cancel_previous_registration_ack")
      ) {
        errorMessage.cancelPrevious = "show";
      }
      if (
        !form.digitalSignature &&
        isRequired(formCongif, "use_stored_signature_ack")
      ) {
        errorMessage.digitalSignature = "show";
      }
      if (
        form.licenseUpdated !== "no" &&
        isRequired(formCongif, "updated_dln_recently")
      ) {
        errorMessage.licenseUpdated = "show";
      }
      if (
        form.duplicateLicense !== "no" &&
        isRequired(formCongif, "request_duplicate_dln_today")
      ) {
        errorMessage.duplicateLicense = "show";
      }
    } else if (step === 2) {
      if (!form.fullName.trim() && isRequired(formCongif, "full_name")) {
        errorMessage.fullName = t("register_page.required");
      }
      if (!form.eyeColor.trim() && isRequired(formCongif, "eye_color")) {
        errorMessage.eyeColor = t("register_page.required");
      }
      if (
        !form.licenseNumber.trim() &&
        isRequired(formCongif, "state_id_number")
      ) {
        errorMessage.licenseNumber = t("register_page.id_number_error_2");
      } else if (!miIdRegex.test(form.licenseNumber.trim())) {
        errorMessage.licenseNumber = t("register_page.id_number_error_1");
      }
      if (!form.birthMonth.trim() && isRequired(formCongif, "date_of_birth")) {
        errorMessage.birthMonth = t("register_page.required");
      }
      if (!form.birthDay.trim() && isRequired(formCongif, "date_of_birth")) {
        errorMessage.birthDay = t("register_page.required");
      }
      if (!form.birthYear.trim() && isRequired(formCongif, "date_of_birth")) {
        errorMessage.birthYear = t("register_page.required");
      } else if (Number(form.birthYear) < 1900) {
        errorMessage.birthYear = t("register_page.invalid_year");
      }
      if (
        form.birthYear.trim() &&
        form.birthMonth.trim() &&
        form.birthDay.trim() &&
        isRequired(formCongif, "date_of_birth")
      ) {
        const year = Number(form.birthYear);
        const month = Number(form.birthMonth) - 1;
        const day = Number(form.birthDay);

        const date = new Date(year, month, day);

        const isInvalidDate =
          date.getFullYear() !== year ||
          date.getMonth() !== month ||
          date.getDate() !== day;

        if (isInvalidDate) {
          errorMessage.birthDay = t("register_page.invalid_birth_date");
        }
      }
      if (!form.ssnLast4.trim() || form.ssnLast4.trim().length !== 4) {
        errorMessage.ssnLast4 = t("register_page.ssn_error");
      }
    } else if (step === 3) {
      if (
        !form.streetNumber.trim() &&
        isRequired(formCongif, "street_number")
      ) {
        errorMessage.streetNumber = t("register_page.required");
      }
      if (!form.streetName.trim() && isRequired(formCongif, "street_name")) {
        errorMessage.streetName = t("register_page.required");
      }
      if (!form.streetType.trim() && isRequired(formCongif, "street_type")) {
        errorMessage.streetType = t("register_page.required");
      }
      if (
        !form.streetDirection.trim() &&
        isRequired(formCongif, "street_direction")
      ) {
        errorMessage.streetDirection = t("register_page.required");
      }
      if (!form.unit.trim() && isRequired(formCongif, "street_apt_unit")) {
        errorMessage.unit = t("register_page.required");
      }
      if (!form.city.trim() && isRequired(formCongif, "city")) {
        errorMessage.city = t("register_page.required");
      }
      if (!form.state.trim() && isRequired(formCongif, "state")) {
        errorMessage.state = t("register_page.required");
      }
      if (!form.zip.trim() && isRequired(formCongif, "zip_code")) {
        errorMessage.zip = t("register_page.required");
      } else if (!zipRegex.test(form.zip.trim())) {
        errorMessage.zip = t("register_page.invalid_zip");
      }
      if (
        !form.mailingAddressType.trim() &&
        isRequired(formCongif, "mailing_address_type")
      ) {
        errorMessage.mailingAddressType = t("register_page.required");
      }
      if (!showMailingAddress) {
        if (form.mailingAddressType === "STANDARD") {
          // if (!form.mailingStreetNumber.trim()) {
          //   errorMessage.mailingStreetNumber = t("register_page.required");
          // }
          // if (!form.mailingStreetName.trim()) {
          //   errorMessage.mailingStreetName = t("register_page.required");
          // }
          if (
            !form.mailingStreetAddress.trim() &&
            isRequired(formCongif, "mailing_address")
          ) {
            errorMessage.mailingStreetAddress = t("register_page.required");
          }
          if (
            !form.mailingCity.trim() &&
            isRequired(formCongif, "mailing_city")
          ) {
            errorMessage.mailingCity = t("register_page.required");
          }
          if (
            !form.mailingState.trim() &&
            isRequired(formCongif, "mailing_state")
          ) {
            errorMessage.mailingState = t("register_page.required");
          }
          if (
            !form.mailingZip.trim() &&
            isRequired(formCongif, "mailing_zip_code")
          ) {
            errorMessage.mailingZip = t("register_page.required");
          } else if (!zipRegex.test(form.mailingZip.trim())) {
            errorMessage.mailingZip = t("register_page.invalid_zip");
          }
        } else if (form.mailingAddressType === "PO_BOX") {
          // if (!form.poBoxNumber.trim()) {
          //   errorMessage.poBoxNumber = t("register_page.required");
          // }
          if (
            !form.mailingCity.trim() &&
            isRequired(formCongif, "mailing_city")
          ) {
            errorMessage.mailingCity = t("register_page.required");
          }
          if (
            !form.mailingState.trim() &&
            isRequired(formCongif, "mailing_state")
          ) {
            errorMessage.mailingState = t("register_page.required");
          }
          if (
            !form.mailingZip.trim() &&
            isRequired(formCongif, "mailing_zip_code")
          ) {
            errorMessage.mailingZip = t("register_page.required");
          } else if (!zipRegex.test(form.mailingZip.trim())) {
            errorMessage.mailingZip = t("register_page.invalid_zip");
          }
        } else if (form.mailingAddressType === "MILITARY") {
          // if (!form.boxGroupType.trim()) {
          //   errorMessage.boxGroupType = t("register_page.required");
          // }
          // if (!form.boxGroupNumber.trim()) {
          //   errorMessage.boxGroupNumber = t("register_page.required");
          // }
          // if (!form.boxNumber.trim()) {
          //   errorMessage.boxNumber = t("register_page.required");
          // }
          if (!form.apoFpoDpo.trim()) {
            errorMessage.apoFpoDpo = t("register_page.required");
          }
          if (!form.aaAeAp.trim()) {
            errorMessage.aaAeAp = t("register_page.required");
          }
          if (
            !form.mailingZip.trim() &&
            isRequired(formCongif, "mailing_zip_code")
          ) {
            errorMessage.mailingZip = t("register_page.required");
          } else if (!zipRegex.test(form.mailingZip.trim())) {
            errorMessage.mailingZip = t("register_page.invalid_zip");
          }
        } else if (form.mailingAddressType === "INTERNATIONAL") {
          // if (!form.addressLine1.trim()) {
          //   errorMessage.addressLine1 = t("register_page.required");
          // }
          if (!form.mailingCountry.trim()) {
            errorMessage.mailingCountry = t("register_page.required");
          }
          if (
            !form.mailingZip.trim() &&
            isRequired(formCongif, "mailing_zip_code")
          ) {
            errorMessage.mailingZip = t("register_page.required");
          } else if (!zipRegex.test(form.mailingZip.trim())) {
            errorMessage.mailingZip = t("register_page.invalid_zip");
          }
        }
      }
      if (
        form.smsConsent &&
        !form.phone.trim() &&
        isRequired(formCongif, "phone_number")
      ) {
        errorMessage.phone = t("register_page.phone_election_error");
      }
      if (form.smsConsent && isRequired(formCongif, "opt_in_sms")) {
        errorMessage.smsConsent = t("register_page.required");
      }
      if (!form.email.trim() && isRequired(formCongif, "email")) {
        errorMessage.email = t("register_page.required");
      } else if (!emailRegex.test(form.email.trim())) {
        errorMessage.email = t("register_page.email_invalid");
      }
      if (form.emailConsent && isRequired(formCongif, "opt_in_email")) {
        errorMessage.emailConsent = t("register_page.required");
      }
      if (form.volunteer && isRequired(formCongif, "opt_in_volunteer")) {
        errorMessage.volunteer = t("register_page.required");
      }
    }

    setErrMsg(errorMessage);
    return !Object.values(errorMessage).some(value => value.trim() !== "");
  };

  const handleMainButtonClick = () => {
    if (flowType === "connected_ovr") {
      if (step === 1) {
        if (validateConnectedOvr()) {
          setStep(2);
        }
      } else if (step === 2) {
        if (validateConnectedOvr()) {
          setStep(3);
        }
      } else {
        if (validateConnectedOvr()) {
          if (form.ssnLast4 === "0000") {
            // todo: redirect to the error page
            navigation.navigate("ZipError", {
              text: t("previous_step"),
              header: t("was_problem_text"),
            });
          } else {
            navigation.navigate("Success");
          }
        }
      }
    } else if (flowType === "paper") {
      if (validatePaper()) {
        navigation.navigate("Success");
      }
    } else if (flowType === "ovr_state") {
      if (validateOvrState()) {
        navigation.navigate("Success");
      }
    } else navigation.navigate("Home");
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetchDataConfiguration({
          state_abbreviation: state.abbreviation,
          locale: i18n.language,
          workflow_type: "ovr",
        });
        setFormCongif(response.data.configuration);
      } catch (err) {
        console.error("Failed to fetch Data configuration:", err);
      }
    };

    fetchConfig();
  }, [state.abbreviation]);

  return (
    <View style={styles.box}>
      {renderContent()}
      <View style={styles.buttonBox}>
        {flowType !== "not_participating" && (
          <TouchableOpacity
            style={styles.button}
            onPress={handleMainButtonClick}
          >
            <Text
              style={[styles.buttonText, styles.registerText]}
              //  style={styles.buttonText}
            >
              {t("register")}
            </Text>
          </TouchableOpacity>
        )}
        <Text style={styles.link} onPress={() => navigation.goBack()}>
          {t("back")}
        </Text>
      </View>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    box: {
      marginVertical: 20,
      padding: 15,
      backgroundColor: theme.background,
      borderRadius: 10,
    },
    buttonBox: {
      display: "flex",
      alignItems: "center",
      gap: 20,
      marginTop: 20,
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderRadius: 5,
      marginLeft: 10,
      height: 45,
      justifyContent: "center",
    },
    buttonText: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 16,
      fontWeight: "semibold",
    },
    registerText: {
      color: theme.white,
    },
    restartText: {
      color: theme.textPrimary,
    },
    link: {
      color: theme.link,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "medium",
    },
  });
