import React, { SetStateAction, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

import { reportEvent } from "utils/api";
import {
  DataCollectionConfiguration,
  RegisterFormState,
  RegisterFormStateError,
  StateData,
} from "utils/types";
import { ConnectedOVR } from "../MI/ConnectedOVR";
import { Button } from "react-native";
import ConnectedOVRStep2 from "../MI/ConnectedOVRStep2";
import ConnectedOVRStep3 from "../MI/ConnectedOVRStep3";
import { ConnectedWA } from "../WA/ConnectedWA";
import { ConnectedWAStep2Select } from "../WA/ConnectedWAStep2Select";
import { useNavigation } from "@react-navigation/native";
import { RegisterScreenNavigation } from "./RegisterResult";
import { ConnectedWAStep2 } from "../WA/ConnectedWAStep2";
import { ConnectedWAStep3LocalUpload } from "../WA/ConnectedWAStep3LocalUpload";
import { ConnectedPAStep3Device } from "../PA/ConnectedPAStep3Device";
import { ConnectedWAStep3Review } from "../WA/ConnectedWAStep3Review";
import { ConnectedPA } from "../PA/ConnectedPA";
import { ConnectedPAStep2 } from "../PA/ConnectedPAStep2";
import { ConnectedPAStep3Select } from "../PA/ConnectedPAStep3Select";
import { ConnectedPAStep3HasID } from "../PA/ConnectedPAStep3HasID";
import { ConnectedPAStep4Signature } from "../PA/ConnectedPAStep4Signature";
import { ConnectedCA } from "../ConnectedCA";
import AcceptNotice from "../AcceptNotice";
import { PaperOVR } from "../PaperOVR";
import { OvrState } from "../OvrState";
import FinishWithState from "../FinishWithState";
import { REPORT_EVENT_STEPS } from "../../../utils/report/eventReporting";
import { allowsPaperFallback } from "../../../utils/register/registerRouting";
import { isFinishOnOtherDeviceEnabled } from "../../../utils/constants";

interface RegisterFlowContentProps {
  state: StateData;
  counties: string[];
  form: RegisterFormState;
  formCongif: DataCollectionConfiguration;
  errMsg: RegisterFormStateError;
  step: SetStateAction<1 | 2 | 3 | 4 | 5>;
  flowType: string;
  setStep: React.Dispatch<React.SetStateAction<1 | 2 | 3 | 4 | 5>>;
  setForm: React.Dispatch<React.SetStateAction<RegisterFormState>>;
  setErrMsg: React.Dispatch<React.SetStateAction<RegisterFormStateError>>;
  handleMainButtonClick: () => void | Promise<void>;
  isSubmitting?: boolean;
  isRedirectedCompressNVRA?: boolean;
}

const RegisterFlowContent = ({
  state,
  counties,
  form,
  formCongif,
  errMsg,
  step,
  flowType,
  setStep,
  setForm,
  setErrMsg,
  handleMainButtonClick,
  isSubmitting = false,
  isRedirectedCompressNVRA = false,
}: RegisterFlowContentProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<RegisterScreenNavigation>();

  useEffect(() => {
    if (!form.has_no_state_license || form.upload !== "device") return;
    if (isFinishOnOtherDeviceEnabled(formCongif)) return;

    if (flowType === "connected_WA" && step === 3) {
      setForm(prev => ({ ...prev, upload: "" }));
      setStep(2);
    } else if (flowType === "connected_PA" && step === 4) {
      setForm(prev => ({ ...prev, upload: "" }));
      setStep(3);
    }
  }, [
    flowType,
    step,
    form.has_no_state_license,
    form.upload,
    formCongif,
    setForm,
    setStep,
  ]);

  useEffect(() => {
    const sendStepAnalytics = async () => {
      const registration_uid =
        (await AsyncStorage.getItem(`registration_uid`)) || "";

      try {
        if (flowType === "connected_ovr") {
          if (step === 1) {
            // ConnectedOVR
            await reportEvent({
              registration_uid,
              partner_id: form.partner_id.toString() || "1",
              step: REPORT_EVENT_STEPS.STEP_1,
              event_name: "MI covr eligibility",
            });
          }
          if (step === 2) {
            // ConnectedOVRStep2
            await reportEvent({
              registration_uid,
              partner_id: form.partner_id.toString() || "1",
              step: REPORT_EVENT_STEPS.STEP_1,
              event_name: "MI covr personal info",
            });
          }
          if (step === 3) {
            // ConnectedOVRStep3
            await reportEvent({
              registration_uid,
              partner_id: form.partner_id.toString() || "1",
              step: REPORT_EVENT_STEPS.STEP_2,
              event_name: "MI covr address info",
            });
          }
          return;
        }

        switch (flowType) {
          case "connected_WA":
            if (step === 1) {
              // ConnectedWA
              await reportEvent({
                registration_uid,
                partner_id: form.partner_id.toString() || "1",
                step: REPORT_EVENT_STEPS.STEP_1,
                event_name: "WA covr personal info",
              });
            }

            if (step === 2) {
              if (form.has_no_state_license) {
                // ConnectedWAStep2Select
                await reportEvent({
                  registration_uid,
                  partner_id: form.partner_id.toString() || "1",
                  step: REPORT_EVENT_STEPS.STEP_2,
                  event_name: "WA covr additional required",
                });
              } else {
                // ConnectedWAStep2
                await reportEvent({
                  registration_uid,
                  partner_id: form.partner_id.toString() || "1",
                  step: REPORT_EVENT_STEPS.STEP_2,
                  event_name: "WA covr additional optional",
                });
              }
            }
            if (step === 3) {
              if (form.has_no_state_license) {
                if (form.upload === "signature") {
                  // ConnectedWAStep3LocalUpload
                  await reportEvent({
                    registration_uid,
                    partner_id: form.partner_id.toString() || "1",
                    step: REPORT_EVENT_STEPS.STEP_3,
                    event_name: "WA download image",
                  });
                } else {
                  // ConnectedPAStep3Device
                  await reportEvent({
                    registration_uid,
                    partner_id: form.partner_id.toString() || "1",
                    step: REPORT_EVENT_STEPS.STEP_3,
                    event_name: "WA finish on another device",
                  });
                }
              } else {
                // ConnectedWAStep3Review
                await reportEvent({
                  registration_uid,
                  partner_id: form.partner_id.toString() || "1",
                  step: REPORT_EVENT_STEPS.STEP_4,
                  event_name: "WA covr review",
                });
              }
            }
            if (step === 4) {
              // ConnectedWAStep3Review
              await reportEvent({
                registration_uid,
                partner_id: form.partner_id.toString() || "1",
                step: REPORT_EVENT_STEPS.STEP_4,
                event_name: "WA covr review",
              });
            }
            break;
          case "connected_PA":
            if (step === 1) {
              // ConnectedPA
              await reportEvent({
                registration_uid,
                partner_id: form.partner_id.toString() || "1",
                step: REPORT_EVENT_STEPS.STEP_1,
                event_name: "PA covr personal info",
              });
            }
            if (step === 2) {
              // ConnectedPAStep2
              await reportEvent({
                registration_uid,
                partner_id: form.partner_id.toString() || "1",
                step: REPORT_EVENT_STEPS.STEP_2,
                event_name: "PA covr PennDot info",
              });
            }
            if (step === 3) {
              if (form.has_no_state_license) {
                // ConnectedPAStep3Select
                await reportEvent({
                  registration_uid,
                  partner_id: form.partner_id.toString() || "1",
                  step: REPORT_EVENT_STEPS.STEP_2,
                  event_name: "PA covr no PennDot options",
                });
              } else {
                // ConnectedPAStep3HasID
                await reportEvent({
                  registration_uid,
                  partner_id: form.partner_id.toString() || "1",
                  step: REPORT_EVENT_STEPS.STEP_4,
                  event_name: "PA covr review",
                });
              }
            }
            if (step === 4) {
              if (form.upload === "signature") {
                // ConnectedPAStep4Signature
                await reportEvent({
                  registration_uid,
                  partner_id: form.partner_id.toString() || "1",
                  step: REPORT_EVENT_STEPS.STEP_3,
                  event_name: "PA download image",
                });
              } else {
                // ConnectedPAStep3Device
                await reportEvent({
                  registration_uid,
                  partner_id: form.partner_id.toString() || "1",
                  step: REPORT_EVENT_STEPS.STEP_3,
                  event_name: "PA finish on another device",
                });
              }
            }
            if (step === 5) {
              // ConnectedPAStep3HasID
              await reportEvent({
                registration_uid,
                partner_id: form.partner_id.toString() || "1",
                step: REPORT_EVENT_STEPS.STEP_4,
                event_name: "PA covr review",
              });
            }
            break;
          case "connected_CA":
            if (step === 1) {
              // ConnectedCA
              await reportEvent({
                registration_uid,
                partner_id: form.partner_id.toString() || "1",
                step: REPORT_EVENT_STEPS.STEP_1,
                event_name: "CA covr personal info",
              });
            }
            if (step === 2) {
              // AcceptNotice
              await reportEvent({
                registration_uid,
                partner_id: form.partner_id.toString() || "1",
                step: REPORT_EVENT_STEPS.STEP_2,
                event_name: "CA covr option to finish with CA",
              });
            }
            if (step === 3) {
              // PaperOVR
              await reportEvent({
                registration_uid,
                partner_id: form.partner_id.toString() || "1",
                step: REPORT_EVENT_STEPS.STEP_1,
                event_name: "redirect to NVRA form step 1",
              });
            }
            break;
          case "ovr_state":
            if (step === 1) {
              // OvrState
              await reportEvent({
                registration_uid,
                partner_id: form.partner_id.toString() || "1",
                step: REPORT_EVENT_STEPS.STEP_1,
                event_name: "finish with state personal info",
              });
            }
            if (step === 2) {
              if (form.has_no_state_license && allowsPaperFallback(state)) {
                // PaperOVR
                await reportEvent({
                  registration_uid,
                  partner_id: form.partner_id.toString() || "1",
                  step: REPORT_EVENT_STEPS.STEP_1,
                  event_name: "redirect to NVRA form step 1",
                });
              } else {
                // FinishWithState
                await reportEvent({
                  registration_uid,
                  partner_id: form.partner_id.toString() || "1",
                  step: REPORT_EVENT_STEPS.STEP_2,
                  event_name: "option to finish with state",
                });
              }
            }
            break;
          case "not_participating":
            return null;
          case "paper":
          case "connected_MI":
          default:
            if (isRedirectedCompressNVRA) {
              await reportEvent({
                registration_uid,
                partner_id: form.partner_id.toString() || "1",
                step: REPORT_EVENT_STEPS.STEP_1,
                event_name: "redirect to NVRA form step 1",
              });
            } else {
              await reportEvent({
                registration_uid,
                partner_id: form.partner_id.toString() || "1",
                step: REPORT_EVENT_STEPS.STEP_1,
                event_name: "NVRA form step 1",
              });
            }
        }
      } catch (err) {
        console.error("Failed to report event:", err);
      }
    };

    sendStepAnalytics();
  }, [flowType, step]);

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
                  : t("michigan.submit_button", {
                      state_abbr: state.abbreviation,
                    })
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
                        isRedirectedCompressNVRA: true,
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
                          home_unit: form.home_unit_type + " " + form.home_unit,
                        },
                        pageFromLookup: "paper",
                        workflowType: "nvra",
                        showRedirectText: true,
                        isRedirectedCompressNVRA: true,
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
            isRedirectedCompressNVRA
            state={state}
            counties={counties}
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
              isRedirectedCompressNVRA
              showQuestions
              showOnlySSN
              state={state}
              counties={counties}
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
          showQuestions
          isRedirectedCompressNVRA={isRedirectedCompressNVRA}
          state={state}
          counties={counties}
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

  return null;
};

export default RegisterFlowContent;
