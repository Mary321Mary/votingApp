import React, {
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Linking,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import RenderHTML from "react-native-render-html";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import i18n from "@/i18n";
import {
  isVisible,
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
  allowsPaperFallback,
  getFlowType,
  mapRegisterFormToVrLookupPayload,
  resolveWorkflowType,
} from "@/utils/register/registerRouting";
import {
  fetchDataConfiguration,
  reportEvent,
  submitFinishedWithState,
  submitLookup,
} from "@/utils/api";
import { submitAndCheckMICovr } from "@/utils/register/miCovr";
import { ThemeContext } from "@/styles/ThemeProvider";
import { RootStackParamList } from "../../Navigation";

import {
  EMPTY_ERROR_MESSAGES,
  validate,
  validateConnectedOvr,
  validateWA,
} from "./validation";
import { submitAndCheckPACovr } from "@/utils/register/paCovr";
import {
  classifyPACovrErrors,
  getPACovrFailNavigationExtras,
} from "@/utils/register/paCovrErrors";
import { submitAndCheckWACovr } from "@/utils/register/waCovr";
import RegisterFlowContent from "./RegisterFlowContent";
import { getInitialFormState } from "./initFormState";
import { useFormScroll } from "../../../contexts/FormScrollContext";
import { REPORT_EVENT_STEPS } from "../../../utils/report/eventReporting";
import { apiTimeoutMethodFromPollErrors } from "../../../utils/report/covrFailReporting";
import Spinner from "../../atoms/Spinner";

export type RegisterScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

interface RegisterResultProps {
  state: StateData;
  zip: string;
  email: string;
  counties?: string[];
  pageFromLookup: string;
  workflowType?: string;
  showRedirectText: boolean;
  /** When true, show the voluntary paper-registration notice instead of the no-ID notice. */
  voluntaryPaperRedirect?: boolean;
  isRedirectedCompressNVRA?: boolean;
  form?: RegisterFormState;
  initialStep?: 1 | 2 | 3;
}

export const RegisterResult = ({
  state,
  zip,
  email,
  counties,
  pageFromLookup,
  workflowType,
  showRedirectText = false,
  isRedirectedCompressNVRA = false,
  voluntaryPaperRedirect = false,
  form: initform,
  initialStep,
}: RegisterResultProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<RegisterScreenNavigation>();
  const [showRedirect, setShowRedirectText] =
    useState<boolean>(showRedirectText);
  const { width } = useWindowDimensions();
  const [workflow, setWorkflow] = useState(() =>
    resolveWorkflowType(workflowType),
  );

  const { scrollViewRef, scrollToFirstError } = useFormScroll();
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
      allows_pre_reg: false,
      min_pre_reg_age: 18,
      min_vr_age: 18,
      min_age_election_day_buffer_days: 180,
      before_vr_deadline: true,
    },
  });
  const [errMsg, setErrMsg] =
    useState<RegisterFormStateError>(EMPTY_ERROR_MESSAGES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  const [form, setForm] = useState<RegisterFormState>(() =>
    getInitialFormState(initform, "1", state, zip, email),
  );

  const shortLang = i18n.language.split("-")[0];

  const effectiveFlowType = useMemo(() => {
    return !state.ovr_locales.includes(shortLang) &&
      flowType !== "not_participating" &&
      allowsPaperFallback(state)
      ? "paper"
      : flowType;
  }, [state?.ovr_locales, shortLang, flowType]);

  const renderContent = () => {
    return (
      <RegisterFlowContent
        state={state}
        counties={counties || []}
        form={form}
        formCongif={formCongif}
        errMsg={errMsg}
        step={step}
        flowType={effectiveFlowType}
        isRedirectedCompressNVRA={isRedirectedCompressNVRA}
        setStep={setStep}
        setForm={setForm}
        setErrMsg={setErrMsg}
        handleMainButtonClick={handleMainButtonClick}
        isSubmitting={isSubmitting}
      />
    );
  };

  const performValidation = async () => {
    const result = validate(form, formCongif, flowType, showRedirect);

    if (
      result.errorMessage.us_citizen ||
      result.errorMessage.will_be_18_by_election
    ) {
      const registration_uid =
        (await AsyncStorage.getItem(`registration_uid`)) || "";

      if (flowType === "paper") {
        await reportEvent({
          registration_uid,
          partner_id: form.partner_id.toString() || "1",
          step: REPORT_EVENT_STEPS.REJECTED,
          event_name: "failed eligibility checks",
        });
      } else {
        await reportEvent({
          registration_uid,
          partner_id: form.partner_id.toString() || "1",
          step: REPORT_EVENT_STEPS.REJECTED,
          event_name: "finish with state form: failed eligibility checks",
        });
      }
    }

    if (!result.isValid) {
      scrollToFirstError(result.errorMessage);
    }

    setErrMsg(result.errorMessage);
    return result.isValid;
  };

  const performConnectedOvrValidation = async () => {
    const result = validateConnectedOvr(form, formCongif, step);

    if (
      result.errorMessage.us_citizen ||
      result.errorMessage.will_be_18_by_election ||
      form.updated_dln_recently === "no" ||
      form.request_duplicate_dln_today === "no"
    ) {
      const registration_uid =
        (await AsyncStorage.getItem(`registration_uid`)) || "";

      await reportEvent({
        registration_uid,
        partner_id: form.partner_id.toString() || "1",
        step: REPORT_EVENT_STEPS.REJECTED,
        event_name: "MI covr: failed eligibility checks",
      });
    }

    if (!result.isValid) {
      scrollToFirstError(result.errorMessage);
    }

    setErrMsg(result.errorMessage);
    return result.isValid;
  };

  const performWAValidation = async (isWA: string = "") => {
    const result = validateWA(form, formCongif, step, isWA, form.upload);

    const registration_uid =
      (await AsyncStorage.getItem(`registration_uid`)) || "";

    if (isWA === "connected_WA") {
      if (
        result.errorMessage.us_citizen ||
        result.errorMessage.will_be_18_by_election
      ) {
        await reportEvent({
          registration_uid,
          partner_id: form.partner_id.toString() || "1",
          step: REPORT_EVENT_STEPS.REJECTED,
          event_name: "WA covr: failed eligibility checks",
        });
      }
    } else if (isWA === "connected_PA") {
      if (
        result.errorMessage.us_citizen ||
        result.errorMessage.will_be_18_by_election
      ) {
        await reportEvent({
          registration_uid,
          partner_id: form.partner_id.toString() || "1",
          step: REPORT_EVENT_STEPS.REJECTED,
          event_name: "PA covr: failed eligibility checks",
        });
      }
    } else {
      if (
        result.errorMessage.us_citizen ||
        result.errorMessage.will_be_18_by_election
      ) {
        await reportEvent({
          registration_uid,
          partner_id: form.partner_id.toString() || "1",
          step: REPORT_EVENT_STEPS.REJECTED,
          event_name: "CA covr: failed eligibility checks",
        });
      }
    }

    if (!result.isValid) {
      scrollToFirstError(result.errorMessage);
    }

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
      const registration_uid = await AsyncStorage.getItem("registration_uid");
      const paPayload = mapFormStateToPACovrPayload(
        form,
        registration_uid || "",
      );
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
        navigation.replace("SuccessPA", { state, form });
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
        apiTimeoutMethod: apiTimeoutMethodFromPollErrors(
          result.errors,
          "check_pa_covr",
        ),
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
      const registration_uid = await AsyncStorage.getItem("registration_uid");
      const waPayload = mapFormStateToWACovrPayload(
        form,
        registration_uid || "",
      );
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
        navigation.replace("SuccessWA", { state, form });
      } else {
        // Check returning a documented failure should route to the WA fail screen
        // (retry / paper form prompt), but still be treated as an error.
        if (result.errors?.length) {
          console.error("WA check failed:", result.errors);
        }
        navigation.navigate("FailWA", {
          state,
          zip,
          email,
          form,

          apiTimeoutMethod: apiTimeoutMethodFromPollErrors(
            result.errors,
            "check_wa_covr",
          ),
        });
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
        workflow_type:
          !state.ovr_locales.includes(shortLang) &&
          flowType !== "not_participating"
            ? "nvra"
            : workflow,
        finish_with_state: false,
      });
    } else {
      navigation.replace("Print", {
        form,
        state,
        workflow_type:
          !state.ovr_locales.includes(shortLang) &&
          flowType !== "not_participating"
            ? "nvra"
            : workflow,
        finish_with_state: false,
      });
    }
  };

  const navigateToPreRegister = async () => {
    const registration_uid =
      (await AsyncStorage.getItem(`registration_uid`)) || "";
    await reportEvent({
      registration_uid,
      partner_id: form.partner_id.toString(),
      step: REPORT_EVENT_STEPS.STEP_2,
      event_name: "nvra_pre_reg",
    });
    navigation.navigate("PreRegister", {
      state,
      form,
      workflow_type: workflow,
      formCongif,
      registration_uid,
    });
  };

  const navigateToUnde18Register = async () => {
    const registration_uid =
      (await AsyncStorage.getItem(`registration_uid`)) || "";
    await reportEvent({
      registration_uid,
      partner_id: form.partner_id.toString(),
      step: REPORT_EVENT_STEPS.STEP_2,
      event_name: "nvra_under_18",
    });
    navigation.navigate("Under18", {
      state,
      form,
      workflow_type: workflow,
      registration_uid,
    });
  };

  const finalizeNvraRegistration = async (checkDOB = true) => {
    const isValid = await performValidation();
    if (!isValid) {
      return;
    }

    const registration_uid =
      (await AsyncStorage.getItem(`registration_uid`)) || "";

    setIsSubmitting(true);
    try {
      if (state.vr_lookup_on_nvra_form) {
        const payload = mapRegisterFormToVrLookupPayload(form);
        const responseLookup = await submitLookup(payload);

        if (!isMountedRef.current) {
          return;
        }

        if (responseLookup.data.found) {
          navigation.replace("AlreadyRegistered", {
            state,
            form,
            workflow_type: workflow,
          });
          return;
        }
      }

      if (checkDOB) {
        if (form.dob_routing_outcome === "pre_registration_notice") {
          navigateToPreRegister();
          return;
        }

        if (form.dob_routing_outcome === "under_18_election_day_ok") {
          navigateToUnde18Register();
          return;
        }
      }

      let eventName: ReportEventPayload["event_name"] = "nvra_print_request";
      if (form.mailForm) {
        eventName = "nvra_email_quest";
      }
      await reportEvent({
        registration_uid,
        partner_id: form.partner_id.toString(),
        step: REPORT_EVENT_STEPS.STEP_2,
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
    const registration_uid =
      (await AsyncStorage.getItem(`registration_uid`)) || "";

    if (effectiveFlowType === "connected_ovr") {
      if (step === 1) {
        if (await performConnectedOvrValidation()) {
          setStep(2);
        }
      } else if (step === 2) {
        if (await performConnectedOvrValidation()) {
          if (form.dob_routing_outcome === "pre_registration_notice") {
            navigateToPreRegister();
            return;
          }

          if (form.dob_routing_outcome === "under_18_election_day_ok") {
            navigateToUnde18Register();
            return;
          }
          setStep(3);
        }
      } else {
        if (await performConnectedOvrValidation()) {
          if (form.last_four_ss_number === "0000") {
            navigation.replace("ZipError", {
              text: t("previous_step"),
              header: t("was_problem_text"),
              user: null,
            });
          } else {
            setIsSubmitting(true);
            miSubmitAbortRef.current?.abort();
            const abortController = new AbortController();
            miSubmitAbortRef.current = abortController;

            try {
              const miPayload = mapFormStateToMICovrPayload(
                form,
                registration_uid,
              );
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
                navigation.replace("SuccessMI", { state, form });
              } else {
                navigation.navigate("FailMI", {
                  state,
                  zip,
                  email,
                  form,
                  apiTimeoutMethod: apiTimeoutMethodFromPollErrors(
                    result.errors,
                    "check_mi_covr",
                  ),
                });
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
    } else if (effectiveFlowType === "paper") {
      await finalizeNvraRegistration(!isRedirectedCompressNVRA);
    } else if (effectiveFlowType === "ovr_state") {
      if (step === 1) {
        if (await performValidation()) {
          if (form.dob_routing_outcome === "pre_registration_notice") {
            navigateToPreRegister();
            return;
          }

          if (form.dob_routing_outcome === "under_18_election_day_ok") {
            navigateToUnde18Register();
            return;
          }

          if (form.has_no_state_license && allowsPaperFallback(state)) {
            setWorkflow("nvra");
            setShowRedirectText(true);
          }
          setStep(2);
        }
      } else if (step === 2) {
        if (await performValidation()) {
          if (form.has_no_state_license && allowsPaperFallback(state)) {
            await finalizeNvraRegistration(false);
          } else {
            try {
              await submitFinishedWithState({
                workflow_type: workflow,
                registrant: {
                  registration_uid,
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

              navigation.replace("FinishWithState", { state, form });
            } catch (error: any) {
              console.log("Error", error);
              navigation.replace("FinishWithState", { state, form });
            }
          }
        }
      }
    } else if (effectiveFlowType === "connected_WA") {
      if (step === 1) {
        if (await performWAValidation("connected_WA")) {
          if (form.dob_routing_outcome === "pre_registration_notice") {
            navigateToPreRegister();
            return;
          }

          if (form.dob_routing_outcome === "under_18_election_day_ok") {
            navigateToUnde18Register();
            return;
          }

          setStep(2);
        }
      } else if (step === 2) {
        if (form.has_no_state_license) {
          if (form.upload !== "") setStep(3);
        } else if (await performWAValidation("connected_WA")) {
          setStep(3);
        }
      } else if (step === 3) {
        if (form.has_no_state_license) {
          if (await performWAValidation("connected_WA")) {
            setStep(4);
          }
        } else if (await performWAValidation("connected_WA")) {
          await handleWaSubmit();
        }
      } else {
        if (await performWAValidation("connected_WA")) {
          await handleWaSubmit();
        }
      }
    } else if (effectiveFlowType === "connected_PA") {
      if (step === 1) {
        if (await performWAValidation("connected_PA")) {
          if (form.dob_routing_outcome === "pre_registration_notice") {
            navigateToPreRegister();
            return;
          }

          if (form.dob_routing_outcome === "under_18_election_day_ok") {
            navigateToUnde18Register();
            return;
          }

          setStep(2);
        }
      } else if (step === 2) {
        if (await performWAValidation("connected_PA")) {
          setStep(3);
        }
      } else if (step === 3) {
        if (form.has_no_state_license) {
          setStep(4);
        } else {
          if (await performWAValidation("connected_PA")) {
            await handlePaSubmit();
          }
        }
      } else if (step === 4) {
        if (await performWAValidation("connected_PA")) {
          setStep(5);
        }
      } else {
        if (await performWAValidation("connected_PA")) {
          await handlePaSubmit();
        }
      }
    } else if (effectiveFlowType === "connected_CA") {
      if (step === 1) {
        if (await performWAValidation()) {
          if (form.dob_routing_outcome === "pre_registration_notice") {
            navigateToPreRegister();
            return;
          }

          if (form.dob_routing_outcome === "under_18_election_day_ok") {
            navigateToUnde18Register();
            return;
          }

          setStep(2);
        }
      } else if (step === 2) {
        if (await performWAValidation()) {
          setWorkflow("nvra");
          setShowRedirectText(true);
          setStep(3);
        }
      } else {
        await finalizeNvraRegistration(false);
      }
    } else navigation.replace("Home");
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
      setIsLoadingConfig(true);
      try {
        const response = await fetchDataConfiguration({
          partner_id: "1",
          state_abbreviation: state.abbreviation,
          locale: i18n.language,
          workflow_type:
            !state.ovr_locales.includes(shortLang) &&
            flowType !== "not_participating"
              ? "nvra"
              : workflow,
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
          will_be_18_by_election: isVisible(config, "will_be_18_by_election")
            ? form.will_be_18_by_election
            : true,
        }));
      } catch (err) {
        console.error("Failed to fetch Data configuration:", err);
      } finally {
        setIsLoadingConfig(false);
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
    scrollViewRef.current
      ?.getScrollResponder()
      ?.scrollTo({ y: 0, animated: true });
  }, [step, scrollViewRef]);

  if (isLoadingConfig) {
    return <Spinner />;
  }

  const noticeI18nKey = voluntaryPaperRedirect
    ? "nvra_form_page.redirect_notice_voluntary"
    : form.has_no_state_license
    ? "nvra_form_page.redirect_notice_no_dl"
    : "nvra_form_page.redirect_notice_have_dl";

  return (
    <KeyboardAwareScrollView
      ref={scrollViewRef}
      enableOnAndroid={true}
      extraScrollHeight={30}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.box}>
        {showRedirect && (
          <RenderHTML
            contentWidth={width}
            source={{
              html: t(noticeI18nKey, {
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
    </KeyboardAwareScrollView>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    box: {
      maxWidth: "100%",
      padding: 10,
    },
    link: {
      marginVertical: 10,
      marginHorizontal: "auto",
      color: theme.link,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "medium",
      textDecorationLine: "underline",
    },
  });
