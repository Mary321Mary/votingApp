import React, { ReactNode, useState } from "react";
import { View, Text, StyleSheet, Button, Linking } from "react-native";
import { useTranslation } from "react-i18next";
import { RegisterFormState, StateData } from "../../utils/types";
import { Checkbox } from "../atoms/Checkbox";

interface AcceptNoticeProps {
  state: StateData;
  value: RegisterFormState;
  onChange: React.Dispatch<React.SetStateAction<RegisterFormState>>;
  handleMainButton?: ReactNode;
}

function AcceptNotice({
  state,
  value,
  onChange,
  handleMainButton,
}: AcceptNoticeProps) {
  const [accept, setAccept] = useState<boolean>(false);
  const { t } = useTranslation();

  const handleToggle = () => {
    const newValue = !accept;
    setAccept(newValue);
    // onChange(prev => ({ ...prev, accepted_notices: newValue }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t("california.eligible_complete_ca")}</Text>

      <View style={styles.noticeBox}>
        <Text style={styles.noticeText}>
          {t("california.compliance_notices_text")}
        </Text>
      </View>

      <Checkbox
        label={t("california.compliance_notices_checkbox")}
        value={accept}
        onValueChange={handleToggle}
      />

      <Button
        title={t("california.finish_ca_button_text")}
        onPress={() =>
          Linking.openURL(state.online_registration_system_url || "")
        }
      />
      {handleMainButton}
      {/* <TouchableOpacity
        style={styles.checkboxWrapper}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, accept && styles.checkboxChecked]}>
          {accept && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.label}>
          {t("california.compliance_notices_checkbox")}
        </Text>
      </TouchableOpacity> */}
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
    padding: 10,
    borderRadius: 4,
    height: 150,
    backgroundColor: "#f8f9fa",
  },
  noticeText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#495057",
  },
});

export default AcceptNotice;
