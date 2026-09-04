import {
  buildPAHomeAddressFromForm,
  buildPAMailingAddressFromForm,
} from "./registerRouting";
import {
  DataCollectionConfiguration,
  RegisterFormState,
  SubmitMICovrPayload,
  SubmitPACovrPayload,
  SubmitWACovrPayload,
} from "./types";

/** Fallback when submit_email_zip does not yet return state_required_id. */
export const DEFAULT_STATE_REQUIRED_ID =
  "driver's license or state identification card";

export const isVisible = (
  formConfig: DataCollectionConfiguration | undefined,
  key: string,
) => formConfig?.fields?.[key]?.visible;

export const isFinishOnOtherDeviceEnabled = (
  formConfig: DataCollectionConfiguration | undefined,
): boolean => formConfig?.eligibility?.enable_finish_on_other_device === true;

/** True when the user may proceed past the no-DL upload selection step. */
export const isValidNoLicenseUpload = (
  upload: string,
  formConfig: DataCollectionConfiguration | undefined,
): boolean => {
  if (!upload) return false;
  if (upload === "device") return isFinishOnOtherDeviceEnabled(formConfig);
  return upload === "signature" || upload === "print";
};

/** True when routing should render the finish-on-other-device step. */
export const canRouteToDeviceUpload = (
  upload: string,
  formConfig: DataCollectionConfiguration | undefined,
): boolean => upload === "device" && isFinishOnOtherDeviceEnabled(formConfig);

/** MI OVR config uses `phone_number`; other flows use `phone`. */
export const phoneConfigKey = (
  formConfig: DataCollectionConfiguration | undefined,
): "phone" | "phone_number" =>
  formConfig?.fields?.phone_number ? "phone_number" : "phone";

export const isPhoneVisible = (
  formConfig: DataCollectionConfiguration | undefined,
): boolean => !!isVisible(formConfig, phoneConfigKey(formConfig));

/**
 * True when the resolved config collects this field at all. Field sets built
 * with `replace_base: true` (e.g. AZ finish_with_state) omit fields entirely,
 * which must not be confused with a field that is present but ungated.
 */
export const fieldConfigured = (
  formConfig: DataCollectionConfiguration | undefined,
  key: string,
): boolean => !!formConfig?.fields?.[key];

/** True when field visibility/requiredness is gated on another field (e.g. SSN after no-DL). */
export const fieldDependsOn = (
  formConfig: DataCollectionConfiguration | undefined,
  key: string,
  parentKey: string,
): boolean => {
  const field = formConfig?.fields?.[key];
  if (!field) return false;
  if (field.dependent_field != null)
    return String(field.dependent_field) === parentKey;
  // Base config marks SSN fields dependent without always repeating dependent_field.
  if (
    field.dependent &&
    (key === "last_four_ss_number" || key === "has_no_ssn")
  ) {
    return parentKey === "has_no_state_license";
  }
  return false;
};

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

/**
 * Phone is required when the user opts into SMS, or when config marks phone required.
 * Keep in sync with mobile `utils/constants.ts`.
 */
export const isPhoneRequired = (
  formConfig: DataCollectionConfiguration,
  optInSms?: boolean,
): boolean => !!optInSms || isRequired(formConfig, phoneConfigKey(formConfig));

/** True when an opt_in_sms toggle lifted the phone requirement and UI errors should clear. */
export const shouldClearPhoneErrorAfterSmsChange = (
  formConfig: DataCollectionConfiguration,
  fieldKey: string,
  optInSms: boolean,
): boolean =>
  fieldKey === "opt_in_sms" && !isPhoneRequired(formConfig, optInSms);

/**
 * Race options from Private (txt.registration.races via data collection config).
 * Values are the display strings the API validates/stores — same pattern as party.
 * Falls back to client i18n labels (also used as values) if config is not loaded yet.
 */
export const buildRaceSelectOptions = (
  formConfig: DataCollectionConfiguration | undefined,
  t: (key: string) => string,
): { name: string; value: string }[] => {
  const apiOptions = formConfig?.fields?.race?.options;
  if (apiOptions?.length) {
    return [
      { name: "", value: "" },
      ...apiOptions.map(o => ({ name: o, value: o })),
    ];
  }
  const fallback = [
    "general.race.asian",
    "general.race.black",
    "general.race.hispanic",
    "general.race.native_american",
    "general.race.other",
    "general.race.multiple",
    "general.race.white",
  ].map(key => {
    const label = t(key);
    return { name: label, value: label };
  });
  return [{ name: "", value: "" }, ...fallback];
};

const ALLOWED_REGISTRANT_FIELDS = [
  "partner_id",
  "lang",

  "name_title",
  "first_name",
  "middle_name",
  "last_name",

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
  "home_unit",
  "home_city",
  "state",
  "home_zip_code",

  "has_mailing_address",
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

  "party",
  "race",
  "home_county",

  "date_of_birth",
  "phone",

  "opt_in_email",
  "opt_in_sms",
  "volunteer",
  "survey_question_1",
  "survey_answer_1",
  "survey_question_2",
  "survey_answer_2",

  "state_id_number",
  "last_four_ss_number",
  "has_no_state_license",
  "has_no_ssn",
];

export const filterRegistrant = (rawForm: RegisterFormState) => {
  const filtered = Object.keys(rawForm)
    .filter(key => ALLOWED_REGISTRANT_FIELDS.includes(key))
    .reduce((obj, key) => {
      obj[key] = rawForm[key as keyof RegisterFormState];
      return obj;
    }, {} as any);
  // Form state uses `suffix`; the NVRA API column is name_suffix.
  if (rawForm.suffix) {
    filtered.name_suffix = rawForm.suffix;
  }
  return filtered;
};

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

export const mapFormStateToMICovrPayload = (
  form: RegisterFormState,
  registration_uid: string,
): SubmitMICovrPayload => {
  return {
    registration_uid,
    email: form.email_address,
    partner_id: form.partner_id,
    locale: form.lang || "en", //  lang -> locale

    // Consents
    confirm_us_citizen: form.us_citizen,
    confirm_will_be_18: form.will_be_18_by_election ?? false,
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

    // Contacts
    opt_in_email: form.opt_in_email,
    opt_in_sms: form.opt_in_sms,
    phone: form.phone ? form.phone.replace(/\D/g, "") : "", // Only numbers

    // Mailing
    has_mailing_address: form.has_mailing_address,
    mailing_address_type: form.mailing_address_type,
    mailing_address_number: form.mailing_address_number,
    mailing_address_street_name: form.mailing_address_street_name,
    mailing_address_street_type: form.mailing_address_street_type,
    mailing_po_box_number: form.mailing_po_box_number,
    mailing_box_group_type: form.mailing_box_group_type,
    mailing_box_group_number: form.mailing_box_group_number,
    mailing_box_number: form.mailing_box_number,
    mailing_apo: form.mailing_apo,
    mailing_ap: form.mailing_ap,
    mailing_country: form.mailing_country,
    mailing_postal_code: form.mailing_postal_code,
    mailing_address_line1: form.mailing_address_line1,
    mailing_address_line2: form.mailing_address_line2,
    mailing_address_line3: form.mailing_address_line3,
    mailing_unit: form.mailing_unit,
    mailing_city: form.mailing_city,
    mailing_state: form.mailing_state,
    mailing_zip_code: form.mailing_zip_code,
  };
};

export const mapFormStateToPACovrPayload = (
  form: RegisterFormState,
  registration_uid: string,
): SubmitPACovrPayload => {
  const hasNoPennDot = form.has_no_state_license === true;
  const phoneDigits = form.phone ? form.phone.replace(/\D/g, "") : "";

  const payload: SubmitPACovrPayload = {
    registration_uid,
    partner_id: form.partner_id,
    locale: form.lang || "en",
    email: form.email_address,
    name_title: form.name_title,
    first_name: form.first_name,
    last_name: form.last_name,
    date_of_birth: buildMICovrDateOfBirth(form),
    confirm_us_citizen: form.us_citizen,
    confirm_will_be_18: form.will_be_18_by_election ?? false,
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

  if (form.change_of_name) {
    payload.prev_name_title = form.prev_name_title;
    payload.prev_first_name = form.prev_first_name;
    payload.prev_middle_name = form.prev_middle_name;
    payload.prev_last_name = form.prev_last_name;
    payload.prev_name_suffix = form.prev_name_suffix;
  }

  if (form.change_of_address) {
    payload.prev_address = form.prev_address;
    payload.prev_unit = form.prev_unit;
    payload.prev_city = form.prev_city;
    payload.prev_state = form.prev_state;
    payload.prev_zip_code = form.prev_zip_code;
    payload.prev_unit_number = form.prev_unit_number;
    payload.prev_unit_type = form.prev_unit_type;
  }

  return payload;
};

export const mapFormStateToWACovrPayload = (
  form: RegisterFormState,
  registration_uid: string,
): SubmitWACovrPayload => {
  const payload = {
    registration_uid,
    locale: form.lang || "en",
    email: form.email_address,
    is_citizen: form.us_citizen,
    confirm_will_be_18: form.will_be_18_by_election ?? false,
    residence_address: buildPAHomeAddressFromForm(form),
    residence_city: form.home_city,
    residence_zip: form.home_zip_code,
    res_county_code: form.home_county,
    phone_type: form.opt_in_sms ? "mobile" : "home",
    driver_license: form.state_id_number,
    ssn4: form.last_four_ss_number,
    issue_date: form.date_of_issue,
    confirm_no_dln: form.has_no_state_license,
    has_assistant: form.someone_helped,
    ...form,
  };

  if (form.middle_name?.trim()) {
    payload.middle_name = form.middle_name.trim();
  }

  if (form.suffix?.trim()) {
    payload.suffix = form.suffix.trim();
  }

  if (form.someone_helped) {
    payload.helper_name = form.helper_name;
    payload.helper_address = form.helper_address;
    payload.helper_phone = form.helper_phone
      ? form.helper_phone.replace(/\D/g, "")
      : "";
  }

  if (form.has_mailing_address) {
    payload.mailing_city = form.mailing_city;
    payload.mailing_state = form.mailing_state;
    payload.mailing_zip_code = form.mailing_zip_code;
  }

  return payload;
};

/** i18n key for the will-be-18 checkbox. Field-config YAML labels are English-only. */
export function willBe18ByElectionLabelKey(stateAbbr?: string): string {
  switch ((stateAbbr || "").toUpperCase()) {
    case "WA":
      return "washington.age_eligibility";
    case "MI":
      return "michigan.eligibility.age";
    default:
      return "nvra_form_page.age_eligibility";
  }
}
