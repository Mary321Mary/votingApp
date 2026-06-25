import {
  CheckRegistrationStatus,
  OVR_TYPE_MAP,
  RegisterFormState,
} from "./types";

export function buildPAHomeAddressFromForm(form: RegisterFormState): string {
  const line2 = form.address_line_2?.trim();
  if (line2) {
    return `${form.home_address} ${line2}`.trim();
  }
  return form.home_address;
}

export function buildPAMailingAddressFromForm(form: RegisterFormState): string {
  const parts = [
    form.mailing_address?.trim(),
    form.mailing_unit_type?.trim() && form.mailing_unit_number?.trim()
      ? `${form.mailing_unit_type} ${form.mailing_unit_number}`
      : form.mailing_unit_number?.trim(),
  ].filter(Boolean);
  return parts.join(" ").trim();
}

/**
 * Maps ovr_type from submit_email_zip to the UI flow identifier.
 * Centralize routing changes here (e.g. new state integrations).
 */
export function getFlowType(ovrType: string): string {
  return OVR_TYPE_MAP[ovrType] ?? "paper";
}

/** Resolves the workflow_type used for data-collection config fetches. */
export function resolveWorkflowType(
  explicitWorkflowType: string | undefined,
): string {
  return explicitWorkflowType !== undefined ? explicitWorkflowType : "ovr";
}

export function mapRegisterFormToVrLookupPayload(
  form: RegisterFormState,
  stateAbbreviation: string,
): CheckRegistrationStatus {
  return {
    partner_id: form.partner_id,
    first_name: form.first_name,
    last_name: form.last_name,
    email: form.email_address,
    zip: form.home_zip_code,
    address: form.home_address,
    city: form.home_city,
    state: form.state || stateAbbreviation,
    phone: form.phone,
    emailConsent: form.opt_in_email,
    smsConsent: form.opt_in_sms,
    volunteer: form.volunteer,
    birthMonth: form.birthMonth,
    birthDay: form.birthDay,
    birthYear: form.birthYear,
    date_of_birth: form.birthYear + "-" + form.birthMonth + "-" + form.birthDay,
    survey_question_1: form.survey_question_1,
    survey_answer_1: form.survey_answer_1,
    survey_question_2: form.survey_question_2,
    survey_answer_2: form.survey_answer_2,
  };
}
