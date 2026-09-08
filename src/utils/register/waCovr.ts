import { isAxiosError } from "axios";
import { checkWACovr, submitWACovr } from "../api";
import { PA_COVR_CLIENT_ERRORS } from "./paCovrErrors";
import type {
  SubmitWACovrPayload,
  SubmitVoterStatusResponse,
  WACovrCheckResponse,
} from "../types";

const POLL_INTERVAL_MS = 1000;
const MAX_POLL_MS = 10000;

export type WACovrOutcome = "success" | "failure";

export type SubmitAndCheckWACovrResult = {
  outcome: WACovrOutcome;
  registrantUid: string | null;
  checkResponse: WACovrCheckResponse | null;
  errors: string[];
};

export type SubmitAndCheckWACovrOptions = {
  signal?: AbortSignal;
  onSubmit?: (data: SubmitVoterStatusResponse) => void;
  onCheck?: (data: WACovrCheckResponse) => void;
};

class PollAbortedError extends Error {
  constructor() {
    super("Poll aborted");
    this.name = "AbortError";
  }
}

function isTerminalStatus(status: WACovrCheckResponse["status"]): boolean {
  return status === "success" || status === "failure";
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new PollAbortedError());
      return;
    }

    const timeoutId = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timeoutId);
        reject(new PollAbortedError());
      },
      { once: true },
    );
  });
}

function isAborted(error: unknown): boolean {
  return error instanceof PollAbortedError;
}

export async function pollWACovrStatus(
  registrantUid: string,
  options?: Pick<SubmitAndCheckWACovrOptions, "signal" | "onCheck">,
): Promise<{
  outcome: WACovrOutcome;
  checkResponse: WACovrCheckResponse | null;
  errors: string[];
}> {
  const { signal, onCheck } = options ?? {};
  const deadline = Date.now() + MAX_POLL_MS;

  while (Date.now() < deadline) {
    if (signal?.aborted) {
      return {
        outcome: "failure",
        checkResponse: null,
        errors: [PA_COVR_CLIENT_ERRORS.POLL_ABORTED],
      };
    }

    try {
      const response = await checkWACovr({ registrant_uid: registrantUid });
      const data = response.data;
      onCheck?.(data);

      if (isTerminalStatus(data.status)) {
        return {
          outcome: data.status === "success" ? "success" : "failure",
          checkResponse: data,
          errors: data.status === "failure" ? data.submission_error ?? [] : [],
        };
      }
    } catch (error: unknown) {
      if (isAborted(error) || signal?.aborted) {
        return {
          outcome: "failure",
          checkResponse: null,
          errors: [PA_COVR_CLIENT_ERRORS.POLL_ABORTED],
        };
      }
      if (isAxiosError(error) && error.response?.status === 404) {
        return {
          outcome: "failure",
          checkResponse: null,
          errors: [PA_COVR_CLIENT_ERRORS.CHECK_NOT_FOUND],
        };
      }
      throw error;
    }

    try {
      await sleep(POLL_INTERVAL_MS, signal);
    } catch (error: unknown) {
      if (isAborted(error) || signal?.aborted) {
        return {
          outcome: "failure",
          checkResponse: null,
          errors: [PA_COVR_CLIENT_ERRORS.POLL_ABORTED],
        };
      }
      throw error;
    }
  }

  return {
    outcome: "failure",
    checkResponse: null,
    errors: [PA_COVR_CLIENT_ERRORS.POLL_TIMEOUT],
  };
}

export async function submitAndCheckWACovr(
  payload: SubmitWACovrPayload,
  options?: SubmitAndCheckWACovrOptions,
): Promise<SubmitAndCheckWACovrResult> {
  const { signal, onSubmit, onCheck } = options ?? {};

  if (signal?.aborted) {
    return {
      outcome: "failure",
      registrantUid: null,
      checkResponse: null,
      errors: [PA_COVR_CLIENT_ERRORS.POLL_ABORTED],
    };
  }

  const submitResponse = await submitWACovr(payload);
  onSubmit?.(submitResponse.data);

  const { status, registrant_uid: registrantUid } = submitResponse.data;
  if (status?.success !== true || !registrantUid) {
    return {
      outcome: "failure",
      registrantUid: null,
      checkResponse: null,
      errors: status?.errors ?? [],
    };
  }

  const { outcome, checkResponse, errors } = await pollWACovrStatus(
    registrantUid,
    {
      signal,
      onCheck,
    },
  );
  return { outcome, registrantUid, checkResponse, errors };
}
