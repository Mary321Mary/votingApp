import { DataCollectionConfiguration } from "./types";

export const STATES = [
  { name: "", value: "" },
  { name: "Alabama", value: "AL" },
  { name: "Alaska", value: "AK" },
  { name: "Arizona", value: "AZ" },
  { name: "Arkansas", value: "AR" },
  { name: "California", value: "CA" },
  { name: "Colorado", value: "CO" },
  { name: "Connecticut", value: "CT" },
  { name: "Delaware", value: "DE" },
  { name: "District of Columbia", value: "DC" },
  { name: "Florida", value: "FL" },
  { name: "Georgia", value: "GA" },
  { name: "Hawaii", value: "HI" },
  { name: "Idaho", value: "ID" },
  { name: "Illinois", value: "IL" },
  { name: "Indiana", value: "IN" },
  { name: "Iowa", value: "IA" },
  { name: "Kansas", value: "KS" },
  { name: "Kentucky", value: "KY" },
  { name: "Louisiana", value: "LA" },
  { name: "Maine", value: "ME" },
  { name: "Maryland", value: "MD" },
  { name: "Massachusetts", value: "MA" },
  { name: "Michigan", value: "MI" },
  { name: "Minnesota", value: "MN" },
  { name: "Mississippi", value: "MS" },
  { name: "Missouri", value: "MO" },
  { name: "Montana", value: "MT" },
  { name: "Nebraska", value: "NE" },
  { name: "Nevada", value: "NV" },
  { name: "New Hampshire", value: "NH" },
  { name: "New Jersey", value: "NJ" },
  { name: "New Mexico", value: "NM" },
  { name: "New York", value: "NY" },
  { name: "North Carolina", value: "NC" },
  { name: "North Dakota", value: "ND" },
  { name: "Ohio", value: "OH" },
  { name: "Oklahoma", value: "OK" },
  { name: "Oregon", value: "OR" },
  { name: "Pennsylvania", value: "PA" },
  { name: "Rhode Island", value: "RI" },
  { name: "South Carolina", value: "SC" },
  { name: "South Dakota", value: "SD" },
  { name: "Tennessee", value: "TN" },
  { name: "Texas", value: "TX" },
  { name: "Utah", value: "UT" },
  { name: "Vermont", value: "VT" },
  { name: "Virginia", value: "VA" },
  { name: "Washington", value: "WA" },
  { name: "West Virginia", value: "WV" },
  { name: "Wisconsin", value: "WI" },
  { name: "Wyoming", value: "WY" },
];

export const DIRECTIONS = [
  { name: "", value: "" },
  { name: "E", value: "E" },
  { name: "N", value: "N" },
  { name: "NE", value: "NE" },
  { name: "NW", value: "NW" },
  { name: "S", value: "S" },
  { name: "SE", value: "SE" },
  { name: "SW", value: "SW" },
  { name: "W", value: "W" },
];

export const MAILING_TYPE = [
  { name: "register_page.mailing_address_type.standard", value: "STANDARD" },
  { name: "register_page.mailing_address_type.po_box", value: "PO_BOX" },
  { name: "register_page.mailing_address_type.military", value: "MILITARY" },
  {
    name: "register_page.mailing_address_type.international",
    value: "INTERNATIONAL",
  },
];

export const isVisible = (
  formConfig: DataCollectionConfiguration,
  key: string,
) => formConfig?.fields?.[key]?.visible;

export const isRequired = (
  formConfig: DataCollectionConfiguration,
  key: string,
) => formConfig?.fields?.[key]?.value_required;
