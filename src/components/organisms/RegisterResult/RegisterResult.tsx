import React, {
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Button,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import i18n from "@/i18n";
import {
  mapFormStateToMICovrPayload,
  mapFormStateToPACovrPayload,
  mapFormStateToWACovrPayload,
} from "@/utils/constants";
import {
  DataCollectionConfiguration,
  RegisterFormState,
  RegisterFormStateError,
  ReportEventPayload,
  StateData,
} from "@/utils/types";
import {
  getFlowType,
  mapRegisterFormToVrLookupPayload,
  resolveWorkflowType,
} from "@/utils/registerRouting";
import {
  fetchDataConfiguration,
  reportEvent,
  submitFinishedWithState,
  submitLookup,
} from "@/utils/api";
import { submitAndCheckMICovr } from "@/utils/miCovr";
import { ThemeContext } from "@/styles/ThemeProvider";
import { RootStackParamList } from "../Navigation";

import { PaperOVR } from "../PaperOVR";
import { OvrState } from "../OvrState";
import { ConnectedOVR } from "../MI/ConnectedOVR";
import ConnectedOVRStep2 from "../MI/ConnectedOVRStep2";
import ConnectedOVRStep3 from "../MI/ConnectedOVRStep3";
import FinishWithState from "../FinishWithState";
import AcceptNotice from "../AcceptNotice";
import { ConnectedWA } from "../ConnectedWA";
import { ConnectedWAStep2 } from "../WA/ConnectedWAStep2";
import { ConnectedWAStep2Select } from "../WA/ConnectedWAStep2Select";
import { ConnectedWAStep3LocalUpload } from "../WA/ConnectedWAStep3LocalUpload";
import { ConnectedWAStep3Review } from "../WA/ConnectedWAStep3Review";
import { ConnectedPA } from "../PA/ConnectedPA";
import { ConnectedCA } from "../ConnectedCA";
import { ConnectedPAStep2 } from "../PA/ConnectedPAStep2";
import { ConnectedPAStep3HasID } from "../PA/ConnectedPAStep3HasID";
import RenderHTML from "react-native-render-html";
import { ConnectedPAStep3Select } from "../PA/ConnectedPAStep3Select";
import { ConnectedPAStep4Signature } from "../PA/ConnectedPAStep4Signature";
import { ConnectedPAStep3Device } from "../PA/ConnectedPAStep3Device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  EMPTY_ERROR_MESSAGES,
  validate,
  validateConnectedOvr,
  validateWA,
} from "./validation";
import { submitAndCheckPACovr } from "@/utils/paCovr";
import {
  classifyPACovrErrors,
  getPACovrFailNavigationExtras,
} from "@/utils/paCovrErrors";
import { submitAndCheckWACovr } from "@/utils/waCovr";

type RegisterScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

interface RegisterResultProps {
  state: StateData;
  zip: string;
  email: string;
  registrationUid: string;
  pageFromLookup: string;
  workflowType?: string;
  showRedirectText: boolean;
  form?: RegisterFormState;
  initialStep?: 1 | 2 | 3;
}

export const RegisterResult = ({
  state,
  zip,
  email,
  registrationUid,
  pageFromLookup,
  workflowType,
  showRedirectText,
  form: initform,
  initialStep,
}: RegisterResultProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<RegisterScreenNavigation>();
  const [showRedirect, setShowRedirectText] =
    useState<boolean>(showRedirectText);
  const scrollRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const [workflow, setWorkflow] = useState(() =>
    resolveWorkflowType(workflowType),
  );
  const isInitialWorkflowMount = useRef(true);
  const isMountedRef = useRef(true);
  const miSubmitAbortRef = useRef<AbortController | null>(null);
  const paSubmitAbortRef = useRef<AbortController | null>(null);
  const waSubmitAbortRef = useRef<AbortController | null>(null);

  const [step, setStep] = useState<SetStateAction<1 | 2 | 3 | 4 | 5>>(1);
  let flowType = pageFromLookup || getFlowType(state?.ovr_type || "");
  const [formCongif, setFormCongif] = useState<DataCollectionConfiguration>({
    fields: {},
    validations: {
      po_box_allowed: false,
      min_age: 18,
    },
    eligibility: {
      min_pre_reg_age: 18,
      min_vr_age: 18,
      min_age_election_day_buffer_days: 180,
      before_vr_deadline: true,
    },
  });
  const [errMsg, setErrMsg] =
    useState<RegisterFormStateError>(EMPTY_ERROR_MESSAGES);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    mailing_state: initform?.mailing_state || "",
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
    changed_party: initform?.changed_party || false,
    home_county: initform?.home_county || "",
    signature_base64: initform?.signature_base64 || "",
    signature_upload_method: initform?.signature_upload_method || "",

    birthMonth: initform?.birthMonth || "",
    birthDay: initform?.birthDay || "",
    birthYear: initform?.birthYear || "",
    date_of_birth: "",
    dob_routing_outcome: initform?.dob_routing_outcome ?? "",
    phone: initform?.phone || "",

    issueMonth: "",
    issueDay: "",
    issueYear: "",
    date_of_issue: "",
    military_service: initform?.military_service || false,
    non_standard_address: initform?.non_standard_address || "",

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

    upload: initform?.upload || "",
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
    mailing_address_number: initform?.mailing_postal_code || "",
    mailing_address_street_name: initform?.mailing_postal_code || "",
    mailing_address_street_type: initform?.mailing_postal_code || "",
    mailing_address_type: "STANDARD",
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
              <Button
                title={
                  isSubmitting
                    ? t("michigan.submitting_button")
                    : t("michigan.submit_button")
                }
                onPress={handleMainButtonClick}
                disabled={isSubmitting}
              />
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

        if (step === 2) {
          if (form.has_no_state_license) {
            return (
              <ConnectedWAStep2Select
                state={state}
                errorMessages={errMsg}
                value={form}
                formCongif={formCongif}
                onChange={setForm}
                onChangeError={setErrMsg}
                handleMainButton={
                  <Button
                    title={t("ovr_landing_page.next_button")}
                    onPress={() => {
                      if (form.upload === "print") {
                        navigation.navigate("Register", {
                          status: { success: true, errors: [] },
                          state,
                          zip: form.home_zip_code,
                          email: form.email_address,
                          form,
                          pageFromLookup: "paper",
                          workflowType: "nvra",
                          showRedirectText: true,
                        });
                      } else {
                        if (form.upload) {
                          handleMainButtonClick();
                        } else {
                          setErrMsg(prev => ({
                            ...prev,
                            upload: "washington.wdl_number_none_error",
                          }));
                        }
                      }
                    }}
                  />
                }
              />
            );
          }
          return (
            <ConnectedWAStep2
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
        if (step === 3) {
          if (form.has_no_state_license) {
            if (form.upload === "signature") {
              return (
                <ConnectedWAStep3LocalUpload
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
          return (
            <ConnectedWAStep3Review
              value={form}
              goBack={stepNumber => setStep(stepNumber)}
              handleMainButtonClick={handleMainButtonClick}
              isSubmitting={isSubmitting}
            />
          );
        }
        if (step === 4) {
          return (
            <ConnectedWAStep3Review
              value={form}
              goBack={stepNumber => setStep(stepNumber)}
              handleMainButtonClick={handleMainButtonClick}
              isSubmitting={isSubmitting}
            />
          );
        }
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
                handleMainButton={
                  <Button
                    title={t("ovr_landing_page.next_button")}
                    onPress={() => {
                      if (form.upload === "print") {
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
                        if (form.upload) {
                          handleMainButtonClick();
                        } else {
                          setErrMsg(prev => ({
                            ...prev,
                            upload: "pennsylvania.penn_dot_number_none_error",
                          }));
                        }
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
                isSubmitting={isSubmitting}
              />
            );
          }
        }
        if (step === 4) {
          if (form.upload === "signature") {
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
              isSubmitting={isSubmitting}
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
                  disabled={isSubmitting}
                />
              }
            />
          );
        break;
      case "not_participating":
        navigation.replace("NotParticipating", { state });
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
                    disabled={isSubmitting}
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
                handleMainButtonClick={handleMainButtonClick}
              />
            );
        }
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
                disabled={isSubmitting}
              />
            }
          />
        );
    }
  };

  const performValidation = () => {
    const result = validate(form, formCongif, flowType, showRedirect);
    setErrMsg(result.errorMessage);
    return result.isValid;
  };

  const performConnectedOvrValidation = () => {
    const result = validateConnectedOvr(form, formCongif, step);
    setErrMsg(result.errorMessage);
    return result.isValid;
  };

  const performWAValidation = (isWA: string = "") => {
    const result = validateWA(form, formCongif, step, isWA, form.upload);
    setErrMsg(result.errorMessage);
    return result.isValid;
  };

  const handlePaSubmit = async () => {
    setIsSubmitting(true);
    paSubmitAbortRef.current?.abort();
    const abortController = new AbortController();
    paSubmitAbortRef.current = abortController;
    let loggedPendingCheck = false;

    try {
      const paPayload = mapFormStateToPACovrPayload(form);
      const result = await submitAndCheckPACovr(paPayload, {
        signal: abortController.signal,
        onCheck: data => {
          const isTerminal =
            data.status === "success" || data.status === "failure";
          if (isTerminal || !loggedPendingCheck) {
            if (!isTerminal) {
              loggedPendingCheck = true;
            }
          }
        },
      });

      if (!isMountedRef.current) {
        return;
      }
      if (result.outcome === "success" && result.registrantUid) {
        await AsyncStorage.setItem("rtv_registrant_uid", result.registrantUid);
        await AsyncStorage.setItem(
          "rtv_voter_name",
          `${paPayload.first_name} ${paPayload.last_name}`.trim(),
        );
        navigation.replace("SuccessPA", { state });
        return;
      }

      const { variant } = classifyPACovrErrors(result.errors);
      const navigationExtras = getPACovrFailNavigationExtras(variant);
      const failState = {
        state,
        zip,
        email,
        form,
        ...navigationExtras,
      };

      navigation.navigate("FailPA", failState);
    } catch (error) {
      console.error("PA submit failed:", error);
      if (isMountedRef.current) {
        navigation.navigate("FailPA", { state, zip, email, form });
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  const handleWaSubmit = async () => {
    setIsSubmitting(true);
    waSubmitAbortRef.current?.abort();
    const abortController = new AbortController();
    waSubmitAbortRef.current = abortController;
    let loggedPendingCheck = false;
    try {
      const waPayload = mapFormStateToWACovrPayload(form);
      const result = await submitAndCheckWACovr(waPayload, {
        signal: abortController.signal,
        onCheck: data => {
          const isTerminal =
            data.status === "success" || data.status === "failure";
          if (isTerminal || !loggedPendingCheck) {
            if (!isTerminal) {
              loggedPendingCheck = true;
            }
          }
        },
      });

      if (!isMountedRef.current) {
        return;
      }

      if (result.outcome === "success" && result.registrantUid) {
        await AsyncStorage.setItem("rtv_registrant_uid", result.registrantUid);
        await AsyncStorage.setItem(
          "rtv_voter_name",
          `${waPayload.first_name} ${waPayload.last_name}`.trim(),
        );
        navigation.navigate("SuccessWA", { state });
      } else {
        // Check returning a documented failure should route to the WA fail screen
        // (retry / paper form prompt), but still be treated as an error.
        if (result.errors?.length) {
          console.error("WA check failed:", result.errors);
        }
        navigation.navigate("FailWA", { state, zip, email, form });
      }
    } catch (error) {
      console.error("WA submit failed:", error);
      if (isMountedRef.current) {
        navigation.navigate("FailWA", { state, zip, email, form });
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  const navigateToNvraPrintOrSuccess = () => {
    if (form.mailForm) {
      navigation.replace("Success", {
        form,
        state,
        workflow_type: "ovr",
        finish_with_state: false,
      });
    } else {
      navigation.replace("Print", {
        form,
        state,
        workflow_type: "ovr",
        finish_with_state: false,
      });
    }
  };

  const navigateToPreRegister = () => {
    navigation.replace("PreRegister", {
      state,
      form,
      workflow_type: workflow,
      formCongif,
    });
  };

  const finalizeNvraRegistration = async (
    validateForm: () => boolean = () => performValidation(),
  ) => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = mapRegisterFormToVrLookupPayload(
        form,
        state.abbreviation,
      );
      const responseLookup = await submitLookup(payload);

      if (!isMountedRef.current) {
        return;
      }

      if (responseLookup.data.found) {
        navigation.replace("AlreadyRegistered", { state, form });
        return;
      }

      if (form.dob_routing_outcome === "pre_registration_notice") {
        await reportEvent({
          registration_uid: registrationUid,
          partner_id: form.partner_id.toString(),
          step: 2,
          event_name: "nvra_pre_reg",
        });
        navigateToPreRegister();
        return;
      }

      if (form.dob_routing_outcome === "under_18_election_day_ok") {
        await reportEvent({
          registration_uid: registrationUid,
          partner_id: form.partner_id.toString(),
          step: 2,
          event_name: "nvra_under_18",
        });
        navigation.replace("Under18", {
          state,
          form,
          workflow_type: workflow,
          registration_uid: registrationUid,
        });
        return;
      }

      let eventName: ReportEventPayload["event_name"] = "nvra_print_request";
      if (form.mailForm) {
        eventName = "nvra_email_quest";
      }
      await reportEvent({
        registration_uid: registrationUid,
        partner_id: form.partner_id.toString(),
        step: 2,
        event_name: eventName,
      });
      navigateToNvraPrintOrSuccess();
    } catch (errorTitle) {
      console.error("VR lookup failed:", errorTitle);
      if (isMountedRef.current) {
        navigation.replace("ApiError", { state });
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  const handleMainButtonClick = async () => {
    if (flowType === "connected_ovr") {
      if (step === 1) {
        if (performConnectedOvrValidation()) {
          setStep(2);
        }
      } else if (step === 2) {
        if (performConnectedOvrValidation()) {
          setStep(3);
        }
      } else {
        if (performConnectedOvrValidation()) {
          if (form.last_four_ss_number === "0000") {
            navigation.replace("ZipError", {
              text: t("previous_step"),
              header: t("was_problem_text"),
              user: null,
            });
          } else {
            if (form.dob_routing_outcome === "under_18_election_day_ok") {
              navigation.replace("Under18", {
                state,
                form,
                workflow_type: workflow,
                registration_uid: registrationUid,
              });
            } else {
              setIsSubmitting(true);
              miSubmitAbortRef.current?.abort();
              const abortController = new AbortController();
              miSubmitAbortRef.current = abortController;

              try {
                const miPayload = mapFormStateToMICovrPayload(form);
                const result = await submitAndCheckMICovr(miPayload, {
                  signal: abortController.signal,
                });

                if (!isMountedRef.current) {
                  return;
                }

                if (result.outcome === "success" && result.registrantUid) {
                  await AsyncStorage.setItem(
                    "rtv_registrant_uid",
                    result.registrantUid,
                  );
                  await AsyncStorage.setItem(
                    "rtv_voter_name",
                    miPayload.full_name,
                  );
                  navigation.replace("SuccessMI", { state });
                } else {
                  navigation.navigate("FailMI", { state, zip, email, form });
                }
              } catch (error) {
                console.error("MI COVR submit failed:", error);
                if (isMountedRef.current) {
                  navigation.navigate("FailMI", { state, zip, email, form });
                }
              } finally {
                if (isMountedRef.current) {
                  setIsSubmitting(false);
                }
              }
            }
          }
        }
      }
    } else if (flowType === "paper") {
      await finalizeNvraRegistration();
    } else if (flowType === "ovr_state") {
      if (step === 1) {
        if (performValidation()) {
          if (form.has_no_state_license) {
            setWorkflow("nvra");
            setShowRedirectText(true);
          }
          setStep(2);
        }
      } else if (step === 2) {
        if (form.has_no_state_license) {
          await finalizeNvraRegistration();
        } else if (performValidation()) {
          try {
            await submitFinishedWithState({
              workflow_type: workflow,
              registrant: {
                name_title: form.name_title,
                first_name: form.first_name,
                last_name: form.last_name,
                date_of_birth: form.date_of_birth,
                email_address: form.email_address,
                state: form.state,
                lang: form.lang,
                home_zip_code: form.home_zip_code,
                us_citizen: form.us_citizen,
                will_be_18_by_election: form.will_be_18_by_election,
                opt_in_email: form.opt_in_email,
                opt_in_sms: form.opt_in_sms,
                partner_id: form.partner_id,

                survey_question_1: form.survey_question_1,
                survey_answer_1: form.survey_answer_1,
                survey_question_2: form.survey_question_2,
                survey_answer_2: form.survey_answer_2,
              },
            });
            if (state?.online_registration_system_url)
              Linking.openURL(state.online_registration_system_url);
            navigation.replace("FinishWithState", { state });
          } catch (error: any) {
            console.log("Error", error);
            navigation.replace("FinishWithState", { state });
          }
        }
      }
    } else if (flowType === "connected_WA") {
      if (step === 1) {
        if (performWAValidation("connected_WA")) {
          if (!form.has_no_state_license) {
            if (form.dob_routing_outcome === "under_18_election_day_ok") {
              navigation.replace("Under18", {
                state,
                form,
                workflow_type: workflow,
                registration_uid: registrationUid,
              });
            } else {
              setForm(prev => ({ ...prev, last_four_ss_number: "" }));
              setStep(2);
            }
          } else {
            setStep(2);
          }
        }
      } else if (step === 2) {
        if (form.has_no_state_license) {
          setStep(3);
        } else if (performWAValidation("connected_WA")) {
          if (form.dob_routing_outcome === "under_18_election_day_ok") {
            navigation.replace("Under18", {
              state,
              form,
              workflow_type: workflow,
              registration_uid: registrationUid,
            });
          } else {
            setStep(3);
          }
        }
      } else if (step === 3) {
        if (form.has_no_state_license) {
          if (performWAValidation("connected_WA")) {
            setStep(4);
          }
        } else if (performWAValidation("connected_WA")) {
          if (form.dob_routing_outcome === "under_18_election_day_ok") {
            navigation.replace("Under18", {
              state,
              form,
              workflow_type: workflow,
              registration_uid: registrationUid,
            });
          } else {
            await handleWaSubmit();
          }
        }
      } else if (step === 4) {
        if (performWAValidation("connected_WA")) {
          if (form.dob_routing_outcome === "under_18_election_day_ok") {
            navigation.replace("Under18", {
              state,
              form,
              workflow_type: workflow,
              registration_uid: registrationUid,
            });
          } else {
            await handleWaSubmit();
          }
        }
      }
    } else if (flowType === "connected_PA") {
      if (step === 1) {
        if (performWAValidation("connected_PA")) {
          setStep(2);
        }
      } else if (step === 2) {
        if (performWAValidation("connected_PA")) {
          setStep(3);
        }
      } else if (step === 3) {
        if (form.has_no_state_license) {
          setStep(4);
        } else {
          if (performWAValidation("connected_PA")) {
            if (form.dob_routing_outcome === "under_18_election_day_ok") {
              navigation.replace("Under18", {
                state,
                form,
                workflow_type: workflow,
                registration_uid: registrationUid,
              });
            } else {
              await handlePaSubmit();
            }
          }
        }
      } else if (step === 4) {
        if (performWAValidation("connected_PA")) {
          setStep(5);
        }
      } else {
        if (performWAValidation("connected_PA")) {
          if (form.dob_routing_outcome === "under_18_election_day_ok") {
            navigation.replace("Under18", {
              state,
              form,
              workflow_type: workflow,
              registration_uid: registrationUid,
            });
          } else {
            await handlePaSubmit();
          }
        }
      }
    } else if (flowType === "connected_CA") {
      if (step === 1) {
        if (performWAValidation()) {
          setStep(2);
        }
      } else if (step === 2) {
        if (performWAValidation()) {
          setWorkflow("nvra");
          setShowRedirectText(true);
          setStep(3);
        }
      } else {
        await finalizeNvraRegistration(performWAValidation);
      }
    } else navigation.navigate("Home");
  };

  useEffect(() => {
    setShowRedirectText(showRedirectText);
  }, [showRedirectText]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      miSubmitAbortRef.current?.abort();
      paSubmitAbortRef.current?.abort();
      waSubmitAbortRef.current?.abort();
    };
  }, []);

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
    if (initialStep) {
      setStep(initialStep);
    } else if (
      pageFromLookup === "paper" ||
      pageFromLookup === "connected_ovr"
    ) {
      setStep(1);
    }
  }, [pageFromLookup, initialStep]);

  useEffect(() => {
    if (isInitialWorkflowMount.current) {
      isInitialWorkflowMount.current = false;
      return;
    }
    setWorkflow(resolveWorkflowType(workflowType));
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
    link: {
      marginTop: 20,
      marginHorizontal: "auto",
      color: theme.link,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "medium",
      textDecorationLine: "underline",
    },
  });
