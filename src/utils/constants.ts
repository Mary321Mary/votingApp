import { DataCollectionConfiguration, RegisterFormState } from "./types";

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
) => {
  const field = formConfig?.fields?.[key];
  if (field?.dependent) {
    if (dependentValue === true) return true;
  } else {
    if (field?.value_required) return true;
  }
  return false;
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
  // "unit_type",
  // "unit",
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
  // "has_mailing_address",
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
