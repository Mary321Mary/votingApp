import type {
  CheckRegistrationStatus,
  CheckRegistrationStatusResponse,
  DataConfigurationRequest,
  DataSurveyQuestionsRequest,
  FetchDataCollectionConfigResponse,
  FetchDataSurveyQuestionsResponse,
  GetBallotData,
  GetBallotResponse,
  LookupVotingLocationsResponse,
  PACovrCheckResponse,
  PDFDocRequest,
  PDFDocResponse,
  PDFTokenRequest,
  PDFTokenResponse,
  ReportEventPayload,
  ReportInternalData,
  ReportInternalResponse,
  SetUnder18ReminderRequest,
  SetUnder18ReminderResponse,
  SubmitCACovrPayload,
  SubmitElectionsResponse,
  SubmitEmailZipRequest,
  SubmitEmailZipResponse,
  SubmitFinishedWithStatData,
  SubmitFonoshedWithStateResponce,
  SubmitMICovrPayload,
  SubmitPACovrPayload,
  SubmitVoterCAResponse,
  SubmitVoterDeviceStatusResponse,
  SubmitVoterStatusResponse,
  SubmitWACovrPayload,
  UIConfig,
  VoterDeviceEmailData,
  VoterDeviceResponse,
  VoterDeviceSMSData,
  VoterStatusData,
  VoterStatusResponse,
  WACovrCheckResponse,
} from "utils/types";
import { HttpClient } from "utils/http/http";
import * as ENDPOINTS from "utils/endpoints";

// need to check EMAIL_ZIP and UI_CONFIG

export function submitEmailZip(
  data: SubmitEmailZipRequest,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<SubmitEmailZipRequest, SubmitEmailZipResponse>(
    ENDPOINTS.EMAIL_ZIP,
    data,
    headers,
  );
}

export function fetchUIConfiguration(
  partnerId: string = "1",
  headers: Record<string, string> = {},
) {
  const params = new URLSearchParams({ partner_id: partnerId });
  return HttpClient.Client.get<UIConfig>(
    `${ENDPOINTS.UI_CONFIG}?${params.toString()}`,
    headers,
  );
}

export function fetchDataConfiguration(
  data: DataConfigurationRequest,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.get<FetchDataCollectionConfigResponse>(
    ENDPOINTS.DATA_CONFIG +
      `partner_id=${data.partner_id}&state_abbreviation=${data.state_abbreviation}&workflow_type=${data.workflow_type}&locale=${data.locale}`,
    headers,
  );
}

export function requestTokenPDF(
  data: PDFTokenRequest,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<PDFTokenRequest, PDFTokenResponse>(
    ENDPOINTS.PDF_TOKEN_CONFIG,
    data,
    headers,
  );
}

export function requestTokenDoc(
  data: PDFDocRequest,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<PDFDocRequest, PDFDocResponse>(
    ENDPOINTS.GET_PDF,
    data,
    headers,
  );
}

export function getSurveyQuestions(
  data: DataSurveyQuestionsRequest,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.get<FetchDataSurveyQuestionsResponse>(
    ENDPOINTS.GET_SERVEY_QUESTIONS +
      `partner_id=${data.partner_id}&locale=${data.locale}`,
    headers,
  );
}

export function submitLookup(
  data: CheckRegistrationStatus,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<
    CheckRegistrationStatus,
    CheckRegistrationStatusResponse
  >(ENDPOINTS.SUBMIT_LOOKUP, data, headers);
}

export function submitElectionsLookup(
  data: CheckRegistrationStatus,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<
    CheckRegistrationStatus,
    SubmitElectionsResponse
  >(ENDPOINTS.SUBMIT_ELECTIONS_LOOKUP, data, headers);
}

export function submitBallotLookup(
  data: GetBallotData,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<GetBallotData, GetBallotResponse>(
    ENDPOINTS.SUBMIT_BALLOT_LOOKUP,
    data,
    headers,
  );
}

export function getLocations(
  data: CheckRegistrationStatus,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<
    CheckRegistrationStatus,
    LookupVotingLocationsResponse
  >(ENDPOINTS.GET_LOATIONS, data, headers);
}

export function setUnder18Reminder(
  data: SetUnder18ReminderRequest,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<
    SetUnder18ReminderRequest,
    SetUnder18ReminderResponse
  >(ENDPOINTS.SET_UNDER_18_REMINDER, data, headers);
}

export function submitMICovr(
  data: SubmitMICovrPayload,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<SubmitMICovrPayload, SubmitVoterStatusResponse>(
    ENDPOINTS.SUBMIT_MI_COVR,
    data,
    headers,
  );
}

export function checkMICovr(
  data: VoterStatusData,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<VoterStatusData, VoterStatusResponse>(
    ENDPOINTS.CHECK_MI_COVR,
    data,
    headers,
  );
}

export function submitPADevice(
  data: SubmitPACovrPayload,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<
    SubmitPACovrPayload,
    SubmitVoterDeviceStatusResponse
  >(ENDPOINTS.SUBMIT_PA_DEVICE, data, headers);
}

export function submitWADevice(
  data: SubmitWACovrPayload,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<
    SubmitWACovrPayload,
    SubmitVoterDeviceStatusResponse
  >(ENDPOINTS.SUBMIT_WA_DEVICE, data, headers);
}

export function submitDeviceSMS(
  data: VoterDeviceSMSData,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<VoterDeviceSMSData, VoterDeviceResponse>(
    ENDPOINTS.SEND_DEVICE_SMS,
    data,
    headers,
  );
}

export function submitDeviceEmail(
  data: VoterDeviceEmailData,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<VoterDeviceEmailData, VoterDeviceResponse>(
    ENDPOINTS.SEND_DEVICE_EMAIL,
    data,
    headers,
  );
}

export function submitPACovr(
  data: SubmitPACovrPayload,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<SubmitPACovrPayload, SubmitVoterStatusResponse>(
    ENDPOINTS.SUBMIT_PA_COVR,
    data,
    headers,
  );
}

export function checkPACovr(
  data: VoterStatusData,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<VoterStatusData, PACovrCheckResponse>(
    ENDPOINTS.CHECK_PA_COVR,
    data,
    headers,
  );
}

export function submitWACovr(
  data: SubmitWACovrPayload,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<SubmitWACovrPayload, SubmitVoterStatusResponse>(
    ENDPOINTS.SUBMIT_WA_COVR,
    data,
    headers,
  );
}

export function checkWACovr(
  data: VoterStatusData,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<VoterStatusData, WACovrCheckResponse>(
    ENDPOINTS.CHECK_WA_COVR,
    data,
    headers,
  );
}

export function submitCACovr(
  data: SubmitCACovrPayload,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<SubmitCACovrPayload, SubmitVoterCAResponse>(
    ENDPOINTS.SUBMIT_CA_COVR,
    data,
    headers,
  );
}

export function submitFinishedWithState(
  data: SubmitFinishedWithStatData,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<
    SubmitFinishedWithStatData,
    SubmitFonoshedWithStateResponce
  >(ENDPOINTS.SUBMIT_FINISH_WITH_STATE, data, headers);
}

export function reportEvent(
  data: ReportEventPayload,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<ReportEventPayload, ReportInternalResponse>(
    ENDPOINTS.REPORT_EVENT,
    data,
    headers,
  );
}

export function reportInternalError(
  data: ReportInternalData,
  headers: Record<string, string> = {},
) {
  return HttpClient.Client.post<ReportInternalData, ReportInternalResponse>(
    ENDPOINTS.REPORT_INTERNAL_ERROR,
    data,
    headers,
  );
}

export async function submitEmailZipFake(
  data: SubmitEmailZipRequest,
  headers: Record<string, string> = {},
) {
  await new Promise(r => setTimeout(() => r(undefined), 100));

  switch (data.zip) {
    case "48001":
      return {
        status: { success: true, errors: [] },
        state: {
          name: "Michigan",
          abbreviation: "MI",
          ovr_type: "connected_ovr",
          not_participating_text: "",
        },
        user: { first_name: "John", last_name: "Doe" },
      };

    case "38111":
      return {
        status: { success: true, errors: [] },
        state: {
          name: "Tennessee",
          abbreviation: "TN",
          ovr_type: "state_ovr",
          not_participating_text: "",
        },
        user: { first_name: "John", last_name: "Doe" },
      };

    case "03031":
      return {
        status: { success: true, errors: [] },
        state: {
          name: "New Hampshire",
          abbreviation: "NH",
          ovr_type: "not_participating",
          not_participating_text: "No OVR in NH",
        },
        user: { first_name: "John", last_name: "Doe" },
      };

    case "72007":
      return {
        status: { success: true, errors: [] },
        state: {
          name: "Arkansas",
          abbreviation: "AR",
          ovr_type: "paper",
          not_participating_text: "",
        },
        user: { first_name: "John", last_name: "Doe" },
      };

    case "00000":
      return {
        status: { success: false, errors: ["ZIP Code 00000 is not valid"] },
        state: {},
        user: {},
      };

    default:
      return {
        status: { success: false, errors: ["Not a test case"] },
        state: {},
        user: {},
      };
  }
}
