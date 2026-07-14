import { processDateOfBirthValidation } from "@/components/atoms/DateOfBirth/dateValidation";
import { SetStateAction } from "react";
import { isRequired, isVisible } from "utils/constants";
import {
  DataCollectionConfiguration,
  RegisterFormState,
  RegisterFormStateError,
} from "utils/types";

export const EMPTY_ERROR_MESSAGES: RegisterFormStateError = {
  partner_id: "",
  lang: "",

  name_title: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  suffix: "",
  us_citizen: "",
  will_be_18_by_election: "",
  email_address: "",

  change_of_name: "",
  prev_name_title: "",
  prev_first_name: "",
  prev_middle_name: "",
  prev_last_name: "",
  prev_name_suffix: "",
  prev_unit_number: "",
  prev_unit_type: "",

  home_address: "",
  address_line_2: "",
  home_unit_type: "",
  home_unit: "",
  home_city: "",
  state: "",
  home_zip_code: "",

  mailing_unit_type: "",
  mailing_unit_number: "",
  mailing_address: "",
  mailing_unit: "",
  mailing_city: "",
  mailing_state: "",
  mailing_zip_code: "",

  change_of_address: "",
  prev_address: "",
  prev_unit: "",
  prev_city: "",
  prev_state: "",
  prev_zip_code: "",

  race: "",
  party: "",
  changed_party: "",
  home_county: "",
  signature_base64: "",
  signature_upload_method: "",
  birthMonth: "",
  birthDay: "",
  birthYear: "",
  date_of_birth: "",
  dob_routing_outcome: "",
  phone: "",

  issueMonth: "",
  issueDay: "",
  issueYear: "",
  date_of_issue: "",
  military_service: "",
  non_standard_address: "",

  opt_in_sms: "",
  opt_in_email: "",
  volunteer: "",
  mailForm: "",
  survey_question_1: "",
  survey_answer_1: "",
  survey_question_2: "",
  survey_answer_2: "",

  residency_duration_ack: "",
  cancel_previous_registration_ack: "",
  use_stored_signature_ack: "",
  updated_dln_recently: "",
  request_duplicate_dln_today: "",

  full_name: "",
  state_id_number: "",
  eye_color: "",
  last_four_ss_number: "",
  has_no_state_license: "",
  has_no_ssn: "",
  helper_electronic_signature_acknowledged: "",

  upload: "",
  someone_helped: "",
  helper_name: "",
  helper_address: "",
  helper_phone: "",

  street_name: "",
  street_number: "",
  street_type: "",
  street_direction: "",

  has_mailing_address: "",
  mailing_postal_code: "",
  mailing_address_number: "",
  mailing_address_street_name: "",
  mailing_address_street_type: "",
  mailing_address_type: "",
  age_eligibility: "",

  mailing_po_box_number: "",
  mailing_box_group_type: "",
  mailing_box_group_number: "",
  mailing_box_number: "",
  mailing_apo: "",
  mailing_ap: "",
  mailing_address_line1: "",
  mailing_address_line2: "",
  mailing_address_line3: "",
  mailing_country: "",
};

interface ValidationResult {
  errorMessage: RegisterFormStateError;
  isValid: boolean;
}

export const validate = (
  form: RegisterFormState,
  formCongif: DataCollectionConfiguration,
  flowType: string,
  showRedirect: boolean,
): ValidationResult => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  const fullPhoneRegex = /^\d{3}-\d{3}-\d{4}$/;
  const validationCfg = formCongif.fields.state_id_number?.validations;
  const configRegex = validationCfg?.regexp;
  const minLen = validationCfg?.min_length;
  const maxLen = validationCfg?.max_length;

  let finalRegex = /^.*$/;

  if (configRegex) {
    finalRegex = new RegExp(`^${configRegex}$`);
  } else if (minLen !== undefined && maxLen !== undefined) {
    finalRegex = new RegExp(`^[a-z0-9]{${minLen},${maxLen}}$`, "i");
  }

  const errorMessage = { ...EMPTY_ERROR_MESSAGES };
  if (!form.name_title.trim() && isRequired(formCongif, "name_title")) {
    errorMessage.name_title = "general.required";
  }
  if (!form.first_name.trim() && isRequired(formCongif, "first_name")) {
    errorMessage.first_name = "general.required";
  }
  if (!form.middle_name.trim() && isRequired(formCongif, "middle_name")) {
    errorMessage.middle_name = "general.required";
  }
  if (!form.last_name.trim() && isRequired(formCongif, "last_name")) {
    errorMessage.last_name = "general.required";
  }
  if (!form.suffix.trim() && isRequired(formCongif, "name_suffix")) {
    errorMessage.suffix = "general.required";
  }
  if (form.change_of_name || isRequired(formCongif, "change_of_name")) {
    if (
      !form.prev_name_title.trim() &&
      isRequired(formCongif, "prev_name_title", form.change_of_name)
    ) {
      errorMessage.prev_name_title = "general.required";
    }
    if (
      !form.prev_first_name.trim() &&
      isRequired(formCongif, "prev_first_name", form.change_of_name)
    ) {
      errorMessage.prev_first_name = "general.required";
    }
    if (
      !form.prev_middle_name.trim() &&
      isRequired(formCongif, "prev_middle_name", form.change_of_name)
    ) {
      errorMessage.prev_middle_name = "general.required";
    }
    if (
      !form.prev_last_name.trim() &&
      isRequired(formCongif, "prev_last_name", form.change_of_name)
    ) {
      errorMessage.prev_last_name = "general.required";
    }
    if (
      !form.prev_name_suffix.trim() &&
      isRequired(formCongif, "prev_name_suffix", form.change_of_name)
    ) {
      errorMessage.prev_name_suffix = "general.required";
    }
  }
  if (!form.us_citizen && isRequired(formCongif, "us_citizen")) {
    errorMessage.us_citizen = "form_fields.citizen_eligibility_error";
  }
  if (!form.home_address.trim() && isRequired(formCongif, "home_address")) {
    errorMessage.home_address = "general.required";
  }
  if (!form.home_unit.trim() && isRequired(formCongif, "home_unit")) {
    errorMessage.home_unit = "general.required";
  }
  if (!form.home_city.trim() && isRequired(formCongif, "home_city")) {
    errorMessage.home_city = "general.required";
  }
  if (!form.state.trim() && isRequired(formCongif, "home_state")) {
    errorMessage.state = "general.required";
  }
  if (!form.home_zip_code.trim() && isRequired(formCongif, "home_zip_code")) {
    errorMessage.home_zip_code = "general.required";
  } else if (!zipRegex.test(form.home_zip_code.trim())) {
    errorMessage.home_zip_code = "form_fields.zip_code_error";
  }
  if (
    form.has_mailing_address ||
    isRequired(formCongif, "has_mailing_address")
  ) {
    if (
      !form.mailing_address.trim() &&
      isRequired(formCongif, "mailing_address", form.has_mailing_address)
    ) {
      errorMessage.mailing_address = "general.required";
    }
    if (
      !form.mailing_unit.trim() &&
      isRequired(formCongif, "mailing_unit", form.has_mailing_address)
    ) {
      errorMessage.mailing_unit = "general.required";
    }
    if (
      !form.mailing_city.trim() &&
      isRequired(formCongif, "mailing_city", form.has_mailing_address)
    ) {
      errorMessage.mailing_city = "general.required";
    }
    if (
      !form.mailing_state.trim() &&
      isRequired(formCongif, "mailing_state", form.has_mailing_address)
    ) {
      errorMessage.mailing_state = "general.required";
    }
    if (
      !form.mailing_zip_code.trim() &&
      isRequired(formCongif, "mailing_zip_code", form.has_mailing_address)
    ) {
      errorMessage.mailing_zip_code = "general.required";
    } else if (!zipRegex.test(form.mailing_zip_code.trim())) {
      errorMessage.mailing_zip_code = "form_fields.zip_code_error";
    }
  }
  if (form.change_of_address || isRequired(formCongif, "change_of_address")) {
    if (
      !form.prev_address.trim() &&
      isRequired(formCongif, "prev_address", form.change_of_address)
    ) {
      errorMessage.prev_address = "general.required";
    }
    if (
      !form.prev_unit.trim() &&
      isRequired(formCongif, "prev_unit", form.change_of_address)
    ) {
      errorMessage.prev_unit = "general.required";
    }
    if (
      !form.prev_city.trim() &&
      isRequired(formCongif, "prev_city", form.change_of_address)
    ) {
      errorMessage.prev_city = "general.required";
    }
    if (
      !form.prev_state.trim() &&
      isRequired(formCongif, "prev_state", form.change_of_address)
    ) {
      errorMessage.prev_state = "general.required";
    }
    if (
      !form.prev_zip_code.trim() &&
      isRequired(formCongif, "prev_zip_code", form.change_of_address)
    ) {
      errorMessage.prev_zip_code = "general.required";
    } else if (!zipRegex.test(form.prev_zip_code.trim())) {
      errorMessage.prev_zip_code = "form_fields.zip_code_error";
    }
  }
  if (form.has_no_state_license == null && flowType !== "paper") {
    errorMessage.has_no_state_license =
      "finish_with_state_page1.dl_id_answer_required";
  }
  if (!form.has_no_state_license && (flowType === "paper" || showRedirect)) {
    if (
      !form.state_id_number.trim() &&
      isRequired(formCongif, "state_id_number")
    ) {
      errorMessage.state_id_number = "general.required";
    } else if (!finalRegex.test(form.state_id_number.trim())) {
      errorMessage.state_id_number = "form_fields.invalid_id_number";
    }
  }
  if (
    form.has_no_state_license &&
    !form.has_no_ssn &&
    (flowType === "paper" || showRedirect)
  )
    if (
      !form.last_four_ss_number.trim() &&
      isRequired(formCongif, "last_four_ss_number")
    ) {
      errorMessage.last_four_ss_number = "general.required";
    } else if (!/^\d{4}$/.test(form.last_four_ss_number.trim())) {
      errorMessage.last_four_ss_number = "form_fields.invalid_ssn4";
    }
  if (!form.race.trim() && isRequired(formCongif, "race")) {
    errorMessage.race = "general.required";
  }
  if (!form.party.trim() && isRequired(formCongif, "party")) {
    errorMessage.party = "general.required";
  }
  if (
    (!form.birthMonth.trim() && isRequired(formCongif, "date_of_birth")) ||
    (!form.birthDay.trim() && isRequired(formCongif, "date_of_birth")) ||
    (!form.birthYear.trim() && isRequired(formCongif, "date_of_birth"))
  ) {
    errorMessage.birthDay = "general.required";
  } else if (Number(form.birthYear) < 1900) {
    errorMessage.birthMonth = "form_fields.invalid_year";
  }
  const dobValidation = processDateOfBirthValidation(
    form.birthYear,
    form.birthMonth,
    form.birthDay,
    formCongif,
    isRequired(formCongif, "date_of_birth"),
    !form.has_no_state_license,
  );
  Object.assign(errorMessage, dobValidation.errors);
  Object.assign(form, dobValidation.formUpdates);

  if (
    isVisible(formCongif, "age_eligibility") &&
    !form.age_eligibility &&
    form.dob_routing_outcome === "pre_registration_notice"
  ) {
    errorMessage.age_eligibility = "form_fields.age_eligibility_error";
  }
  if (!form.age_eligibility || !form.has_no_state_license) {
    if (!form.race.trim() && isRequired(formCongif, "race")) {
      errorMessage.race = "general.required";
    }
    if (!form.party.trim() && isRequired(formCongif, "party")) {
      errorMessage.party = "general.required";
    }
  }
  if (
    !form.phone.trim() &&
    (isRequired(formCongif, "phone", form.opt_in_sms) || form.opt_in_sms)
  ) {
    errorMessage.phone = "form_fields.required_phone";
  } else if (form.opt_in_sms && !fullPhoneRegex.test(form.phone.trim())) {
    errorMessage.phone = "form_fields.invalid_phone";
  }
  if (form.opt_in_email && isRequired(formCongif, "opt_in_email")) {
    errorMessage.opt_in_email = "general.required";
  }
  if (form.volunteer && isRequired(formCongif, "opt_in_volunteer")) {
    errorMessage.volunteer = "general.required";
  }

  return {
    errorMessage,
    isValid: !Object.values(errorMessage).some(value => !!value),
  };
};

export const validateConnectedOvr = (
  form: RegisterFormState,
  formCongif: DataCollectionConfiguration,
  step: SetStateAction<1 | 2 | 3 | 4 | 5>,
): ValidationResult => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  const fullPhoneRegex = /^\d{3}-\d{3}-\d{4}$/;
  const miIdRegex = /^[a-zA-Z]\d{12}$/i;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const errorMessage = { ...EMPTY_ERROR_MESSAGES };
  if (step === 1) {
    if (!form.us_citizen && isRequired(formCongif, "us_citizen")) {
      errorMessage.us_citizen = "michigan.eligibility.citizen_error";
    }
    if (
      !form.will_be_18_by_election &&
      isRequired(formCongif, "will_be_18_by_election")
    ) {
      errorMessage.will_be_18_by_election = "michigan.eligibility.age_error";
    }
    if (
      !form.residency_duration_ack &&
      isRequired(formCongif, "residency_duration_ack")
    ) {
      errorMessage.residency_duration_ack = "show";
    }
    if (
      !form.cancel_previous_registration_ack &&
      isRequired(formCongif, "cancel_previous_registration_ack")
    ) {
      errorMessage.cancel_previous_registration_ack = "show";
    }
    if (
      !form.use_stored_signature_ack &&
      isRequired(formCongif, "use_stored_signature_ack")
    ) {
      errorMessage.use_stored_signature_ack = "show";
    }
    if (
      form.updated_dln_recently !== "no" &&
      isRequired(formCongif, "updated_dln_recently")
    ) {
      errorMessage.updated_dln_recently = "show";
    }
    if (
      form.request_duplicate_dln_today !== "no" &&
      isRequired(formCongif, "request_duplicate_dln_today")
    ) {
      errorMessage.request_duplicate_dln_today = "show";
    }
  } else if (step === 2) {
    if (!form.full_name.trim() && isRequired(formCongif, "full_name")) {
      errorMessage.full_name = "general.required";
    }
    if (!form.eye_color.trim() && isRequired(formCongif, "eye_color")) {
      errorMessage.eye_color = "general.required";
    }
    if (
      !form.state_id_number.trim() &&
      isRequired(formCongif, "state_id_number")
    ) {
      errorMessage.state_id_number = "michigan.id_empty_error";
    } else if (
      !miIdRegex.test(form.state_id_number.trim()) &&
      form.state_id_number.trim() !== "NONE"
    ) {
      errorMessage.state_id_number = "michigan.id_format_error";
    }
    if (
      (!form.birthMonth.trim() && isRequired(formCongif, "date_of_birth")) ||
      (!form.birthDay.trim() && isRequired(formCongif, "date_of_birth")) ||
      (!form.birthYear.trim() && isRequired(formCongif, "date_of_birth"))
    ) {
      errorMessage.birthDay = "general.required";
    } else if (Number(form.birthYear) < 1900) {
      errorMessage.birthYear = "form_fields.invalid_year";
    }
    const dobValidation2 = processDateOfBirthValidation(
      form.birthYear,
      form.birthMonth,
      form.birthDay,
      formCongif,
      isRequired(formCongif, "date_of_birth"),
      false,
    );
    Object.assign(errorMessage, dobValidation2.errors);
    Object.assign(form, dobValidation2.formUpdates);

    if (
      !form.last_four_ss_number.trim() ||
      form.last_four_ss_number.trim().length !== 4
    ) {
      errorMessage.last_four_ss_number = "michigan.ssn_last4_empty_error";
    } else if (!/^\d{4}$/.test(form.last_four_ss_number.trim())) {
      errorMessage.last_four_ss_number = "michigan.ssn_last4_invalid_error";
    }
  } else if (step === 3) {
    if (!form.street_number.trim() && isRequired(formCongif, "street_number")) {
      errorMessage.street_number = "general.required";
    }
    if (!form.street_name.trim() && isRequired(formCongif, "street_name")) {
      errorMessage.street_name = "general.required";
    }
    if (!form.street_type.trim() && isRequired(formCongif, "street_type")) {
      errorMessage.street_type = "general.required";
    }
    if (
      !form.street_direction.trim() &&
      isRequired(formCongif, "street_direction")
    ) {
      errorMessage.street_direction = "general.required";
    }
    if (!form.home_unit.trim() && isRequired(formCongif, "street_apt_unit")) {
      errorMessage.home_unit = "general.required";
    }
    if (!form.home_city.trim() && isRequired(formCongif, "city")) {
      errorMessage.home_city = "general.required";
    }
    if (!form.state.trim() && isRequired(formCongif, "state")) {
      errorMessage.state = "general.required";
    }
    if (!form.home_zip_code.trim() && isRequired(formCongif, "zip_code")) {
      errorMessage.home_zip_code = "general.required";
    } else if (!zipRegex.test(form.home_zip_code.trim())) {
      errorMessage.home_zip_code = "form_fields.zip_code_error";
    }
    if (
      !form.mailing_address_type.trim() &&
      isRequired(formCongif, "mailing_address_type")
    ) {
      errorMessage.mailing_address_type = "general.required";
    }
    if (form.has_mailing_address) {
      if (form.mailing_address_type === "STANDARD") {
        if (
          !form.mailing_address_number.trim() &&
          isRequired(
            formCongif,
            "mailing_address_number",
            form.has_mailing_address,
          )
        ) {
          errorMessage.mailing_address_number = "general.required";
        }
        if (
          !form.mailing_address_street_name.trim() &&
          isRequired(
            formCongif,
            "mailing_address_street_name",
            form.has_mailing_address,
          )
        ) {
          errorMessage.mailing_address_street_name = "general.required";
        }
        if (
          !form.mailing_address_street_type.trim() &&
          isRequired(
            formCongif,
            "mailing_address_street_type",
            form.has_mailing_address,
          )
        ) {
          errorMessage.mailing_address_street_type = "general.required";
        }
        if (
          !form.mailing_city.trim() &&
          isRequired(formCongif, "mailing_city", form.has_mailing_address)
        ) {
          errorMessage.mailing_city = "general.required";
        }
        if (
          !form.mailing_state.trim() &&
          isRequired(formCongif, "mailing_state", form.has_mailing_address)
        ) {
          errorMessage.mailing_state = "general.required";
        }
        if (
          !form.mailing_zip_code.trim() &&
          isRequired(formCongif, "mailing_zip_code", form.has_mailing_address)
        ) {
          errorMessage.mailing_zip_code = "general.required";
        } else if (!zipRegex.test(form.mailing_zip_code.trim())) {
          errorMessage.mailing_zip_code = "form_fields.zip_code_error";
        }
      } else if (form.mailing_address_type === "PO_BOX") {
        if (
          !form.mailing_po_box_number.trim() &&
          isRequired(
            formCongif,
            "mailing_po_box_number",
            form.has_mailing_address,
          )
        ) {
          errorMessage.mailing_po_box_number = "general.required";
        }
        if (
          !form.mailing_city.trim() &&
          isRequired(formCongif, "mailing_city", form.has_mailing_address)
        ) {
          errorMessage.mailing_city = "general.required";
        }
        if (
          !form.mailing_state.trim() &&
          isRequired(formCongif, "mailing_state", form.has_mailing_address)
        ) {
          errorMessage.mailing_state = "general.required";
        }
        if (
          !form.mailing_zip_code.trim() &&
          isRequired(formCongif, "mailing_zip_code", form.has_mailing_address)
        ) {
          errorMessage.mailing_zip_code = "general.required";
        } else if (!zipRegex.test(form.mailing_zip_code.trim())) {
          errorMessage.mailing_zip_code = "form_fields.zip_code_error";
        }
      } else if (form.mailing_address_type === "MILITARY") {
        if (
          !form.mailing_box_group_type.trim() &&
          isRequired(
            formCongif,
            "mailing_box_group_type",
            form.has_mailing_address,
          )
        ) {
          errorMessage.mailing_box_group_type = "general.required";
        }
        if (
          !form.mailing_box_group_number.trim() &&
          isRequired(
            formCongif,
            "mailing_box_group_number",
            form.has_mailing_address,
          )
        ) {
          errorMessage.mailing_box_group_number = "general.required";
        }
        if (
          !form.mailing_box_number.trim() &&
          isRequired(formCongif, "mailing_box_number", form.has_mailing_address)
        ) {
          errorMessage.mailing_box_number = "general.required";
        }
        if (
          !form.mailing_apo.trim() &&
          isRequired(formCongif, "mailing_apo", form.has_mailing_address)
        ) {
          errorMessage.mailing_apo = "general.required";
        }
        if (
          !form.mailing_ap.trim() &&
          isRequired(formCongif, "mailing_ap", form.has_mailing_address)
        ) {
          errorMessage.mailing_ap = "general.required";
        }
        if (
          !form.mailing_zip_code.trim() &&
          isRequired(formCongif, "mailing_zip_code", form.has_mailing_address)
        ) {
          errorMessage.mailing_zip_code = "general.required";
        } else if (!zipRegex.test(form.mailing_zip_code.trim())) {
          errorMessage.mailing_zip_code = "form_fields.zip_code_error";
        }
      } else if (form.mailing_address_type === "INTERNATIONAL") {
        if (
          !form.mailing_address_line1.trim() &&
          isRequired(
            formCongif,
            "mailing_address_line1",
            form.has_mailing_address,
          )
        ) {
          errorMessage.mailing_address_line1 = "general.required";
        }
        if (
          !form.mailing_address_line2.trim() &&
          isRequired(
            formCongif,
            "mailing_address_line2",
            form.has_mailing_address,
          )
        ) {
          errorMessage.mailing_address_line2 = "general.required";
        }
        if (
          !form.mailing_address_line3.trim() &&
          isRequired(
            formCongif,
            "mailing_address_line3",
            form.has_mailing_address,
          )
        ) {
          errorMessage.mailing_address_line3 = "general.required";
        }
        if (
          !form.mailing_country.trim() &&
          isRequired(formCongif, "mailing_country", form.has_mailing_address)
        ) {
          errorMessage.mailing_country = "general.required";
        }
        if (
          !form.mailing_postal_code.trim() &&
          isRequired(
            formCongif,
            "mailing_postal_code",
            form.has_mailing_address,
          )
        ) {
          errorMessage.mailing_postal_code = "general.required";
        }
      }
    }
    if (
      !form.phone.trim() &&
      (isRequired(formCongif, "phone", form.opt_in_sms) || form.opt_in_sms)
    ) {
      errorMessage.phone = "michigan.phone_election_error";
    } else if (form.opt_in_sms && !fullPhoneRegex.test(form.phone.trim())) {
      errorMessage.phone = "form_fields.invalid_phone";
    }
    if (form.opt_in_sms && isRequired(formCongif, "opt_in_sms")) {
      errorMessage.opt_in_sms = "general.required";
    }
    if (!form.email_address.trim() && isRequired(formCongif, "email")) {
      errorMessage.email_address = "general.required";
    } else if (!emailRegex.test(form.email_address.trim())) {
      errorMessage.email_address = "form_fields.email_error";
    }
    if (form.opt_in_email && isRequired(formCongif, "opt_in_email")) {
      errorMessage.opt_in_email = "general.required";
    }
    if (form.volunteer && isRequired(formCongif, "opt_in_volunteer")) {
      errorMessage.volunteer = "general.required";
    }
  }

  return {
    errorMessage,
    isValid: !Object.values(errorMessage).some(value => !!value),
  };
};

export const validateWA = (
  form: RegisterFormState,
  formCongif: DataCollectionConfiguration,
  step: SetStateAction<1 | 2 | 3 | 4 | 5>,
  isWA: string = "",
  upload: string = "signature",
): ValidationResult => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  const fullPhoneRegex = /^\d{3}-\d{3}-\d{4}$/;
  const idRegex = /^[a-z0-9]{12}$/i;

  const errorMessage = { ...EMPTY_ERROR_MESSAGES };

  const needsValidation = (
    configKey: string,
    stateKey: keyof RegisterFormState,
    dependentValue?: boolean,
  ) => {
    const isFieldVisible = isVisible(formCongif, configKey);
    const hasStateValue = form[stateKey] !== undefined;
    return (
      isFieldVisible &&
      hasStateValue &&
      isRequired(formCongif, configKey, dependentValue)
    );
  };

  const nameFields: (keyof RegisterFormState)[] = [
    "name_title",
    "first_name",
    "middle_name",
    "last_name",
    "suffix",
  ];
  nameFields.forEach(field => {
    const configKey = field === "suffix" ? "name_suffix" : field;
    const fieldValue = form[field];
    if (
      needsValidation(configKey, field) &&
      (typeof fieldValue !== "string" || !fieldValue.trim())
    ) {
      errorMessage[field] = "general.required";
    }
  });

  if (form.change_of_name) {
    const prevFields: (keyof RegisterFormState)[] = [
      "prev_name_title",
      "prev_first_name",
      "prev_middle_name",
      "prev_last_name",
      "prev_name_suffix",
    ];
    prevFields.forEach(field => {
      const fieldValue = form[field];
      if (
        needsValidation(field, field) &&
        (typeof fieldValue !== "string" || !fieldValue.trim())
      ) {
        errorMessage[field] = "general.required";
      }
    });
  }

  if (needsValidation("us_citizen", "us_citizen") && !form.us_citizen) {
    errorMessage.us_citizen = "form_fields.citizen_eligibility_error";
  }

  if (isRequired(formCongif, "date_of_birth")) {
    if (
      (!form.birthMonth.trim() && isRequired(formCongif, "date_of_birth")) ||
      (!form.birthDay.trim() && isRequired(formCongif, "date_of_birth")) ||
      (!form.birthYear.trim() && isRequired(formCongif, "date_of_birth"))
    ) {
      errorMessage.birthDay = "general.required";
    } else if (Number(form.birthYear) < 1900) {
      errorMessage.birthYear = "form_fields.invalid_year";
    }
    const dobValidation3 = processDateOfBirthValidation(
      form.birthYear,
      form.birthMonth,
      form.birthDay,
      formCongif,
      true,
      false,
    );
    Object.assign(errorMessage, dobValidation3.errors);
    Object.assign(form, dobValidation3.formUpdates);
  }

  if (
    needsValidation("home_address", "home_address") &&
    !form.home_address?.trim()
  )
    errorMessage.home_address = "general.required";
  const hasSecondaryAddressValue = [
    form.home_unit_type?.trim(),
    form.home_unit?.trim(),
  ].some(Boolean);
  if (isWA === "connected_PA" && hasSecondaryAddressValue) {
    if (!form.home_unit_type?.trim()) {
      errorMessage.home_unit_type = "general.required";
    }
    if (!form.home_unit?.trim()) {
      errorMessage.home_unit = "general.required";
    }
  } else if (
    needsValidation("home_unit", "home_unit") &&
    !form.home_unit?.trim()
  )
    errorMessage.home_unit = "general.required";
  if (needsValidation("home_city", "home_city") && !form.home_city?.trim())
    errorMessage.home_city = "general.required";
  if (needsValidation("home_state", "state") && !form.state?.trim())
    errorMessage.state = "general.required";

  if (needsValidation("home_zip_code", "home_zip_code")) {
    if (!form.home_zip_code?.trim()) {
      errorMessage.home_zip_code = "general.required";
    } else if (!zipRegex.test(form.home_zip_code.trim())) {
      errorMessage.home_zip_code = "form_fields.zip_code_error";
    }
  }

  if (
    form.has_mailing_address ||
    isRequired(formCongif, "has_mailing_address")
  ) {
    const mailFields: (keyof RegisterFormState)[] = [
      "mailing_address",
      "mailing_unit",
      "mailing_city",
      "mailing_state",
      "mailing_zip_code",
      "mailing_unit_type",
      "mailing_unit_number",
    ];
    mailFields.forEach(field => {
      const fieldValue = form[field];
      if (
        needsValidation(field, field) &&
        (typeof fieldValue !== "string" || !fieldValue.trim())
      ) {
        errorMessage[field] = "general.required";
      }
    });
  }

  if (form.change_of_address || isRequired(formCongif, "change_of_address")) {
    const mailFields: (keyof RegisterFormState)[] = [
      "prev_address",
      "prev_unit",
      "prev_city",
      "prev_state",
      "prev_zip_code",
      "prev_unit_number",
      "prev_unit_type",
    ];
    mailFields.forEach(field => {
      const fieldValue = form[field];
      if (
        needsValidation(field, field) &&
        (typeof fieldValue !== "string" || !fieldValue.trim())
      ) {
        errorMessage[field] = "general.required";
      }
    });
  }

  if (isWA === "connected_WA") {
    if (
      needsValidation("will_be_18_by_election", "will_be_18_by_election") &&
      !form.will_be_18_by_election
    ) {
      errorMessage.will_be_18_by_election = "washington.age_eligibility_error";
    }
    if (!form.has_no_state_license) {
      const configRegex =
        formCongif.fields.state_id_number?.validations?.regexp;
      const regex = configRegex ? new RegExp(`^${configRegex}$`) : idRegex;
      if (
        (!form.state_id_number.trim() ||
          !regex.test(form.state_id_number.trim())) &&
        form.state_id_number.trim() !== "NONE"
      ) {
        errorMessage.state_id_number = "general.required";
      }
      const isYearFilled = !!form.issueYear?.trim();
      const isMonthFilled = !!form.issueMonth?.trim();
      const isDayFilled = !!form.issueDay?.trim();

      if (!isMonthFilled || !isDayFilled || !isYearFilled) {
        errorMessage.issueYear = "general.required";
      } else {
        if (isMonthFilled && isDayFilled) {
          const selectedDate = new Date(
            Number(form.issueYear),
            Number(form.issueMonth) - 1,
            Number(form.issueDay),
          );

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (selectedDate > today) {
            errorMessage.issueYear = "washington.invalid_wdl_date";
          }
        }
      }

      if (
        form.issueYear.trim() &&
        form.issueMonth.trim() &&
        form.issueDay.trim()
      ) {
        const year = Number(form.issueYear);
        const month = Number(form.issueMonth) - 1;
        const day = Number(form.issueDay);

        const date = new Date(year, month, day);
        const isInvalidDate =
          date.getFullYear() !== year ||
          date.getMonth() !== month ||
          date.getDate() !== day;

        if (isInvalidDate) {
          errorMessage.issueDay = "form_fields.invalid_birth_date";
        }
      }

      form.date_of_issue = `${form.issueYear}-${form.issueMonth}-${form.issueDay}`;
    }

    if (step === 2) {
      if (!form.has_no_state_license) {
        // Optional SSN4: ok empty, validate only when provided
        const ssn4 = form.last_four_ss_number?.trim() ?? "";
        if (ssn4 && !/^\d{4}$/.test(ssn4)) {
          errorMessage.last_four_ss_number =
            "washington.ssn_last4_invalid_error";
        }
      }
    }

    if (step === 3 && form.has_no_state_license && upload === "signature") {
      if (form.has_no_ssn !== true) {
        const ssn4 = form.last_four_ss_number?.trim() ?? "";
        if (!ssn4) {
          errorMessage.last_four_ss_number = "general.required";
        } else if (!/^\d{4}$/.test(ssn4)) {
          errorMessage.last_four_ss_number =
            "washington.ssn_last4_invalid_error";
        }
      }
      if (!form.signature_base64?.trim()) {
        errorMessage.signature_base64 = "washington.signature_required_error";
      }
    }
  }

  const phoneReq =
    isRequired(formCongif, "phone", form.opt_in_sms) || form.opt_in_sms;
  if (phoneReq && !form.phone?.trim()) {
    errorMessage.phone = "form_fields.required_phone";
  } else if (form.phone?.trim() && !fullPhoneRegex.test(form.phone.trim())) {
    errorMessage.phone = "form_fields.invalid_phone";
  }

  if (isWA === "connected_PA") {
    if (
      needsValidation("will_be_18_by_election", "will_be_18_by_election") &&
      !form.will_be_18_by_election
    ) {
      errorMessage.will_be_18_by_election =
        "pennsylvania.age_eligibility_error";
    }
    if (step === 2) {
      if (!form.has_no_state_license) {
        const configRegex =
          formCongif.fields.state_id_number?.validations?.regexp;
        const regex = configRegex ? new RegExp(`^${configRegex}$`) : idRegex;
        if (
          !form.state_id_number.trim() &&
          isRequired(formCongif, "state_id_number")
        ) {
          errorMessage.state_id_number =
            "pennsylvania.penn_dot_number_empty_error";
        } else if (!regex.test(form.state_id_number.trim())) {
          errorMessage.state_id_number =
            "pennsylvania.penn_dot_number_invalid_error";
        }
      }
    }
    if (step === 4) {
      if (form.has_no_ssn !== true) {
        if (
          !form.last_four_ss_number.trim() ||
          form.last_four_ss_number.trim().length !== 4
        ) {
          errorMessage.last_four_ss_number =
            "pennsylvania.ssn_last4_empty_error";
        } else if (!/^\d{4}$/.test(form.last_four_ss_number.trim())) {
          errorMessage.last_four_ss_number =
            "pennsylvania.ssn_last4_invalid_error";
        }
      }
      if (!form.signature_base64.trim()) {
        errorMessage.signature_base64 = "general.required";
      }
      if (
        form.someone_helped &&
        !form.helper_electronic_signature_acknowledged
      ) {
        errorMessage.helper_electronic_signature_acknowledged =
          "pennsylvania.helper_terms_confirm_required";
      }
      if (form.someone_helped) {
        if (!form.helper_name.trim()) {
          errorMessage.helper_name = "general.required";
        }
        if (!form.helper_address.trim()) {
          errorMessage.helper_address = "general.required";
        }
        if (!form.helper_phone.trim()) {
          errorMessage.helper_phone = "general.required";
        }
      }
    }
    if (!form.home_county.trim()) {
      errorMessage.home_county = "general.required";
    }

    if (!form.race.trim() && isRequired(formCongif, "race")) {
      errorMessage.race = "general.required";
    }
    if (!form.party.trim() && isRequired(formCongif, "party")) {
      errorMessage.party = "general.required";
    }
  }
  if (form.volunteer && isRequired(formCongif, "volunteer")) {
    errorMessage.volunteer = "general.required";
  }

  if (needsValidation("opt_in_email", "opt_in_email") && !form.opt_in_email) {
    errorMessage.opt_in_email = "general.required";
  }

  return {
    errorMessage,
    isValid: !Object.values(errorMessage).some(value => !!value),
  };
};
