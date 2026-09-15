import { DataCollectionConfiguration } from "utils/types";

/**
 * Date validation utilities for DateOfBirth component
 * Can be imported and used in form validation logic
 */

export interface DateValidationResult {
  isValid: boolean;
  errorField?: "birthYear" | "birthDay" | "birthMonth";
  errorMessage?: string;
}

export interface DateValidationContext {
  formConfigMinAge?: number;
  referenceDate?: Date;
}

/**
 * Result of processing date of birth validation for form integration
 */
export interface DateValidationProcessingResult {
  errors: {
    birthYear?: string;
    birthMonth?: string;
    birthDay?: string;
  };
  formUpdates: {
    date_of_birth?: string;
    dob_routing_outcome?:
      | "eligible"
      | "under_18_election_day_ok"
      | "pre_registration_notice";
  };
}

interface ParsedBirthDate {
  year: number;
  month: number;
  day: number;
  date: Date;
}

function parseBirthDateComponents(
  birthYear: string,
  birthMonth: string,
  birthDay: string,
): ParsedBirthDate | null {
  if (!birthYear.trim() || !birthMonth.trim() || !birthDay.trim()) {
    return null;
  }

  const year = Number(birthYear);
  const month = Number(birthMonth) - 1;
  const day = Number(birthDay);
  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day)
  ) {
    return null;
  }

  const date = new Date(year, month, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return { year, month, day, date };
}

function getReferenceToday(referenceDate: Date = new Date()): Date {
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Calculate exact age of user (with consideration of fractional years for Oklahoma 17.5)
 */
function calculateExactAge(parsed: ParsedBirthDate, today: Date): number {
  const monthIndex = parsed.month;
  let age = today.getFullYear() - parsed.year;
  const monthDiff = today.getMonth() - monthIndex;
  const dayDiff = today.getDate() - parsed.day;

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  const lastBirthday = new Date(parsed.year + age, monthIndex, parsed.day);
  const nextBirthday = new Date(parsed.year + age + 1, monthIndex, parsed.day);

  const msInYear = nextBirthday.getTime() - lastBirthday.getTime();
  const msPassedSinceBirthday = today.getTime() - lastBirthday.getTime();

  const exactAge = age + msPassedSinceBirthday / msInYear;
  return Math.round(exactAge * 10000) / 10000;
}

/**
 * Check age "age minus N days bugger" for election
 */
function hasReachedAgeWithBuffer(
  parsed: ParsedBirthDate,
  baseAge: number,
  bufferDays: number,
  today: Date,
): boolean {
  const thresholdDate = new Date(today);
  thresholdDate.setFullYear(thresholdDate.getFullYear() - Math.floor(baseAge));
  thresholdDate.setDate(thresholdDate.getDate() + bufferDays);
  return parsed.date <= thresholdDate;
}

export function normalizeStateAbbreviation(abbreviation?: string): string {
  return (abbreviation ?? "").trim().toUpperCase();
}

/**
 * Process date of birth validation with full form integration
 * Handles PA connected OVR special logic and general age validation
 * Returns errors to set in errorMessage and updates for form state
 *
 * Used by validate(), validateConnectedOvr(), validateWA()
 */
export function processDateOfBirthValidation(
  birthYear = "",
  birthMonth = "",
  birthDay = "",
  formConfig: DataCollectionConfiguration,
  isRequired: boolean = true,
): DateValidationProcessingResult {
  const result: DateValidationProcessingResult = {
    errors: {},
    formUpdates: {},
  };

  // Check if fields are required but not filled
  if (isRequired) {
    if (!birthMonth.trim()) {
      result.errors.birthMonth = "general.required";
    }
    if (!birthDay.trim()) {
      result.errors.birthDay = "general.required";
    }
    if (!birthYear.trim()) {
      result.errors.birthYear = "general.required";
    }

    if (
      result.errors.birthMonth ||
      result.errors.birthDay ||
      result.errors.birthYear
    ) {
      return result;
    }
  }

  // Early return if not all fields filled (but not required)
  if (!birthYear.trim() || !birthMonth.trim() || !birthDay.trim()) {
    return result;
  }

  // Check year >= 1900
  if (Number(birthYear) < 1900) {
    result.errors.birthYear = "form_fields.invalid_year";
    return result;
  }

  const parsed = parseBirthDateComponents(birthYear, birthMonth, birthDay);
  if (!parsed) {
    result.errors.birthDay = "form_fields.invalid_birth_date";
    return result;
  }

  const today = getReferenceToday();

  // Check if date is in the future
  if (parsed.date > today) {
    result.errors.birthYear = "form_fields.invalid_year_future";
    return result;
  }

  // Take config parameters (Item A)
  const eligibility = formConfig.eligibility || {};

  const minVrAge = eligibility.min_vr_age ?? 18;
  const allowsPreReg = eligibility.allows_pre_reg ?? false;
  let minPreRegAge = eligibility.min_pre_reg_age ?? 18;
  const bufferDays = eligibility.min_age_election_day_buffer_days ?? 0;

  // Calculate age
  const userAge = calculateExactAge(parsed, today);
  const ageErrorKey = "form_fields.age_eligibility_error";

  // -------------------------------------------------------------
  // ITEM B (4 Result Validation DOB)
  // -------------------------------------------------------------

  // Outcome 1: DOB valid b/c age >= min_vr_age
  if (userAge >= minVrAge) {
    result.formUpdates.date_of_birth = `${birthYear}-${birthMonth}-${birthDay}`;
    result.formUpdates.dob_routing_outcome = "eligible";
    return result;
  }

  // Outcome 2: DOB valid b/c allows_pre_reg is true AND age >= min_pre_reg_age
  if (allowsPreReg && userAge >= minPreRegAge) {
    result.formUpdates.date_of_birth = `${birthYear}-${birthMonth}-${birthDay}`;
    result.formUpdates.dob_routing_outcome = "pre_registration_notice";
    return result;
  }

  // Outcome 3: DOB valid b/c allows_pre_reg is false AND age > (min_vr_age - min_age_election_day_buffer_days)
  if (!allowsPreReg) {
    const hasReachedBuffer = hasReachedAgeWithBuffer(
      parsed,
      minVrAge,
      bufferDays,
      today,
    );
    if (hasReachedBuffer) {
      result.formUpdates.date_of_birth = `${birthYear}-${birthMonth}-${birthDay}`;
      result.formUpdates.dob_routing_outcome = "under_18_election_day_ok";
      return result;
    }
  }

  // Outcome 4: None of the above is true -> Invalid DOB
  result.errors.birthMonth = ageErrorKey;
  return result;
}
