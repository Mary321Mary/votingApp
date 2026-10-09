import { LatLng } from "./types";

/** True when a field has real content (API sometimes returns "," alone). */
export const hasMeaningfulAddressPart = (value?: string | null) => {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 && !/^,+$/.test(trimmed);
};

/** True when map_center has usable coordinates (API may return `{}`). */
export const hasValidMapCenter = (
  center?: LatLng | Record<string, unknown> | null,
): center is LatLng =>
  typeof center?.lat === "number" &&
  typeof center?.lng === "number" &&
  Number.isFinite(center.lat) &&
  Number.isFinite(center.lng);

export const formatCityStateZip = (
  city?: string | null,
  state?: string | null,
  zip?: string | null,
) => {
  const cityState = [city, state]
    .map(part => part?.trim() ?? "")
    .filter(hasMeaningfulAddressPart)
    .join(", ");
  const zipPart = hasMeaningfulAddressPart(zip) ? zip?.trim() ?? "" : "";
  return [cityState, zipPart].filter(Boolean).join(" ");
};
