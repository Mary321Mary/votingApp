import React, { useContext } from "react";
import { useWindowDimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { FormProps } from "@/utils/types";
import { ThemeContext } from "@/styles/ThemeProvider";
import RenderHTML from "react-native-render-html";
import { Radio } from "@/components/atoms/Radio";
import { useNavigation } from "@react-navigation/native";

export const ConnectedPAStep3Select = ({
  state,
  value,
  errorMessages,
  onChange,
  onChangeError,
  handleMainButton,
}: FormProps) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();

  const goToPaper = () => {
    navigation.navigate("Register", {
      status: { success: true },
      state,
      zip: value.home_zip_code,
      email: value.email_address,
      form: {
        ...value,
        home_address: value.home_address + " " + value.address_line_2,
        unit: value.home_unit_type + " " + value.home_unit,
      },
      pageFromLookup: "paper",
      workflowType: "nvra",
      showRedirectText: true,
    });
  };

  return (
    <>
      {/* Notice */}
      <RenderHTML
        contentWidth={width}
        source={{
          html: t("pennsylvania.penn_dot_number_none_notice", {
            rtv_paper_form_url: "paper-link",
          }),
        }}
        tagsStyles={{
          body: {
            fontSize: 14,
            lineHeight: 18,
            marginBottom: 20,
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

      {/* Radio Buttons */}
      <Radio
        label={t("pennsylvania.upload_signature_local")}
        selected={value.upload === "signature"}
        onPress={() => {
          onChange({
            ...value,
            upload: "signature",
          });
          onChangeError({
            ...errorMessages,
            upload: "",
          });
        }}
      />
      <Radio
        label={t("pennsylvania.upload_signature_other_device")}
        selected={value.upload === "device"}
        onPress={() => {
          onChange({
            ...value,
            upload: "device",
          });
          onChangeError({
            ...errorMessages,
            upload: "",
          });
        }}
      />
      <Radio
        label={t("pennsylvania.print_mail")}
        selected={value.upload === "print"}
        onPress={() => {
          onChange({
            ...value,
            upload: "print",
          });
          onChangeError({
            ...errorMessages,
            upload: "",
          });
        }}
      />
      {errorMessages.upload && (
        <RenderHTML
          contentWidth={width}
          source={{
            html: t(errorMessages.upload, {
              rtv_paper_form_url: "paper-link",
            }),
          }}
          tagsStyles={{
            body: {
              fontSize: 14,
              lineHeight: 18,
              marginBottom: 20,
              color: theme.secondary,
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
      )}
      {handleMainButton}
    </>
  );
};
