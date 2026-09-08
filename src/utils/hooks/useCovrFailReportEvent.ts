import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { reportEvent } from "@/utils/api";
import type { RegisterFormState } from "@/utils/types";
import {
  CovrCheckMethodName,
  resolveCovrFailEventName,
} from "../report/covrFailReporting";
import { REPORT_EVENT_STEPS } from "../report/eventReporting";

export function useCovrFailReportEvent(
  defaultEventName: string,
  form: RegisterFormState | undefined,
  apiTimeoutMethod?: CovrCheckMethodName,
): void {
  const eventName = resolveCovrFailEventName(
    defaultEventName,
    apiTimeoutMethod,
  );

  useEffect(() => {
    if (!form) {
      return;
    }

    void (async () => {
      let registrationUid = "";
      try {
        registrationUid =
          (await AsyncStorage.getItem("registration_uid")) || "";
      } catch {
        registrationUid = "";
      }

      await reportEvent({
        registration_uid: registrationUid,
        partner_id: form.partner_id.toString() || "1",
        step: REPORT_EVENT_STEPS.EMPTY,
        event_name: eventName,
      });
    })();
  }, [eventName, form]);
}
