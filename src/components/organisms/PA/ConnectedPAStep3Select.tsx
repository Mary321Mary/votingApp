import React, { useContext } from "react";
import { useWindowDimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { FormProps } from "@/utils/types";
import { ThemeContext } from "@/styles/ThemeProvider";
import RenderHTML from "react-native-render-html";
import { Radio } from "@/components/atoms/Radio";
import { useNavigation } from "@react-navigation/native";

interface FormPropsConnectedPAStep3Select extends FormProps {
  upload: string;
  setUpload: (newValue: string) => void;
}

export const ConnectedPAStep3Select = ({
  state,
  value,
  upload,
  setUpload,
  handleMainButton,
}: FormPropsConnectedPAStep3Select) => {
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
        selected={upload === "signature"}
        onPress={() => setUpload("signature")}
      />
      <Radio
        label={t("pennsylvania.upload_signature_other_device")}
        selected={upload === "device"}
        onPress={() => setUpload("device")}
      />
      <Radio
        label={t("pennsylvania.print_mail")}
        selected={upload === "print"}
        onPress={() => setUpload("print")}
      />
      {handleMainButton}
    </>
  );
};
