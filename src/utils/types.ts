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

// -----

export interface ReportEventPayload {
  registration_uid: string;
  partner_id: string;
  step: number;
  event_name:
    | "nvra_pre_reg"
    | "nvra_under_18"
    | "nvra_email_quest"
    | "nvra_print_request";
}

export type ReportInternalData = {
  message: string;
  registration_uid: string;
  voter_uid: string;
  partner_id: string;
  workflow_type: string;
  severity: string;
  context: {};
};

export type ReportInternalResponse = {
  status: {
    success: boolean;
    errors: string[];
  };
  recorded: boolean;
};

// ---------------------------------------------------

export const OVR_TYPE_MAP: Record<string, string> = {
  paper: "paper",
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
  before_vr_deadline?: boolean;
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
  mailing_address_number: string;
  mailing_address_street_name: string;
  mailing_address_street_type: string;
  mailing_address_type: string;
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
  changed_party: boolean;
  home_county: string;
  signature_base64: string;
  signature_upload_method: "" | "local" | "device";

  // CONTACT
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  date_of_birth: string;
  dob_routing_outcome: string;
  phone: string;

  // ISSUE DATE
  issueMonth: string;
  issueDay: string;
  issueYear: string;
  date_of_issue: string;
  military_service: boolean;
  non_standard_address: string;

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

  upload: string;
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
  mailing_address_number: string;
  mailing_address_street_name: string;
  mailing_address_street_type: string;
  mailing_address_type: string;
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
  changed_party: string;
  home_county: string;
  signature_base64: string;
  signature_upload_method: string;

  // CONTACT
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  date_of_birth: string;
  dob_routing_outcome: string;
  phone: string;

  // ISSUE DATE
  issueMonth: string;
  issueDay: string;
  issueYear: string;
  date_of_issue: string;
  military_service: string;
  non_standard_address: string;

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

  upload: string;
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
  confirm_affirm_privacy_notice: boolean;
  updated_dln_recently: boolean;
  requested_duplicate_dln_today: boolean;
  full_name: string;
  date_of_birth: string; // YYYY-MM-DD
  eye_color_code: string;
  dln: string;
  ssn4: string;
  email_address: string;
  registration_address_number: string;
  registration_address_street_name: string;
  registration_address_street_type: string;
  registration_unit_number: string;
  registration_city: string;
  registration_zip_code: string;
  registration_county: string;
  opt_in_email: boolean;
  opt_in_sms: boolean;
  phone: string;

  has_mailing_address: boolean;
  mailing_postal_code: string;
  mailing_address_number: string;
  mailing_address_street_name: string;
  mailing_address_street_type: string;
  mailing_address_type: string;
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
  mailing_unit: string;
  mailing_city: string;
  mailing_state: string;
  mailing_zip_code: string;
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
  volunteer: boolean;

  birthMonth: string;
  birthDay: string;
  birthYear: string;
  date_of_birth: string;

  survey_question_1: string;
  survey_answer_1: string;
  survey_question_2: string;
  survey_answer_2: string;
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
  volunteer: string;

  birthMonth: string;
  birthDay: string;
  birthYear: string;
  date_of_birth: string;

  survey_question_1: string;
  survey_answer_1: string;
  survey_question_2: string;
  survey_answer_2: string;
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
  uid: string;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  aptunit: string | null;
  city: string;
  zip: string;
  date_of_birth: string;
  phone: string;
  survey_question_1: string | null;
  survey_answer_1: string | null;
  survey_question_2: string | null;
  survey_answer_2: string | null;
  opt_in_email: boolean | null;
  opt_in_sms: boolean | null;
  partner_opt_in_email: boolean | null;
  partner_opt_in_sms: boolean | null;
  opt_in_volunteer: boolean | null;
  partner_opt_in_volunteer: boolean | null;
  registration_status: boolean;
  registration_status_date: string;
  registration_date: string;
  pledge_status: boolean;
  pledge_date: string | null;
};

export interface SubmitEmailZipResponse {
  status: { success: boolean; errors: string[] | null };
  state: StateData;
  voter: UserData;
  registration_uid?: string;
  counties?: string[];
}

export interface SubmitEmailZipResponseProps {
  status: { success: boolean; errors: string[] | null };
  registration_uid?: string;
  state?: StateData;
  zip: string;
  email: string;
  pageFromLookup?: string;
  workflowType?: string;
  showRedirectText?: boolean;
  form?: RegisterFormState;
  initialStep?: 1 | 2 | 3;
}

export interface SetUnder18ReminderRequest {
  registration_uid: string;
  remind_when_18?: boolean;
  opt_in_email?: boolean;
}

export interface SetUnder18ReminderResponse {
  status: { success: boolean; errors: string[] | null };
  registration_uid: string;
  registrant_status: string;
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
  eligibility: {
    min_pre_reg_age: number;
    min_vr_age: number;
    min_age_election_day_buffer_days: number;
    before_vr_deadline: boolean;
  };
}

export interface FetchDataCollectionConfigResponse {
  status: {
    success: boolean;
    errors: string[] | null;
  };
  configuration: DataCollectionConfiguration;
}

export interface SubmitFinishedWithStatData {
  workflow_type: string;
  registrant: Partial<RegisterFormState>;
}

export interface SubmitFonoshedWithStateResponce {
  status: {
    success: boolean;
    errors: string[];
  };
  registration_uid: string;
  voter: UserData;
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

export type SubmitVoterDeviceStatusResponse = SubmitVoterStatusResponse & {
  continue_url: string;
};

export type SubmitVoterCAResponse = SubmitVoterStatusResponse & {
  covr_success: boolean;
  redirect_url: string;
  disclosures: string[];
  disclosures_prechecked: boolean;
};

export type VoterDeviceSMSData = {
  registrant_uid: string;
  phone: string;
};

export type VoterDeviceEmailData = {
  registrant_uid: string;
  email: string;
};

export type VoterDeviceResponse = {
  status: {
    success: boolean;
    errors: string[];
  };
  sent: boolean;
};

export type SubmitPACovrPayload = {
  partner_id: number;
  locale: string;
  email: string;
  name_title: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  date_of_birth: string;
  confirm_us_citizen: boolean;
  confirm_will_be_18: boolean;
  registration_address_1: string;
  registration_city: string;
  registration_zip_code: string;
  registration_county: string;
  phone: string;
  phone_type: string;
  party: string;
  penndot_number: string;
  confirm_no_penndot_number: boolean;
  confirm_no_dl_or_ssn: boolean;
  ssn4?: string;
  signature?: string;
  has_mailing_address: boolean;
  mailing_address_1?: string;
  mailing_city?: string;
  mailing_state?: string;
  mailing_zip_code?: string;
  change_of_name: boolean;
  change_of_address: boolean;
  has_assistant: boolean;
  helper_name?: string;
  helper_address?: string;
  helper_phone?: string;
  opt_in_email: boolean;
  opt_in_sms: boolean;
  confirm_declaration: boolean;
};

export type SubmitWACovrPayload = RegisterFormState & {
  locale: string;
  email: string;
  is_citizen: boolean;
  confirm_will_be_18: boolean | null;
  residence_address: string;
  residence_city: string;
  residence_zip: string;
  res_county_code: string;
  phone_type: string;
  driver_license: string;
  ssn4: string;
  issue_date: string;
  confirm_no_dln: boolean | null;
  has_assistant: boolean;
};

export type SubmitCACovrPayload = RegisterFormState & {
  locale: string;
  email: string;
};

export type PACovrCheckResponse = {
  status: "pending" | "success" | "failure";
  transaction_id: string | null;
  submission_error: string[];
};

export type WACovrCheckResponse = {
  status: "pending" | "success" | "failure";
  transaction_id: string | null;
  submission_error: string[];
};
