import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Button,
  Linking,
} from "react-native";
import { useTranslation } from "react-i18next";

import { DateRow } from "@/components/atoms/DateOfBirth/DateRow";
import InputField from "@/components/atoms/InputField";
import { ThemeContext } from "@/styles/ThemeProvider";
import { Checkbox } from "@/components/atoms/Checkbox";
import {
  CheckRegistrationStatus,
  CheckRegistrationStatusError,
} from "@/utils/types";
import { RootStackParamList } from "@/components/organisms/Navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Header from "@/layout/Header";
import RenderHTML from "react-native-render-html";
import { useUIConfig } from "@/contexts/UIConfigContext";
import { getSurveyQuestions, submitLookup } from "@/utils/api";
import i18n from "@/i18n";
import { processDateOfBirthValidation } from "@/components/atoms/DateOfBirth/dateValidation";
import AsyncStorage from "@react-native-async-storage/async-storage";

type CheckVoterStatusScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "CheckVoterStatus"
>;

export const EMPTY_ERROR_MESSAGES = {
  partner_id: "",
  first_name: "",
  last_name: "",
  email: "",
  zip: "",

  aptunit: "",
  state: "",
  address: "",
  city: "",
  phone: "",
  opt_in_email: "",
  opt_in_sms: "",
  volunteer: "",

  birthMonth: "",
  birthDay: "",
  birthYear: "",
  date_of_birth: "",

  survey_question_1: "",
  survey_answer_1: "",
  survey_question_2: "",
  survey_answer_2: "",
};

export const CheckVoterStatusScreen = ({
  route,
  navigation,
}: CheckVoterStatusScreenProps) => {
  const { form: initialForm } = route.params;
  const { config } = useUIConfig();
  const { width } = useWindowDimensions();

  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const [form, setForm] = useState<CheckRegistrationStatus>(initialForm);
  const [errMsg, setErrMsg] =
    useState<CheckRegistrationStatusError>(EMPTY_ERROR_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (key: string, fieldValue: any) => {
    setForm({ ...form, [key]: fieldValue });
  };
  const onlyDigits = (text: string) => text.replace(/\D/g, "");

  const formatPhone = (digits: string) => {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (text: string) => {
    let digits = onlyDigits(text).slice(0, 10);
    if (form.phone.endsWith("-") && text.length === form.phone.length - 1) {
      digits = digits.slice(0, -1);
    }
    const formatted = formatPhone(digits);
    updateField("phone", formatted);
  };

  const onContinue = async () => {
    if (validateRegistrationStatus()) {
      setIsLoading(true);

      try {
        form.date_of_birth =
          form.birthYear + "-" + form.birthMonth + "-" + form.birthDay;
        const responseLookup = await submitLookup({ ...form });

        if (responseLookup.data.lookup_uid)
          await AsyncStorage.setItem(
            "registration_uid",
            responseLookup.data.lookup_uid,
          );

        if (responseLookup.data.state?.abbreviation === "ND") {
          navigation.navigate("NotParticipating", {
            state: responseLookup.data.state,
          });
          return;
        }

        if (responseLookup.data.status.success) {
          navigation.navigate("Lookup", {
            form,
            state: responseLookup.data.state,
          });
        } else {
          navigation.navigate("LookupNotFound", {
            form,
            state: responseLookup.data.state,
          });
        }
      } catch (error: any) {
        console.error("Lookup submission failed:", error);

        error?.response?.data?.status?.errors?.forEach((err: string) => {
          if (err.includes("email")) {
            setErrMsg(prev => ({
              ...prev,
              email: t("form_fields.email_error"),
            }));
          } else if (err.includes("zip")) {
            setErrMsg(prev => ({
              ...prev,
              zip: t("form_fields.zip_code_error"),
            }));
          } else {
            setErrMsg(prev => ({
              ...prev,
              email: t("form_fields.email_error"),
            }));
          }
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const validateRegistrationStatus = () => {
    const zipRegex = /^\d{5}$/;
    const fullPhoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PARTNER_ANSWER_REGEX =
      /^[\p{L}\p{M}\p{Nd}\p{Zs}.,;:'"()/\-&@#%!?+]*$/u;

    let errorMessage = { ...EMPTY_ERROR_MESSAGES };
    if (!form.first_name.trim())
      errorMessage.first_name = t("general.required");
    if (!form.last_name.trim()) errorMessage.first_name = t("general.required");
    if (!form.city.trim()) errorMessage.city = t("general.required");
    if (!form.address.trim()) errorMessage.address = t("general.required");

    const dobValidation = processDateOfBirthValidation(
      form.birthYear,
      form.birthMonth,
      form.birthDay,
      {
        fields: {},
        validations: {
          po_box_allowed: false,
          min_age: 18,
        },
        eligibility: {
          allows_pre_reg: false,
          min_pre_reg_age: 18,
          min_vr_age: 18,
          min_age_election_day_buffer_days: 180,
          before_vr_deadline: true,
        },
      },
      true,
    );
    Object.assign(errorMessage, dobValidation.errors);
    Object.assign(form, dobValidation.formUpdates);

    if (form.opt_in_sms && !form.phone.trim()) {
      errorMessage.phone = t("form_fields.required_phone");
    } else if (form.opt_in_sms && !fullPhoneRegex.test(form.phone.trim())) {
      errorMessage.phone = t("form_fields.invalid_phone");
    }
    if (!form.zip.trim()) {
      errorMessage.zip = t("general.required");
    } else if (!zipRegex.test(form.zip.trim())) {
      errorMessage.zip = t("form_fields.zip_code_error");
    }
    if (!form.email.trim()) {
      errorMessage.email = t("general.required");
    } else if (!emailRegex.test(form.email.trim())) {
      errorMessage.email = t("form_fields.email_error");
    }

    if (
      form.survey_answer_1 &&
      !PARTNER_ANSWER_REGEX.test(form.survey_answer_1)
    ) {
      errorMessage.survey_answer_1 = t("form_fields.partner_answer_invalid");
    }
    if (
      form.survey_answer_2 &&
      !PARTNER_ANSWER_REGEX.test(form.survey_answer_2)
    ) {
      errorMessage.survey_answer_2 = t("form_fields.partner_answer_invalid");
    }

    setErrMsg(errorMessage);
    return !Object.values(errorMessage).some(value => value.trim() !== "");
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getSurveyQuestions({
          partner_id: form.partner_id.toString(),
          locale: i18n.language,
        });
        const data = response.data;
        setForm((prev: CheckRegistrationStatus) => ({
          ...prev,
          survey_question_1: data.survey_question_1,
          survey_question_2: data.survey_question_2,
        }));
      } catch (err) {
        console.error("Failed to fetch Data configuration:", err);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <ScrollView>
      <Header text={t("lookup_page.check_voter_registration_status")} />
      <View style={styles.box}>
        <InputField
          name="first_name"
          label={t("form_fields.first_name")}
          required
          value={form.first_name}
          errorMessage={errMsg.first_name}
          onChangeText={(text: string) => updateField("first_name", text)}
        />
        <InputField
          name="last_name"
          label={t("form_fields.last_name")}
          required
          value={form.last_name}
          errorMessage={errMsg.last_name}
          onChangeText={(text: string) => updateField("last_name", text)}
        />
        <InputField
          name="address"
          label={t("form_fields.address")}
          required
          value={form.address}
          errorMessage={errMsg.address}
          onChangeText={(text: string) => updateField("address", text)}
        />
        <InputField
          name="aptunit"
          label={t("form_fields.unit_lot")}
          value={form.aptunit}
          errorMessage={t(errMsg.aptunit)}
          onChangeText={(text: string) => updateField("aptunit", text)}
        />
        <InputField
          name="city"
          label={t("form_fields.city")}
          required
          value={form.city}
          errorMessage={errMsg.city}
          onChangeText={(text: string) => updateField("city", text)}
        />
        <InputField
          name="zip"
          label={t("form_fields.zip")}
          required
          value={form.zip}
          errorMessage={errMsg.zip}
          onChangeText={(text: string) => updateField("zip", text)}
        />

        <DateRow
          value={{
            month: {
              name: "birthMonth",
              value: form.birthMonth,
              errorText: t(errMsg.birthMonth),
            },
            day: {
              name: "birthDay",
              value: form.birthDay,
              errorText: t(errMsg.birthDay),
            },
            year: {
              name: "birthYear",
              value: form.birthYear,
              errorText: t(errMsg.birthYear),
            },
          }}
          updateField={updateField}
        />

        <InputField
          name="email"
          label={t("form_fields.email")}
          value={form.email}
          required
          errorMessage={errMsg.email}
          onChangeText={(text: string) => updateField("email", text)}
        />
        <InputField
          name="phone"
          label={t("form_fields.phone")}
          placeholder="###-###-####"
          value={form.phone}
          errorMessage={errMsg.phone}
          helpText={t("form_fields.phone_help")}
          onChangeText={handlePhoneChange}
        />

        <View style={styles.divider} />
        <Text style={styles.title}>
          {t("nvra_form_page.questions_for_you")}
        </Text>

        <InputField
          name="survey_answer_1"
          value={form.survey_answer_1}
          errorMessage={t(errMsg.survey_answer_1)}
          label={form.survey_question_1}
          onChangeText={(text: string) => updateField("survey_answer_1", text)}
        />

        <InputField
          name="survey_answer_2"
          value={form.survey_answer_2}
          errorMessage={t(errMsg.survey_answer_2)}
          label={form.survey_question_2}
          onChangeText={(text: string) => updateField("survey_answer_2", text)}
        />

        <View style={styles.divider} />

        {/* Checkboxes */}
        <Checkbox
          name="opt_in_email"
          label={t("general.opt_ins.email_opt_in")}
          value={form.opt_in_email}
          onValueChange={(checked: boolean) =>
            updateField("opt_in_email", checked)
          }
        />

        <Checkbox
          name="opt_in_sms"
          label={t("general.opt_ins.sms_opt_in")}
          value={form.opt_in_sms}
          onValueChange={(checked: boolean) =>
            updateField("opt_in_sms", checked)
          }
        />

        <Checkbox
          name="volunteer"
          label={t("general.opt_ins.volunteer")}
          value={form.volunteer}
          errorText={t(errMsg.volunteer)}
          onValueChange={(checked: boolean) =>
            updateField("volunteer", checked)
          }
        />

        <RenderHTML
          contentWidth={width}
          source={{
            html: t("general.opt_ins.sms_disclaimer", {
              rtv_terms_url: config?.urls?.terms,
              rtv_privacy_url: config?.urls?.privacy,
            }),
          }}
          tagsStyles={{
            body: {
              fontSize: 14,
              lineHeight: 18,
              marginVertical: 15,
            },
            a: {
              color: theme.link,
              textDecorationLine: "underline",
            },
          }}
          renderersProps={{
            a: {
              onPress: (_, href) => {
                if (href) {
                  Linking.openURL(href);
                }
              },
            },
          }}
        />

        {/* Continue */}
        <Button
          title={t("register_18_by_election_page.continue_button_text")}
          disabled={isLoading}
          onPress={onContinue}
        />
        <RenderHTML
          contentWidth={width}
          source={{
            html: t("general.opt_ins.continue_privacy_ack", {
              rtv_privacy_url: config?.urls?.privacy,
            }),
          }}
          tagsStyles={{
            body: {
              fontSize: 14,
              marginVertical: 18,
            },
            a: {
              fontSize: 14,
              color: theme.link,
              textDecorationLine: "underline",
            },
          }}
          renderersProps={{
            a: {
              onPress: (_, href) => {
                if (href) {
                  Linking.openURL(href);
                }
              },
            },
          }}
        />
      </View>
    </ScrollView>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    box: {
      paddingHorizontal: 10,
    },
    inputLabel: {
      textTransform: "uppercase",
      marginTop: 10,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      color: theme.textPrimary,
    },
    row: {
      gap: 8,
      marginBottom: 16,
      alignItems: "flex-end",
    },
    pickerWrapper: {
      flexBasis: "18%",
      minWidth: "100%",
      height: 45,
      backgroundColor: theme.white,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 5,
      overflow: "hidden",
      justifyContent: "center",
    },
    picker: {
      width: "100%",
    },
    pickerItem: {
      fontSize: 14,
    },

    fieldset: {
      marginBottom: 10,
      alignItems: "center",
      width: "100%",
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
    },
    inputBlock: {
      flex: 1,
      marginBottom: 12,
    },
    label: {
      textTransform: "uppercase",
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 4,
    },
    input: {
      borderWidth: 1,
      borderColor: "#000",
      borderRadius: 4,
      padding: 10,
    },
    smallInput: {
      borderWidth: 1,
      borderColor: "#000",
      borderRadius: 4,
      padding: 10,
      width: 80,
      textAlign: "center",
    },
    switchRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 10,
    },
    switchText: {
      flex: 1,
      marginLeft: 10,
      fontSize: 13,
    },
    button: {
      backgroundColor: "#1e6bd6",
      padding: 14,
      borderRadius: 4,
      alignItems: "center",
      marginTop: 20,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
    },

    divider: {
      height: 1,
      backgroundColor: theme.gray,
      marginVertical: 16,
    },
  });
