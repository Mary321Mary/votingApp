import { isAxiosError } from "axios";
import { checkPACovr, submitPACovr } from "../api";
import { PA_COVR_CLIENT_ERRORS } from "./paCovrErrors";
import { PACovrCheckResponse, SubmitPACovrPayload } from "../types";

const POLL_INTERVAL_MS = 1000;
const MAX_POLL_MS = 60000;

export type PACovrOutcome = "success" | "failure";

export type SubmitAndCheckPACovrResult = {
  outcome: PACovrOutcome;
  registrantUid: string | null;
  checkResponse: PACovrCheckResponse | null;
  errors: string[];
};

export type SubmitAndCheckPACovrOptions = {
  signal?: AbortSignal;
  onCheck?: (data: PACovrCheckResponse) => void;
};

class PollAbortedError extends Error {
  constructor() {
    super("Poll aborted");
    this.name = "AbortError";
  }
}

function isTerminalStatus(status: PACovrCheckResponse["status"]): boolean {
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

export async function pollPACovrStatus(
  registrantUid: string,
  options?: Pick<SubmitAndCheckPACovrOptions, "signal" | "onCheck">,
): Promise<{
  outcome: PACovrOutcome;
  checkResponse: PACovrCheckResponse | null;
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
      const response = await checkPACovr({ registrant_uid: registrantUid });
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

export async function submitAndCheckPACovr(
  payload: SubmitPACovrPayload,
  options?: SubmitAndCheckPACovrOptions,
): Promise<SubmitAndCheckPACovrResult> {
  const { signal, onCheck } = options ?? {};

  if (signal?.aborted) {
    return {
      outcome: "failure",
      registrantUid: null,
      checkResponse: null,
      errors: [PA_COVR_CLIENT_ERRORS.POLL_ABORTED],
    };
  }

  const submitResponse = await submitPACovr(payload);

  const { status, registrant_uid: registrantUid } = submitResponse.data;
  if (status?.success === false || !registrantUid) {
    return {
      outcome: "failure",
      registrantUid: null,
      checkResponse: null,
      errors: status?.errors ?? [],
    };
  }

  const { outcome, checkResponse, errors } = await pollPACovrStatus(
    registrantUid,
    {
      signal,
      onCheck,
    },
  );
  return { outcome, registrantUid, checkResponse, errors };
}
