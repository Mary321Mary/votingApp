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
    pa_preregistration_age_window?: boolean;
  };
}

/**
 * Validates a date of birth for Pennsylvania connected OVR:
 * - minimum 17 years + 180 days
 * - determines if registrant is in preregistration window (before 18th birthday)
 */
export function evaluatePaConnectedRegistrationDateOfBirth(
  birthYear: string,
  birthMonth: string,
  birthDay: string,
  referenceDate: Date = new Date(),
): {
  outcome: "defer" | "too_young" | "eligible";
  errorMessageKey?: string;
  preregistrationAgeWindow?: boolean;
} {
  if (!birthYear.trim() || !birthMonth.trim() || !birthDay.trim()) {
    return { outcome: "defer" };
  }

  const year = Number(birthYear);
  const month = Number(birthMonth) - 1;
  const day = Number(birthDay);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return { outcome: "defer" };
  }

  const birth = new Date(year, month, day);
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  if (birth > today) {
    return { outcome: "defer" };
  }

  const invalidCalendar =
    birth.getFullYear() !== year || birth.getMonth() !== month || birth.getDate() !== day;
  if (invalidCalendar) {
    return { outcome: "defer" };
  }

  const minAgeThresholdDate = new Date(today);
  minAgeThresholdDate.setFullYear(minAgeThresholdDate.getFullYear() - 17);
  minAgeThresholdDate.setDate(minAgeThresholdDate.getDate() - 180);

  if (birth > minAgeThresholdDate) {
    return {
      outcome: "too_young",
      errorMessageKey: "form_fields.age_eligibility_error",
    };
  }

  const eighteenthBirthday = new Date(year, month, day);
  eighteenthBirthday.setFullYear(eighteenthBirthday.getFullYear() + 18);
  const preregistrationAgeWindow = today < eighteenthBirthday;

  return { outcome: "eligible", preregistrationAgeWindow };
}

/**
 * Process date of birth validation with full form integration
 * Handles PA connected OVR special logic and general age validation
 * Returns errors to set in errorMessage and updates for form state
 *
 * Used by validate(), validateConnectedOvr(), validateWA()
 */
export function processDateOfBirthValidation(
  birthYear: string,
  birthMonth: string,
  birthDay: string,
  formConfig: DataCollectionConfiguration,
  isRequired: boolean = true,
  usePaConnectedRules: boolean = false,
): DateValidationProcessingResult {
  const result: DateValidationProcessingResult = {
    errors: {},
    formUpdates: {},
  };

  // Check if fields are required but not filled
  if ((!birthMonth.trim() || !birthDay.trim() || !birthYear.trim()) && isRequired) {
    result.errors.birthDay = "general.required";
    return result;
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

  const year = Number(birthYear);
  const month = Number(birthMonth) - 1;
  const day = Number(birthDay);
  const date = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if date is in the future
  if (date > today) {
    result.errors.birthYear = "form_fields.invalid_year_future";
    return result;
  }

  // Check if date is valid calendar date
  const isInvalidDate =
    date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day;

  if (isInvalidDate) {
    result.errors.birthDay = "form_fields.invalid_birth_date";
    return result;
  }

  if (usePaConnectedRules) {
    // Evaluate PA connected OVR special logic only when requested
    const paDob = evaluatePaConnectedRegistrationDateOfBirth(
      birthYear,
      birthMonth,
      birthDay,
      today,
    );

    if (paDob.outcome === "too_young") {
      // "You must be 18..."
      result.errors.birthMonth = paDob.errorMessageKey;
      result.formUpdates.pa_preregistration_age_window = false;
      return result;
    }

    if (paDob.outcome === "eligible") {
      // >= 18 (preregistrationAgeWindow: false),
      // And from 17.5 to 18 (preregistrationAgeWindow: true)
      // No Error
      result.formUpdates.date_of_birth = `${birthYear}-${birthMonth}-${birthDay}`;
      result.formUpdates.pa_preregistration_age_window = paDob.preregistrationAgeWindow;
      return result;
    }
  }

  // Default case: check general age requirement from formConfig
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  const dayDiff = today.getDate() - date.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  if (age < formConfig.validations.min_age) {
    result.errors.birthMonth = "form_fields.age_eligibility_error";
    return result;
  }

  // Valid date, set form data
  result.formUpdates.date_of_birth = `${birthYear}-${birthMonth}-${birthDay}`;
  return result;
}
