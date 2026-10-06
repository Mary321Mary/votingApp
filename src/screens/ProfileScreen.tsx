import React, { useState, useContext, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ThemeContext } from "@/styles/ThemeProvider";
import Header from "@/layout/Header";
import { CustomButton } from "../components/atoms/CustomButton";
import { VOTER_FORM_STORAGE_KEY } from "@/utils/constants";
import {
  CheckRegistrationStatus,
  CheckRegistrationStatusError,
} from "@/utils/types";
import { EMPTY_ERROR_MESSAGES } from "./onboarding/CheckVoterStatus";
import { DateRow } from "@/components/atoms/DateOfBirth/DateRow";
import InputField from "@/components/atoms/InputField";
import { processDateOfBirthValidation } from "@/components/atoms/DateOfBirth/dateValidation";
import { RootStackParamList } from "@/components/Navigation";
import { Checkbox } from "../components/atoms/Checkbox";
import { AddressAutocomplete } from "../components/atoms/AddressAutocomplete";
import { useUIConfig } from "../contexts/UIConfigContext";

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, "Profile">;

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { config } = useUIConfig();

  const [form, setForm] = useState<CheckRegistrationStatus>({
    partner_id: 1,

    first_name: "",
    last_name: "",
    email: "",
    city: "",
    zip: "",

    aptunit: "",
    address: "",
    birthMonth: "",
    birthDay: "",
    birthYear: "",
    date_of_birth: "",
    phone: "",

    opt_in_email: false,
    opt_in_sms: true,
    volunteer: false,

    survey_question_1: "",
    survey_answer_1: "",
    survey_question_2: "",
    survey_answer_2: "",

    prefType1: true,
    prefType2: true,
    prefType3: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] =
    useState<CheckRegistrationStatusError>(EMPTY_ERROR_MESSAGES);
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

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [storedForm] = await Promise.all([
          AsyncStorage.getItem(VOTER_FORM_STORAGE_KEY),
        ]);

        if (storedForm) {
          const parsedForm = JSON.parse(storedForm);
          setForm(parsedForm);
        }
      } catch (error) {
        console.error("Failed to load user data from AsyncStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleContinue = async () => {
    if (validateRegistrationStatus()) {
      await AsyncStorage.setItem(VOTER_FORM_STORAGE_KEY, JSON.stringify(form));
      navigation.replace("Dashboard");
    }
  };

  const validateRegistrationStatus = () => {
    const zipRegex = /^\d{5}$/;
    const fullPhoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    if (form.phone.trim()) {
      errorMessage.phone = t("form_fields.required_phone");
    } else if (fullPhoneRegex.test(form.phone.trim())) {
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

    setErrors(errorMessage);
    return !Object.values(errorMessage).some(value => value.trim() !== "");
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header text={t("native_local.initial_profile_page.title")} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Form Fields */}
        <InputField
          name="first_name"
          label={t("form_fields.first_name")}
          required
          value={form.first_name}
          errorMessage={errors.first_name}
          onChangeText={(text: string) => updateField("first_name", text)}
        />
        <InputField
          name="last_name"
          label={t("form_fields.last_name")}
          required
          value={form.last_name}
          errorMessage={errors.last_name}
          onChangeText={(text: string) => updateField("last_name", text)}
        />
        {!isByFields ? (
          <AddressAutocomplete
            apiKey={config?.google_maps_browser_key || ""}
            label={t("form_fields.address")}
            required
            errorText={errors.address}
            onAddressSelect={({ address, city, zip }) => {
              setForm(prev => ({
                ...prev,
                address,
                city,
                zip,
              }));
              setErrors(prev => ({
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
              errorMessage={errors.address}
              onChangeText={(text: string) => updateField("address", text)}
            />
            <InputField
              name="aptunit"
              label={t("form_fields.unit_lot")}
              value={form.aptunit}
              errorMessage={t(errors.aptunit)}
              onChangeText={(text: string) => updateField("aptunit", text)}
            />
            <InputField
              name="city"
              label={t("form_fields.city")}
              required
              value={form.city}
              errorMessage={errors.city}
              onChangeText={(text: string) => updateField("city", text)}
            />
            <InputField
              name="zip"
              numeric
              label={t("form_fields.zip")}
              required
              value={form.zip}
              errorMessage={errors.zip}
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
            setErrors(EMPTY_ERROR_MESSAGES);
          }}
        />

        <DateRow
          value={{
            month: {
              name: "birthMonth",
              value: form.birthMonth,
              errorText: t(errors.birthMonth),
            },
            day: {
              name: "birthDay",
              value: form.birthDay,
              errorText: t(errors.birthDay),
            },
            year: {
              name: "birthYear",
              value: form.birthYear,
              errorText: t(errors.birthYear),
            },
          }}
          required
          updateField={updateField}
        />

        <InputField
          name="email"
          email
          label={t("form_fields.email")}
          value={form.email}
          required
          errorMessage={errors.email}
          onChangeText={(text: string) => updateField("email", text)}
        />
        <InputField
          name="phone"
          numeric
          label={t("form_fields.phone")}
          placeholder="###-###-####"
          value={form.phone}
          errorMessage={errors.phone}
          helpText={t("form_fields.phone_help")}
          onChangeText={handlePhoneChange}
        />

        {/* Bottom Continue Button */}
        <CustomButton
          title={t("register_18_by_election_page.continue_button_text")}
          onPress={handleContinue}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme?.white || "#FFFFFF",
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    scrollContent: {
      padding: 10,
    },
    bodyContainer: {
      marginBottom: 24,
      gap: 12,
    },
    bodyText: {
      fontSize: 15,
      color: theme?.textColor || "#374151",
      lineHeight: 22,
    },
  });
