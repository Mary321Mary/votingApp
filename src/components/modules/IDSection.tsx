import React, { useContext } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "@/styles/ThemeProvider";
import { FormProps, RegisterFormState } from "@/utils/types";

import InputField from "../atoms/InputField";
import { isRequired } from "@/utils/constants";
import { Checkbox } from "../atoms/Checkbox";
import { Radio } from "../atoms/Radio";
import RenderHTML from "react-native-render-html";

interface IDSectionProps extends FormProps {
  showRadioButtons?: boolean;
}

export const IDSection = ({
  state,
  value,
  formCongif,
  errorMessages,
  showRadioButtons = false,
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

  const onlyDigits = (text: string) => text.replace(/\D/g, "");

  const handleSSNChange = (text: string) => {
    const digits = onlyDigits(text);
    const lastFour = digits.slice(-4);
    updateField("last_four_ss_number", lastFour);
  };

  return (
    <View style={styles.section}>
      {showRadioButtons ? (
        <>
          <Text style={styles.header}>
            <RenderHTML
              contentWidth={width}
              source={{
                html: `
                  ${t("finish_with_state_page1.dl_id_question", {
                    state_abbr: state.abbreviation,
                  })}
                  ${
                    isRequired(formCongif, "id_number_radio_button_set")
                      ? '<span style="color:red">*</span>'
                      : ""
                  }
                `,
              }}
              tagsStyles={{
                body: {
                  fontSize: 14,
                  lineHeight: 18,
                  marginVertical: 5,
                },
                strong: {
                  fontWeight: "bold",
                },
                span: {
                  color: "red",
                  fontWeight: "bold",
                },
              }}
            />
          </Text>
          <Radio
            label={t("finish_with_state_page1.dl_id_answer_yes", {
              state_abbr: state.abbreviation,
            })}
            selected={value.has_no_state_license === false}
            onPress={() => updateField("has_no_state_license", false)}
          />
          {value.has_no_state_license && value.age_eligibility ? (
            <Text style={styles.required}>
              {t("register_page.license_age_eligibility")}
            </Text>
          ) : (
            ""
          )}
          <Radio
            label={t("finish_with_state_page1.dl_id_answer_no", {
              state_abbr: state.abbreviation,
            })}
            selected={value.has_no_state_license === true}
            onPress={() => updateField("has_no_state_license", true)}
          />
          {errorMessages.has_no_state_license && (
            <Text style={styles.required}>
              {t(errorMessages.has_no_state_license)}
            </Text>
          )}
        </>
      ) : (
        <>
          <InputField
            label={t("form_fields.id_number")}
            value={value.state_id_number}
            required={isRequired(formCongif, "state_id_number")}
            disabled={value.has_no_state_license === true}
            maxLength={
              formCongif.fields.state_id_number?.validations?.max_length
            }
            errorMessage={
              value.has_no_state_license !== true &&
              t(errorMessages.state_id_number, {
                state_abbr: state.abbreviation,
              })
            }
            onChangeText={(text: string) => {
              const digits = onlyDigits(text);
              const lastFour = digits.slice(-4);

              // Batch all updates together to prevent overwriting
              onChange({
                ...value,
                state_id_number: text,
                has_no_state_license: false,
                last_four_ss_number: lastFour,
              });

              // Clear errors for updated fields
              const clearedErrors = { ...errorMessages };
              if (errorMessages.state_id_number?.length) {
                clearedErrors.state_id_number = "";
              }
              if (errorMessages.last_four_ss_number?.length) {
                clearedErrors.last_four_ss_number = "";
              }
              onChangeError(clearedErrors);
            }}
          />
          <Text style={styles.hint}>
            {formCongif.fields.state_id_number?.tooltip}
          </Text>
          <Checkbox
            value={value.has_no_state_license === true}
            label={t("nvra_form_page.no_license_number_label")}
            required={isRequired(formCongif, "has_no_state_license")}
            onValueChange={checked =>
              updateField("has_no_state_license", checked)
            }
          />
          {value.has_no_state_license && (
            <>
              <InputField
                showEye
                maxLength={4}
                value={value.last_four_ss_number}
                errorMessage={t(errorMessages.last_four_ss_number)}
                disabled={
                  !value.has_no_state_license || value.has_no_ssn === true
                }
                required={
                  !value.has_no_ssn &&
                  isRequired(formCongif, "last_four_ss_number")
                }
                label={t("form_fields.ssn_last4")}
                onChangeText={handleSSNChange}
              />
              <Checkbox
                value={value.has_no_ssn === true}
                required={isRequired(formCongif, "has_no_ssn")}
                label={t("nvra_form_page.no_ssn_last4")}
                onValueChange={checked => updateField("has_no_ssn", checked)}
              />
            </>
          )}
        </>
      )}
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    section: {},
    header: { marginVertical: 10 },
    hint: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 13,
      color: theme.gray,
      marginTop: 8,
      marginBottom: 8,
      lineHeight: 18,
    },
    strong: {
      fontWeight: "bold",
    },
    required: {
      color: theme.secondary,
    },
  });
