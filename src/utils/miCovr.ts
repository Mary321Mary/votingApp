import { isAxiosError } from "axios";
import { checkMICovr, submitMICovr } from "./api";
import { CovrStatus, SubmitMICovrPayload, VoterStatusResponse } from "./types";

const POLL_INTERVAL_MS = 1000;
const MAX_POLL_MS = 60000;

export type MICovrOutcome = "success" | "failure";

export type SubmitAndCheckResult = {
  outcome: MICovrOutcome;
  registrantUid: string | null;
  checkResponse: VoterStatusResponse | null;
};

export type SubmitAndCheckMICovrOptions = {
  signal?: AbortSignal;
  onCheck?: (data: VoterStatusResponse) => void;
};

class PollAbortedError extends Error {
  constructor() {
    super("Poll aborted");
    this.name = "AbortError";
  }
}

function isTerminalStatus(status: CovrStatus): boolean {
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

export async function pollMICovrStatus(
  registrantUid: string,
  options?: Pick<SubmitAndCheckMICovrOptions, "signal" | "onCheck">,
): Promise<{
  outcome: MICovrOutcome;
  checkResponse: VoterStatusResponse | null;
}> {
  const { signal, onCheck } = options ?? {};
  const deadline = Date.now() + MAX_POLL_MS;

  while (Date.now() < deadline) {
    if (signal?.aborted) {
      return { outcome: "failure", checkResponse: null };
    }

    try {
      const response = await checkMICovr({ registrant_uid: registrantUid });
      const data = response.data;
      onCheck?.(data);

      if (isTerminalStatus(data.status)) {
        return {
          outcome: data.status === "success" ? "success" : "failure",
          checkResponse: data,
        };
      }
    } catch (error: unknown) {
      if (isAborted(error) || signal?.aborted) {
        return { outcome: "failure", checkResponse: null };
      }
      if (isAxiosError(error) && error.response?.status === 404) {
        return { outcome: "failure", checkResponse: null };
      }
      throw error;
    }

    try {
      await sleep(POLL_INTERVAL_MS, signal);
    } catch (error: unknown) {
      if (isAborted(error) || signal?.aborted) {
        return { outcome: "failure", checkResponse: null };
      }
      throw error;
    }
  }

  return { outcome: "failure", checkResponse: null };
}

export async function submitAndCheckMICovr(
  payload: SubmitMICovrPayload,
  options?: SubmitAndCheckMICovrOptions,
): Promise<SubmitAndCheckResult> {
  const { signal, onCheck } = options ?? {};

  if (signal?.aborted) {
    return { outcome: "failure", registrantUid: null, checkResponse: null };
  }

  const submitResponse = await submitMICovr(payload);

  const { status, registrant_uid: registrantUid } = submitResponse.data;
  if (status?.success === false || !registrantUid) {
    return { outcome: "failure", registrantUid: null, checkResponse: null };
  }

  const { outcome, checkResponse } = await pollMICovrStatus(registrantUid, {
    signal,
    onCheck,
  });
  return { outcome, registrantUid, checkResponse };
}
