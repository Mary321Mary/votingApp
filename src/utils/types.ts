import { ReactNode } from "react";

export interface User {
  id: number;
  username: string;
  password_hash: string;
  email: string;
  name: string;
  birth_date?: string; // ISO date string
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  created_at: string; // ISO datetime string
}

export interface AuthState {
  user: AuthMeResponse | User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  user: {
    username: string;
    name: string;
    email: string;
    password: string;
    state: string;
    city: string;
    address: string;
    phone: string;
    birth_date: string;
    zip: string;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export type AuthData = {
  access_token: string;
  refresh_token: string;
};

export type RegisterData = {
  access_token: string;
  refresh_token: string;
};

export interface AuthMeResponse {
  email: string;
  username: string;
  name: string;
  state: string;
  city: string;
  address: string;
  phone: string;
  birth_date?: string;
  agency?: string;
  zip: string;
}

// ---------------------------------------------------

export const OVR_TYPE_MAP: Record<string, string> = {
  paper_only: "paper",
  paper_or_finish_with_state: "ovr_state",
  connected_MI: "connected_ovr",
  connected_WA: "connected_WA",
  connected_CA: "connected_CA",
  connected_PA: "connected_PA",
  not_participating: "not_participating",
};

export interface StateData {
  name: string;
  abbreviation: string;
  ovr_type: string;
  ovr_locales: string[];
  not_participating_text?: string | null;
  online_registration_system_name?: string;
  online_registration_system_url?: string;
  online_status_check_url?: string;
  registration_deadline?: string | null;
  sos_address?: string;
  sos_phone?: string;
  sos_url?: string;
  more_info_url?: string;
  learn_about_url?: string;
  show_vr_check_button?: boolean;
  recent_register_date: string;
}

export type RegisterFormState = {
  partner_id: number;
  lang: string;

  // NAME
  name_title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;

  change_of_name: boolean;
  prev_name_title: string;
  prev_first_name: string;
  prev_middle_name: string;
  prev_last_name: string;
  prev_name_suffix: string;

  us_citizen: boolean;
  will_be_18_by_election: boolean;
  email_address: string;

  // ADDRESS
  home_address: string;
  address_line_2: string;
  home_unit_type: string;
  home_unit: string;
  home_city: string;
  state: string;
  home_zip_code: string;

  // different
  mailing_unit_type: string;
  mailing_unit_number: string;
  mailing_address: string;
  mailing_unit: string;
  mailing_city: string;
  mailing_state: string;
  mailing_zip_code: string;

  change_of_address: boolean;
  prev_address: string;
  prev_unit: string;
  prev_city: string;
  prev_state: string;
  prev_zip_code: string;
  prev_unit_number: string;
  prev_unit_type: string;

  street_name: string;
  street_number: string;
  street_type: string;
  street_direction: string;

  has_mailing_address: boolean;
  mailing_postal_code: string;
  mailingAddressType: string;
  mailing_po_box_number: string;
  mailing_box_group_type: string;
  mailing_box_group_number: string;
  mailing_box_number: string;
  mailing_apo: string;
  mailing_ap: string;
  mailing_address_line1: string;
  mailing_address_line2: string;
  mailing_address_line3: string;
  mailing_country: string;

  // ADDITIONAL
  race: string;
  party: string;
  home_county: string;
  signature_base64: string;

  // CONTACT
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  date_of_birth: string;
  pa_preregistration_age_window: boolean;
  phone: string;

  // ISSUE DATE
  issueMonth: string;
  issueDay: string;
  issueYear: string;

  // CONSENTS
  opt_in_sms: boolean;
  opt_in_email: boolean;
  volunteer: boolean;
  mailForm: boolean;
  survey_question_1: string;
  survey_answer_1: string;
  survey_question_2: string;
  survey_answer_2: string;

  // Personal
  full_name: string;
  state_id_number: string;
  eye_color: string;
  last_four_ss_number: string;
  has_no_state_license: boolean | null;
  has_no_ssn: boolean | null;
  helper_electronic_signature_acknowledged: boolean;

  someone_helped: boolean;
  helper_name: string;
  helper_address: string;
  helper_phone: string;

  // Eligibility
  residency_duration_ack: boolean;
  cancel_previous_registration_ack: boolean;
  use_stored_signature_ack: boolean;
  updated_dln_recently: "yes" | "no" | null;
  request_duplicate_dln_today: "yes" | "no" | null;
  age_eligibility: boolean;
};

export type RegisterFormStateError = {
  partner_id: string;
  lang: string;

  // NAME
  name_title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;

  change_of_name: string;
  prev_name_title: string;
  prev_first_name: string;
  prev_middle_name: string;
  prev_last_name: string;
  prev_name_suffix: string;
  us_citizen: string;
  will_be_18_by_election: string;
  email_address: string;

  // ADDRESS
  home_address: string;
  address_line_2: string;
  home_unit_type: string;
  home_unit: string;
  home_city: string;
  state: string;
  home_zip_code: string;

  // different
  mailing_unit_type: string;
  mailing_unit_number: string;
  mailing_address: string;
  mailing_unit: string;
  mailing_city: string;
  mailing_state: string;
  mailing_zip_code: string;

  change_of_address: string;
  prev_address: string;
  prev_unit: string;
  prev_city: string;
  prev_state: string;
  prev_zip_code: string;
  prev_unit_number: string;
  prev_unit_type: string;

  street_name: string;
  street_number: string;
  street_type: string;
  street_direction: string;

  has_mailing_address: string;
  mailing_postal_code: string;
  mailingAddressType: string;
  mailing_po_box_number: string;
  mailing_box_group_type: string;
  mailing_box_group_number: string;
  mailing_box_number: string;
  mailing_apo: string;
  mailing_ap: string;
  mailing_address_line1: string;
  mailing_address_line2: string;
  mailing_address_line3: string;
  mailing_country: string;

  // ADDITIONAL
  race: string;
  party: string;
  home_county: string;
  signature_base64: string;

  // CONTACT
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  date_of_birth: string;
  pa_preregistration_age_window: string;
  phone: string;

  // ISSUE DATE
  issueMonth: string;
  issueDay: string;
  issueYear: string;

  // CONSENTS
  opt_in_sms: string;
  opt_in_email: string;
  volunteer: string;
  mailForm: string;
  survey_question_1: string;
  survey_answer_1: string;
  survey_question_2: string;
  survey_answer_2: string;

  // Personal
  full_name: string;
  state_id_number: string;
  eye_color: string;
  last_four_ss_number: string;
  has_no_state_license: string;
  has_no_ssn: string;
  helper_electronic_signature_acknowledged: string;

  someone_helped: string;
  helper_name: string;
  helper_address: string;
  helper_phone: string;

  // Eligibility
  residency_duration_ack: string;
  cancel_previous_registration_ack: string;
  use_stored_signature_ack: string;
  updated_dln_recently: string;
  request_duplicate_dln_today: string;
  age_eligibility: string;
};

export type SubmitMICovrPayload = {
  email: string;
  partner_id: number;
  locale: string;
  confirm_us_citizen: boolean;
  confirm_will_be_18: boolean;
  is_30_day_resident: boolean;
  registration_cancellation_authorized: boolean;
  digital_signature_authorized: boolean;
  full_name: string;
  date_of_birth: string; // YYYY-MM-DD
  eye_color_code: string;
  dln: string;
  email_address: string;
  registration_address_number: string;
  registration_address_street_name: string;
  registration_address_street_type: string;
  registration_unit_number: string;
  registration_city: string;
  registration_zip_code: string;
  registration_county: string;
  has_mailing_address: boolean;
  opt_in_email: boolean;
  opt_in_sms: boolean;
  phone: string;
};

export type SubmitVoterStatusResponse = {
  status: {
    success: boolean;
    errors: string[] | null;
  };
  registrant_uid: string | null;
  voter: {
    uid: string | null;
    email: string;
    registration_status: boolean;
    registration_status_date: string | null;
    registration_date: string | null;
    pledge_status: boolean;
    pledge_data: string | null;
  } | null;
};

export type FormProps = {
  state: StateData;
  value: RegisterFormState;
  formCongif: DataCollectionConfiguration;
  errorMessages: RegisterFormStateError;
  onChange: (value: RegisterFormState) => void;
  onChangeError: (value: RegisterFormStateError) => void;
  handleMainButton?: ReactNode;
};

export type CheckRegistrationStatus = {
  partner_id: number;
  first_name: string;
  last_name: string;
  email: string;
  zip: string;
  state: string;
  address: string;
  city: string;
  phone: string;
  emailConsent: boolean;
  smsConsent: boolean;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  date_of_birth: string;
};
export type CheckRegistrationStatusError = {
  partner_id: string;
  first_name: string;
  last_name: string;
  state: string;
  address: string;
  city: string;
  phone: string;
  zip: string;
  email: string;
  emailConsent: string;
  smsConsent: string;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  date_of_birth: string;
};
export type CheckRegistrationStatusResponse = {
  status: { success: boolean; errors: string[] | null };
  found: boolean;
};

// zip

export interface UIConfig {
  display_locale_switcher: boolean;
  supported_locales: string[];
  powered_by_logo_url?: string;
  urls: {
    homepage: string;
    terms: string;
    privacy: string;
    shortcode: string;
    faq: string;
    contact: string;
    about: string;
  };
}

export interface SubmitEmailZipRequest {
  email: string;
  zip: string;
  locale: string;
  partner_id: string;
}

export type UserData = {
  first_name: string;
  last_name: string;
  email: string;
  locale: string;
};

export interface SubmitEmailZipResponse {
  status: { success: boolean; errors: string[] | null };
  state: StateData;
  user: UserData;
}

export interface SubmitEmailZipResponseProps {
  status: { success: boolean; errors: string[] | null };
  state?: StateData;
  zip: string;
  email: string;
  pageFromLookup?: string;
  workflowType?: string;
  showRedirectText?: boolean;
  form?: RegisterFormState;
}

export type MediaMainResponse = Record<string, unknown>;

export interface DataConfigurationRequest {
  partner_id: string;
  state_abbreviation: string;
  workflow_type: string;
  locale: string;
}

export interface FieldValidation {
  regexp?: string;
  enforce_e164?: boolean;
  min_length?: number;
  max_length?: number;
}

export interface FieldConfig {
  visible: boolean;
  value_required: boolean;
  label?: string;
  dependent?: boolean;
  dependent_field?: string;
  options?: string[];
  tooltip?: string;
  validations?: FieldValidation;
  checked?: boolean;
}

export interface DataCollectionConfiguration {
  fields: Record<string, FieldConfig>;
  validations: {
    po_box_allowed: boolean;
    min_age: number;
  };
}

export interface FetchDataCollectionConfigResponse {
  status: {
    success: boolean;
    errors: string[] | null;
  };
  configuration: DataCollectionConfiguration;
}

export interface PDFTokenRequest {
  workflow_type: string;
  finish_with_state: boolean;
  registrant: RegisterFormState;
}

export interface PDFTokenResponse {
  status: {
    success: boolean;
    errors: string[] | null;
  };
  pdf_token: string;
}

export interface PDFDocRequest {
  pdf_token: string;
}

export interface PDFDocResponse {
  status: {
    success: boolean;
    errors: string[] | null;
  };
  pdf_ready: boolean;
  download_url: string;
}

export interface DataSurveyQuestionsRequest {
  partner_id: string;
  locale: string;
}

export interface FetchDataSurveyQuestionsResponse {
  status: {
    success: boolean;
    errors: string[] | null;
  };
  survey_question_1: string;
  survey_question_2: string;
}

export type CovrStatus = "pending" | "success" | "failure" | null;

export type VoterStatusData = {
  registrant_uid: string | null;
};

export type VoterStatusResponse = {
  status: CovrStatus;
  voter_status_id: string | null;
  response_outcome: string | null;
};
