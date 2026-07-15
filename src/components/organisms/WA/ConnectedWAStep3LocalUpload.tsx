import React, { useContext } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useTranslation } from "react-i18next";
import { FormProps, RegisterFormState } from "@/utils/types";
import InputField from "@/components/atoms/InputField";
import { Checkbox } from "@/components/atoms/Checkbox";
import { ThemeContext } from "@/styles/ThemeProvider";
import { isRequired } from "@/utils/constants";
import SignatureUpload from "@/components/modules/SignatureUpload";
import RenderHTML from "react-native-render-html";
import { useNavigation } from "@react-navigation/native";

export const ConnectedWAStep3LocalUpload = ({
  value,
  state,
  formCongif,
  errorMessages,
  onChangeError,
  onChange,
  handleMainButton,
}: FormProps) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();

  const goToPaper = () => {
    navigation.navigate("Register", {
      status: { success: true },
      state,
      zip: value.home_zip_code,
      email: value.email_address,
      form: value,
      pageFromLookup: "paper",
      workflowType: "nvra",
      showRedirectText: true,
    });
  };

  const onlyDigits = (text: string) => text.replace(/\D/g, "");

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

  const handleSSNChange = (text: string) => {
    const digits = onlyDigits(text);
    const lastFour = digits.slice(-4);
    updateField("last_four_ss_number", lastFour);
  };

  return (
    <View>
      <Text style={styles.paragraph}>{t("washington.local_upload_help")}</Text>

      <Text style={styles.label}>
        {t("washington.upload_signature_image_help")}
      </Text>

      <SignatureUpload
        initialValue={value.signature_base64}
        error={
          errorMessages.signature_base64 && (
            <RenderHTML
              contentWidth={width}
              source={{
                html: t(errorMessages.signature_base64, {
                  rtv_paper_form_url: "paper-link",
                }),
              }}
              tagsStyles={{
                body: {
                  fontSize: 14,
                  lineHeight: 18,
                  marginBottom: 20,
                  color: "red",
                },
                a: {
                  color: theme.link,
                  textDecorationLine: "underline",
                },
              }}
              renderersProps={{
                a: { onPress: goToPaper },
              }}
            />
          )
        }
        selectButtonTextKey="washington.upload_signature_image_button"
        onChange={({ base64 }) => {
          updateField("signature_base64", base64);
        }}
      />

      <InputField
        showEye
        label={t("washington.ssn4_required")}
        value={value.last_four_ss_number}
        disabled={value.has_no_ssn === true}
        maxLength={4}
        secureTextEntry
        onChangeText={handleSSNChange}
        errorMessage={
          errorMessages.last_four_ss_number
            ? t(errorMessages.last_four_ss_number)
            : ""
        }
      />

      <Checkbox
        value={value.has_no_ssn === true}
        label={t("washington.ssn4_none")}
        required={isRequired(formCongif, "has_no_ssn")}
        onValueChange={(checked: boolean) => {
          if (checked) {
            onChange({
              ...value,
              has_no_ssn: checked,
              last_four_ss_number: "",
            });
          } else {
            onChange({ ...value, has_no_ssn: checked });
          }
        }}
      />

      {handleMainButton}
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    paragraph: {
      fontSize: 14,
      lineHeight: 22,
      marginBottom: 10,
    },
    label: {
      fontSize: 14,
      fontWeight: "700",
      textTransform: "uppercase",
      marginBottom: 8,
    },
  });
