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
 * Вычисляет точный возраст пользователя (с учетом дробных долей для Оклахомы 17.5)
 */
function calculateExactAge(parsed: ParsedBirthDate, today: Date): number {
  let age = today.getFullYear() - parsed.year;
  const monthDiff = today.getMonth() - parsed.month;
  const dayDiff = today.getDate() - parsed.day;

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  const lastBirthday = new Date(parsed.year + age, parsed.month, parsed.day);
  const nextBirthday = new Date(
    parsed.year + age + 1,
    parsed.month,
    parsed.day,
  );

  const msInYear = nextBirthday.getTime() - lastBirthday.getTime();
  const msPassedSinceBirthday = today.getTime() - lastBirthday.getTime();

  return age + msPassedSinceBirthday / msInYear;
}

/**
 * Проверяет порог "возраст минус N дней буфера" для выборов
 */
function hasReachedAgeWithBuffer(
  parsed: ParsedBirthDate,
  baseAge: number,
  bufferDays: number,
  today: Date,
): boolean {
  const thresholdDate = new Date(today);
  thresholdDate.setFullYear(thresholdDate.getFullYear() - baseAge);
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
  birthYear: string,
  birthMonth: string,
  birthDay: string,
  formConfig: DataCollectionConfiguration,
  isRequired: boolean = true,
  isFinishWithStateWorkflow: boolean = false,
): DateValidationProcessingResult {
  const result: DateValidationProcessingResult = {
    errors: {},
    formUpdates: {},
  };

  // Check if fields are required but not filled
  if (
    (!birthMonth.trim() || !birthDay.trim() || !birthYear.trim()) &&
    isRequired
  ) {
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

  // Загружаем настройки группы "eligibility"
  const eligibility = formConfig?.eligibility || {
    min_pre_reg_age: 18,
    min_vr_age: 18,
    min_age_election_day_buffer_days: 180,
    before_vr_deadline: true,
  };

  let minPreRegAge = eligibility.min_pre_reg_age ?? 18;
  const minVrAge = eligibility.min_vr_age ?? 18;
  const bufferDays = eligibility.min_age_election_day_buffer_days ?? 180;

  // Угловой кейс: ошибка конфигурации
  if (minVrAge < minPreRegAge) {
    console.error(
      "Internal Configuration Error: min_vr_age is less than min_pre_reg_age.",
    );
    minPreRegAge = minVrAge;
  }

  const userAge = calculateExactAge(parsed, today);
  const ageErrorKey = "form_fields.age_eligibility_error";

  // -------------------------------------------------------------
  // ДЛЯ ВОРКФЛОУ FINISH WITH STATE (ВТОРАЯ ЗАДАЧА)
  // -------------------------------------------------------------
  if (isFinishWithStateWorkflow) {
    if (userAge < minPreRegAge) {
      result.errors.birthMonth = ageErrorKey;
    } else {
      result.formUpdates.date_of_birth = `${birthYear}-${birthMonth}-${birthDay}`;
    }
    return result;
  }

  // -------------------------------------------------------------
  // ДЛЯ ВОРКФЛОУ СТАНДАРТНОЙ NVRA ФОРМЫ (ПЕРВАЯ ЗАДАЧА)
  // -------------------------------------------------------------
  const isPreRegState = minVrAge > minPreRegAge;

  if (!isPreRegState) {
    // Штаты БЕЗ предрегистрации
    if (userAge >= minVrAge) {
      result.formUpdates.date_of_birth = `${birthYear}-${birthMonth}-${birthDay}`;
      result.formUpdates.dob_routing_outcome = "eligible";
      return result;
    }

    const hasReachedBuffer = hasReachedAgeWithBuffer(
      parsed,
      minVrAge,
      bufferDays,
      today,
    );
    if (!hasReachedBuffer) {
      result.errors.birthMonth = ageErrorKey;
      return result;
    } else {
      result.formUpdates.date_of_birth = `${birthYear}-${birthMonth}-${birthDay}`;
      result.formUpdates.dob_routing_outcome = "under_18_election_day_ok";
      return result;
    }
  } else {
    // Штаты С предрегистрацией
    if (userAge >= minVrAge) {
      result.formUpdates.date_of_birth = `${birthYear}-${birthMonth}-${birthDay}`;
      result.formUpdates.dob_routing_outcome = "eligible";
      return result;
    }

    if (userAge < minPreRegAge) {
      result.errors.birthMonth = ageErrorKey;
      return result;
    }

    if (userAge >= minPreRegAge && userAge < minVrAge) {
      result.formUpdates.date_of_birth = `${birthYear}-${birthMonth}-${birthDay}`;
      result.formUpdates.dob_routing_outcome = "pre_registration_notice";
      return result;
    }
  }

  // Valid date, set form data
  result.formUpdates.date_of_birth = `${birthYear}-${birthMonth}-${birthDay}`;
  return result;
}
