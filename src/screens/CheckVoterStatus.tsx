import React, { useContext, useState } from "react";
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
import { Picker } from "@react-native-picker/picker";

import { DateRow } from "@/components/atoms/DateRow";
import InputField from "@/components/atoms/InputField";
import { ThemeContext } from "@/styles/ThemeProvider";
import { Checkbox } from "@/components/atoms/Checkbox";
import { CheckRegistrationStatusError, RegisterFormState } from "@/utils/types";
import { RootStackParamList } from "@/components/organisms/Navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Header from "@/layout/Header";
import RenderHTML from "react-native-render-html";
import { useUIConfig } from "@/contexts/UIConfigContext";
import { submitEmailZip } from "@/utils/api";
import i18n from "@/i18n";

type CheckVoterStatusScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "CheckVoterStatus"
>;

const EMPTY_ERROR_MESSAGES = {
  firstName: "",
  lastName: "",
  suffix: "",
  address: "",
  city: "",
  phone: "",
  zip: "",
  email: "",
  emailConsent: "",
  smsConsent: "",
  birthMonth: "",
  birthDay: "",
  birthYear: "",
};

export const CheckVoterStatusScreen = ({
  route,
  navigation,
}: CheckVoterStatusScreenProps) => {
  const { form: initialForm } = route.params;
  const { config } = useUIConfig();
  const { width } = useWindowDimensions();
  const [errMsg, setErrMsg] =
    useState<CheckRegistrationStatusError>(EMPTY_ERROR_MESSAGES);

  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const [form, setForm] = useState<RegisterFormState>(initialForm);

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
      const response = await submitEmailZip({
        email: form.email_address,
        zip: form.home_zip_code,
        locale: i18n.language,
        partner_id: "1",
      });

      if (response.data.state?.abbreviation === "ND") {
        // navigation.navigate(PATH.REGISTER.INELIGIBLE, { state: response.data.state });
        return;
      }
      if (form.first_name === "John") {
        navigation.navigate("LookupNotFound", {
          form,
          state: response.data.state,
        });
      } else {
        navigation.navigate("Lookup", {
          form,
          state: response.data.state,
        });
      }
    }
  };

  const validateRegistrationStatus = () => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    const fullPhoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let errorMessage = { ...EMPTY_ERROR_MESSAGES };
    if (!form.first_name.trim()) errorMessage.firstName = t("general.required");
    if (!form.last_name.trim()) errorMessage.lastName = t("general.required");
    if (!form.home_city.trim()) errorMessage.city = t("general.required");
    if (!form.home_address.trim()) errorMessage.address = t("general.required");
    if (!form.birthMonth.trim())
      errorMessage.birthMonth = t("general.required");
    if (!form.birthDay.trim()) errorMessage.birthDay = t("general.required");
    if (!form.birthYear.trim()) {
      errorMessage.birthYear = t("general.required");
    } else if (Number(form.birthYear) < 1900) {
      errorMessage.birthYear = t("form_fields.invalid_year");
    }
    if (
      form.birthYear.trim() &&
      form.birthMonth.trim() &&
      form.birthDay.trim()
    ) {
      const year = Number(form.birthYear);
      const month = Number(form.birthMonth) - 1;
      const day = Number(form.birthDay);
      const date = new Date(year, month, day);
      const isInvalidDate =
        date.getFullYear() !== year ||
        date.getMonth() !== month ||
        date.getDate() !== day;
      if (isInvalidDate)
        errorMessage.birthDay = t("form_fields.invalid_birth_date");
    }
    if (form.opt_in_sms && !form.phone.trim()) {
      errorMessage.phone = t("form_fields.required_phone");
    } else if (form.opt_in_sms && !fullPhoneRegex.test(form.phone.trim())) {
      errorMessage.phone = t("form_fields.invalid_phone");
    }
    if (!form.home_zip_code.trim()) {
      errorMessage.zip = t("general.required");
    } else if (!zipRegex.test(form.home_zip_code.trim())) {
      errorMessage.zip = t("form_fields.zip_code_error");
    }
    if (!form.email_address.trim()) {
      errorMessage.email = t("general.required");
    } else if (!emailRegex.test(form.email_address.trim())) {
      errorMessage.email = t("form_fields.email_error");
    }
    setErrMsg(errorMessage);
    return !Object.values(errorMessage).some(value => value.trim() !== "");
  };

  return (
    <ScrollView>
      <Header text={t("lookup_page.check_voter_registration_status")} />
      <View style={styles.box}>
        {/* Names */}
        <View style={styles.fieldset}>
          <InputField
            label={t("form_fields.first_name")}
            required
            value={form.first_name}
            errorMessage={errMsg.firstName}
            onChangeText={(text: string) => updateField("first_name", text)}
          />
          <InputField
            label={t("form_fields.last_name")}
            required
            value={form.last_name}
            errorMessage={errMsg.lastName}
            onChangeText={(text: string) => updateField("last_name", text)}
          />

          <View>
            <Text style={styles.inputLabel}>
              {t("form_fields.name_suffix")}{" "}
            </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                style={styles.picker}
                itemStyle={styles.pickerItem}
                selectedValue={form.suffix}
                onValueChange={itemValue => updateField("suffix", itemValue)}
              >
                <Picker.Item label="" value="" />
                <Picker.Item label="Jr." value="Jr." />
                <Picker.Item label="Sr." value="Sr." />
                <Picker.Item label="I" value="I" />
                <Picker.Item label="II" value="II" />
                <Picker.Item label="III" value="III" />
                <Picker.Item label="IV" value="IV" />
                <Picker.Item label="V" value="V" />
                <Picker.Item label="VI" value="VI" />
                <Picker.Item label="VII" value="VII" />
              </Picker>
            </View>
          </View>
        </View>

        <Text style={styles.label}>{t("form_fields.dob")}</Text>
        <DateRow value={form} updateField={updateField} />

        <View style={styles.fieldset}>
          <InputField
            label={t("form_fields.phone")}
            placeholder="###-###-####"
            value={form.phone}
            errorMessage={errMsg.phone}
            onChangeText={handlePhoneChange}
          />
          <InputField
            label={t("form_fields.address")}
            required
            value={form.home_address}
            errorMessage={errMsg.address}
            onChangeText={(text: string) => updateField("home_address", text)}
          />
          <InputField
            label={t("form_fields.city")}
            required
            value={form.home_city}
            errorMessage={errMsg.city}
            onChangeText={(text: string) => updateField("home_city", text)}
          />
          <InputField
            label={t("zip")}
            required
            value={form.home_zip_code}
            errorMessage={errMsg.zip}
            onChangeText={(text: string) => updateField("home_zip_code", text)}
          />

          <InputField
            label={t("email")}
            value={form.email_address}
            required
            errorMessage={errMsg.email}
            onChangeText={(text: string) => updateField("email_address", text)}
          />
        </View>

        {/* Checkboxes */}
        <Checkbox
          label={t("general.opt_ins.email_opt_in")}
          value={form.opt_in_email}
          onValueChange={(checked: boolean) =>
            updateField("emailConsent", checked)
          }
        />

        <Checkbox
          label={t("general.opt_ins.sms_opt_in")}
          value={form.opt_in_sms}
          onValueChange={(checked: boolean) =>
            updateField("opt_in_sms", checked)
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
          title={t("register_18_by_election_page.continute_button_text")}
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
      height: 48,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 6,
      justifyContent: "center",
      backgroundColor: theme.white,
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
      marginVertical: 16,
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
  });
