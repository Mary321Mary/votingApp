import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";
import { ThemeContext } from "@/styles/ThemeProvider";
import { StateData } from "@/utils/types";

export default function ConnectedOVRStep2Screen({ state }: { state: StateData; }) {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

  const [eyeColor, setEyeColor] = useState("");
  const [birthMM, setBirthMM] = useState("");
  const [birthDD, setBirthDD] = useState("");
  const [birthYYYY, setBirthYYYY] = useState("");

  return (
    <>
      {/* PERSONAL INFO */}
      <View style={styles.fieldset}>
        <Text style={styles.legend}>Personal Information</Text>

        <Text style={styles.text}>
          The personal information you use to register to vote must match the
          personal information on your {state.name} driver’s license or state
          ID.
        </Text>

        <Text style={styles.text}>
          If you do not have a {state.name} driver's license or state ID, click
          here to create a paper registration form to download, print, sign, and
          mail.
        </Text>
      </View>

      {/* NAME */}
      <View style={styles.fieldset}>
        <Text style={styles.legend}>Name</Text>

        <View style={styles.inputBlock}>
          <Text style={styles.label}>
            Full Name (as printed on your {state.name} driver's license or state
            ID)
            <Text style={styles.required}> *</Text>
          </Text>
          <TextInput style={styles.input} />
        </View>

        <View style={styles.inputBlock}>
          <Text style={styles.label}>
            {state.name} Driver's License or state ID number (no dashes or spaces)
            <Text style={styles.required}> *</Text>
          </Text>
          <TextInput style={styles.input} />
        </View>

        {/* BIRTHDATE */}
        <View style={styles.inputBlock}>
          <Text style={styles.label}>
            {t("Birthdate")}
            <Text style={styles.required}> *</Text>
          </Text>

          <View style={styles.dateRow}>
            <TextInput
              style={styles.dateInput}
              placeholder="MM"
              keyboardType="number-pad"
              maxLength={2}
              value={birthMM}
              onChangeText={setBirthMM}
            />
            <TextInput
              style={styles.dateInput}
              placeholder="DD"
              keyboardType="number-pad"
              maxLength={2}
              value={birthDD}
              onChangeText={setBirthDD}
            />
            <TextInput
              style={styles.dateInput}
              placeholder="YYYY"
              keyboardType="number-pad"
              maxLength={4}
              value={birthYYYY}
              onChangeText={setBirthYYYY}
            />
          </View>
        </View>

        {/* EYE COLOR */}
        <View style={styles.inputBlock}>
          <Text style={styles.label}>
            Eye color (as printed on your license or state ID)
            <Text style={styles.required}> *</Text>
          </Text>

          <View style={styles.pickerWrapper}>
            <Picker selectedValue={eyeColor} onValueChange={setEyeColor}>
              <Picker.Item label="" value="" />
              <Picker.Item label="No Eye Color" value="UNK" />
              <Picker.Item label="Black" value="BLK" />
              <Picker.Item label="Blue" value="BLU" />
              <Picker.Item label="Brown" value="BRO" />
              <Picker.Item label="Green" value="GRN" />
              <Picker.Item label="Gray" value="GRY" />
              <Picker.Item label="Hazel" value="HIZ" />
              <Picker.Item label="Maroon" value="MAR" />
              <Picker.Item label="Pink" value="PNK" />
            </Picker>
          </View>
        </View>

        {/* SSN */}
        <View style={styles.inputBlock}>
          <Text style={styles.label}>
            Social Security Number (Last 4 digits)
            <Text style={styles.required}> *</Text>
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>
      </View>
    </>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      padding: 16,
    },
    fieldset: {
      marginBottom: 24,
    },
    legend: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 16,
      fontWeight: "semibold",
      marginBottom: 8,
    },
    text: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      marginBottom: 8,
      color: theme.textPrimary,
    },
    inputBlock: {
      marginBottom: 16,
    },
    label: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      marginBottom: 6,
    },
    required: {
      color: theme.secondary,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 6,
      padding: 10,
      fontSize: 14,
    },
    dateRow: {
      flexDirection: "row",
      gap: 8,
    },
    dateInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 6,
      padding: 10,
      textAlign: "center",
    },
    pickerWrapper: {
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 6,
      overflow: "hidden",
    },
  });

