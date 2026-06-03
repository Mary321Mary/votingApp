import {
  DataCollectionConfiguration,
  RegisterFormState,
  SubmitMICovrPayload,
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
    digital_signature_authorized: form.helper_electronic_signature_acknowledged,

    // Personale
    full_name: form.full_name || `${form.first_name} ${form.last_name}`.trim(),
    date_of_birth: form.date_of_birth,
    eye_color_code: form.eye_color?.substring(0, 3).toUpperCase() || "BRO", // "Brown" -> "BRO"
    dln: form.state_id_number,
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
