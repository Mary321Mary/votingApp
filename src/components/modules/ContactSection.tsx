import React, { useContext } from "react";
import { Linking, useWindowDimensions } from "react-native";
import { useTranslation } from "react-i18next";

import { FormProps, RegisterFormState } from "@/utils/types";
import { ThemeContext } from "@/styles/ThemeProvider";
import { Checkbox } from "../atoms/Checkbox";
import { isRequired, isVisible } from "@/utils/constants";
import { useUIConfig } from "@/contexts/UIConfigContext";
import QuestionsSection from "../atoms/QuestionsSection";
import RenderHTML from "react-native-render-html";

interface ContactSectionProps extends FormProps {
  showQuestions?: boolean;
}

export const ContactSection = ({
  value,
  formCongif,
  errorMessages,
  showQuestions = false,
  onChange,
  onChangeError,
}: ContactSectionProps) => {
  const theme = useContext(ThemeContext);
  const { t } = useTranslation();
  const { config } = useUIConfig();
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
      {showQuestions && (
        <QuestionsSection
          value={value}
          errorMessages={errorMessages}
          onChange={onChange}
          onChangeError={onChangeError}
        />
      )}

      {isVisible(formCongif, "opt_in_sms") && (
        <Checkbox
          label={t("general.opt_ins.sms_opt_in")}
          value={value.opt_in_sms}
          required={isRequired(formCongif, "opt_in_sms")}
          errorText={t(errorMessages.opt_in_sms)}
          onValueChange={(checked: boolean) =>
            updateField("opt_in_sms", checked)
          }
        />
      )}
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
            color: theme.gray,
            lineHeight: 18,
            marginVertical: 5,
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
      {isVisible(formCongif, "opt_in_email") && (
        <Checkbox
          label={t("general.opt_ins.email_opt_in")}
          value={value.opt_in_email}
          required={isRequired(formCongif, "opt_in_email")}
          errorText={t(errorMessages.opt_in_email)}
          onValueChange={(checked: boolean) =>
            updateField("opt_in_email", checked)
          }
        />
      )}
      {isVisible(formCongif, "volunteer") && (
        <Checkbox
          label={t("general.opt_ins.volunteer")}
          value={value.volunteer}
          required={isRequired(formCongif, "volunteer")}
          errorText={t(errorMessages.volunteer)}
          onValueChange={(checked: boolean) =>
            updateField("volunteer", checked)
          }
        />
      )}
    </>
  );
};
