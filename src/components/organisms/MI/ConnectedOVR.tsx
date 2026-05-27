import React, { useContext } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { FormProps, RegisterFormState } from "@/utils/types";
import { ThemeContext } from "@/styles/ThemeProvider";
import { useTranslation } from "react-i18next";
import { Radio } from "../../atoms/Radio";
import { Checkbox } from "../../atoms/Checkbox";
import { RegisterStepHeader } from "../../modules/RegisterStepHeader";
import { isRequired, isVisible } from "@/utils/constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Navigation";
import { useNavigation } from "@react-navigation/native";
import RenderHTML from "react-native-render-html";

type ConnectedOVRScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

export const ConnectedOVR = ({
  state,
  value,
  formCongif,
  errorMessages,
  onChange,
  onChangeError,
  handleMainButton,
}: FormProps) => {
  const navigation = useNavigation<ConnectedOVRScreenNavigation>();
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

  return (
    <>
      <RegisterStepHeader
        titleKey="michigan.eligibility_title"
        completedSteps={1}
        currentStep={2}
      />
      {isVisible(formCongif, "us_citizen") && (
        <Checkbox
          value={value.us_citizen}
          label={t("nvra_form_page.citizen")}
          required={isRequired(formCongif, "us_citizen")}
          errorText={t(errorMessages.us_citizen)}
          onValueChange={(checked: boolean) =>
            updateField("us_citizen", checked)
          }
        />
      )}
      {isVisible(formCongif, "will_be_18_by_election") && (
        <Checkbox
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
      )}
      {isVisible(formCongif, "residency_duration_ack") && (
        <Checkbox
          value={value.residency_duration_ack}
          label={t("michigan.eligibility.residency", {
            state_name: state.name,
          })}
          required={isRequired(formCongif, "residency_duration_ack")}
          errorText={
            errorMessages.residency_duration_ack === "show" ? (
              <>
                <Text style={styles.error}>
                  {t("michigan.eligibility.residency_error_1", {
                    state: state.name,
                  })}
                </Text>
                <Text style={styles.error}>
                  {t("michigan.eligibility.residency_error_2")}
                </Text>
              </>
            ) : (
              ""
            )
          }
          onValueChange={(checked: boolean) =>
            updateField("residency_duration_ack", checked)
          }
        />
      )}
      {isVisible(formCongif, "cancel_previous_registration_ack") && (
        <Checkbox
          value={value.cancel_previous_registration_ack}
          label={t("michigan.eligibility.cancelPrevious")}
          required={isRequired(formCongif, "cancel_previous_registration_ack")}
          errorText={
            errorMessages.cancel_previous_registration_ack === "show" ? (
              <>
                <View>
                  <Text style={styles.error}>
                    {t("michigan.eligibility.cancel_previous_error_1")}
                  </Text>
                </View>
                <RenderHTML
                  contentWidth={width}
                  source={{
                    html: t("michigan.eligibility.cancel_previous_error_2", {
                      rtv_paper_form_url: "paper-link",
                    }),
                  }}
                  tagsStyles={{
                    body: {
                      fontSize: 12,
                      lineHeight: 14,
                      color: theme.secondary,
                    },
                    a: {
                      color: theme.link,
                      textDecorationLine: "underline",
                    },
                  }}
                  renderersProps={{
                    a: {
                      onPress: () => {
                        navigation.replace("Register", {
                          status: { success: true },
                          state,
                          zip: value.home_zip_code,
                          email: value.email_address,
                          form: {
                            ...value,
                            home_address:
                              value.street_name +
                              " " +
                              value.street_number +
                              " " +
                              value.street_type +
                              " " +
                              value.street_direction,
                          },
                          pageFromLookup: "paper",
                          showRedirectText: true,
                        } as any);
                      },
                    },
                  }}
                />
              </>
            ) : (
              ""
            )
          }
          onValueChange={(checked: boolean) =>
            updateField("cancel_previous_registration_ack", checked)
          }
        />
      )}
      {isVisible(formCongif, "use_stored_signature_ack") && (
        <Checkbox
          value={value.use_stored_signature_ack}
          label={t("michigan.eligibility.digitalSignature")}
          required={isRequired(formCongif, "use_stored_signature_ack")}
          errorText={
            errorMessages.use_stored_signature_ack === "show" ? (
              <>
                <View>
                  <Text style={styles.error}>
                    {t("michigan.eligibility.digital_signature_error_1")}
                  </Text>
                </View>
                <RenderHTML
                  contentWidth={width}
                  source={{
                    html: t("michigan.eligibility.digital_signature_error_2", {
                      rtv_paper_form_url: "paper-link",
                    }),
                  }}
                  tagsStyles={{
                    body: {
                      fontSize: 12,
                      lineHeight: 14,
                      color: theme.secondary,
                    },
                    a: {
                      color: theme.link,
                      textDecorationLine: "underline",
                    },
                  }}
                  renderersProps={{
                    a: {
                      onPress: () => {
                        navigation.replace("Register", {
                          status: { success: true },
                          state,
                          zip: value.home_zip_code,
                          email: value.email_address,
                          form: {
                            ...value,
                            home_address:
                              value.street_name +
                              " " +
                              value.street_number +
                              " " +
                              value.street_type +
                              " " +
                              value.street_direction,
                          },
                          pageFromLookup: "paper",
                          showRedirectText: true,
                        } as any);
                      },
                    },
                  }}
                />
              </>
            ) : (
              ""
            )
          }
          onValueChange={(checked: boolean) =>
            updateField("use_stored_signature_ack", checked)
          }
        />
      )}

      {isVisible(formCongif, "updated_dln_recently") && (
        <>
          {/* LICENSE UPDATE */}
          <Text style={styles.gray}>
            {t("michigan.eligibility.questions.licenseUpdate")}
            {isRequired(formCongif, "updated_dln_recently") && (
              <Text style={styles.required}> *</Text>
            )}
          </Text>

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
        </>
      )}
      {errorMessages.updated_dln_recently === "show" && (
        <>
          <View>
            <Text style={styles.error}>
              {t("michigan.eligibility.updated_license_error_1")}
            </Text>
          </View>
          <RenderHTML
            contentWidth={width}
            source={{
              html: t("michigan.eligibility.updated_license_error_2", {
                rtv_paper_form_url: "paper-link",
              }),
            }}
            tagsStyles={{
              body: {
                fontSize: 12,
                lineHeight: 14,
                color: theme.secondary,
              },
              a: {
                color: theme.link,
                textDecorationLine: "underline",
              },
            }}
            renderersProps={{
              a: {
                onPress: () => {
                  navigation.replace("Register", {
                    status: { success: true },
                    state,
                    zip: value.home_zip_code,
                    email: value.email_address,
                    form: {
                      ...value,
                      home_address:
                        value.street_name +
                        " " +
                        value.street_number +
                        " " +
                        value.street_type +
                        " " +
                        value.street_direction,
                    },
                    pageFromLookup: "paper",
                    showRedirectText: true,
                  } as any);
                },
              },
            }}
          />
        </>
      )}

      {isVisible(formCongif, "request_duplicate_dln_today") && (
        <>
          {/* DUPLICATE LICENSE */}
          <Text style={styles.gray}>
            {t("michigan.eligibility.questions.duplicateLicense")}
            <Text style={styles.required}> *</Text>
          </Text>

          <Radio
            label={t("general.no")}
            selected={value.request_duplicate_dln_today === "no"}
            onPress={() => updateField("request_duplicate_dln_today", "no")}
          />
          <Radio
            label={t("general.yes")}
            selected={value.request_duplicate_dln_today === "yes"}
            onPress={() => updateField("request_duplicate_dln_today", "yes")}
          />
        </>
      )}
      {errorMessages.request_duplicate_dln_today === "show" && (
        <View style={styles.errorBlock}>
          <View>
            <Text style={styles.error}>
              {t("michigan.eligibility.duplicate_license_error_1")}
            </Text>
          </View>
          <RenderHTML
            contentWidth={width}
            source={{
              html: t("michigan.eligibility.duplicate_license_error_2", {
                rtv_paper_form_url: "paper-link",
              }),
            }}
            tagsStyles={{
              body: {
                fontSize: 12,
                lineHeight: 14,
                color: theme.secondary,
              },
              a: {
                color: theme.link,
                textDecorationLine: "underline",
              },
            }}
            renderersProps={{
              a: {
                onPress: () => {
                  navigation.replace("Register", {
                    status: { success: true },
                    state,
                    zip: value.home_zip_code,
                    email: value.email_address,
                    form: {
                      ...value,
                      home_address:
                        value.street_name +
                        " " +
                        value.street_number +
                        " " +
                        value.street_type +
                        " " +
                        value.street_direction,
                    },
                    pageFromLookup: "paper",
                    showRedirectText: true,
                  } as any);
                },
              },
            }}
          />
        </View>
      )}
      {handleMainButton}
    </>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    gray: {
      color: theme.gray,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "regular",
      marginTop: 12,
      marginBottom: 4,
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
    errorBlock: {
      marginBottom: 5,
    },
  });
