import React, { useContext, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { FormProps, RegisterFormState } from "@/utils/types";
import InputField from "../../atoms/InputField";
import { Checkbox } from "@/components/atoms/Checkbox";
import { ThemeContext } from "@/styles/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { isRequired } from "@/utils/constants";
import SignatureUpload from "@/components/modules/SignatureUpload";
import { Radio } from "@/components/atoms/Radio";
import RenderHTML from "react-native-render-html";
import { PhoneSection } from "@/components/modules/PhoneSection";

export const ConnectedPAStep3Upload = ({
  state,
  value,
  formCongif,
  errorMessages,
  onChangeError,
  onChange,
  handleMainButton,
}: FormProps) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const navigation = useNavigation<any>();
  const [upload, setUpload] = useState("signature");
  const { width } = useWindowDimensions();

  const onlyDigits = (text: string) => text.replace(/\D/g, "");

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

  const goToPaper = () => {
    navigation.navigate("Register", {
      status: { success: true },
      state,
      zip: value.home_zip_code,
      email: value.email_address,
      form: {
        ...value,
        home_address: value.home_address + " " + value.address_line_2,
        unit: value.home_unit_type + " " + value.home_unit,
      },
      pageFromLookup: "paper",
      showRedirectText: true,
    });
  };

  const handleSSNChange = (text: string) => {
    const digits = onlyDigits(text);
    const lastFour = digits.slice(-4);
    updateField("last_four_ss_number", lastFour);
  };

  const handleSomeoneHelpedChange = (checked: boolean) => {
    if (!checked) {
      onChange({
        ...value,
        someone_helped: checked,
        helper_electronic_signature_acknowledged: false,
      });
    } else {
      onChange({
        ...value,
        someone_helped: checked,
      });
    }
  };

  return (
    <>
      {/* Notice */}
      <RenderHTML
        contentWidth={width}
        source={{
          html: t("pennsylvania.penn_dot_number_none_notice", {
            rtv_paper_form_url: "paper-link",
          }),
        }}
        tagsStyles={{
          body: {
            fontSize: 14,
            lineHeight: 18,
            marginBottom: 20,
          },
          a: {
            color: theme.link,
            textDecorationLine: "underline",
          },
        }}
        renderersProps={{
          a: { onPress: goToPaper },
        }}
      />

      {/* Radio Buttons */}
      <Radio
        label={t("pennsylvania.upload_signature_local")}
        selected={upload === "signature"}
        onPress={() => setUpload("signature")}
      />
      <Radio
        label={t("pennsylvania.upload_signature_other_device")}
        selected={upload === "device"}
        onPress={() => setUpload("device")}
      />
      <Radio
        label={t("pennsylvania.print_mail")}
        selected={upload === "print"}
        onPress={goToPaper}
      />

      {/* Upload Signature */}
      {upload === "signature" && (
        <View>
          <Text style={styles.paragraph}>
            {t("pennsylvania.complete_with_upload")}
          </Text>

          <Text style={styles.label}>
            {t("pennsylvania.upload_signature_instruction")}
          </Text>

          <SignatureUpload
            initialValue={value.signature_base64}
            error={t(errorMessages.signature_base64)}
            onChange={({ base64 }) => {
              updateField("signature_base64", base64);
            }}
          />

          {/* SSN */}
          <InputField
            showEye
            label={t("pennsylvania.ssn4_label")}
            value={value.last_four_ss_number}
            disabled={value.has_no_ssn === true}
            maxLength={4}
            onChangeText={handleSSNChange}
            errorMessage={t(errorMessages.last_four_ss_number)}
          />

          {/* Checkbox */}
          <Checkbox
            value={value.has_no_ssn === true}
            label={t("pennsylvania.ssn4_none_checkbox")}
            required={isRequired(formCongif, "has_no_ssn")}
            onValueChange={(checked: boolean) => {
              if (checked) {
                onChange({
                  ...value,
                  has_no_ssn: checked,
                  last_four_ss_number: "",
                });
              } else {
                onChange({ ...value, has_no_ssn: checked });
              }
            }}
          />

          {/* Someone helped */}
          <Checkbox
            value={value.someone_helped}
            label={t("pennsylvania.someone_helped")}
            onValueChange={handleSomeoneHelpedChange}
          />

          {value.someone_helped && (
            <>
              <InputField
                label={t("pennsylvania.helper_name_label")}
                disabled={false}
                value=""
              />

              <InputField
                label={t("pennsylvania.helper_address_label")}
                disabled={false}
                value=""
              />

              <InputField
                label={t("pennsylvania.helper_phone_label")}
                disabled={false}
                value=""
              />

              <View style={styles.termsBox}>
                <Text style={styles.termsText}>
                  {t("pennsylvania.helper_terms_paragraph_1")}
                </Text>

                <Text style={styles.termsBold}>
                  {t("pennsylvania.helper_terms_paragraph_2")}
                </Text>

                <Text style={styles.bullet}>
                  • {t("pennsylvania.helper_terms_bullet_1")}
                </Text>

                <Text style={styles.bullet}>
                  • {t("pennsylvania.helper_terms_bullet_2")}
                </Text>
              </View>

              <Checkbox
                value={value.helper_electronic_signature_acknowledged}
                label={t("pennsylvania.helper_terms_confirm_label")}
                onValueChange={(checked: boolean) =>
                  updateField(
                    "helper_electronic_signature_acknowledged",
                    checked,
                  )
                }
              />
            </>
          )}
        </View>
      )}

      {/* Device Upload */}
      {upload === "device" && (
        <View style={styles.deviceBlock}>
          <PhoneSection
            value={value}
            state={state}
            formCongif={formCongif}
            errorMessages={errorMessages}
            onChange={onChange}
            onChangeError={onChangeError}
          />

          <Button title={t("pennsylvania.send_sms")} onPress={() => {}} />

          <InputField
            label={t("pennsylvania.email_me_link")}
            value={value.email_address}
            required={isRequired(formCongif, "email")}
            onChangeText={(text: string) => updateField("email_address", text)}
            errorMessage={t(errorMessages.email_address)}
          />

          <Button title={t("pennsylvania.send_email")} onPress={() => {}} />

          <Text style={styles.paragraph}>
            {t("pennsylvania.continue_on_touch_device")}
          </Text>

          <Button title={t("pennsylvania.copy_link")} onPress={() => {}} />
        </View>
      )}
      {handleMainButton}
    </>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    paragraph: {
      fontSize: 14,
      lineHeight: 22,
      marginBottom: 10,
    },

    label: {
      fontSize: 14,
      fontWeight: "700",
    },

    termsBox: {
      backgroundColor: theme.background,
      borderRadius: 10,
      padding: 14,
      marginVertical: 16,
    },

    termsText: {
      fontSize: 13,
      marginBottom: 10,
    },

    termsBold: {
      fontSize: 13,
      fontWeight: "700",
      marginBottom: 10,
    },

    bullet: {
      fontSize: 13,
      marginBottom: 6,
    },

    deviceBlock: {
      gap: 10,
      marginBottom: 10,
    },
  });
