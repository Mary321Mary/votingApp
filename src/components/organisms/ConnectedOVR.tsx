import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FormProps, RegisterFormState } from "@/utils/types";
import { ThemeContext } from "@/styles/ThemeProvider";
import { useTranslation } from "react-i18next";
import { Radio } from "../atoms/Radio";
import { Checkbox } from "../atoms/Checkbox";
import { RegisterStepHeader } from "../modules/RegisterStepHeader";
import { isRequired, isVisible } from "@/utils/constants";

export const ConnectedOVR = ({
  state,
  value,
  formCongif,
  errorMessages,
  onChange,
  onChangeError,
}: FormProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

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

  return (
    <View style={styles.block}>
      <RegisterStepHeader
        titleKey="register_page.eligibility_title"
        completedSteps={1}
        currentStep={2}
      />
      {isVisible(formCongif, "us_citizen") && (
        <Checkbox
          value={value.isCitizen}
          label={t("register_page.eligibility.citizen")}
          required={isRequired(formCongif, "us_citizen")}
          errorText={errorMessages.isCitizen}
          onValueChange={(checked: boolean) =>
            updateField("isCitizen", checked)
          }
        />
      )}
      {isVisible(formCongif, "will_be_18_by_election") && (
        <Checkbox
          value={value.isAdult}
          label={t("register_page.eligibility.age")}
          required={isRequired(formCongif, "will_be_18_by_election")}
          errorText={errorMessages.isAdult}
          onValueChange={(checked: boolean) => updateField("isAdult", checked)}
        />
      )}
      {isVisible(formCongif, "residency_duration_ack") && (
        <Checkbox
          value={value.residency}
          label={t("register_page.eligibility.residency", {
            state: state.name,
          })}
          required={isRequired(formCongif, "residency_duration_ack")}
          errorText={
            errorMessages.residency === "show" ? (
              <>
                <Text style={styles.error}>
                  {t("register_page.residency_error_1", { state: state.name })}
                </Text>
                <Text style={styles.error}>
                  {t("register_page.residency_error_2")}
                </Text>
              </>
            ) : (
              ""
            )
          }
          onValueChange={(checked: boolean) =>
            updateField("residency", checked)
          }
        />
      )}
      {isVisible(formCongif, "cancel_previous_registration_ack") && (
        <Checkbox
          value={value.cancelPrevious}
          label={t("register_page.eligibility.cancelPrevious")}
          required={isRequired(formCongif, "cancel_previous_registration_ack")}
          errorText={
            errorMessages.cancelPrevious === "show" ? (
              <>
                <Text style={styles.error}>
                  {t("register_page.cancel_previous_error_1")}
                </Text>
                <Text style={styles.error}>
                  {t("register_page.cancel_previous_error_2")}
                </Text>
              </>
            ) : (
              ""
            )
          }
          onValueChange={(checked: boolean) =>
            updateField("cancelPrevious", checked)
          }
        />
      )}
      {isVisible(formCongif, "use_stored_signature_ack") && (
        <Checkbox
          value={value.digitalSignature}
          label={t("register_page.eligibility.digitalSignature")}
          required={isRequired(formCongif, "use_stored_signature_ack")}
          errorText={
            errorMessages.digitalSignature === "show" ? (
              <>
                <Text style={styles.error}>
                  {t("register_page.digital_signature_error_1")}
                </Text>
                <Text style={styles.error}>
                  {t("register_page.digital_signature_error_2")}
                </Text>
              </>
            ) : (
              ""
            )
          }
          onValueChange={(checked: boolean) =>
            updateField("digitalSignature", checked)
          }
        />
      )}

      {isVisible(formCongif, "updated_dln_recently") && (
        <>
          {/* LICENSE UPDATE */}
          <Text style={styles.gray}>
            {t("register_page.questions.licenseUpdate")}
            {isRequired(formCongif, "updated_dln_recently") && (
              <Text style={styles.required}> *</Text>
            )}
          </Text>

          <Radio
            label={t("register_page.no")}
            selected={value.licenseUpdated === "no"}
            onPress={() => updateField("licenseUpdated", "no")}
          />
          <Radio
            label={t("register_page.yes")}
            selected={value.licenseUpdated === "yes"}
            onPress={() => updateField("licenseUpdated", "yes")}
          />
        </>
      )}
      {errorMessages.licenseUpdated === "show" && (
        <>
          <Text style={styles.error}>
            {t("register_page.updated_license_error_1")}
          </Text>
          <Text style={styles.error}>
            {t("register_page.updated_license_error_2")}
          </Text>
        </>
      )}

      {isVisible(formCongif, "request_duplicate_dln_today") && (
        <>
          {/* DUPLICATE LICENSE */}
          <Text style={styles.gray}>
            {t("register_page.questions.duplicateLicense")}
            <Text style={styles.required}> *</Text>
          </Text>

          <Radio
            label={t("register_page.no")}
            selected={value.duplicateLicense === "no"}
            onPress={() => updateField("duplicateLicense", "no")}
          />
          <Radio
            label={t("register_page.yes")}
            selected={value.duplicateLicense === "yes"}
            onPress={() => updateField("duplicateLicense", "yes")}
          />
        </>
      )}
      {errorMessages.duplicateLicense === "show" && (
        <>
          <Text style={styles.error}>
            {t("register_page.duplicate_license_error_1")}
          </Text>
          <Text style={styles.error}>
            {t("register_page.duplicate_license_error_2")}
          </Text>
        </>
      )}
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    block: {
      maxWidth: "90%",
      minWidth: "80%",
    },
    text: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "regular",
    },
    gray: {
      color: theme.gray,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "regular",
      marginTop: 12,
      marginBottom: 4,
    },
    bold: {
      fontWeight: "bold",
    },
    link: {
      color: theme.link,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "regular",
    },
    checkbox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    checkboxText: {
      fontSize: 14,
      flex: 1,
    },
    required: {
      color: "red",
    },
    error: {
      color: theme.secondary,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 11,
      fontWeight: "regular",
    },
  });
