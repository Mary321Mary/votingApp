import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  useWindowDimensions,
} from "react-native";
import { Trans, useTranslation } from "react-i18next";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import InputField from "@/components/atoms/InputField";
import { RootStackParamList } from "@/components/organisms/Navigation";
import { submitEmailZip } from "@/utils/api";
import Header from "@/layout/Header";
import Config from "react-native-config";
import { useUIConfig } from "@/contexts/UIConfigContext";
import { ThemeContext } from "@/styles/ThemeProvider";
import i18n from "i18n";
import RenderHTML from "react-native-render-html";

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const { config } = useUIConfig();
  const policyUrl = config?.urls?.privacy || "";
  const { width } = useWindowDimensions();

  const [email, setEmail] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    zip?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Validation logic
  const validate = () => {
    const newErrors: { email?: string; zip?: string; common?: string } = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t("form_fields.email_error");
    }
    if (!zipCode) {
      newErrors.zip = "Zip is required";
    } else if (zipCode.length !== 5) {
      newErrors.zip = t("form_fields.zip_code_error");
    } else if (!/^\d{5}$/.test(zipCode)) {
      newErrors.zip = t("form_fields.zip_code_error");
    }
    return newErrors;
  };

  // Handle input changes and clear errors
  const handleEmailChange = (text: string) => {
    setEmail(text);
    setErrors(prev => ({ ...prev, email: undefined }));
  };

  const handleZipCode = (text: string) => {
    setZipCode(text);
    setErrors(prev => ({ ...prev, zip: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      try {
        const response = await submitEmailZip({
          email,
          zip: zipCode,
          locale: i18n.language,
          partner_id: "1",
        });
        if (Object.keys(response.data.user).length === 0) {
          navigation.navigate("Register", {
            ...response.data,
            zip: zipCode,
            email,
          });
        } else {
          navigation.navigate("ZipError", {
            header: "Welcome back",
            text:
              "Welcome back " +
              response.data.user.first_name +
              " " +
              response.data.user.last_name +
              ". Your best next step are ...",
            showImage: true,
          });
        }
      } catch (error: any) {
        console.error("Register failed:", error);

        const newErrors: { email?: string; zip?: string; general?: string } =
          {};
        if (
          error?.response?.status === 422 &&
          Array.isArray(error?.response?.data?.status?.errors)
        ) {
          error.response.data.status.errors.forEach((msg: string) => {
            const lowerMsg = msg.toLowerCase();
            if (lowerMsg.includes("email")) {
              newErrors.email = t("form_fields.email_error");
            } else if (lowerMsg.includes("zip")) {
              newErrors.zip = t("form_fields.zip_code_error");
            } else
              newErrors.general = newErrors.general
                ? `${newErrors.general}\n${msg}`
                : msg;
          });
        } else newErrors.general = "An error occurred. Please try again later.";
        setErrors(newErrors);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Header text={t("ovr_landing_page.register_vote")} />
      <View style={styles.card}>
        <Text style={styles.instructionText}>
          {t("ovr_landing_page.register_text")}
        </Text>
        {t("ovr_landing_page.register_text2") && (
          <Text style={[styles.instructionText, styles.mbLarge]}>
            {t("ovr_landing_page.register_text2")}
          </Text>
        )}
        {errors.general && (
          <Text style={styles.errorText}>{errors.general}</Text>
        )}
        <InputField
          value={email}
          label={t("form_fields.email")}
          placeholder="you@example.com"
          required
          disabled={isLoading}
          errorMessage={errors.email}
          helpText={t("ovr_landing_page.email_help")}
          onChangeText={handleEmailChange}
        />
        <View style={styles.zipCodeRow}>
          <View style={{ flex: 1 }}>
            <InputField
              value={zipCode}
              label={t("form_fields.zip")}
              placeholder="12345"
              required
              numeric
              disabled={isLoading}
              errorMessage={errors.zip}
              helpText={t("ovr_landing_page.zip_help")}
              onChangeText={handleZipCode}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {t("ovr_landing_page.next_button")}
            </Text>
          </TouchableOpacity>
        </View>

        <RenderHTML
          contentWidth={width}
          source={{
            html: t("general.opt_ins.continue_privacy_ack", {
              rtv_privacy_url: policyUrl,
            }),
          }}
          tagsStyles={{
            body: {
              fontSize: 12,
              marginBottom: 10,
              color: theme.textPrimary,
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
        <RenderHTML
          contentWidth={width}
          source={{
            html: t("ovr_landing_page.already_registered"),
          }}
          tagsStyles={{
            body: {
              fontSize: 12,
              color: theme.textPrimary,
            },
            strong: {
              fontWeight: "bold",
            },
          }}
        />
        <Text
          style={styles.linkText}
          onPress={() => {
            navigation.navigate("CheckVoterStatus", {
              zip: zipCode,
              email,
              form: {
                partner_id: 1,
                lang: i18n.language,

                name_title: "",
                first_name: "",
                middle_name: "",
                last_name: "",
                suffix: "",
                change_of_name: false,
                prev_name_title: "",
                prev_first_name: "",
                prev_middle_name: "",
                prev_last_name: "",
                prev_name_suffix: "",
                us_citizen: false,
                will_be_18_by_election: false,
                email_address: email,

                home_address: "",
                address_line_2: "",
                unit_type: "",
                unit: "",
                home_city: "",
                state: "",
                home_zip_code: zipCode,
                mailing_address: "",
                mailing_unit: "",
                mailing_city: "",
                mailing_state: "",
                mailing_zip_code: "",

                change_of_address: false,
                prev_address: "",
                prev_unit: "",
                prev_city: "",
                prev_state: "",
                prev_zip_code: "",

                race: "",
                party: "",
                home_county: "",
                signature_base64: "",

                birthMonth: "",
                birthDay: "",
                birthYear: "",
                date_of_birth: "",
                pa_preregistration_age_window: false,
                phone: "",

                issueMonth: "",
                issueDay: "",
                issueYear: "",

                opt_in_sms: false,
                opt_in_email: true,
                volunteer: false,
                mailForm: false,
                survey_question_1: "",
                survey_answer_1: "",
                survey_question_2: "",
                survey_answer_2: "",

                residency_duration_ack: false,
                cancel_previous_registration_ack: false,
                use_stored_signature_ack: false,
                updated_dln_recently: null,
                request_duplicate_dln_today: null,
                age_eligibility: false,

                full_name: "",
                state_id_number: "",
                eye_color: "",
                last_four_ss_number: "",
                has_no_state_license: null,
                has_no_ssn: null,
                someone_helped: false,
                helper_electronic_signature_acknowledged: false,

                street_name: "",
                street_number: "",
                street_type: "",
                street_direction: "",

                has_mailing_address: false,
                mailing_postal_code: "",
                mailingAddressType: "STANDARD",
                mailing_po_box_number: "",
                mailing_box_group_type: "",
                mailing_box_group_number: "",
                mailing_box_number: "",
                mailing_apo: "",
                mailing_ap: "",
                mailing_address_line1: "",
                mailing_address_line2: "",
                mailing_address_line3: "",
                mailing_country: "",
              },
            });
          }}
        >
          <Trans i18nKey="ovr_landing_page.confirm_link_text" />
        </Text>
        <RenderHTML
          contentWidth={width}
          source={{
            html: t("ovr_landing_page.living_abroad"),
          }}
          tagsStyles={{
            body: {
              fontSize: 12,
              color: theme.textPrimary,
              fontFamily: "Inter-VariableFont_opsz_wght",
            },
            strong: {
              fontWeight: "bold",
            },
          }}
        />
        <Text
          style={styles.linkText}
          onPress={() => Linking.openURL(Config.REACT_APP_OVERSEAS || "*")}
        >
          <Trans i18nKey="ovr_landing_page.overseas_vote_link_text" />
        </Text>
        <RenderHTML
          contentWidth={width}
          source={{
            html: t("ovr_landing_page.note_state_ovr"),
          }}
          tagsStyles={{
            body: {
              fontSize: 12,
              color: theme.textPrimary,
              fontFamily: "Inter-VariableFont_opsz_wght",
            },
            strong: {
              fontWeight: "bold",
            },
          }}
        />
        <Text
          style={styles.linkText}
          onPress={() => {
            Linking.openURL(Config.REACT_APP_LEARN_MORE || "*");
          }}
        >
          <Trans i18nKey="ovr_landing_page.note_state_ovr_link_text" />
        </Text>
      </View>
    </>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    // --- CARD STYLES ---
    card: {
      // width: width > 600 ? 500 : "90%",
      width: "100%",
      padding: 15,
    },
    instructionText: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 16,
      // textAlign: "center",
      marginBottom: 10,
      color: theme.textPrimary,
    },
    mbLarge: {
      marginBottom: 30,
    },
    // --- ROW STYLES ---
    zipCodeRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      marginBottom: 10,
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderRadius: 5,
      marginLeft: 10,
      height: 45,
      justifyContent: "center",
    },
    buttonText: {
      color: theme.white,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 16,
      fontWeight: "semibold",
    },
    // --- REGISTERED SECTION STYLES ---
    linkText: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      color: theme.link,
      textDecorationLine: "underline",
      fontWeight: "medium",
      marginBottom: 10,
    },
    errorText: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      color: theme.secondary,
      textAlign: "center",
      marginBottom: 15,
    },
  });

export default HomeScreen;
