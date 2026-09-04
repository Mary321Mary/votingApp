import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { FormProps, RegisterFormState } from "@/utils/types";
import InputField from "../../atoms/InputField";
import { ThemeContext } from "@/styles/ThemeProvider";
import {
  isRequired,
  mapFormStateToPACovrPayload,
  mapFormStateToWACovrPayload,
} from "@/utils/constants";
import { PhoneSection } from "@/components/modules/PhoneSection";
import {
  submitDeviceEmail,
  submitDeviceSMS,
  submitPADevice,
  submitWADevice,
} from "@/utils/api";
import Clipboard from "@react-native-clipboard/clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ConnectedPAStep3Device = ({
  value,
  state,
  formCongif,
  errorMessages,
  onChangeError,
  onChange,
}: FormProps) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  const [registrantUid, setRegistrantUid] = useState("");
  const [continueUrl, setContinueUrl] = useState("");

  const statePrefix = value.state === "PA" ? "pennsylvania" : "washington";
  const [smsNotification, setSmsNotification] = useState("");
  const [emailNotification, setEmailNotification] = useState("");
  const [copyNotification, setCopyNotification] = useState("");

  const updateField = <K extends keyof RegisterFormState>(
    key: K,
    fieldValue: RegisterFormState[K],
  ) => {
    onChange({ ...value, [key]: fieldValue });
    if (errorMessages[key].length) {
      onChangeError({
        ...errorMessages,
        [key]: "",
      });
    }
  };

  useEffect(() => {
    const fetchConfig = async () => {
      const registration_uid = await AsyncStorage.getItem("registration_uid");
      if (value.state === "PA") {
        const paPayload = mapFormStateToPACovrPayload(
          value,
          registration_uid || "",
        );
        try {
          const response = await submitPADevice(paPayload);
          setRegistrantUid(response.data.registrant_uid || "");
          setContinueUrl(response.data.continue_url || "");
        } catch (err) {
          console.error(
            "Failed to create a Pennsylvania state-registrant:",
            err,
          );
        }
      } else {
        const waPayload = mapFormStateToWACovrPayload(
          value,
          registration_uid || "",
        );
        try {
          const response = await submitWADevice(waPayload);
          setRegistrantUid(response.data.registrant_uid || "");
          setContinueUrl(response.data.continue_url || "");
        } catch (err) {
          console.error("Failed to create a Washington state-registrant:", err);
        }
      }
    };

    fetchConfig();
  }, []);

  const handleSmsSend = async () => {
    setSmsNotification("");
    try {
      await submitDeviceSMS({
        registrant_uid: registrantUid,
        phone: value.phone,
      });
      setSmsNotification(
        t(`${statePrefix}.text_sent`, { user_phone: value.phone }),
      );
    } catch (err: any) {
      console.error("Failed to send sms:", err);
      if (!err.response?.data?.status?.success) {
        onChangeError({
          ...errorMessages,
          phone:
            err.response?.data?.status?.errors?.join(", ") ||
            "Error sending SMS",
        });
      }
    }
  };

  const handleEmailSend = async () => {
    setEmailNotification("");
    try {
      await submitDeviceEmail({
        registrant_uid: registrantUid,
        email: value.email_address,
      });
      setEmailNotification(
        t(`${statePrefix}.email_sent`, { user_email: value.email_address }),
      );
    } catch (err: any) {
      console.error("Failed to send email:", err);
      if (!err.response?.data?.status?.success) {
        onChangeError({
          ...errorMessages,
          email_address:
            err.response?.data?.status?.errors?.join(", ") ||
            "Error sending Email",
        });
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      Clipboard.setString(continueUrl);

      if (Platform.OS === "android") {
        ToastAndroid.show(t(`${statePrefix}.link_copied`), ToastAndroid.SHORT);
      } else {
        Alert.alert("Success", t(`${statePrefix}.link_copied`));
      }
      setCopyNotification(t(`${statePrefix}.link_copied`));
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <View style={styles.deviceBlock}>
      <PhoneSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        onChange={onChange}
        onChangeError={onChangeError}
      />

      <Button title={t("pennsylvania.send_sms")} onPress={handleSmsSend} />
      {smsNotification && <Text>{smsNotification}</Text>}

      <InputField
        name="email_address"
        label={t("pennsylvania.email_me_link")}
        value={value.email_address}
        required={isRequired(formCongif, "email")}
        onChangeText={(text: string) => updateField("email_address", text)}
        errorMessage={t(errorMessages.email_address)}
      />

      <Button title={t("pennsylvania.send_email")} onPress={handleEmailSend} />
      {emailNotification && <Text>{emailNotification}</Text>}

      <Text style={styles.paragraph}>
        {t("pennsylvania.continue_on_touch_device")}
      </Text>

      <Button title={t("pennsylvania.copy_link")} onPress={handleCopyLink} />
      {copyNotification && <Text>{copyNotification}</Text>}
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    paragraph: {
      fontSize: 14,
      lineHeight: 22,
      marginBottom: 10,
    },

    deviceBlock: {
      gap: 10,
      marginBottom: 10,
    },
  });
