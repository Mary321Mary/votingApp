import React, { useContext } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "@/styles/ThemeProvider";
import { FormProps, RegisterFormState } from "@/utils/types";

import InputField from "../atoms/InputField";
import {
  DEFAULT_STATE_REQUIRED_ID,
  fieldConfigured,
  fieldDependsOn,
  isRequired,
  isVisible,
} from "@/utils/constants";
import { Checkbox } from "../atoms/Checkbox";
import { Radio } from "../atoms/Radio";
import RenderHTML from "react-native-render-html";

interface IDSectionProps extends FormProps {
  showRadioButtons?: boolean;
  showOnlySSN?: boolean;
}

export const IDSection = ({
  state,
  value,
  formCongif,
  errorMessages,
  showRadioButtons = false,
  showOnlySSN = false,
  onChange,
  onChangeError,
}: IDSectionProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

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

  const ssnLength =
    formCongif?.fields?.last_four_ss_number?.validations?.max_length ?? 4;

  const ssnGatedOnNoLicense = fieldDependsOn(
    formCongif,
    "last_four_ss_number",
    "has_no_state_license",
  );

  const showSsnFields =
    value.has_no_state_license === true ||
    (fieldConfigured(formCongif, "last_four_ss_number") &&
      !ssnGatedOnNoLicense);

  const ssnTooltip = formCongif.fields.last_four_ss_number?.tooltip;
  const noDriversLicenseSsnNotice =
    showOnlySSN && !ssnTooltip
      ? t(
          ssnLength === 9
            ? "nvra_form_page.no_dl_ssn9_label"
            : "nvra_form_page.no_dl_ssn4_label",
        )
      : null;

  const onlyDigits = (text: string) => text.replace(/\D/g, "");

  const handleSSNChange = (text: string) => {
    const digits = onlyDigits(text);
    updateField("last_four_ss_number", digits.slice(-ssnLength));
  };

  return (
    <>
      {showRadioButtons ? (
        <View style={styles.section}>
          <View style={styles.header}>
            <RenderHTML
              contentWidth={width}
              source={{
                html: `
                  ${t("finish_with_state_page1.dl_id_question", {
                    state_abbr: state.abbreviation,
                    state_required_id:
                      state.state_required_id || DEFAULT_STATE_REQUIRED_ID,
                  })}
                  ${
                    isRequired(formCongif, "id_number_radio_button_set")
                      ? '<span style="color:red">*</span>'
                      : ""
                  }
                `,
              }}
              tagsStyles={{
                body: { fontSize: 14, lineHeight: 18, marginVertical: 5 },
                strong: { fontWeight: "bold" },
                span: { color: "red", fontWeight: "bold" },
                em: { fontStyle: "italic" },
              }}
            />
          </View>
          <View style={styles.header}>
            <RenderHTML
              contentWidth={width}
              source={{
                html: `
                  ${t("finish_with_state_page1.dl_id_statement", {
                    state_abbr: state.abbreviation,
                    state_required_id:
                      state.state_required_id || DEFAULT_STATE_REQUIRED_ID,
                  })}
                `,
              }}
              tagsStyles={{
                body: { fontSize: 14, lineHeight: 18 },
                strong: { fontWeight: "bold" },
                span: { color: "red", fontWeight: "bold" },
                em: { fontStyle: "italic" },
              }}
            />
          </View>
          <Radio
            label={t("finish_with_state_page1.dl_id_answer_yes", {
              state_abbr: state.abbreviation,
              state_required_id:
                state.state_required_id || DEFAULT_STATE_REQUIRED_ID,
            })}
            selected={value.has_no_state_license === false}
            onPress={() => updateField("has_no_state_license", false)}
          />
          {value.has_no_state_license && value.age_eligibility ? (
            <Text style={styles.required}>
              {t("register_page.license_age_eligibility")}
            </Text>
          ) : null}
          <Radio
            label={t("finish_with_state_page1.dl_id_answer_no", {
              state_abbr: state.abbreviation,
              state_required_id:
                state.state_required_id || DEFAULT_STATE_REQUIRED_ID,
            })}
            selected={value.has_no_state_license === true}
            onPress={() => updateField("has_no_state_license", true)}
          />
          {errorMessages.has_no_state_license && (
            <RenderHTML
              contentWidth={width}
              source={{ html: t(errorMessages.has_no_state_license) }}
              tagsStyles={{
                body: { color: theme.secondary || "red" },
                strong: { fontWeight: "bold" },
              }}
            />
          )}
        </View>
      ) : (
        <View style={styles.fieldset}>
          <View style={styles.legendContainer}>
            <Text style={styles.legendText}>
              {t("nvra_form_page.section_identification")}
              <Text style={styles.requiredStar}> *</Text>
            </Text>
          </View>

          {!showOnlySSN && (
            <>
              {isVisible(formCongif, "state_id_number") &&
                value.has_no_state_license !== true && (
                  <>
                    {formCongif.fields?.state_id_number?.tooltip && (
                      <Text style={styles.hint}>
                        {formCongif.fields.state_id_number?.tooltip}
                      </Text>
                    )}
                    <InputField
                      name="state_id_number"
                      value={value.state_id_number}
                      required={isRequired(formCongif, "state_id_number")}
                      // minLength={
                      //   formCongif.fields?.state_id_number?.validations
                      //     ?.min_length
                      // }
                      maxLength={
                        formCongif.fields?.state_id_number?.validations
                          ?.max_length
                      }
                      errorMessage={
                        errorMessages.state_id_number &&
                        t(errorMessages.state_id_number, {
                          state_abbr: state.abbreviation,
                        })
                      }
                      onChangeText={(text: string) => {
                        updateField("state_id_number", text);
                        updateField("has_no_state_license", false);
                      }}
                    />
                  </>
                )}

              {isVisible(formCongif, "has_no_state_license") && (
                <Checkbox
                  name="has_no_state_license"
                  value={value.has_no_state_license === true}
                  label={t("nvra_form_page.no_license_number_label")}
                  onValueChange={checked => {
                    onChange({
                      ...value,
                      has_no_state_license: checked,
                      state_id_number: checked ? "" : value.state_id_number,
                    });
                  }}
                />
              )}
            </>
          )}

          {showSsnFields && (
            <View style={styles.ssnBlock}>
              {value.has_no_ssn !== true && (
                <InputField
                  name="last_four_ss_number"
                  maxLength={ssnLength}
                  showEye
                  value={value.last_four_ss_number}
                  errorMessage={
                    errorMessages.last_four_ss_number
                      ? t(errorMessages.last_four_ss_number)
                      : undefined
                  }
                  required={
                    !value.has_no_ssn &&
                    isRequired(
                      formCongif,
                      "last_four_ss_number",
                      ssnGatedOnNoLicense
                        ? value.has_no_state_license === true
                        : undefined,
                    )
                  }
                  label={t(
                    ssnLength === 9
                      ? "form_fields.ssn"
                      : "form_fields.ssn_last4",
                  )}
                  afterLabel={
                    <>
                      {noDriversLicenseSsnNotice && (
                        <Text>{noDriversLicenseSsnNotice}</Text>
                      )}
                      {ssnTooltip && <Text>{ssnTooltip}</Text>}
                    </>
                  }
                  onChangeText={handleSSNChange}
                />
              )}

              {isVisible(formCongif, "has_no_ssn") && (
                <Checkbox
                  name="has_no_ssn"
                  value={value.has_no_ssn === true}
                  disabled={ssnGatedOnNoLicense && !value.has_no_state_license}
                  label={t("nvra_form_page.no_ssn_last4")}
                  onValueChange={checked => {
                    onChange({
                      ...value,
                      has_no_ssn: checked,
                      last_four_ss_number: checked
                        ? ""
                        : value.last_four_ss_number,
                    });
                  }}
                />
              )}
            </View>
          )}

          {isVisible(formCongif, "has_no_ssn") &&
            value.has_no_ssn === true &&
            (value.has_no_state_license === true ||
              !isVisible(formCongif, "has_no_state_license")) && (
              <Text style={styles.statementText}>
                {t("nvra_form_page.no_ssn_statement")}
              </Text>
            )}
        </View>
      )}
    </>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    section: {
      paddingTop: 10,
    },
    fieldset: {
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 15,
      marginTop: 20,
      marginBottom: 20,
      position: "relative",
    },
    legendContainer: {
      position: "absolute",
      top: -10,
      left: 12,
      backgroundColor: theme.white,
      borderRadius: 5,
      padding: 3,
      flexDirection: "row",
      alignItems: "center",
    },
    legendText: {
      fontSize: 14,
      fontWeight: "bold",
      textTransform: "uppercase",
      color: theme.textPrimary,
    },
    requiredStar: {
      color: theme.secondary || "red",
      fontWeight: "bold",
    },
    header: {
      marginVertical: 5,
    },
    hint: {
      fontSize: 13,
      color: theme.gray || "#6c757d",
      marginBottom: 8,
      lineHeight: 18,
    },
    required: {
      color: theme.secondary || "red",
      marginVertical: 4,
    },
    ssnBlock: {
      marginTop: 10,
    },
    statementText: {
      marginTop: 10,
      fontSize: 14,
      color: theme.textPrimary || "#000",
    },
  });
