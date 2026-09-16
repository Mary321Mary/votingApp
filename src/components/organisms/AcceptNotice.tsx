import React, { ReactNode, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useTranslation } from "react-i18next";
import RenderHTML from "react-native-render-html";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import {
  RegisterFormState,
  StateData,
  SubmitVoterCAResponse,
} from "@/utils/types";
import { Checkbox } from "../atoms/Checkbox";
import { reportEvent, submitCACovr } from "@/utils/api";
import { RootStackParamList } from "./Navigation";
import { REPORT_EVENT_STEPS } from "@/utils/report/eventReporting";
import { CustomButton } from "../atoms/CustomButton";

interface AcceptNoticeProps {
  state: StateData;
  value: RegisterFormState;
  onChange: React.Dispatch<React.SetStateAction<RegisterFormState>>;
  handleMainButton?: ReactNode;
}

type RegisterScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

function AcceptNotice({ state, value, handleMainButton }: AcceptNoticeProps) {
  const { t } = useTranslation();
  const navigation = useNavigation<RegisterScreenNavigation>();
  const { width } = useWindowDimensions();

  const [accept, setAccept] = useState<boolean>(false);
  const [showErrorAccept, setShowErrorAccept] = useState<boolean>(false);
  const [config, setConfig] = useState<SubmitVoterCAResponse>();

  useEffect(() => {
    const fetchCA = async () => {
      const registration_uid =
        (await AsyncStorage.getItem(`registration_uid`)) || "";
      const response = await submitCACovr({
        ...value,
        registration_uid,
        locale: value.lang,
        email: value.email_address,
      });
      if (response.data.covr_success) {
        setConfig(response.data);
        setAccept(response.data.disclosures_prechecked);
      } else {
        navigation.navigate("FailCA", {
          state,
          form: value,
          zip: value.home_zip_code,
          email: value.email_address,
        });
      }
    };

    fetchCA();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t("california.eligible_complete_ca")}</Text>
      <ScrollView style={styles.noticeBox} nestedScrollEnabled={true}>
        {config?.disclosures?.map((htmlContent, index) => (
          <Text>
            <RenderHTML
              key={index}
              contentWidth={width}
              source={{ html: htmlContent }}
              tagsStyles={{
                p: { marginBottom: 8, color: "#333" },
                strong: { fontWeight: "bold" },
              }}
            />
          </Text>
        ))}
      </ScrollView>

      <Checkbox
        name="compliance_notices_checkbox"
        label={t("california.compliance_notices_checkbox")}
        value={accept}
        errorText={
          showErrorAccept && t("california.compliance_notices_checkbox_error")
        }
        onValueChange={checked => {
          setAccept(checked);
          if (checked) setShowErrorAccept(false);
        }}
      />

      <CustomButton
        title={t("california.finish_ca_button_text")}
        onPress={async () => {
          if (accept) {
            if (config?.redirect_url)
              Linking.openURL(config?.redirect_url || "");

            const registration_uid =
              (await AsyncStorage.getItem(`registration_uid`)) || "";
            await reportEvent({
              registration_uid,
              partner_id: value.partner_id.toString() || "1",
              step: REPORT_EVENT_STEPS.STEP_5,
              event_name: "finish with CA selected",
            });

            navigation.navigate("FinishWithState", { state, form: value });
          } else {
            setShowErrorAccept(true);
          }
        }}
      />
      {handleMainButton}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  noticeBox: {
    borderWidth: 1,
    borderColor: "#dee2e6",
    paddingHorizontal: 10,
    borderRadius: 4,
    height: 200,
    backgroundColor: "#f8f9fa",
    marginBottom: 10,
  },
  noticeText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#495057",
  },
});

export default AcceptNotice;
