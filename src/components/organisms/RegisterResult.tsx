import React, {
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import i18n from "@/i18n";
import {
  isRequired,
  isVisible,
  mapFormStateToMICovrPayload,
} from "@/utils/constants";
import {
  DataCollectionConfiguration,
  OVR_TYPE_MAP,
  RegisterFormState,
  RegisterFormStateError,
  StateData,
} from "@/utils/types";
import {
  fetchDataConfiguration,
  getSurveyQuestions,
  submitMICovr,
} from "@/utils/api";
import { ThemeContext } from "@/styles/ThemeProvider";
import { RootStackParamList } from "./Navigation";

import { PaperOVR } from "./PaperOVR";
import { OvrState } from "./OvrState";
import { ConnectedOVR } from "./MI/ConnectedOVR";
import ConnectedOVRStep2 from "./MI/ConnectedOVRStep2";
import ConnectedOVRStep3 from "./MI/ConnectedOVRStep3";
import FinishWithState from "./FinishWithState";
import AcceptNotice from "./AcceptNotice";
import { ConnectedWA } from "./ConnectedWA";
import { ConnectedPA } from "./PA/ConnectedPA";
import { ConnectedCA } from "./ConnectedCA";
import { ConnectedPAStep2 } from "./PA/ConnectedPAStep2";
import { ConnectedPAStep3HasID } from "./PA/ConnectedPAStep3HasID";
import RenderHTML from "react-native-render-html";
import { ConnectedPAStep3Select } from "./PA/ConnectedPAStep3Select";
import { ConnectedPAStep4Signature } from "./PA/ConnectedPAStep4Signature";
import { ConnectedPAStep3Device } from "./PA/ConnectedPAStep3Device";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type PaConnectedRegistrationDobResult =
  | { outcome: "defer" }
  | { outcome: "too_young"; errorMessageKey: string }
  | { outcome: "eligible"; preregistrationAgeWindow: boolean };

/**
 * Evaluates date of birth for Pennsylvania connected OVR: minimum 17 years + 180 days,
 * and whether the registrant is in the preregistration window (before 18th birthday).
 * Used by RegisterResult `validateWA`; exported so other code can reuse the same rules.
 */
export function evaluatePaConnectedRegistrationDateOfBirth(
  birthYear: string,
  birthMonth: string,
  birthDay: string,
  referenceDate: Date = new Date(),
): PaConnectedRegistrationDobResult {
  if (!birthYear.trim() || !birthMonth.trim() || !birthDay.trim()) {
    return { outcome: "defer" };
  }

  const year = Number(birthYear);
  const month = Number(birthMonth) - 1;
  const day = Number(birthDay);
  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day)
  ) {
    return { outcome: "defer" };
  }

  const birth = new Date(year, month, day);
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  if (birth > today) {
    return { outcome: "defer" };
  }

  const invalidCalendar =
    birth.getFullYear() !== year ||
    birth.getMonth() !== month ||
    birth.getDate() !== day;
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

function getFlowType(ovrType: string) {
  return OVR_TYPE_MAP[ovrType] ?? "paper";
}

type RegisterScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

interface RegisterResultProps {
  state: StateData;
  zip: string;
  email: string;
  pageFromLookup: string;
  workflowType?: string;
  showRedirectText: boolean;
  form?: RegisterFormState;
}

const EMPTY_ERROR_MESSAGES: RegisterFormStateError = {
  partner_id: "",
  lang: "",

  name_title: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  suffix: "",
  us_citizen: "",
  will_be_18_by_election: "",
  email_address: "",

  change_of_name: "",
  prev_name_title: "",
  prev_first_name: "",
  prev_middle_name: "",
  prev_last_name: "",
  prev_name_suffix: "",
  prev_unit_number: "",
  prev_unit_type: "",

  home_address: "",
  address_line_2: "",
  home_unit_type: "",
  home_unit: "",
  home_city: "",
  state: "",
  home_zip_code: "",

  mailing_unit_type: "",
  mailing_unit_number: "",
  mailing_address: "",
  mailing_unit: "",
  mailing_city: "",
  mailing_state: "",
  mailing_zip_code: "",

  change_of_address: "",
  prev_address: "",
  prev_unit: "",
  prev_city: "",
  prev_state: "",
  prev_zip_code: "",

  race: "",
  party: "",
  home_county: "",
  signature_base64: "",
  birthMonth: "",
  birthDay: "",
  birthYear: "",
  date_of_birth: "",
  pa_preregistration_age_window: "",
  phone: "",

  issueMonth: "",
  issueDay: "",
  issueYear: "",

  opt_in_sms: "",
  opt_in_email: "",
  volunteer: "",
  mailForm: "",
  survey_question_1: "",
  survey_answer_1: "",
  survey_question_2: "",
  survey_answer_2: "",

  residency_duration_ack: "",
  cancel_previous_registration_ack: "",
  use_stored_signature_ack: "",
  updated_dln_recently: "",
  request_duplicate_dln_today: "",

  full_name: "",
  state_id_number: "",
  eye_color: "",
  last_four_ss_number: "",
  has_no_state_license: "",
  has_no_ssn: "",
  helper_electronic_signature_acknowledged: "",

  someone_helped: "",
  helper_name: "",
  helper_address: "",
  helper_phone: "",

  street_name: "",
  street_number: "",
  street_type: "",
  street_direction: "",

  has_mailing_address: "",
  mailing_postal_code: "",
  mailingAddressType: "",
  age_eligibility: "",

  mailing_po_box_number: "",
  mailing_box_group_type: "",
  mailing_box_group_number: "",
  mailing_box_number: "",
  mailing_apo: "",
  mailing_ap: "",
  mailing_address_line1: "",
  mailing_address_line2: "",
  mailing_address_line3: "",
  mailing_country: "",
};

export const RegisterResult = ({
  state,
  zip,
  email,
  pageFromLookup,
  workflowType = "ovr",
  showRedirectText,
  form: initform,
}: RegisterResultProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<RegisterScreenNavigation>();
  const [showRedirect, setShowRedirectText] =
    useState<boolean>(showRedirectText);
  const scrollRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const [workflow, setWorkflow] = useState("ovr");
  const [upload, setUpload] = useState("signature");

  const [step, setStep] = useState<SetStateAction<1 | 2 | 3 | 4 | 5>>(1);
  let flowType = pageFromLookup || getFlowType(state?.ovr_type || "");
  const [formCongif, setFormCongif] = useState<DataCollectionConfiguration>({
    fields: {},
    validations: {
      po_box_allowed: false,
      min_age: 18,
    },
  });
  const [errMsg, setErrMsg] =
    useState<RegisterFormStateError>(EMPTY_ERROR_MESSAGES);

  const [form, setForm] = useState<RegisterFormState>({
    partner_id: 1,
    lang: i18n.language,

    name_title: initform?.name_title || "",
    first_name: initform?.first_name || "",
    middle_name: initform?.middle_name || "",
    last_name: initform?.last_name || "",
    suffix: initform?.suffix || "",

    change_of_name: initform?.change_of_name || false,
    prev_name_title: initform?.prev_name_title || "",
    prev_first_name: initform?.prev_first_name || "",
    prev_middle_name: initform?.prev_middle_name || "",
    prev_last_name: initform?.prev_last_name || "",
    prev_name_suffix: initform?.prev_name_suffix || "",
    us_citizen: initform?.us_citizen || false,
    will_be_18_by_election: initform?.will_be_18_by_election || false,
    email_address: initform?.email_address || email,

    home_address: initform?.home_address || "",
    address_line_2: initform?.address_line_2 || "",
    home_unit_type: initform?.home_unit_type || "",
    home_unit: initform?.home_unit || "",
    home_city: initform?.home_city || "",
    state: initform?.state || state.abbreviation,
    home_zip_code: initform?.home_zip_code || zip,

    mailing_unit_type: initform?.mailing_unit_type || "",
    mailing_unit_number: initform?.mailing_unit_number || "",
    mailing_address: initform?.mailing_address || "",
    mailing_unit: initform?.mailing_unit || "",
    mailing_city: initform?.mailing_city || "",
    mailing_state: initform?.mailing_state || state.abbreviation,
    mailing_zip_code: initform?.mailing_zip_code || "",

    change_of_address: initform?.change_of_address || false,
    prev_address: initform?.prev_address || "",
    prev_unit: initform?.prev_unit || "",
    prev_city: initform?.prev_city || "",
    prev_state: initform?.prev_state || "",
    prev_zip_code: initform?.prev_zip_code || "",
    prev_unit_number: initform?.prev_unit_number || "",
    prev_unit_type: initform?.prev_unit_type || "",

    race: initform?.race || "",
    party: initform?.party || "",
    home_county: initform?.home_county || "",
    signature_base64: initform?.signature_base64 || "",

    birthMonth: initform?.birthMonth || "",
    birthDay: initform?.birthDay || "",
    birthYear: initform?.birthYear || "",
    date_of_birth: "",
    pa_preregistration_age_window:
      initform?.pa_preregistration_age_window ?? false,
    phone: initform?.phone || "",

    issueMonth: "",
    issueDay: "",
    issueYear: "",

    opt_in_sms: initform?.opt_in_sms || false,
    opt_in_email: initform?.opt_in_email || true,
    volunteer: initform?.volunteer || false,
    mailForm: initform?.mailForm || false,
    survey_question_1: initform?.survey_question_1 || "",
    survey_answer_1: initform?.survey_answer_1 || "",
    survey_question_2: initform?.survey_question_2 || "",
    survey_answer_2: initform?.survey_answer_2 || "",

    residency_duration_ack: initform?.residency_duration_ack || false,
    cancel_previous_registration_ack:
      initform?.cancel_previous_registration_ack || false,
    use_stored_signature_ack: initform?.use_stored_signature_ack || false,
    updated_dln_recently: initform?.updated_dln_recently || null,
    request_duplicate_dln_today: initform?.request_duplicate_dln_today || null,
    age_eligibility: initform?.age_eligibility || false,

    full_name: initform?.full_name || "",
    state_id_number: initform?.state_id_number || "",
    eye_color: initform?.eye_color || "",
    last_four_ss_number: initform?.last_four_ss_number || "",
    has_no_state_license: initform?.has_no_state_license || null,
    has_no_ssn: initform?.has_no_ssn || null,
    helper_electronic_signature_acknowledged:
      initform?.helper_electronic_signature_acknowledged || false,

    someone_helped: initform?.someone_helped || false,
    helper_name: initform?.helper_name || "",
    helper_address: initform?.helper_address || "",
    helper_phone: initform?.helper_phone || "",

    street_name: initform?.street_name || "",
    street_number: initform?.street_number || "",
    street_type: initform?.street_type || "",
    street_direction: initform?.street_direction || "",

    has_mailing_address: false,
    mailing_postal_code: "",
    mailingAddressType: "STANDARD",
    mailing_po_box_number: "",
    mailing_box_group_type: "",
    mailing_box_group_number: "",
    mailing_box_number: "",
    mailing_apo: "",
    mailing_ap: "",
    mailing_address_line1: "",
    mailing_address_line2: "",
    mailing_address_line3: "",
    mailing_country: "",
  });

  const renderContent = () => {
    const shortLang = i18n.language.split("-")[0];
    if (
      !state.ovr_locales.includes(shortLang) &&
      flowType !== "not_participating"
    ) {
      flowType = "paper";
    }

    if (flowType === "connected_ovr") {
      if (step === 1)
        return (
          <ConnectedOVR
            state={state}
            value={form}
            formCongif={formCongif}
            errorMessages={errMsg}
            onChange={setForm}
            onChangeError={setErrMsg}
            handleMainButton={
              <Button
                title={t("ovr_landing_page.next_button")}
                onPress={handleMainButtonClick}
              />
            }
          />
        );
      if (step === 2)
        return (
          <ConnectedOVRStep2
            state={state}
            value={form}
            formCongif={formCongif}
            errorMessages={errMsg}
            onChange={setForm}
            onChangeError={setErrMsg}
            handleMainButton={
              <Button
                title={t("ovr_landing_page.next_button")}
                onPress={handleMainButtonClick}
              />
            }
          />
        );
      if (step === 3)
        return (
          <ConnectedOVRStep3
            state={state}
            value={form}
            formCongif={formCongif}
            errorMessages={errMsg}
            onChange={setForm}
            onChangeError={setErrMsg}
            handleMainButton={
              <Button title="Submit" onPress={handleMainButtonClick} />
            }
          />
        );
    }

    switch (flowType) {
      case "connected_WA":
        if (step === 1)
          return (
            <ConnectedWA
              state={state}
              errorMessages={errMsg}
              value={form}
              formCongif={formCongif}
              onChange={setForm}
              onChangeError={setErrMsg}
              handleMainButton={
                <Button
                  title={t("ovr_landing_page.next_button")}
                  onPress={handleMainButtonClick}
                />
              }
            />
          );

        if (step === 2)
          return (
            <PaperOVR
              state={state}
              errorMessages={errMsg}
              value={form}
              formCongif={formCongif}
              onChange={setForm}
              onChangeError={setErrMsg}
              handleMainButton={
                <Button
                  title={t("nvra_form_page.print_form")}
                  onPress={handleMainButtonClick}
                />
              }
            />
          );
        break;
      case "connected_PA":
        if (step === 1)
          return (
            <ConnectedPA
              state={state}
              errorMessages={errMsg}
              value={form}
              formCongif={formCongif}
              onChange={setForm}
              onChangeError={setErrMsg}
              handleMainButton={
                <Button
                  title={t("ovr_landing_page.next_button")}
                  onPress={handleMainButtonClick}
                />
              }
            />
          );
        if (step === 2)
          return (
            <ConnectedPAStep2
              state={state}
              errorMessages={errMsg}
              value={form}
              formCongif={formCongif}
              onChange={setForm}
              onChangeError={setErrMsg}
              handleMainButton={
                <Button
                  title={t("ovr_landing_page.next_button")}
                  onPress={handleMainButtonClick}
                />
              }
            />
          );
        if (step === 3) {
          if (form.has_no_state_license) {
            return (
              <ConnectedPAStep3Select
                state={state}
                errorMessages={errMsg}
                value={form}
                formCongif={formCongif}
                onChange={setForm}
                onChangeError={setErrMsg}
                upload={upload}
                setUpload={setUpload}
                handleMainButton={
                  <Button
                    title={t("ovr_landing_page.next_button")}
                    onPress={() => {
                      if (upload === "print") {
                        navigation.navigate("Register", {
                          status: { success: true, errors: [] },
                          state,
                          zip: form.home_zip_code,
                          email: form.email_address,
                          form: {
                            ...form,
                            home_address:
                              form.home_address + " " + form.address_line_2,
                            home_unit:
                              form.home_unit_type + " " + form.home_unit,
                          },
                          pageFromLookup: "paper",
                          workflowType: "nvra",
                          showRedirectText: true,
                        });
                      } else {
                        handleMainButtonClick();
                      }
                    }}
                  />
                }
              />
            );
          } else {
            return (
              <ConnectedPAStep3HasID
                value={form}
                goBack={stepNumber => setStep(stepNumber)}
                handleMainButtonClick={handleMainButtonClick}
              />
            );
          }
        }
        if (step === 4) {
          if (upload === "signature") {
            return (
              <ConnectedPAStep4Signature
                state={state}
                errorMessages={errMsg}
                value={form}
                formCongif={formCongif}
                onChange={setForm}
                onChangeError={setErrMsg}
                handleMainButton={
                  <Button
                    title={t("ovr_landing_page.next_button")}
                    onPress={handleMainButtonClick}
                  />
                }
              />
            );
          }
          return (
            <ConnectedPAStep3Device
              state={state}
              errorMessages={errMsg}
              value={form}
              formCongif={formCongif}
              onChange={setForm}
              onChangeError={setErrMsg}
              handleMainButton={
                <Button
                  title={t("ovr_landing_page.next_button")}
                  onPress={handleMainButtonClick}
                />
              }
            />
          );
        }
        if (step === 5)
          return (
            <ConnectedPAStep3HasID
              value={form}
              goBack={(stepNumber: SetStateAction<1 | 2 | 3 | 4 | 5>) =>
                setStep(stepNumber)
              }
              handleMainButtonClick={handleMainButtonClick}
            />
          );
        break;
      case "connected_CA":
        if (step === 1)
          return (
            <ConnectedCA
              state={state}
              errorMessages={errMsg}
              value={form}
              formCongif={formCongif}
              onChange={setForm}
              onChangeError={setErrMsg}
              handleMainButton={
                <Button
                  title={t("ovr_landing_page.next_button")}
                  onPress={handleMainButtonClick}
                />
              }
            />
          );
        if (step === 2)
          return (
            <AcceptNotice
              state={state}
              value={form}
              onChange={setForm}
              handleMainButton={
                <Button
                  title={"< " + t("general.no_thanks_continue_rtv")}
                  onPress={handleMainButtonClick}
                />
              }
            />
          );
        if (step === 3)
          return (
            <PaperOVR
              state={state}
              errorMessages={errMsg}
              value={form}
              formCongif={formCongif}
              onChange={setForm}
              onChangeError={setErrMsg}
              handleMainButton={
                <Button
                  title={t("ovr_landing_page.next_button")}
                  onPress={handleMainButtonClick}
                />
              }
            />
          );
        break;
      case "not_participating":
        navigation.navigate("NotParticipating", { state });
        break;
      case "ovr_state":
        if (step === 1)
          return (
            <OvrState
              state={state}
              value={form}
              formCongif={formCongif}
              errorMessages={errMsg}
              onChange={setForm}
              onChangeError={setErrMsg}
              handleMainButton={
                <Button
                  title={t("ovr_landing_page.next_button")}
                  onPress={handleMainButtonClick}
                />
              }
            />
          );
        if (step === 2) {
          if (form.has_no_state_license) {
            return (
              <PaperOVR
                state={state}
                errorMessages={errMsg}
                value={form}
                formCongif={formCongif}
                onChange={setForm}
                onChangeError={setErrMsg}
                handleMainButton={
                  <Button
                    title={t("nvra_form_page.print_form")}
                    onPress={handleMainButtonClick}
                  />
                }
              />
            );
          } else
            return (
              <FinishWithState
                state={state}
                errorMessages={errMsg}
                value={form}
                formCongif={formCongif}
                onChange={setForm}
                onChangeError={setErrMsg}
                handleMainButton={
                  <TouchableOpacity
                    style={styles.outlineButton}
                    onPress={handleMainButtonClick}
                  >
                    <Text style={styles.outlineButtonText}>
                      {t("finish_with_state_page2.paper_button")}
                    </Text>
                  </TouchableOpacity>
                }
              />
            );
        }
        if (step === 3)
          return (
            <PaperOVR
              state={state}
              errorMessages={errMsg}
              value={form}
              formCongif={formCongif}
              onChange={setForm}
              onChangeError={setErrMsg}
              handleMainButton={
                <Button
                  title={t("ovr_landing_page.next_button")}
                  onPress={handleMainButtonClick}
                />
              }
            />
          );
        break;
      case "paper":
      default:
        return (
          <PaperOVR
            state={state}
            value={form}
            formCongif={formCongif}
            errorMessages={errMsg}
            onChange={setForm}
            onChangeError={setErrMsg}
            handleMainButton={
              <Button
                title={t("nvra_form_page.prepare_form")}
                onPress={handleMainButtonClick}
              />
            }
          />
        );
    }
  };

  const validate = () => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    const fullPhoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    const validationCfg = formCongif.fields.state_id_number?.validations;
    const configRegex = validationCfg?.regexp;
    const minLen = validationCfg?.min_length;
    const maxLen = validationCfg?.max_length;

    let finalRegex = /^.*$/;

    if (configRegex) {
      finalRegex = new RegExp(`^${configRegex}$`);
    } else if (minLen !== undefined && maxLen !== undefined) {
      finalRegex = new RegExp(`^[a-z0-9]{${minLen},${maxLen}}$`, "i");
    }

    let errorMessage = { ...EMPTY_ERROR_MESSAGES };
    if (!form.name_title.trim() && isRequired(formCongif, "name_title")) {
      errorMessage.name_title = "general.required";
    }
    if (!form.first_name.trim() && isRequired(formCongif, "first_name")) {
      errorMessage.first_name = "general.required";
    }
    if (!form.middle_name.trim() && isRequired(formCongif, "middle_name")) {
      errorMessage.middle_name = "general.required";
    }
    if (!form.last_name.trim() && isRequired(formCongif, "last_name")) {
      errorMessage.last_name = "general.required";
    }
    if (!form.suffix.trim() && isRequired(formCongif, "name_suffix")) {
      errorMessage.suffix = "general.required";
    }
    if (form.change_of_name || isRequired(formCongif, "change_of_name")) {
      if (
        !form.prev_name_title.trim() &&
        isRequired(formCongif, "prev_name_title", form.change_of_name)
      ) {
        errorMessage.prev_name_title = "general.required";
      }
      if (
        !form.prev_first_name.trim() &&
        isRequired(formCongif, "prev_first_name", form.change_of_name)
      ) {
        errorMessage.prev_first_name = "general.required";
      }
      if (
        !form.prev_middle_name.trim() &&
        isRequired(formCongif, "prev_middle_name", form.change_of_name)
      ) {
        errorMessage.prev_middle_name = "general.required";
      }
      if (
        !form.prev_last_name.trim() &&
        isRequired(formCongif, "prev_last_name", form.change_of_name)
      ) {
        errorMessage.prev_last_name = "general.required";
      }
      if (
        !form.prev_name_suffix.trim() &&
        isRequired(formCongif, "prev_name_suffix", form.change_of_name)
      ) {
        errorMessage.prev_name_suffix = "general.required";
      }
    }
    if (!form.us_citizen && isRequired(formCongif, "us_citizen")) {
      errorMessage.us_citizen = "form_fields.citizen_eligibility_error";
    }
    if (!form.home_address.trim() && isRequired(formCongif, "home_address")) {
      errorMessage.home_address = "general.required";
    }
    if (!form.home_unit.trim() && isRequired(formCongif, "home_unit")) {
      errorMessage.home_unit = "general.required";
    }
    if (!form.home_city.trim() && isRequired(formCongif, "home_city")) {
      errorMessage.home_city = "general.required";
    }
    if (!form.state.trim() && isRequired(formCongif, "home_state")) {
      errorMessage.state = "general.required";
    }
    if (!form.home_zip_code.trim() && isRequired(formCongif, "home_zip_code")) {
      errorMessage.home_zip_code = "general.required";
    } else if (!zipRegex.test(form.home_zip_code.trim())) {
      errorMessage.home_zip_code = "form_fields.zip_code_error";
    }
    if (
      form.has_mailing_address ||
      isRequired(formCongif, "has_mailing_address")
    ) {
      if (
        !form.mailing_address.trim() &&
        isRequired(formCongif, "mailing_address", form.has_mailing_address)
      ) {
        errorMessage.mailing_address = "general.required";
      }
      if (
        !form.mailing_unit.trim() &&
        isRequired(formCongif, "mailing_unit", form.has_mailing_address)
      ) {
        errorMessage.mailing_unit = "general.required";
      }
      if (
        !form.mailing_city.trim() &&
        isRequired(formCongif, "mailing_city", form.has_mailing_address)
      ) {
        errorMessage.mailing_city = "general.required";
      }
      if (
        !form.mailing_state.trim() &&
        isRequired(formCongif, "mailing_state", form.has_mailing_address)
      ) {
        errorMessage.mailing_state = "general.required";
      }
      if (
        !form.mailing_zip_code.trim() &&
        isRequired(formCongif, "mailing_zip_code", form.has_mailing_address)
      ) {
        errorMessage.mailing_zip_code = "general.required";
      } else if (!zipRegex.test(form.mailing_zip_code.trim())) {
        errorMessage.mailing_zip_code = "form_fields.zip_code_error";
      }
    }
    if (form.change_of_address || isRequired(formCongif, "change_of_address")) {
      if (
        !form.prev_address.trim() &&
        isRequired(formCongif, "prev_address", form.change_of_address)
      ) {
        errorMessage.prev_address = "general.required";
      }
      if (
        !form.prev_unit.trim() &&
        isRequired(formCongif, "prev_unit", form.change_of_address)
      ) {
        errorMessage.prev_unit = "general.required";
      }
      if (
        !form.prev_city.trim() &&
        isRequired(formCongif, "prev_city", form.change_of_address)
      ) {
        errorMessage.prev_city = "general.required";
      }
      if (
        !form.prev_state.trim() &&
        isRequired(formCongif, "prev_state", form.change_of_address)
      ) {
        errorMessage.prev_state = "general.required";
      }
      if (
        !form.prev_zip_code.trim() &&
        isRequired(formCongif, "prev_zip_code", form.change_of_address)
      ) {
        errorMessage.prev_zip_code = "general.required";
      } else if (!zipRegex.test(form.prev_zip_code.trim())) {
        errorMessage.prev_zip_code = "form_fields.zip_code_error";
      }
    }
    if (form.has_no_state_license == null && flowType !== "paper") {
      errorMessage.has_no_state_license =
        "finish_with_state_page1.dl_id_answer_required";
    }
    if (!form.has_no_state_license && (flowType === "paper" || showRedirect)) {
      if (
        !form.state_id_number.trim() &&
        isRequired(formCongif, "state_id_number")
      ) {
        errorMessage.state_id_number = "general.required";
      } else if (!finalRegex.test(form.state_id_number.trim())) {
        errorMessage.state_id_number = "form_fields.invalid_id_number";
      }
    }
    if (
      form.has_no_state_license &&
      !form.has_no_ssn &&
      (flowType === "paper" || showRedirect)
    )
      if (
        !form.last_four_ss_number.trim() &&
        isRequired(formCongif, "last_four_ss_number")
      ) {
        errorMessage.last_four_ss_number = "general.required";
      } else if (!/^\d{4}$/.test(form.last_four_ss_number.trim())) {
        errorMessage.last_four_ss_number = "form_fields.invalid_ssn4";
      }
    if (!form.race.trim() && isRequired(formCongif, "race")) {
      errorMessage.race = "general.required";
    }
    if (!form.party.trim() && isRequired(formCongif, "party")) {
      errorMessage.party = "general.required";
    }
    if (
      (!form.birthMonth.trim() && isRequired(formCongif, "date_of_birth")) ||
      (!form.birthDay.trim() && isRequired(formCongif, "date_of_birth")) ||
      (!form.birthYear.trim() && isRequired(formCongif, "date_of_birth"))
    ) {
      errorMessage.birthDay = "general.required";
    } else if (Number(form.birthYear) < 1900) {
      errorMessage.birthYear = "form_fields.invalid_year";
    }
    if (
      form.birthYear.trim() &&
      form.birthMonth.trim() &&
      form.birthDay.trim() &&
      isRequired(formCongif, "date_of_birth")
    ) {
      const year = Number(form.birthYear);
      const month = Number(form.birthMonth) - 1;
      const day = Number(form.birthDay);

      const date = new Date(year, month, day);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (date > today) {
        errorMessage.birthYear = "form_fields.invalid_year_future";
      } else {
        const isInvalidDate =
          date.getFullYear() !== year ||
          date.getMonth() !== month ||
          date.getDate() !== day;

        if (isInvalidDate) {
          errorMessage.birthDay = "form_fields.invalid_birth_date";
        } else {
          const paDob = evaluatePaConnectedRegistrationDateOfBirth(
            form.birthYear,
            form.birthMonth,
            form.birthDay,
            today,
          );

          if (paDob.outcome === "too_young") {
            // "You must be 18..."
            errorMessage.birthMonth = paDob.errorMessageKey;
            form.pa_preregistration_age_window = false;
          } else if (paDob.outcome === "eligible") {
            // >= 18 (preregistrationAgeWindow: false),
            // And from 17.5 to 18 (preregistrationAgeWindow: true)
            // No Error
            form.date_of_birth =
              form.birthYear + "-" + form.birthMonth + "-" + form.birthDay;
            form.pa_preregistration_age_window = paDob.preregistrationAgeWindow;
          } else {
            let age = today.getFullYear() - date.getFullYear();
            const monthDiff = today.getMonth() - date.getMonth();
            const dayDiff = today.getDate() - date.getDate();

            if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
              age--;
            }

            if (age < formCongif.validations.min_age) {
              errorMessage.birthMonth = "form_fields.age_eligibility_error";
            } else {
              form.date_of_birth =
                form.birthYear + "-" + form.birthMonth + "-" + form.birthDay;
            }
          }
        }
      }
    }
    if (isVisible(formCongif, "age_eligibility") && !form.age_eligibility) {
      errorMessage.age_eligibility = "form_fields.age_eligibility_error";
    }
    if (!form.age_eligibility || !form.has_no_state_license) {
      if (!form.race.trim() && isRequired(formCongif, "race")) {
        errorMessage.race = "general.required";
      }
      if (!form.party.trim() && isRequired(formCongif, "party")) {
        errorMessage.party = "general.required";
      }
    }
    if (
      !form.phone.trim() &&
      isRequired(formCongif, "phone", form.opt_in_sms)
    ) {
      errorMessage.phone = "form_fields.required_phone";
    } else if (form.opt_in_sms && !fullPhoneRegex.test(form.phone.trim())) {
      errorMessage.phone = "form_fields.invalid_phone";
    }
    if (form.opt_in_email && isRequired(formCongif, "opt_in_email")) {
      errorMessage.opt_in_email = "general.required";
    }
    if (form.volunteer && isRequired(formCongif, "opt_in_volunteer")) {
      errorMessage.volunteer = "general.required";
    }

    setErrMsg(errorMessage);
    return !Object.values(errorMessage).some(value => !!value);
  };
  const validateConnectedOvr = () => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    const fullPhoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    const miIdRegex = /^[a-zA-Z]\d{12}$/i;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let errorMessage = { ...EMPTY_ERROR_MESSAGES };
    if (step === 1) {
      if (!form.us_citizen && isRequired(formCongif, "us_citizen")) {
        errorMessage.us_citizen = "michigan.eligibility.citizen_error";
      }
      if (
        !form.will_be_18_by_election &&
        isRequired(formCongif, "will_be_18_by_election")
      ) {
        errorMessage.will_be_18_by_election = "michigan.eligibility.age_error";
      }
      if (
        !form.residency_duration_ack &&
        isRequired(formCongif, "residency_duration_ack")
      ) {
        errorMessage.residency_duration_ack = "show";
      }
      if (
        !form.cancel_previous_registration_ack &&
        isRequired(formCongif, "cancel_previous_registration_ack")
      ) {
        errorMessage.cancel_previous_registration_ack = "show";
      }
      if (
        !form.use_stored_signature_ack &&
        isRequired(formCongif, "use_stored_signature_ack")
      ) {
        errorMessage.use_stored_signature_ack = "show";
      }
      if (
        form.updated_dln_recently !== "no" &&
        isRequired(formCongif, "updated_dln_recently")
      ) {
        errorMessage.updated_dln_recently = "show";
      }
      if (
        form.request_duplicate_dln_today !== "no" &&
        isRequired(formCongif, "request_duplicate_dln_today")
      ) {
        errorMessage.request_duplicate_dln_today = "show";
      }
    } else if (step === 2) {
      if (!form.full_name.trim() && isRequired(formCongif, "full_name")) {
        errorMessage.full_name = "general.required";
      }
      if (!form.eye_color.trim() && isRequired(formCongif, "eye_color")) {
        errorMessage.eye_color = "general.required";
      }
      if (
        !form.state_id_number.trim() &&
        isRequired(formCongif, "state_id_number")
      ) {
        errorMessage.state_id_number = "michigan.id_empty_error";
      } else if (
        !miIdRegex.test(form.state_id_number.trim()) &&
        form.state_id_number.trim() !== "NONE"
      ) {
        errorMessage.state_id_number = "michigan.id_format_error";
      }
      if (
        (!form.birthMonth.trim() && isRequired(formCongif, "date_of_birth")) ||
        (!form.birthDay.trim() && isRequired(formCongif, "date_of_birth")) ||
        (!form.birthYear.trim() && isRequired(formCongif, "date_of_birth"))
      ) {
        errorMessage.birthDay = "general.required";
      } else if (Number(form.birthYear) < 1900) {
        errorMessage.birthYear = "form_fields.invalid_year";
      }
      if (
        form.birthYear.trim() &&
        form.birthMonth.trim() &&
        form.birthDay.trim() &&
        isRequired(formCongif, "date_of_birth")
      ) {
        const year = Number(form.birthYear);
        const month = Number(form.birthMonth) - 1;
        const day = Number(form.birthDay);

        const date = new Date(year, month, day);
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (date > today) {
          errorMessage.birthYear = "form_fields.invalid_year_future";
        } else {
          const isInvalidDate =
            date.getFullYear() !== year ||
            date.getMonth() !== month ||
            date.getDate() !== day;

          if (isInvalidDate) {
            errorMessage.birthDay = "form_fields.invalid_birth_date";
          } else {
            const paDob = evaluatePaConnectedRegistrationDateOfBirth(
              form.birthYear,
              form.birthMonth,
              form.birthDay,
              today,
            );

            if (paDob.outcome === "too_young") {
              // "You must be 18..."
              errorMessage.birthMonth = paDob.errorMessageKey;
              form.pa_preregistration_age_window = false;
            } else if (paDob.outcome === "eligible") {
              // >= 18 (preregistrationAgeWindow: false),
              // And from 17.5 to 18 (preregistrationAgeWindow: true)
              // No Error
              form.date_of_birth =
                form.birthYear + "-" + form.birthMonth + "-" + form.birthDay;
              form.pa_preregistration_age_window =
                paDob.preregistrationAgeWindow;
            } else {
              let age = today.getFullYear() - date.getFullYear();
              const monthDiff = today.getMonth() - date.getMonth();
              const dayDiff = today.getDate() - date.getDate();

              if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                age--;
              }

              if (age < formCongif.validations.min_age) {
                errorMessage.birthMonth = "form_fields.age_eligibility_error";
              } else {
                form.date_of_birth =
                  form.birthYear + "-" + form.birthMonth + "-" + form.birthDay;
              }
            }
          }
        }
      }
      if (
        !form.last_four_ss_number.trim() ||
        form.last_four_ss_number.trim().length !== 4
      ) {
        errorMessage.last_four_ss_number = "michigan.ssn_last4_empty_error";
      } else if (!/^\d{4}$/.test(form.last_four_ss_number.trim())) {
        errorMessage.last_four_ss_number = "michigan.ssn_last4_invalid_error";
      }
    } else if (step === 3) {
      if (
        !form.street_number.trim() &&
        isRequired(formCongif, "street_number")
      ) {
        errorMessage.street_number = "general.required";
      }
      if (!form.street_name.trim() && isRequired(formCongif, "street_name")) {
        errorMessage.street_name = "general.required";
      }
      if (!form.street_type.trim() && isRequired(formCongif, "street_type")) {
        errorMessage.street_type = "general.required";
      }
      if (
        !form.street_direction.trim() &&
        isRequired(formCongif, "street_direction")
      ) {
        errorMessage.street_direction = "general.required";
      }
      if (!form.home_unit.trim() && isRequired(formCongif, "street_apt_unit")) {
        errorMessage.home_unit = "general.required";
      }
      if (!form.home_city.trim() && isRequired(formCongif, "city")) {
        errorMessage.home_city = "general.required";
      }
      if (!form.state.trim() && isRequired(formCongif, "state")) {
        errorMessage.state = "general.required";
      }
      if (!form.home_zip_code.trim() && isRequired(formCongif, "zip_code")) {
        errorMessage.home_zip_code = "general.required";
      } else if (!zipRegex.test(form.home_zip_code.trim())) {
        errorMessage.home_zip_code = "form_fields.zip_code_error";
      }
      if (
        !form.mailingAddressType.trim() &&
        isRequired(formCongif, "mailing_address_type")
      ) {
        errorMessage.mailingAddressType = "general.required";
      }
      if (form.has_mailing_address) {
        if (form.mailingAddressType === "STANDARD") {
          if (
            !form.mailing_address.trim() &&
            isRequired(formCongif, "mailing_address", form.has_mailing_address)
          ) {
            errorMessage.mailing_address = "general.required";
          }
          if (
            !form.mailing_city.trim() &&
            isRequired(formCongif, "mailing_city", form.has_mailing_address)
          ) {
            errorMessage.mailing_city = "general.required";
          }
          if (
            !form.mailing_state.trim() &&
            isRequired(formCongif, "mailing_state", form.has_mailing_address)
          ) {
            errorMessage.mailing_state = "general.required";
          }
          if (
            !form.mailing_zip_code.trim() &&
            isRequired(formCongif, "mailing_zip_code", form.has_mailing_address)
          ) {
            errorMessage.mailing_zip_code = "general.required";
          } else if (!zipRegex.test(form.mailing_zip_code.trim())) {
            errorMessage.mailing_zip_code = "form_fields.zip_code_error";
          }
        } else if (form.mailingAddressType === "PO_BOX") {
          if (
            !form.mailing_po_box_number.trim() &&
            isRequired(
              formCongif,
              "mailing_po_box_number",
              form.has_mailing_address,
            )
          ) {
            errorMessage.mailing_po_box_number = "general.required";
          }
          if (
            !form.mailing_city.trim() &&
            isRequired(formCongif, "mailing_city", form.has_mailing_address)
          ) {
            errorMessage.mailing_city = "general.required";
          }
          if (
            !form.mailing_state.trim() &&
            isRequired(formCongif, "mailing_state", form.has_mailing_address)
          ) {
            errorMessage.mailing_state = "general.required";
          }
          if (
            !form.mailing_zip_code.trim() &&
            isRequired(formCongif, "mailing_zip_code", form.has_mailing_address)
          ) {
            errorMessage.mailing_zip_code = "general.required";
          } else if (!zipRegex.test(form.mailing_zip_code.trim())) {
            errorMessage.mailing_zip_code = "form_fields.zip_code_error";
          }
        } else if (form.mailingAddressType === "MILITARY") {
          if (
            !form.mailing_box_group_type.trim() &&
            isRequired(
              formCongif,
              "mailing_box_group_type",
              form.has_mailing_address,
            )
          ) {
            errorMessage.mailing_box_group_type = "general.required";
          }
          if (
            !form.mailing_box_group_number.trim() &&
            isRequired(
              formCongif,
              "mailing_box_group_number",
              form.has_mailing_address,
            )
          ) {
            errorMessage.mailing_box_group_number = "general.required";
          }
          if (
            !form.mailing_box_number.trim() &&
            isRequired(
              formCongif,
              "mailing_box_number",
              form.has_mailing_address,
            )
          ) {
            errorMessage.mailing_box_number = "general.required";
          }
          if (
            !form.mailing_apo.trim() &&
            isRequired(formCongif, "mailing_apo", form.has_mailing_address)
          ) {
            errorMessage.mailing_apo = "general.required";
          }
          if (
            !form.mailing_ap.trim() &&
            isRequired(formCongif, "mailing_ap", form.has_mailing_address)
          ) {
            errorMessage.mailing_ap = "general.required";
          }
          if (
            !form.mailing_zip_code.trim() &&
            isRequired(formCongif, "mailing_zip_code", form.has_mailing_address)
          ) {
            errorMessage.mailing_zip_code = "general.required";
          } else if (!zipRegex.test(form.mailing_zip_code.trim())) {
            errorMessage.mailing_zip_code = "form_fields.zip_code_error";
          }
        } else if (form.mailingAddressType === "INTERNATIONAL") {
          if (
            !form.mailing_address_line1.trim() &&
            isRequired(
              formCongif,
              "mailing_address_line1",
              form.has_mailing_address,
            )
          ) {
            errorMessage.mailing_address_line1 = "general.required";
          }
          if (
            !form.mailing_address_line2.trim() &&
            isRequired(
              formCongif,
              "mailing_address_line2",
              form.has_mailing_address,
            )
          ) {
            errorMessage.mailing_address_line2 = "general.required";
          }
          if (
            !form.mailing_address_line3.trim() &&
            isRequired(
              formCongif,
              "mailing_address_line3",
              form.has_mailing_address,
            )
          ) {
            errorMessage.mailing_address_line3 = "general.required";
          }
          if (
            !form.mailing_country.trim() &&
            isRequired(formCongif, "mailing_country", form.has_mailing_address)
          ) {
            errorMessage.mailing_country = "general.required";
          }
          if (
            !form.mailing_postal_code.trim() &&
            isRequired(
              formCongif,
              "mailing_postal_code",
              form.has_mailing_address,
            )
          ) {
            errorMessage.mailing_postal_code = "general.required";
          }
        }
      }
      if (
        !form.phone.trim() &&
        isRequired(formCongif, "phone", form.opt_in_sms)
      ) {
        errorMessage.phone = "michigan.phone_election_error";
      } else if (form.opt_in_sms && !fullPhoneRegex.test(form.phone.trim())) {
        errorMessage.phone = "form_fields.invalid_phone";
      }
      if (form.opt_in_sms && isRequired(formCongif, "opt_in_sms")) {
        errorMessage.opt_in_sms = "general.required";
      }
      if (!form.email_address.trim() && isRequired(formCongif, "email")) {
        errorMessage.email_address = "general.required";
      } else if (!emailRegex.test(form.email_address.trim())) {
        errorMessage.email_address = "form_fields.email_error";
      }
      if (form.opt_in_email && isRequired(formCongif, "opt_in_email")) {
        errorMessage.opt_in_email = "general.required";
      }
      if (form.volunteer && isRequired(formCongif, "opt_in_volunteer")) {
        errorMessage.volunteer = "general.required";
      }
    }

    setErrMsg(errorMessage);
    return !Object.values(errorMessage).some(value => !!value);
  };
  const validateWA = (isWA: string = "") => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    const fullPhoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    const idRegex = /^[a-z0-9]{12}$/i;

    let errorMessage = { ...EMPTY_ERROR_MESSAGES };

    const needsValidation = (
      configKey: string,
      stateKey: keyof RegisterFormState,
      dependentValue?: boolean,
    ) => {
      const isFieldVisible = isVisible(formCongif, configKey);
      const hasStateValue = form[stateKey] !== undefined;
      return (
        isFieldVisible &&
        hasStateValue &&
        isRequired(formCongif, configKey, dependentValue)
      );
    };

    const nameFields: (keyof RegisterFormState)[] = [
      "name_title",
      "first_name",
      "middle_name",
      "last_name",
      "suffix",
    ];
    nameFields.forEach(field => {
      const configKey = field === "suffix" ? "name_suffix" : field;
      const fieldValue = form[field];
      if (
        needsValidation(configKey, field) &&
        (typeof fieldValue !== "string" || !fieldValue.trim())
      ) {
        errorMessage[field] = "general.required";
      }
    });

    if (form.change_of_name) {
      const prevFields: (keyof RegisterFormState)[] = [
        "prev_name_title",
        "prev_first_name",
        "prev_middle_name",
        "prev_last_name",
        "prev_name_suffix",
      ];
      prevFields.forEach(field => {
        const fieldValue = form[field];
        if (
          needsValidation(field, field) &&
          (typeof fieldValue !== "string" || !fieldValue.trim())
        ) {
          errorMessage[field] = "general.required";
        }
      });
    }

    if (needsValidation("us_citizen", "us_citizen") && !form.us_citizen) {
      errorMessage.us_citizen = "form_fields.citizen_eligibility_error";
    }
    if (
      needsValidation("will_be_18_by_election", "will_be_18_by_election") &&
      !form.will_be_18_by_election
    ) {
      errorMessage.will_be_18_by_election = "washington.age_eligibility_error";
    }

    if (isRequired(formCongif, "date_of_birth")) {
      if (
        (!form.birthMonth.trim() && isRequired(formCongif, "date_of_birth")) ||
        (!form.birthDay.trim() && isRequired(formCongif, "date_of_birth")) ||
        (!form.birthYear.trim() && isRequired(formCongif, "date_of_birth"))
      ) {
        errorMessage.birthDay = "general.required";
      } else if (Number(form.birthYear) < 1900) {
        errorMessage.birthYear = "form_fields.invalid_year";
      }
      if (
        form.birthYear.trim() &&
        form.birthMonth.trim() &&
        form.birthDay.trim()
      ) {
        const year = Number(form.birthYear);
        const month = Number(form.birthMonth) - 1;
        const day = Number(form.birthDay);

        const date = new Date(year, month, day);
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (date > today) {
          errorMessage.birthYear = "form_fields.invalid_year_future";
        } else {
          const isInvalidDate =
            date.getFullYear() !== year ||
            date.getMonth() !== month ||
            date.getDate() !== day;

          if (isInvalidDate) {
            errorMessage.birthDay = "form_fields.invalid_birth_date";
          } else {
            const paDob = evaluatePaConnectedRegistrationDateOfBirth(
              form.birthYear,
              form.birthMonth,
              form.birthDay,
              today,
            );
            if (paDob.outcome === "too_young") {
              // "You must be 18..."
              errorMessage.birthMonth = paDob.errorMessageKey;
              form.pa_preregistration_age_window = false;
            } else if (paDob.outcome === "eligible") {
              // >= 18 (preregistrationAgeWindow: false),
              // And from 17.5 to 18 (preregistrationAgeWindow: true)
              // No Error
              form.date_of_birth =
                form.birthYear + "-" + form.birthMonth + "-" + form.birthDay;
              form.pa_preregistration_age_window =
                paDob.preregistrationAgeWindow;
            } else {
              let age = today.getFullYear() - date.getFullYear();
              const monthDiff = today.getMonth() - date.getMonth();
              const dayDiff = today.getDate() - date.getDate();

              if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                age--;
              }

              if (age < formCongif.validations.min_age) {
                errorMessage.birthMonth = "form_fields.age_eligibility_error";
              } else {
                form.date_of_birth =
                  form.birthYear + "-" + form.birthMonth + "-" + form.birthDay;
              }
            }
          }
        }
      }
    }

    if (
      needsValidation("home_address", "home_address") &&
      !form.home_address?.trim()
    )
      errorMessage.home_address = "general.required";
    const hasSecondaryAddressValue = [
      form.home_unit_type?.trim(),
      form.home_unit?.trim(),
    ].some(Boolean);
    if (isWA === "connected_PA" && hasSecondaryAddressValue) {
      if (!form.home_unit_type?.trim()) {
        errorMessage.home_unit_type = "general.required";
      }
      if (!form.home_unit?.trim()) {
        errorMessage.home_unit = "general.required";
      }
    } else if (
      needsValidation("home_unit", "home_unit") &&
      !form.home_unit?.trim()
    )
      errorMessage.home_unit = "general.required";
    if (needsValidation("home_city", "home_city") && !form.home_city?.trim())
      errorMessage.home_city = "general.required";
    if (needsValidation("home_state", "state") && !form.state?.trim())
      errorMessage.state = "general.required";

    if (needsValidation("home_zip_code", "home_zip_code")) {
      if (!form.home_zip_code?.trim()) {
        errorMessage.home_zip_code = "general.required";
      } else if (!zipRegex.test(form.home_zip_code.trim())) {
        errorMessage.home_zip_code = "form_fields.zip_code_error";
      }
    }

    if (
      form.has_mailing_address ||
      isRequired(formCongif, "has_mailing_address")
    ) {
      const mailFields: (keyof RegisterFormState)[] = [
        "mailing_address",
        "mailing_unit",
        "mailing_city",
        "mailing_state",
        "mailing_zip_code",
        "mailing_unit_type",
        "mailing_unit_number",
      ];
      mailFields.forEach(field => {
        const fieldValue = form[field];
        if (
          needsValidation(field, field) &&
          (typeof fieldValue !== "string" || !fieldValue.trim())
        ) {
          errorMessage[field] = "general.required";
        }
      });
    }

    if (form.change_of_address || isRequired(formCongif, "change_of_address")) {
      const mailFields: (keyof RegisterFormState)[] = [
        "prev_address",
        "prev_unit",
        "prev_city",
        "prev_state",
        "prev_zip_code",
        "prev_unit_number",
        "prev_unit_type",
      ];
      mailFields.forEach(field => {
        const fieldValue = form[field];
        if (
          needsValidation(field, field) &&
          (typeof fieldValue !== "string" || !fieldValue.trim())
        ) {
          errorMessage[field] = "general.required";
        }
      });
    }

    if (isWA === "connected_WA") {
      if (!form.has_no_state_license) {
        const configRegex =
          formCongif.fields.state_id_number?.validations?.regexp;
        const regex = configRegex ? new RegExp(`^${configRegex}$`) : idRegex;
        if (
          (!form.state_id_number.trim() ||
            !regex.test(form.state_id_number.trim())) &&
          form.state_id_number.trim() !== "NONE"
        ) {
          errorMessage.state_id_number = "general.required";
        }
        const isYearFilled = !!form.issueYear?.trim();
        const isMonthFilled = !!form.issueMonth?.trim();
        const isDayFilled = !!form.issueDay?.trim();

        if (!isMonthFilled) errorMessage.issueMonth = "general.required";
        if (!isDayFilled) errorMessage.issueDay = "general.required";
        if (!isYearFilled) {
          errorMessage.issueYear = "general.required";
        } else {
          if (isMonthFilled && isDayFilled) {
            const selectedDate = new Date(
              Number(form.issueYear),
              Number(form.issueMonth) - 1,
              Number(form.issueDay),
            );
            const today = new Date();

            today.setHours(0, 0, 0, 0);

            if (selectedDate > today) {
              errorMessage.issueYear = "washington.invalid_wdl_date";
            }
          }
        }

        if (
          form.issueYear.trim() &&
          form.issueMonth.trim() &&
          form.issueDay.trim()
        ) {
          const year = Number(form.issueYear);
          const month = Number(form.issueMonth) - 1;
          const day = Number(form.issueDay);

          const date = new Date(year, month, day);

          const isInvalidDate =
            date.getFullYear() !== year ||
            date.getMonth() !== month ||
            date.getDate() !== day;

          if (isInvalidDate) {
            errorMessage.issueDay = "form_fields.invalid_birth_date";
          }
        }
      }
    }

    const phoneReq = isRequired(formCongif, "phone", form.opt_in_sms);
    if (phoneReq && !form.phone?.trim()) {
      errorMessage.phone = "form_fields.required_phone";
    } else if (form.phone?.trim() && !fullPhoneRegex.test(form.phone.trim())) {
      errorMessage.phone = "form_fields.invalid_phone";
    }

    if (isWA === "connected_PA") {
      if (step === 2) {
        if (!form.has_no_state_license) {
          const configRegex =
            formCongif.fields.state_id_number?.validations?.regexp;
          const regex = configRegex ? new RegExp(`^${configRegex}$`) : idRegex;
          if (
            !form.state_id_number.trim() &&
            isRequired(formCongif, "state_id_number")
          ) {
            errorMessage.state_id_number =
              "pennsylvania.penn_dot_number_empty_error";
          } else if (!regex.test(form.state_id_number.trim())) {
            errorMessage.state_id_number =
              "pennsylvania.penn_dot_number_invalid_error";
          }
        }
      }
      if (step === 4) {
        if (form.has_no_ssn !== true) {
          if (
            !form.last_four_ss_number.trim() ||
            form.last_four_ss_number.trim().length !== 4
          ) {
            errorMessage.last_four_ss_number =
              "pennsylvania.ssn_last4_empty_error";
          } else if (!/^\d{4}$/.test(form.last_four_ss_number.trim())) {
            errorMessage.last_four_ss_number =
              "pennsylvania.ssn_last4_invalid_error";
          }
        }
        if (!form.signature_base64.trim()) {
          errorMessage.signature_base64 = "general.required";
        }
        if (
          form.someone_helped &&
          !form.helper_electronic_signature_acknowledged
        ) {
          errorMessage.helper_electronic_signature_acknowledged =
            "pennsylvania.helper_terms_confirm_required";
        }
        if (form.someone_helped) {
          if (!form.helper_name.trim()) {
            errorMessage.helper_name = "general.required";
          }
          if (!form.helper_address.trim()) {
            errorMessage.helper_address = "general.required";
          }
          if (!form.helper_phone.trim()) {
            errorMessage.helper_phone = "general.required";
          }
        }
      }
      if (!form.home_county.trim()) {
        errorMessage.home_county = "general.required";
      }

      if (!form.race.trim() && isRequired(formCongif, "race")) {
        errorMessage.race = "general.required";
      }
      if (!form.party.trim() && isRequired(formCongif, "party")) {
        errorMessage.party = "general.required";
      }
    }
    if (form.volunteer && isRequired(formCongif, "volunteer")) {
      errorMessage.volunteer = "general.required";
    }

    if (needsValidation("opt_in_email", "opt_in_email") && !form.opt_in_email) {
      errorMessage.opt_in_email = "general.required";
    }

    setErrMsg(errorMessage);
    return !Object.values(errorMessage).some(value => !!value);
  };

  const handleMainButtonClick = async () => {
    if (flowType === "connected_ovr") {
      if (step === 1) {
        if (validateConnectedOvr()) {
          setStep(2);
        }
      } else if (step === 2) {
        if (validateConnectedOvr()) {
          setStep(3);
        }
      } else {
        if (validateConnectedOvr()) {
          if (form.last_four_ss_number === "0000") {
            navigation.navigate("ZipError", {
              text: t("previous_step"),
              header: t("was_problem_text"),
            });
          } else {
            if (form.pa_preregistration_age_window) {
              navigation.navigate("Under18", { state });
            } else {
              const miPayload = mapFormStateToMICovrPayload(form);
              const response = await submitMICovr(miPayload);
              if (response.data.registrant_uid) {
                await AsyncStorage.setItem(
                  "rtv_registrant_uid",
                  response.data.registrant_uid,
                );

                await AsyncStorage.setItem(
                  "rtv_voter_name",
                  miPayload.full_name,
                );

                navigation.navigate("SuccessMI", { state });
              } else navigation.navigate("FailMI", { state, form });
            }
          }
        }
      }
    } else if (flowType === "paper") {
      // if (step === 1) {
      if (validate()) {
        //     setStep(2);
        //   }
        // } else {
        if (form.pa_preregistration_age_window) {
          navigation.navigate("Under18", { state });
        } else {
          if (form.mailForm) {
            navigation.navigate("Success", {
              form,
              state,
              workflow_type: "ovr", // ? state.ovr_type
              finish_with_state: false,
            });
          } else
            navigation.navigate("Print", {
              form,
              state,
              workflow_type: "ovr", // ? state.ovr_type
              finish_with_state: false,
            });
        }
      }
    } else if (flowType === "ovr_state") {
      if (step === 1) {
        if (validate()) {
          if (form.has_no_state_license) {
            setWorkflow("nvra");
            setShowRedirectText(true);
          }
          setStep(2);
        }
      } else if (step === 2) {
        if (validate()) {
          if (form.has_no_state_license) {
            if (form.pa_preregistration_age_window) {
              navigation.navigate("Under18", { state });
            } else {
              if (form.mailForm) {
                navigation.navigate("Success", {
                  form,
                  state,
                  workflow_type: "ovr", // ? state.ovr_type
                  finish_with_state: false,
                });
              } else
                navigation.navigate("Print", {
                  form,
                  state,
                  workflow_type: "ovr", // ? state.ovr_type
                  finish_with_state: false,
                });
            }
          } else {
            setWorkflow("nvra");
            setShowRedirectText(true);
            setStep(3);
          }
        }
      } else {
        if (validate()) {
          if (form.pa_preregistration_age_window) {
            navigation.navigate("Under18", { state });
          } else {
            if (form.mailForm) {
              navigation.navigate("Success", {
                form,
                state,
                workflow_type: "ovr", // ? state.ovr_type
                finish_with_state: false,
              });
            } else
              navigation.navigate("Print", {
                form,
                state,
                workflow_type: "ovr", // ? state.ovr_type
                finish_with_state: false,
              });
          }
        }
      }
    } else if (flowType === "connected_WA") {
      if (step === 1) {
        if (validateWA("connected_WA")) {
          if (!form.has_no_state_license) {
            if (form.pa_preregistration_age_window) {
              navigation.navigate("Under18", { state });
            } else {
              navigation.navigate("Print", {
                form,
                state,
                workflow_type: "ovr", // ? state.ovr_type
                finish_with_state: false,
              });
            }
          } else {
            setWorkflow("nvra");
            setShowRedirectText(true);
            setStep(2);
          }
        }
      } else {
        if (validateWA()) {
          // ???
          if (form.pa_preregistration_age_window) {
            navigation.navigate("Under18", { state });
          } else {
            navigation.navigate("Print", {
              form,
              state,
              workflow_type: "ovr", // ? state.ovr_type
              finish_with_state: false,
            });
          }
        }
      }
    } else if (flowType === "connected_PA") {
      if (step === 1) {
        if (validateWA("connected_PA")) {
          setStep(2);
        }
      } else if (step === 2) {
        if (validateWA("connected_PA")) {
          setStep(3);
        }
      } else if (step === 3) {
        if (form.has_no_state_license) {
          setStep(4);
        } else {
          if (validateWA("connected_PA")) {
            if (form.pa_preregistration_age_window) {
              navigation.navigate("Under18", { state });
            } else {
              navigation.navigate("Print", {
                form,
                state,
                workflow_type: "ovr", // ? state.ovr_type
                finish_with_state: false,
              });
            }
          }
        }
      } else if (step === 4) {
        if (validateWA("connected_PA")) {
          setStep(5);
        }
      } else {
        if (validateWA("connected_PA")) {
          if (form.pa_preregistration_age_window) {
            navigation.navigate("Under18", { state });
          } else {
            navigation.navigate("Print", {
              form,
              state,
              workflow_type: "ovr", // ? state.ovr_type
              finish_with_state: false,
            });
          }
        }
      }
    } else if (flowType === "connected_CA") {
      if (step === 1) {
        if (validateWA()) {
          setStep(2);
        }
      } else if (step === 2) {
        if (validateWA()) {
          setWorkflow("nvra");
          setShowRedirectText(true);
          setStep(3);
        }
      } else {
        if (validateWA()) {
          if (form.pa_preregistration_age_window) {
            navigation.navigate("Under18", { state });
          } else {
            navigation.navigate("Print", {
              form,
              state,
              workflow_type: "ovr", // ? state.ovr_type
              finish_with_state: false,
            });
          }
        }
      }
    } else navigation.navigate("Home");
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetchDataConfiguration({
          partner_id: "1",
          state_abbreviation: state.abbreviation,
          locale: i18n.language,
          workflow_type: workflow,
        });
        const config = response.data.configuration;
        setFormCongif(response.data.configuration);
        setForm((prev: RegisterFormState) => ({
          ...prev,
          opt_in_sms:
            initform?.opt_in_sms ??
            config.fields.opt_in_sms?.checked ??
            prev.opt_in_sms,
          opt_in_email:
            initform?.opt_in_email ??
            config.fields.opt_in_email?.checked ??
            prev.opt_in_email,
          volunteer: config.fields.opt_in_volunteer?.checked ?? prev.volunteer,
        }));
      } catch (err) {
        console.error("Failed to fetch Data configuration:", err);
      }
    };

    fetchConfig();
  }, [workflow]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getSurveyQuestions({
          partner_id: form.partner_id.toString(),
          locale: i18n.language,
        });
        const data = response.data;
        setForm((prev: RegisterFormState) => ({
          ...prev,
          survey_question_1: data.survey_question_1,
          survey_question_2: data.survey_question_2,
        }));
      } catch (err) {
        console.error("Failed to fetch Data configuration:", err);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (pageFromLookup === "paper" || pageFromLookup === "connected_ovr") {
      setStep(1);
    }
  }, [pageFromLookup]);

  useEffect(() => {
    setWorkflow(workflowType || "ovr");
  }, [workflowType]);

  const goBack = () => {
    setShowRedirectText(false);
    if (step === 1) {
      navigation.goBack();
    } else {
      setStep(prev => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev));
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }, [step]);

  return (
    <ScrollView ref={scrollRef}>
      <View style={styles.box}>
        {showRedirect && (
          <RenderHTML
            contentWidth={width}
            source={{
              html: t("nvra_form_page.redirect_notice", {
                state_abbr: state.abbreviation,
                state_name: state.name,
              }),
            }}
            tagsStyles={{
              body: {
                fontSize: 14,
                lineHeight: 18,
                marginVertical: 5,
              },
              strong: {
                fontWeight: "bold",
              },
            }}
          />
        )}
        {renderContent()}
        {flowType !== "not_participating" && (
          <Text style={styles.link} onPress={goBack}>
            {"< "} {t("general.previous_step")}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    box: {
      maxWidth: "100%",
      padding: 10,
    },
    strong: {
      fontWeight: "bold",
    },
    link: {
      marginTop: 20,
      marginHorizontal: "auto",
      color: theme.link,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "medium",
      textDecorationLine: "underline",
    },

    outlineButton: {
      borderWidth: 1,
      borderColor: theme.primary,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 10,
    },
    outlineButtonText: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: "600",
    },
  });
