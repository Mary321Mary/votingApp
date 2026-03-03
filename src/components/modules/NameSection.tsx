import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";
import { ThemeContext } from "@/styles/ThemeProvider";
import InputField from "../atoms/InputField";
import HelpTooltip from "../atoms/HelpTooltip";
import { FormProps, RegisterFormState } from "@/utils/types";
import { Checkbox } from "../atoms/Checkbox";
import { isRequired, isVisible } from "@/utils/constants";

interface NameSectionProps extends FormProps {
  showAgeEligibility?: boolean;
}

export const NameSection = ({
  value,
  formCongif,
  errorMessages,
  showChangeName,
  showIsAdultBlock,
  onChange,
  onChangeError,
  handleCheckbox,
  showAgeEligibility = false,
}: NameSectionProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

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
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {t("register_page.section_name")}
        <HelpTooltip text={t("register_page.name_help")} />
      </Text>

      <View style={styles.row}>
        {isVisible(formCongif, "name_title") && (
          <View>
            <Text style={styles.inputLabel}>
              {t("register_page.title")}
              {isRequired(formCongif, "name_title") && (
                <Text style={styles.required}> *</Text>
              )}
            </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                style={styles.picker}
                itemStyle={styles.pickerItem}
                selectedValue={value.title}
                onValueChange={itemValue => updateField("title", itemValue)}
              >
                <Picker.Item label="" value="" />
                <Picker.Item label="Mr." value="Mr." />
                <Picker.Item label="Mrs." value="Mrs." />
                <Picker.Item label="Miss" value="Miss" />
                <Picker.Item label="Ms." value="Ms." />
              </Picker>
            </View>
            {errorMessages.title && (
              <Text style={styles.required}>{errorMessages.title}</Text>
            )}
          </View>
        )}

        {isVisible(formCongif, "first_name") && (
          <InputField
            label={t("register_page.first_name")}
            required={isRequired(formCongif, "first_name")}
            value={value.firstName}
            errorMessage={errorMessages.firstName}
            onChangeText={(text: string) => updateField("firstName", text)}
          />
        )}
        {(!showIsAdultBlock || !value.hasStateId) &&
          isVisible(formCongif, "middle_name") && (
            <InputField
              label={t("register_page.middle_name")}
              value={value.middleName}
              required={isRequired(formCongif, "middle_name")}
              errorMessage={errorMessages.middleName}
              onChangeText={(text: string) => updateField("middleName", text)}
            />
          )}
        {isVisible(formCongif, "last_name") && (
          <InputField
            label={t("register_page.last_name")}
            value={value.lastName}
            errorMessage={errorMessages.lastName}
            required={isRequired(formCongif, "last_name")}
            onChangeText={(text: string) => updateField("lastName", text)}
          />
        )}

        {isVisible(formCongif, "name_suffix") && (
          <View>
            <Text style={styles.inputLabel}>
              {t("register_page.suffix")}
              {isRequired(formCongif, "name_suffix") && (
                <Text style={styles.required}> *</Text>
              )}
            </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                style={styles.picker}
                itemStyle={styles.pickerItem}
                selectedValue={value.suffix}
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
            {errorMessages.suffix && (
              <Text style={styles.required}>{errorMessages.suffix}</Text>
            )}
          </View>
        )}
      </View>

      {(!showIsAdultBlock || !value.hasStateId) &&
        isVisible(formCongif, "change_of_name") && (
          <Checkbox
            value={showChangeName}
            required={isRequired(formCongif, "change_of_name")}
            label={t("register_page.changed_name")}
            helpText={t("register_page.changed_name_help")}
            onValueChange={(checked: boolean) => {
              if (handleCheckbox) handleCheckbox(checked, "showChangeName");
              if (!checked) {
                updateField("changedTitle", "");
                updateField("changedFirstName", "");
                updateField("changedMiddleName", "");
                updateField("changedLastName", "");
                updateField("changedSuffix", "");
              }
            }}
          />
        )}

      {(!showIsAdultBlock || !value.hasStateId) && showChangeName && (
        <>
          <Text>{t("register_page.previous_name")}</Text>
          <View style={styles.row}>
            {isVisible(formCongif, "prev_name_title") && (
              <View>
                <Text style={styles.inputLabel}>
                  {t("register_page.title")}
                  {isRequired(formCongif, "prev_name_title") && (
                    <Text style={styles.required}> *</Text>
                  )}
                </Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                    selectedValue={value.changedTitle}
                    onValueChange={itemValue =>
                      updateField("changedTitle", itemValue)
                    }
                  >
                    <Picker.Item label="" value="" />
                    <Picker.Item label="Mr." value="Mr." />
                    <Picker.Item label="Mrs." value="Mrs." />
                    <Picker.Item label="Miss" value="Miss" />
                    <Picker.Item label="Ms." value="Ms." />
                  </Picker>
                </View>
                {errorMessages.changedTitle && (
                  <Text style={styles.required}>
                    {errorMessages.changedTitle}
                  </Text>
                )}
              </View>
            )}
            {isVisible(formCongif, "prev_first_name") && (
              <InputField
                label={t("register_page.first_name")}
                value={value.changedFirstName}
                required={isRequired(formCongif, "prev_first_name")}
                errorMessage={errorMessages.changedFirstName}
                onChangeText={(text: string) =>
                  updateField("changedFirstName", text)
                }
              />
            )}
            {isVisible(formCongif, "prev_middle_name") && (
              <InputField
                label={t("register_page.middle_name")}
                value={value.changedMiddleName}
                required={isRequired(formCongif, "prev_middle_name")}
                errorMessage={errorMessages.changedMiddleName}
                onChangeText={(text: string) =>
                  updateField("changedMiddleName", text)
                }
              />
            )}
            {isVisible(formCongif, "prev_last_name") && (
              <InputField
                label={t("register_page.last_name")}
                required={isRequired(formCongif, "prev_last_name")}
                errorMessage={errorMessages.changedLastName}
                value={value.changedLastName}
                onChangeText={(text: string) =>
                  updateField("changedLastName", text)
                }
              />
            )}
            {isVisible(formCongif, "prev_name_suffix") && (
              <View>
                <Text style={styles.inputLabel}>
                  {t("register_page.suffix")}
                  {isRequired(formCongif, "prev_name_suffix") && (
                    <Text style={styles.required}> *</Text>
                  )}
                </Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                    selectedValue={value.changedSuffix}
                    onValueChange={itemValue =>
                      updateField("changedSuffix", itemValue)
                    }
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
                {errorMessages.changedSuffix && (
                  <Text style={styles.required}>
                    {errorMessages.changedSuffix}
                  </Text>
                )}
              </View>
            )}
          </View>
        </>
      )}
      {isVisible(formCongif, "us_citizen") && (
        <Checkbox
          label={t("register_page.eligibility.citizen")}
          value={value.isCitizen}
          required={isRequired(formCongif, "us_citizen")}
          errorText={errorMessages.isCitizen}
          onValueChange={() => updateField("isCitizen", !value.isCitizen)}
        />
      )}
      {showAgeEligibility && (
        <Checkbox
          label={t("register_page.age_eligibility")}
          required
          value={showIsAdultBlock}
          onValueChange={checked => {
            if (handleCheckbox) handleCheckbox(checked, "showIsAdultBlock");
            if (checked && value.hasStateId) {
              if (handleCheckbox) handleCheckbox(false, "showChangeName");
              updateField("changedTitle", "");
              updateField("changedFirstName", "");
              updateField("changedMiddleName", "");
              updateField("changedLastName", "");
              updateField("changedSuffix", "");
              if (handleCheckbox)
                handleCheckbox(false, "showDifferentMailAddress");
              updateField("differentAddress", "");
              updateField("differentUnit", "");
              updateField("differentCity", "");
              updateField("differentState", "");
              updateField("differentZip", "");
              if (handleCheckbox) handleCheckbox(false, "showChangedAddress");
              updateField("changedAddress", "");
              updateField("changedUnit", "");
              updateField("changedCity", "");
              updateField("changedState", "");
              updateField("changedZip", "");
            }
          }}
        />
      )}
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    section: {
      marginBottom: 10,
      paddingHorizontal: 5,
    },
    sectionTitle: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 18,
      fontWeight: "semibold",
    },
    inputLabel: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      color: theme.textPrimary,
    },
    required: {
      color: theme.secondary,
    },
    row: {
      flexWrap: "wrap",
      gap: 8,
      width: "100%",
      marginBottom: 16,
      alignItems: "flex-end",
    },
    pickerWrapper: {
      flexBasis: "18%",
      minWidth: "100%",
      height: 48,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 8,
      justifyContent: "center",
      backgroundColor: theme.white,
    },
    picker: {
      width: "100%",
    },
    pickerItem: {
      fontSize: 14,
    },
  });
