import React, { useContext } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { Clock, Lock, Shield } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import RenderHTML from "react-native-render-html";

import { ThemeContext } from "@/styles/ThemeProvider";
import { FormProps, RegisterFormState } from "utils/types";
import { isRequired, isVisible } from "utils/constants";
import { RegisterStepHeader } from "../../modules/RegisterStepHeader";
import { Checkbox } from "../../atoms/Checkbox";
import { Radio } from "../../atoms/Radio";

export const ConnectedOVR = ({
  state,
  value,
  formCongif,
  errorMessages,
  onChange,
  onChangeError,
  handleMainButton,
}: FormProps) => {
  const navigation = useNavigation<any>();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const updateField = <K extends keyof RegisterFormState>(
    key: K,
    fieldValue: RegisterFormState[K],
  ) => {
    onChange({ ...value, [key]: fieldValue });
    if (errorMessages[key]?.length) {
      onChangeError({
        ...errorMessages,
        [key]: "",
      });
    }
  };

  const handlePaperFormRedirect = () => {
    navigation.replace("Register", {
      status: { success: true },
      state,
      zip: value.home_zip_code,
      email: value.email_address,
      form: {
        ...value,
        home_address: [
          value.street_name,
          value.street_number,
          value.street_type,
          value.street_direction,
        ]
          .filter(Boolean)
          .join(" "),
      },
      pageFromLookup: "paper",
      workflowType: "nvra",
      showRedirectText: true,
    });
  };

  const renderHtmlError = (i18nKey: string) => (
    <RenderHTML
      contentWidth={width}
      source={{
        html: t(i18nKey, { rtv_paper_form_url: "paper-link" }),
      }}
      tagsStyles={{
        body: {
          fontSize: 12,
          lineHeight: 16,
          color: theme.secondary,
        },
        a: {
          color: theme.link,
          textDecorationLine: "underline",
        },
      }}
      renderersProps={{
        a: {
          onPress: handlePaperFormRedirect,
        },
      }}
    />
  );

  return (
    <>
      <RegisterStepHeader
        titleKey="michigan.eligibility_title"
        completedSteps={1}
        currentStep={2}
      />
      <Text style={styles.subheadRequires}>
        {t("michigan.eligibility.michigan_requires")}
      </Text>

      <View style={styles.sectionRow}>
        <View style={styles.iconContainer}>
          <Shield size={20} color={theme.primary} />
        </View>
        <View style={styles.sectionContent}>
          <Text style={styles.subheadSection}>
            {t("michigan.eligibility.confirm_eligible")}
          </Text>

          {isVisible(formCongif, "us_citizen") && (
            <View style={styles.fieldMargin}>
              <Checkbox
                name="us_citizen"
                value={value.us_citizen}
                label={t("nvra_form_page.citizen")}
                required={isRequired(formCongif, "us_citizen")}
                errorText={t(errorMessages.us_citizen)}
                onValueChange={(checked: boolean) =>
                  updateField("us_citizen", checked)
                }
              />
            </View>
          )}

          {isVisible(formCongif, "will_be_18_by_election") && (
            <View style={styles.fieldMargin}>
              <Checkbox
                name="will_be_18_by_election"
                value={value.will_be_18_by_election}
                label={t("michigan.eligibility.age")}
                required={isRequired(formCongif, "will_be_18_by_election")}
                errorText={t(errorMessages.will_be_18_by_election, {
                  state_name: state.name,
                })}
                onValueChange={(checked: boolean) =>
                  updateField("will_be_18_by_election", checked)
                }
              />
            </View>
          )}

          {isVisible(formCongif, "residency_duration_ack") && (
            <View style={styles.fieldMargin}>
              <Checkbox
                name="residency_duration_ack"
                value={value.residency_duration_ack}
                label={t("michigan.eligibility.residency", {
                  state_name: state.name,
                })}
                required={isRequired(formCongif, "residency_duration_ack")}
                errorText={
                  errorMessages.residency_duration_ack === "show" ? (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>
                        {t("michigan.eligibility.residency_error_1", {
                          state: state.name,
                        })}
                      </Text>
                      <Text style={[styles.errorText, styles.marginTopSmall]}>
                        {t("michigan.eligibility.residency_error_2")}
                      </Text>
                    </View>
                  ) : (
                    ""
                  )
                }
                onValueChange={(checked: boolean) =>
                  updateField("residency_duration_ack", checked)
                }
              />
            </View>
          )}
        </View>
      </View>

      <View style={styles.sectionRow}>
        <View style={styles.iconContainer}>
          <Lock size={20} color={theme.primary} />
        </View>
        <View style={styles.sectionContent}>
          <Text style={styles.subheadSection}>
            {t("michigan.eligibility.authorize_registration")}
          </Text>
          <Text style={styles.tipText}>
            {t("michigan.eligibility.these_authorize")}
          </Text>

          {isVisible(formCongif, "cancel_previous_registration_ack") && (
            <>
              <View style={styles.fieldMargin}>
                <Checkbox
                  name="cancel_previous_registration_ack"
                  value={value.cancel_previous_registration_ack}
                  label={t("michigan.eligibility.cancelPrevious")}
                  required={isRequired(
                    formCongif,
                    "cancel_previous_registration_ack",
                  )}
                  errorText={
                    errorMessages.cancel_previous_registration_ack ===
                    "show" ? (
                      <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>
                          {t("michigan.eligibility.cancel_previous_error_1")}
                        </Text>
                        {renderHtmlError(
                          "michigan.eligibility.cancel_previous_error_2",
                        )}
                      </View>
                    ) : (
                      ""
                    )
                  }
                  onValueChange={(checked: boolean) =>
                    updateField("cancel_previous_registration_ack", checked)
                  }
                />
              </View>
              <Text style={styles.tipText}>
                {t("michigan.eligibility.if_registered_elsewhere")}
              </Text>
            </>
          )}

          {isVisible(formCongif, "use_stored_signature_ack") && (
            <>
              <View style={styles.fieldMargin}>
                <Checkbox
                  name="use_stored_signature_ack"
                  value={value.use_stored_signature_ack}
                  label={t("michigan.eligibility.digitalSignature")}
                  required={isRequired(formCongif, "use_stored_signature_ack")}
                  errorText={
                    errorMessages.use_stored_signature_ack === "show" ? (
                      <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>
                          {t("michigan.eligibility.digital_signature_error_1")}
                        </Text>
                        {renderHtmlError(
                          "michigan.eligibility.digital_signature_error_2",
                        )}
                      </View>
                    ) : (
                      ""
                    )
                  }
                  onValueChange={(checked: boolean) =>
                    updateField("use_stored_signature_ack", checked)
                  }
                />
              </View>
              <Text style={styles.tipText}>
                {t("michigan.eligibility.signature_on_file")}
              </Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.sectionRow}>
        <View style={styles.iconContainer}>
          <Clock size={20} color={theme.primary} />
        </View>
        <View style={styles.sectionContent}>
          <Text style={styles.subheadSection}>
            {t("michigan.eligibility.questions.confirm_state_id")}
          </Text>
          <Text style={styles.tipText}>
            {t("michigan.eligibility.questions.these_make_sure")}
          </Text>

          {isVisible(formCongif, "updated_dln_recently") && (
            <View>
              <Text style={styles.questionLabel}>
                {t("michigan.eligibility.questions.licenseUpdate")}
                {isRequired(formCongif, "updated_dln_recently") && (
                  <Text style={styles.required}> *</Text>
                )}
              </Text>

              <View style={styles.radioButtons}>
                <Radio
                  label={t("general.no")}
                  selected={value.updated_dln_recently === "no"}
                  onPress={() => updateField("updated_dln_recently", "no")}
                />
                <Radio
                  label={t("general.yes")}
                  selected={value.updated_dln_recently === "yes"}
                  onPress={() => updateField("updated_dln_recently", "yes")}
                />
              </View>

              {errorMessages.updated_dln_recently === "show" && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>
                    {t("michigan.eligibility.updated_license_error_1")}
                  </Text>
                  {renderHtmlError(
                    "michigan.eligibility.updated_license_error_2",
                  )}
                </View>
              )}
            </View>
          )}

          {isVisible(formCongif, "request_duplicate_dln_today") && (
            <View>
              <Text style={styles.questionLabel}>
                {t("michigan.eligibility.questions.duplicateLicense")}
                {isRequired(formCongif, "request_duplicate_dln_today") && (
                  <Text style={styles.required}> *</Text>
                )}
              </Text>

              <View style={styles.radioButtons}>
                <Radio
                  label={t("general.no")}
                  selected={value.request_duplicate_dln_today === "no"}
                  onPress={() =>
                    updateField("request_duplicate_dln_today", "no")
                  }
                />
                <Radio
                  label={t("general.yes")}
                  selected={value.request_duplicate_dln_today === "yes"}
                  onPress={() =>
                    updateField("request_duplicate_dln_today", "yes")
                  }
                />
              </View>

              {errorMessages.request_duplicate_dln_today === "show" && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>
                    {t("michigan.eligibility.duplicate_license_error_1")}
                  </Text>
                  {renderHtmlError(
                    "michigan.eligibility.duplicate_license_error_2",
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      <View style={styles.buttonContainer}>{handleMainButton}</View>
    </>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    subheadRequires: {
      color: theme.textPrimary || "#000",
      fontSize: 15,
      marginVertical: 12,
      lineHeight: 20,
    },
    sectionRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginTop: 16,
      marginBottom: 8,
    },
    iconContainer: {
      marginRight: 10,
      marginTop: 2,
    },
    sectionContent: {
      flex: 1,
    },
    subheadSection: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.textPrimary || "#000",
      marginBottom: 6,
    },
    tipText: {
      fontSize: 13,
      color: theme.gray || "#666",
      marginTop: 4,
      marginBottom: 10,
      lineHeight: 18,
    },
    fieldMargin: {
      marginVertical: 10, // my-4
      padding: 12, // p-3
      backgroundColor: "#f8f9fa",
      borderRadius: 8,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8, // gap-2
    },
    questionLabel: {
      color: theme.gray || "#444",
      fontSize: 14,
      marginTop: 8,
      marginBottom: 6,
    },
    radioButtons: {
      display: "flex",
      flexDirection: "row",
      gap: 16, // gap-4
    },
    required: {
      color: "red",
    },
    errorContainer: {
      marginTop: 6,
    },
    errorText: {
      color: theme.secondary || "red",
      fontSize: 12,
      lineHeight: 16,
    },
    marginTopSmall: {
      marginTop: 4,
    },
    buttonContainer: {
      marginVertical: 20,
      alignItems: "center",
    },
  });

export default ConnectedOVR;
