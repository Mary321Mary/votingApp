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

export const OVR_TYPE_MAP: Record<string, string> = {
  paper_only: "paper",
  paper_or_finish_with_state: "ovr_state",
  connected_MI: "connected_ovr",
  not_participating: "not_participating",
};

export interface StateData {
  name: string;
  abbreviation: string;
  ovr_type: string;
  ovr_locales?: string[];
  not_participating_text?: string | null;
  online_registration_system_name?: string;
  online_registration_system_url?: string;
  online_status_check_url?: string;
  registration_deadline?: string | null;
  sos_address?: string;
  sos_phone?: string;
  sos_url?: string;
}

export type RegisterFormState = {
  // NAME
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  changedTitle: string;
  changedFirstName: string;
  changedMiddleName: string;
  changedLastName: string;
  changedSuffix: string;
  isCitizen: boolean;
  isAdult: boolean;

  // ADDRESS
  address: string;
  unit: string;
  city: string;
  state: string;
  zip: string;
  differentAddress: string;
  differentUnit: string;
  differentCity: string;
  differentState: string;
  differentZip: string;
  changedAddress: string;
  changedUnit: string;
  changedCity: string;
  changedState: string;
  changedZip: string;
  hasStateId: boolean | null;

  email: string;
  streetName: string;
  streetNumber: string;
  streetType: string;
  streetDirection: string;

  mailingStreetName: string;
  mailingStreetNumber: string;
  mailingStreetType: string;
  mailingUnit: string;
  mailingCity: string;
  mailingState: string;
  mailingZip: string;
  mailingAddressType: string;

  poNumber: string;
  poCity: string;
  poState: string;
  poZip: string;

  militaryType: string;
  militaryGroupNumber: string;
  militaryNumber: string;
  militaryPostOffice: string;
  militaryPostState: string;
  militaryZip: string;

  internationalAddress1: string;
  internationalAddress2: string;
  internationalAddress3: string;
  internationalCountry: string;
  internationalZip: string;

  // ID
  idNumber: string;

  // ADDITIONAL
  race: string;
  party: string;

  // CONTACT
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  phone: string;
  phoneType: string;

  // CONSENTS
  smsConsent: boolean;
  emailConsent: boolean;
  volunteer: boolean;
  mailForm: boolean;

  // Personal
  fullName: string;
  licenseNumber: string;
  eyeColor: string;
  ssnLast4: string;

  // Eligibility
  residency: boolean;
  cancelPrevious: boolean;
  digitalSignature: boolean;
  licenseUpdated: "yes" | "no" | null;
  duplicateLicense: "yes" | "no" | null;
};

export type RegisterFormStateError = {
  // NAME
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  changedTitle: string;
  changedFirstName: string;
  changedMiddleName: string;
  changedLastName: string;
  changedSuffix: string;
  isCitizen: string;
  isAdult: string;
  email: string;

  // ADDRESS
  address: string;
  unit: string;
  city: string;
  state: string;
  zip: string;
  differentAddress: string;
  differentUnit: string;
  differentCity: string;
  differentState: string;
  differentZip: string;
  changedAddress: string;
  changedUnit: string;
  changedCity: string;
  changedState: string;
  changedZip: string;
  hasStateId: string;
  streetName: string;
  streetNumber: string;
  streetType: string;
  streetDirection: string;
  mailingStreetName: string;
  mailingStreetNumber: string;
  mailingStreetType: string;
  mailingUnit: string;
  mailingCity: string;
  mailingState: string;
  mailingZip: string;
  mailingAddressType: string;

  poNumber: string;
  poCity: string;
  poState: string;
  poZip: string;

  militaryType: string;
  militaryGroupNumber: string;
  militaryNumber: string;
  militaryPostOffice: string;
  militaryPostState: string;
  militaryZip: string;

  internationalAddress1: string;
  internationalAddress2: string;
  internationalAddress3: string;
  internationalCountry: string;
  internationalZip: string;

  // ID
  idNumber: string;

  // ADDITIONAL
  race: string;
  party: string;

  // CONTACT
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  phone: string;
  phoneType: string;

  // CONSENTS
  smsConsent: string;
  emailConsent: string;
  volunteer: string;
  mailForm: string;

  // Personal
  fullName: string;
  licenseNumber: string;
  eyeColor: string;
  ssnLast4: string;

  // Eligibility
  residency: string;
  cancelPrevious: string;
  digitalSignature: string;
  licenseUpdated: string;
  duplicateLicense: string;
  isAdultBlock: string;
};

export type FormProps = {
  state: StateData;
  value: RegisterFormState;
  errorMessages: RegisterFormStateError;
  onChange: (value: RegisterFormState) => void;
  onChangeError: (value: RegisterFormStateError) => void;
};

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

// zip

export interface UIConfig {
  display_locale_switcher: string;
  supported_locales: string[];
  urls: {
    homepage: string;
    terms: string;
    privacy: string;
    shortcode: string;
  };
}

export interface SubmitEmailZipRequest {
  email: string;
  zip: string;
  locale: string;
}

export interface SubmitEmailZipResponse {
  status: { success: boolean; errors: string[] | null };
  state?: StateData;
  user?: Record<string, unknown>;
}

export interface SubmitEmailZipResponseProps extends SubmitEmailZipResponse {
  zip: string;
  email: string;
}
