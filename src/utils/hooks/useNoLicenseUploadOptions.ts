import { useEffect } from "react";
import { isFinishOnOtherDeviceEnabled } from "utils/constants";
import { DataCollectionConfiguration, RegisterFormState } from "utils/types";

/**
 * Gates no-DL upload choices on eligibility config and clears a stale
 * `upload: "device"` when finish-on-other-device is disabled.
 * `onChange` is intentionally omitted from deps — callers pass stable setState.
 */
export function useNoLicenseUploadOptions(
  formCongif: DataCollectionConfiguration | undefined,
  value: RegisterFormState,
  onChange: (value: RegisterFormState) => void,
) {
  const showOtherDevice = isFinishOnOtherDeviceEnabled(formCongif);
  const upload = value.upload;

  useEffect(() => {
    if (upload === "device" && !showOtherDevice) {
      onChange({ ...value, upload: "" });
    }
  }, [showOtherDevice, upload]);

  return { showOtherDevice };
}
