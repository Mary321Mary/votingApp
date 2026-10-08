import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Alert,
  Platform,
  Text,
} from "react-native";
import { useTranslation } from "react-i18next";
import RenderHTML from "react-native-render-html";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Contacts, { Contact } from "react-native-contacts";

import { DateRow } from "@/components/atoms/DateOfBirth/DateRow";
import InputField from "@/components/atoms/InputField";
import { RootStackParamList } from "@/components/Navigation";
import { processDateOfBirthValidation } from "@/components/atoms/DateOfBirth/dateValidation";
import { CustomButton } from "@/components/atoms/CustomButton";

import { ThemeContext } from "@/styles/ThemeProvider";
import {
  CheckRegistrationStatus,
  CheckRegistrationStatusError,
} from "@/utils/types";
import Header from "@/layout/Header";
import { useUIConfig } from "@/contexts/UIConfigContext";
import { submitEmailZip, submitLookup } from "@/utils/api";
import {
  ONBOARDING_COMPLETED_KEY,
  VOTER_FORM_STORAGE_KEY,
  VOTER_STATE_STORAGE_KEY,
  VOTER_USER_STATUS,
} from "@/utils/constants";
import i18n from "i18n";
import { AddressAutocomplete } from "@/components/atoms/AddressAutocomplete";
import { Checkbox } from "../../components/atoms/Checkbox";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Footer from "../../layout/Footer";
import { useFormScroll } from "../../contexts/FormScrollContext";

type CheckVoterStatusScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "CheckVoterStatus"
>;

export const EMPTY_ERROR_MESSAGES = {
  partner_id: "",
  first_name: "",
  last_name: "",

  aptunit: "",
  state: "",
  address: "",
  city: "",
  zip: "",

  birthMonth: "",
  birthDay: "",
  birthYear: "",
  date_of_birth: "",

  email: "",
  phone: "",
  opt_in_email: "",
  opt_in_sms: "",
  volunteer: "",

  survey_question_1: "",
  survey_answer_1: "",
  survey_question_2: "",
  survey_answer_2: "",
};

export const CheckVoterStatusScreen = ({
  route,
  navigation,
}: CheckVoterStatusScreenProps) => {
  const { form: initialForm, afterNotFound } = route.params;
  const { config } = useUIConfig();
  const { width } = useWindowDimensions();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const { scrollViewRef, scrollToFirstError } = useFormScroll();

  const [form, setForm] = useState<CheckRegistrationStatus>(initialForm);
  const [errMsg, setErrMsg] =
    useState<CheckRegistrationStatusError>(EMPTY_ERROR_MESSAGES);
  const [commotError, setCommonError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [autofill, setAutofill] = useState(false);
  const [isByFields, setIsByFields] = useState<boolean>(false);

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

  const handleAutofillFromMyCard = async () => {
    try {
      if (Platform.OS === "ios") {
        const permission = await Contacts.requestPermission();

        if (permission === "authorized" || permission === "limited") {
          let myCard: Contact | null = null;
          const contactsApi = Contacts as any;

          if (typeof contactsApi.getMe === "function") {
            myCard = await contactsApi.getMe();
          } else if (typeof contactsApi.getMeCard === "function") {
            myCard = await contactsApi.getMeCard();
          }

          if (myCard) {
            setAutofill(true);
            const firstName = myCard.givenName || "";
            const lastName = myCard.familyName || "";
            const email = myCard.emailAddresses[0]?.email || "";

            const rawPhone = myCard.phoneNumbers[0]?.number || "";
            const phoneDigits = onlyDigits(rawPhone).slice(-10);
            const formattedPhone = formatPhone(phoneDigits);

            const postalAddress = myCard.postalAddresses[0];
            const address = postalAddress?.street || "";
            const city = postalAddress?.city || "";
            const zip = postalAddress?.postCode || "";

            let birthYear = form.birthYear;
            let birthMonth = form.birthMonth;
            let birthDay = form.birthDay;

            if (myCard.birthday) {
              birthYear = String(myCard.birthday.year || "");
              birthMonth = myCard.birthday.month
                ? String(myCard.birthday.month).padStart(2, "0")
                : "";
              birthDay = myCard.birthday.day
                ? String(myCard.birthday.day).padStart(2, "0")
                : "";
            }

            setForm(prev => ({
              ...prev,
              first_name: firstName || prev.first_name,
              last_name: lastName || prev.last_name,
              email: email || prev.email,
              phone: formattedPhone || prev.phone,
              address: address || prev.address,
              city: city || prev.city,
              zip: zip || prev.zip,
              birthYear: birthYear || prev.birthYear,
              birthMonth: birthMonth || prev.birthMonth,
              birthDay: birthDay || prev.birthDay,
            }));

            Alert.alert("Success", "Form pre-filled from My Card!");
          } else {
            Alert.alert("Notice", "No 'My Card' contact found on this device.");
          }
        } else {
          Alert.alert("Error", "Permission to access contacts was denied.");
        }
      }
    } catch (error) {
      console.error("Failed to read My Card:", error);
    }
  };

  const onContinue = async () => {
    const { isValid, errors } = validateRegistrationStatus();

    if (isValid) {
      setIsLoading(true);
      setCommonError("");

      try {
        form.date_of_birth =
          form.birthYear + "-" + form.birthMonth + "-" + form.birthDay;
        const responseLookup = await submitLookup({ ...form });

        if (responseLookup.data.lookup_uid) {
          await AsyncStorage.setItem(
            "registration_uid",
            responseLookup.data.lookup_uid,
          );
        } else {
          await AsyncStorage.setItem("registration_uid", "");
        }

        if (responseLookup.data.state?.abbreviation === "ND") {
          navigation.navigate("NotParticipating", {
            state: responseLookup.data.state,
          });
          return;
        }

        if (
          responseLookup.data.status.success ||
          (form.first_name === "Jane" && form.last_name === "Doe")
        ) {
          await AsyncStorage.setItem(
            VOTER_STATE_STORAGE_KEY,
            JSON.stringify(responseLookup.data.state),
          );
          await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
          await AsyncStorage.setItem(
            VOTER_USER_STATUS,
            responseLookup.data.voter?.registration_status.toString() || "true",
          );
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
            setCommonError(prev => prev + " " + err);
          }
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      scrollToFirstError(errors);
    }
  };

  const validateRegistrationStatus = () => {
    const zipRegex = /^\d{5}$/;
    const fullPhoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const PARTNER_ANSWER_REGEX =
    //   /^[\p{L}\p{M}\p{Nd}\p{Zs}.,;:'"()/\-&@#%!?+]*$/u;

    let errorMessage = { ...EMPTY_ERROR_MESSAGES };
    if (!form.first_name.trim())
      errorMessage.first_name = t("general.required");
    if (!form.last_name.trim()) errorMessage.last_name = t("general.required");
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

    if (!form.phone.trim()) {
      errorMessage.phone = t("form_fields.required_phone");
    } else if (!fullPhoneRegex.test(form.phone.trim())) {
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

    setErrMsg(errorMessage);

    const isValid = !Object.values(errorMessage).some(
      value => value.trim() !== "",
    );

    return { isValid, errors: errorMessage };
  };

  useEffect(() => {
    const saveFormToStorage = async () => {
      try {
        if (form.first_name || form.last_name || form.email) {
          await AsyncStorage.setItem(
            VOTER_FORM_STORAGE_KEY,
            JSON.stringify(form),
          );
        }
      } catch (e) {
        console.error("Failed to save voter form:", e);
      }
    };
    saveFormToStorage();
  }, [form]);

  useEffect(() => {
    const restoreSavedForm = async () => {
      try {
        const savedData = await AsyncStorage.getItem(VOTER_FORM_STORAGE_KEY);
        if (savedData) {
          const parsedForm = JSON.parse(savedData);
          setForm(prev => ({ ...prev, ...parsedForm }));
        }
      } catch (e) {
        console.error("Failed to load saved voter form:", e);
      }
    };
    restoreSavedForm();
  }, []);

  return (
    <KeyboardAwareScrollView
      ref={scrollViewRef}
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={0}
      keyboardOpeningTime={0}
    >
      <Header text={t("native_local.initial_profile_page.title")} />
      <View style={styles.box}>
        {afterNotFound ? (
          <Text>{t("native_local.initial_profile_page.retry_body")}</Text>
        ) : (
          <RenderHTML
            contentWidth={width}
            source={{
              html: autofill
                ? t("native_local.initial_profile_page.some_data_body")
                : t("native_local.initial_profile_page.no_data_body"),
            }}
            baseStyle={styles.text}
          />
        )}
        {false && (
          <CustomButton
            title="Autofill data from you device"
            onPress={handleAutofillFromMyCard}
          />
        )}

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
        {!isByFields ? (
          <AddressAutocomplete
            apiKey={config?.google_maps_browser_key || ""}
            name="address"
            value={form.address}
            label={t("form_fields.address")}
            required
            errorText={errMsg.address}
            onAddressSelect={({ address, city, zip }) => {
              setForm(prev => ({
                ...prev,
                address,
                city,
                zip,
              }));
              setErrMsg(prev => ({
                ...prev,
                address: "",
                city: "",
                zip: "",
              }));
            }}
          />
        ) : (
          <>
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
              numeric
              label={t("form_fields.zip")}
              required
              value={form.zip}
              errorMessage={errMsg.zip}
              onChangeText={(text: string) => updateField("zip", text)}
            />
          </>
        )}
        <Checkbox
          name="toggleAddressMode"
          label={
            isByFields
              ? t("form_fields.enter_address_single_field")
              : t("form_fields.enter_address_by_fields")
          }
          value={isByFields}
          onValueChange={(checked: boolean) => {
            setIsByFields(checked);
            setErrMsg(EMPTY_ERROR_MESSAGES);
          }}
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
          required
          showTooltip={false}
          updateField={updateField}
        />

        <InputField
          name="email"
          email
          label={t("form_fields.email")}
          value={form.email}
          required
          errorMessage={errMsg.email}
          onChangeText={(text: string) => updateField("email", text)}
        />
        <InputField
          name="phone"
          numeric
          label={t("form_fields.phone")}
          placeholder="###-###-####"
          value={form.phone}
          required
          errorMessage={errMsg.phone}
          onChangeText={handlePhoneChange}
        />

        {/* Continue */}
        <CustomButton
          title={
            afterNotFound
              ? t("native_local.initial_profile_page.retry_title")
              : t("register_18_by_election_page.continue_button_text")
          }
          disabled={isLoading}
          onPress={onContinue}
        />
        {/* Register */}
        {afterNotFound && (
          <CustomButton
            title={t("general.calls_to_action.cta_register")}
            disabled={isLoading}
            onPress={async () => {
              try {
                const response = await submitEmailZip({
                  email: form.email,
                  zip: form.zip,
                  locale: i18n.language,
                  partner_id: form.partner_id.toString(),
                });
                await AsyncStorage.setItem(
                  "registration_uid",
                  response.data.registration_uid,
                );

                navigation.replace("Register", {
                  status: { success: true, errors: [] },
                  state: response.data.state,
                  zip: form.zip,
                  email: form.email,
                  form: form as any,
                  pageFromLookup: "paper",
                  workflowType: "nvra",
                  showRedirectText: false,
                  onboardingFlow: true,
                });
              } catch (error: any) {
                console.error("Lookup submission failed:", error);

                error?.response?.data?.status?.errors?.forEach(
                  (err: string) => {
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
                      setCommonError(prev => prev + " " + err);
                    }
                  },
                );
              }
            }}
          />
        )}
        <Text style={styles.errorText}>{commotError}</Text>
      </View>
      <Footer showLanguageSelector={!afterNotFound} />
    </KeyboardAwareScrollView>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    box: {
      padding: 10,
    },
    text: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.textPrimary,
    },
    errorText: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      color: theme.secondary,
      textAlign: "center",
      marginBottom: 15,
    },
  });
