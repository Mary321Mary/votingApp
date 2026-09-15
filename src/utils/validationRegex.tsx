/** Matches fetch_data_collection_configuration validations.regexp `[\d]{5}` for zip_code fields. */
export const ZIP_CODE_REGEX = /^[\d]{5}$/;

/** Canonical email format from /register (Home) data entry. */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** US phone digit bounds (optional fields still reject partial numbers). */
export const PHONE_MIN_DIGITS = 10;
export const PHONE_MAX_DIGITS = 10;

/** True when the value has exactly PHONE_MIN_DIGITS digits (punctuation ignored). */
export function isValidPhoneNumber(phone: string): boolean {
  const digitCount = phone.replace(/\D/g, "").length;
  return digitCount >= PHONE_MIN_DIGITS && digitCount <= PHONE_MAX_DIGITS;
}
