import React, { useContext } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "@/styles/ThemeProvider";
import { FormProps, RegisterFormState } from "@/utils/types";
import InputField from "../../atoms/InputField";
import { RegisterStepHeader } from "../../modules/RegisterStepHeader";
import { DateRow } from "../../atoms/DateOfBirth/DateRow";
import { isRequired, isVisible } from "@/utils/constants";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Navigation";
import RenderHTML from "react-native-render-html";
import { SelectField } from "../../atoms/SelectField";

type ConnectedOVRScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

export default function ConnectedOVRStep2({
  state,
  value,
  formCongif,
  errorMessages,
  onChange,
  onChangeError,
  handleMainButton,
}: FormProps) {
  const navigation = useNavigation<ConnectedOVRScreenNavigation>();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const EYE_COLORS = [
    { name: "", value: "" },
    { name: t("michigan.eye_color_options.none"), value: "UNK" },
    { name: t("michigan.eye_color_options.black"), value: "BLK" },
    { name: t("michigan.eye_color_options.blue"), value: "BLU" },
    { name: t("michigan.eye_color_options.brown"), value: "BRO" },
    { name: t("michigan.eye_color_options.green"), value: "GRN" },
    { name: t("michigan.eye_color_options.gray"), value: "GRY" },
    { name: t("michigan.eye_color_options.hazel"), value: "HIZ" },
    { name: t("michigan.eye_color_options.maroon"), value: "MAR" },
    { name: t("michigan.eye_color_options.pink"), value: "PNK" },
  ];

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
    const formValue = onlyDigits(text).slice(0, 4);
    updateField("last_four_ss_number", formValue);
  };

  return (
    <>
      <RegisterStepHeader
        titleKey="michigan.section_personal_info"
        completedSteps={2}
        currentStep={3}
      />
      <Text style={styles.text}>{t("michigan.personal_info_req_1")}</Text>
      <RenderHTML
        contentWidth={width}
        source={{
          html: t("michigan.personal_info_req_2", {
            rtv_paper_form_url: "paper-link",
          }),
        }}
        tagsStyles={{
          body: {
            fontSize: 12,
            lineHeight: 14,
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
                workflowType: "nvra",
                showRedirectText: true,
              } as any);
            },
          },
        }}
      />
      {isVisible(formCongif, "full_name") && (
        <InputField
          name="full_name"
          value={value.full_name}
          label={t("michigan.full_name", { state: state.name })}
          required={isRequired(formCongif, "full_name")}
          errorMessage={t(errorMessages.full_name)}
          helpText={t("form_fields.name_help")}
          onChangeText={(text: string) => updateField("full_name", text)}
        />
      )}
      {isVisible(formCongif, "state_id_number") && (
        <InputField
          name="state_id_number"
          value={value.state_id_number}
          label={t("michigan.license_number_label", {
            state_name: state.name,
          })}
          // maxLength={
          //   formCongif.fields.state_id_number?.validations?.max_length
          // }
          required={isRequired(formCongif, "state_id_number")}
          errorMessage={
            errorMessages.state_id_number && (
              <RenderHTML
                contentWidth={width}
                source={{
                  html: t(errorMessages.state_id_number),
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
                        workflowType: "nvra",
                        showRedirectText: true,
                      } as any);
                    },
                  },
                }}
              />
            )
          }
          onChangeText={(text: string) => updateField("state_id_number", text)}
        />
      )}

      {isVisible(formCongif, "date_of_birth") && (
        <DateRow
          value={{
            month: {
              name: "birthMonth",
              value: value.birthMonth,
              errorText: t(errorMessages.birthMonth),
            },
            day: {
              name: "birthDay",
              value: value.birthDay,
              errorText: t(errorMessages.birthDay),
            },
            year: {
              name: "birthYear",
              value: value.birthYear,
              errorText: t(errorMessages.birthYear),
            },
          }}
          required={isRequired(formCongif, "date_of_birth")}
          updateField={updateField}
        />
      )}

      {/* EYE COLOR */}
      {isVisible(formCongif, "eye_color") && (
        <SelectField
          name="eye_color"
          label={t("michigan.eye_color_label")}
          value={value.eye_color}
          options={EYE_COLORS}
          required={isRequired(formCongif, "eye_color")}
          errorMessage={errorMessages.eye_color}
          onValueChange={itemValue => updateField("eye_color", itemValue)}
        />
      )}

      {/* SSN */}
      {isVisible(formCongif, "ssn4") && (
        <InputField
          name="ssn_last4"
          showEye
          value={value.last_four_ss_number}
          label={t("form_fields.ssn_last4")}
          required={isRequired(formCongif, "ssn4")}
          helpText={formCongif.fields.ssn4?.tooltip}
          numeric
          maxLength={4}
          errorMessage={
            errorMessages.last_four_ss_number && (
              <RenderHTML
                contentWidth={width}
                source={{
                  html: t(errorMessages.last_four_ss_number),
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
                        workflowType: "nvra",
                        showRedirectText: true,
                      } as any);
                    },
                  },
                }}
              />
            )
          }
          onChangeText={handleSSNChange}
        />
      )}
      <View style={styles.buttonblock}>{handleMainButton}</View>
    </>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    text: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      marginBottom: 8,
      color: theme.textPrimary,
    },
    buttonblock: {
      marginTop: 15,
    },
  });
