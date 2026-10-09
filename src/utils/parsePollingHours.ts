/**
 * Normalize Civic / HTML hours blobs into plain text with `\n` delimiters.
 */
const normalizeHoursText = (hours: string): string =>
  hours
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"');

/** Strip a leading "Hours: " label from placeHours strings. */
export const stripHoursPrefix = (hours: string): string =>
  hours.replace(/^\uFEFF?\s*Hours\s*:\s*/i, "");

/** Split an already-normalized hours block on newlines. */
const splitHoursItems = (normalized: string): string[] | null => {
  if (!/\n/.test(normalized)) return null;

  const items = normalized
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);

  return items.length > 0 ? items : null;
};

/**
 * Best-effort parse of a hours block as a newline-delimited sequence of items.
 * Returns null when there are no newline delimiters (or nothing usable) so the
 * caller can fall back to showing the original string as-is.
 */
export const parsePollingHours = (hours: string): string[] | null => {
  if (!hours?.trim()) return null;
  return splitHoursItems(normalizeHoursText(hours));
};

export type ResolvedLocationHours =
  | { type: "items"; items: string[] }
  | { type: "raw"; text: string };

/**
 * Prefer pollingHours; if missing/empty (or only a bare "Hours:" label),
 * fall back to placeHours. Leading "Hours: " is stripped — LocationHours
 * renders its own i18n label.
 */
export const resolveLocationHours = (
  pollingHours?: string | null,
  placeHours?: string | null,
): ResolvedLocationHours | null => {
  const sources = [pollingHours, placeHours]
    .map(value => value?.trim())
    .filter((value): value is string => Boolean(value));

  for (const source of sources) {
    // Normalize once, then strip — avoid re-normalizing in parsePollingHours.
    const text = stripHoursPrefix(normalizeHoursText(source)).trim();
    if (!text) continue;

    const items = splitHoursItems(text);
    if (items) {
      return { type: "items", items };
    }
    return { type: "raw", text };
  }

  return null;
};
