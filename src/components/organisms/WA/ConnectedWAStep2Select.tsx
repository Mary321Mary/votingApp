import React, { useContext } from "react";
import { useWindowDimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { FormProps } from "@/utils/types";
import { ThemeContext } from "@/styles/ThemeProvider";
import RenderHTML from "react-native-render-html";
import { Radio } from "@/components/atoms/Radio";
import { useNavigation } from "@react-navigation/native";

export const ConnectedWAStep2Select = ({
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
      form: value,
      pageFromLookup: "paper",
      workflowType: "nvra",
      showRedirectText: true,
    });
  };

  return (
    <>
      <RenderHTML
        contentWidth={width}
        source={{
          html: t("washington.wdl_number_none_notice", {
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

      <Radio
        label={t("washington.local_upload_option")}
        selected={value.upload === "signature"}
        onPress={() => {
          onChange({ ...value, upload: "signature" });
          onChangeError({
            ...errorMessages,
            upload: "",
          });
        }}
      />
      <Radio
        label={t("washington.other_device_option")}
        selected={value.upload === "device"}
        onPress={() => {
          onChange({ ...value, upload: "device" });
          onChangeError({
            ...errorMessages,
            upload: "",
          });
        }}
      />
      <Radio
        label={t("washington.paper_option")}
        selected={value.upload === "print"}
        onPress={() => {
          onChange({ ...value, upload: "print" });
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
