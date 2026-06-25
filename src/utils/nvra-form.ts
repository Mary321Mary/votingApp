import { requestTokenDoc, requestTokenPDF } from "./api";
import { INTERNAL_ERRORS } from "./internal-errors";
import type { PDFTokenRequest } from "./types";

const MAX_POLL_ATTEMPTS = 10;
const POLL_INTERVAL_MS = 2000;

export type RequestNvraFormOptions = {
  payload: PDFTokenRequest;
  signal?: AbortSignal;
  onRequestToken?: (data: unknown) => void;
  onGetForm?: (data: unknown) => void;
  onError: (title?: string) => void;
  onReady: (downloadUrl: string) => void;
};

export async function requestNvraFormWithPolling(
  options: RequestNvraFormOptions,
): Promise<void> {
  const { payload, signal, onRequestToken, onGetForm, onError, onReady } =
    options;

  if (signal?.aborted) {
    return;
  }

  let pdfToken: string;
  try {
    const responseToken = await requestTokenPDF(payload);
    onRequestToken?.(responseToken.data);

    if (!responseToken.data.status.success) {
      onError(INTERNAL_ERRORS.REQUEST_NVRA_FORM_REJECTED);
      return;
    }

    if (!responseToken.data.pdf_token) {
      onError(INTERNAL_ERRORS.REQUEST_NVRA_FORM_NO_TOKEN);
      return;
    }

    pdfToken = responseToken.data.pdf_token;
  } catch (err) {
    console.error("Submit error:", err);
    onError(INTERNAL_ERRORS.REQUEST_NVRA_FORM_FAILED);
    return;
  }

  let attempts = 0;

  const checkStatus = async (): Promise<void> => {
    if (signal?.aborted) {
      return;
    }

    try {
      const responseDoc = await requestTokenDoc({ pdf_token: pdfToken });
      onGetForm?.(responseDoc.data);

      if (!responseDoc.data.status.success) {
        onError(INTERNAL_ERRORS.GET_NVRA_FORM_REJECTED);
        return;
      }

      if (responseDoc.data.pdf_ready && responseDoc.data.download_url) {
        onReady(responseDoc.data.download_url);
        return;
      }

      if (attempts < MAX_POLL_ATTEMPTS) {
        attempts++;
        setTimeout(checkStatus, POLL_INTERVAL_MS);
        return;
      }

      onError(INTERNAL_ERRORS.GET_NVRA_FORM_TIMEOUT);
    } catch (err) {
      console.log("Error in requestNvraFormWithPolling", err);
      onError(INTERNAL_ERRORS.GET_NVRA_FORM_FAILED);
    }
  };

  await checkStatus();
}
