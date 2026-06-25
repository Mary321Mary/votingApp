import {
  buildPAHomeAddressFromForm,
  buildPAMailingAddressFromForm,
} from "./registerRouting";
import {
  DataCollectionConfiguration,
  RegisterFormState,
  SubmitMICovrPayload,
  SubmitPACovrPayload,
} from "./types";

export const STATES = [
  { name: "", value: "" },
  { name: "Alabama", value: "AL" },
  { name: "Alaska", value: "AK" },
  { name: "Arizona", value: "AZ" },
  { name: "Arkansas", value: "AR" },
  { name: "California", value: "CA" },
  { name: "Colorado", value: "CO" },
  { name: "Connecticut", value: "CT" },
  { name: "Delaware", value: "DE" },
  { name: "District of Columbia", value: "DC" },
  { name: "Florida", value: "FL" },
  { name: "Georgia", value: "GA" },
  { name: "Hawaii", value: "HI" },
  { name: "Idaho", value: "ID" },
  { name: "Illinois", value: "IL" },
  { name: "Indiana", value: "IN" },
  { name: "Iowa", value: "IA" },
  { name: "Kansas", value: "KS" },
  { name: "Kentucky", value: "KY" },
  { name: "Louisiana", value: "LA" },
  { name: "Maine", value: "ME" },
  { name: "Maryland", value: "MD" },
  { name: "Massachusetts", value: "MA" },
  { name: "Michigan", value: "MI" },
  { name: "Minnesota", value: "MN" },
  { name: "Mississippi", value: "MS" },
  { name: "Missouri", value: "MO" },
  { name: "Montana", value: "MT" },
  { name: "Nebraska", value: "NE" },
  { name: "Nevada", value: "NV" },
  { name: "New Hampshire", value: "NH" },
  { name: "New Jersey", value: "NJ" },
  { name: "New Mexico", value: "NM" },
  { name: "New York", value: "NY" },
  { name: "North Carolina", value: "NC" },
  { name: "North Dakota", value: "ND" },
  { name: "Ohio", value: "OH" },
  { name: "Oklahoma", value: "OK" },
  { name: "Oregon", value: "OR" },
  { name: "Pennsylvania", value: "PA" },
  { name: "Rhode Island", value: "RI" },
  { name: "South Carolina", value: "SC" },
  { name: "South Dakota", value: "SD" },
  { name: "Tennessee", value: "TN" },
  { name: "Texas", value: "TX" },
  { name: "Utah", value: "UT" },
  { name: "Vermont", value: "VT" },
  { name: "Virginia", value: "VA" },
  { name: "Washington", value: "WA" },
  { name: "West Virginia", value: "WV" },
  { name: "Wisconsin", value: "WI" },
  { name: "Wyoming", value: "WY" },
];

export const DIRECTIONS = [
  { name: "", value: "" },
  { name: "E", value: "E" },
  { name: "N", value: "N" },
  { name: "NE", value: "NE" },
  { name: "NW", value: "NW" },
  { name: "S", value: "S" },
  { name: "SE", value: "SE" },
  { name: "SW", value: "SW" },
  { name: "W", value: "W" },
];

export const isVisible = (
  formConfig: DataCollectionConfiguration,
  key: string,
) => formConfig?.fields?.[key]?.visible;

export const isRequired = (
  formConfig: DataCollectionConfiguration,
  key: string,
  dependentValue?: boolean,
): boolean => {
  const field = formConfig?.fields?.[key];
  if (!field) return false;
  if (field.dependent || field.dependent_field) {
    return !!(dependentValue && field.value_required);
  }
  return !!field.value_required;
};

const ALLOWED_REGISTRANT_FIELDS = [
  "partner_id",
  "lang",

  "name_title",
  "first_name",
  "middle_name",
  "last_name",
  // "suffix",

  "change_of_name",
  "prev_first_name",
  "prev_last_name",
  "prev_middle_name",
  "prev_name_suffix",
  "prev_name_title",
  "us_citizen",
  "will_be_18_by_election",
  "email_address",

  "home_address",
  // "address_line_2", ???
  // "home_unit_type",
  // "home_unit",
  "home_city",
  "state",
  "home_zip_code",

  "mailing_address",
  "mailing_unit",
  "mailing_city",
  "mailing_state",
  "mailing_zip_code",

  "change_of_address",
  "prev_address",
  "prev_unit",
  "prev_city",
  "prev_state",
  "prev_zip_code",

  // MI
  // "street_name",
  // "street_number",
  // "street_type",
  // "street_direction",
  "has_mailing_address",
  // "mailing_postal_code",
  // "mailing_po_box_number",
  // "mailing_box_group_type",
  // "mailing_box_group_number",
  // "mailing_box_number",
  // "mailing_apo",
  // "mailing_ap",
  // "mailing_address_line1",
  // "mailing_address_line2",
  // "mailing_address_line3",
  // "mailing_country",

  "party",
  "race",
  "home_county",
  // "signature_base64", ???

  "date_of_birth",
  "phone",
  // "date_of_issue", ???

  "opt_in_email",
  "opt_in_sms",
  "volunteer",
  "survey_question_1",
  "survey_answer_1",
  "survey_question_2",
  "survey_answer_2",

  "state_id_number",
  "last_four_ss_number",
  // "has_no_state_license",
  // "has_no_ssn",

  // MI
  // "full_name",
  // "eye_color",
  // "residency_duration_ack",
  // "cancel_previous_registration_ack",
  // "use_stored_signature_ack",
  // "updated_dln_recently",
  // "request_duplicate_dln_today",
];

export const filterRegistrant = (rawForm: RegisterFormState) => {
  return Object.keys(rawForm)
    .filter(key => ALLOWED_REGISTRANT_FIELDS.includes(key))
    .reduce((obj, key) => {
      obj[key] = rawForm[key as keyof RegisterFormState];
      return obj;
    }, {} as any);
};

function buildMICovrDateOfBirth(form: RegisterFormState): string {
  if (form.date_of_birth) {
    return form.date_of_birth;
  }
  if (form.birthYear && form.birthMonth && form.birthDay) {
    const month = form.birthMonth.padStart(2, "0");
    const day = form.birthDay.padStart(2, "0");
    return `${form.birthYear}-${month}-${day}`;
  }
  return "";
}

export const mapFormStateToPACovrPayload = (
  form: RegisterFormState,
): SubmitPACovrPayload => {
  const hasNoPennDot = form.has_no_state_license === true;
  const phoneDigits = form.phone ? form.phone.replace(/\D/g, "") : "";

  const payload: SubmitPACovrPayload = {
    partner_id: form.partner_id,
    locale: form.lang || "en",
    email: form.email_address,
    name_title: form.name_title,
    first_name: form.first_name,
    last_name: form.last_name,
    date_of_birth: buildMICovrDateOfBirth(form),
    confirm_us_citizen: form.us_citizen,
    confirm_will_be_18: form.will_be_18_by_election,
    registration_address_1: buildPAHomeAddressFromForm(form),
    registration_city: form.home_city,
    registration_zip_code: form.home_zip_code,
    registration_county: form.home_county,
    phone: phoneDigits,
    phone_type: form.opt_in_sms ? "mobile" : "home",
    party: form.party,
    penndot_number: form.state_id_number,
    confirm_no_penndot_number: hasNoPennDot,
    confirm_no_dl_or_ssn: hasNoPennDot && form.has_no_ssn === true,
    has_mailing_address: form.has_mailing_address,
    change_of_name: form.change_of_name,
    change_of_address: form.change_of_address,
    has_assistant: form.someone_helped,
    opt_in_email: form.opt_in_email,
    opt_in_sms: form.opt_in_sms,
    confirm_declaration: true,
  };

  if (form.middle_name?.trim()) {
    payload.middle_name = form.middle_name.trim();
  }

  if (form.suffix?.trim()) {
    payload.suffix = form.suffix.trim();
  }

  if (hasNoPennDot) {
    const ssn4 = form.last_four_ss_number?.trim();
    if (ssn4) {
      payload.ssn4 = ssn4;
    }
    const signature = form.signature_base64?.trim();
    if (signature) {
      payload.signature = signature;
    }
  }

  if (form.someone_helped) {
    payload.helper_name = form.helper_name;
    payload.helper_address = form.helper_address;
    payload.helper_phone = form.helper_phone
      ? form.helper_phone.replace(/\D/g, "")
      : "";
  }

  if (form.has_mailing_address) {
    payload.mailing_address_1 = buildPAMailingAddressFromForm(form);
    payload.mailing_city = form.mailing_city;
    payload.mailing_state = form.mailing_state;
    payload.mailing_zip_code = form.mailing_zip_code;
  }

  return payload;
};

export const mapFormStateToMICovrPayload = (
  form: RegisterFormState,
): SubmitMICovrPayload => {
  return {
    email: form.email_address,
    partner_id: form.partner_id,
    locale: form.lang || "en", //  lang -> locale

    // Consents
    confirm_us_citizen: form.us_citizen,
    confirm_will_be_18: form.will_be_18_by_election,
    is_30_day_resident: form.residency_duration_ack,
    registration_cancellation_authorized: form.cancel_previous_registration_ack,
    digital_signature_authorized: form.use_stored_signature_ack,
    confirm_affirm_privacy_notice: true,
    updated_dln_recently: form.updated_dln_recently === "yes",
    requested_duplicate_dln_today: form.request_duplicate_dln_today === "yes",

    // Personale
    full_name: form.full_name || `${form.first_name} ${form.last_name}`.trim(),
    date_of_birth: buildMICovrDateOfBirth(form),
    eye_color_code: form.eye_color?.substring(0, 3).toUpperCase() || "BRO", // "Brown" -> "BRO"
    dln: form.state_id_number,
    ssn4: form.last_four_ss_number,
    email_address: form.email_address,

    // Address
    registration_address_number: form.street_number || "",
    registration_address_street_name: form.street_name?.toUpperCase() || "",
    registration_address_street_type: form.street_type?.toUpperCase() || "",
    registration_unit_number: form.home_unit || "0001", // Happy path for tests
    registration_city: form.home_city,
    registration_zip_code: form.home_zip_code,
    registration_county: form.home_county?.toUpperCase() || "",

    // Cpntacts
    has_mailing_address: form.has_mailing_address,
    opt_in_email: form.opt_in_email,
    opt_in_sms: form.opt_in_sms,
    phone: form.phone ? form.phone.replace(/\D/g, "") : "", // Only numbers
  };
};
