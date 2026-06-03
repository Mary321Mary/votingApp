import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";
import { ThemeContext } from "@/styles/ThemeProvider";
import InputField from "../atoms/InputField";
import { FormProps, RegisterFormState } from "@/utils/types";
import { Checkbox } from "../atoms/Checkbox";
import { isRequired, isVisible } from "@/utils/constants";

interface NameSectionProps extends FormProps {
  showChangeName?: boolean;
  showAgeEligibility?: boolean;
  showWillBe18ByElection?: boolean;
}

export const NameSection = ({
  value,
  formCongif,
  errorMessages,
  onChange,
  onChangeError,
  showChangeName = false,
  showAgeEligibility = false,
  showWillBe18ByElection = false,
}: NameSectionProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation();

  const TITLES = [
    { name: "", value: "" },
    { name: t("general.titles.mr"), value: "Mr." },
    { name: t("general.titles.mrs"), value: "Mrs." },
    { name: t("general.titles.miss"), value: "Miss" },
    { name: t("general.titles.ms"), value: "Ms." },
  ];
  const SUFFIX = [
    { name: t("general.none"), value: "" },
    { name: "Jr.", value: "Jr." },
    { name: "Sr.", value: "Sr." },
    { name: "I", value: "I" },
    { name: "II", value: "II" },
    { name: "III", value: "III" },
    { name: "IV", value: "IV" },
    { name: "V", value: "V" },
    { name: "VI", value: "VI" },
    { name: "VII", value: "VII" },
  ];

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
      <View style={styles.row}>
        {/* {isVisible(formCongif, "name_title") && ( */}
        <View>
          <Text style={styles.inputLabel}>
            {t("form_fields.name_title")}
            {isRequired(formCongif, "name_title") && (
              <Text style={styles.required}> *</Text>
            )}
          </Text>
          <View style={styles.pickerWrapper}>
            <Picker
              style={styles.picker}
              itemStyle={styles.pickerItem}
              selectedValue={value.name_title}
              onValueChange={itemValue => updateField("name_title", itemValue)}
            >
              {TITLES.map(title => (
                <Picker.Item
                  key={title.value}
                  label={title.name}
                  value={title.value}
                />
              ))}
            </Picker>
          </View>
          {errorMessages.name_title && (
            <Text style={styles.required}>{t(errorMessages.name_title)}</Text>
          )}
        </View>
        {/* )} */}

        {/* {isVisible(formCongif, "first_name") && ( */}
        <InputField
          label={t("form_fields.first_name")}
          required={isRequired(formCongif, "first_name")}
          value={value.first_name}
          errorMessage={t(errorMessages.first_name)}
          helpText={t("form_fields.name_help")}
          onChangeText={(text: string) => updateField("first_name", text)}
        />
        {/* )} */}
        {(!value.age_eligibility || !value.has_no_state_license) && (
          // isVisible(formCongif, "middle_name") && (
          <InputField
            label={t("form_fields.middle_name")}
            value={value.middle_name}
            required={isRequired(formCongif, "middle_name")}
            errorMessage={t(errorMessages.middle_name)}
            onChangeText={(text: string) => updateField("middle_name", text)}
          />
        )}
        {/* {isVisible(formCongif, "last_name") && ( */}
        <InputField
          label={t("form_fields.last_name")}
          value={value.last_name}
          errorMessage={t(errorMessages.last_name)}
          required={isRequired(formCongif, "last_name")}
          onChangeText={(text: string) => updateField("last_name", text)}
        />
        {/* )} */}

        {/* {isVisible(formCongif, "name_suffix") && ( */}
        <View>
          <Text style={styles.inputLabel}>
            {t("form_fields.name_suffix")}
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
              {SUFFIX.map(suffix => (
                <Picker.Item
                  key={suffix.value}
                  label={suffix.name}
                  value={suffix.value}
                />
              ))}
            </Picker>
          </View>
          {errorMessages.suffix && (
            <Text style={styles.required}>{t(errorMessages.suffix)}</Text>
          )}
        </View>
        {/* )} */}
      </View>

      {(!value.age_eligibility || !value.has_no_state_license) &&
        showChangeName &&
        isVisible(formCongif, "change_of_name") && (
          <Checkbox
            value={value.change_of_name}
            required={isRequired(formCongif, "change_of_name")}
            label={t("nvra_form_page.changed_name")}
            helpText={t("nvra_form_page.changed_name_help")}
            onValueChange={(checked: boolean) => {
              if (!checked) {
                // Update change_of_name and clear all prev_* fields in one batch
                onChange({
                  ...value,
                  change_of_name: checked,
                  prev_name_title: "",
                  prev_first_name: "",
                  prev_middle_name: "",
                  prev_last_name: "",
                  prev_name_suffix: "",
                });
                // Clear errors for prev_* fields
                const clearedErrors = { ...errorMessages };
                clearedErrors.prev_name_title = "";
                clearedErrors.prev_first_name = "";
                clearedErrors.prev_middle_name = "";
                clearedErrors.prev_last_name = "";
                clearedErrors.prev_name_suffix = "";
                onChangeError(clearedErrors);
              } else {
                updateField("change_of_name", checked);
              }
            }}
          />
        )}

      {(!value.age_eligibility || !value.has_no_state_license) &&
        value.change_of_name && (
          <View style={styles.row}>
            {isVisible(formCongif, "prev_name_title") && (
              <View>
                <Text style={styles.inputLabel}>
                  {t("form_fields.name_title")}
                  {isRequired(
                    formCongif,
                    "prev_name_title",
                    value.change_of_name,
                  ) && <Text style={styles.required}> *</Text>}
                </Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                    selectedValue={value.prev_name_title}
                    onValueChange={itemValue =>
                      updateField("prev_name_title", itemValue)
                    }
                  >
                    <Picker.Item label="" value="" />
                    <Picker.Item label="Mr." value="Mr." />
                    <Picker.Item label="Mrs." value="Mrs." />
                    <Picker.Item label="Miss" value="Miss" />
                    <Picker.Item label="Ms." value="Ms." />
                  </Picker>
                </View>
                {errorMessages.prev_name_title && (
                  <Text style={styles.required}>
                    {t(errorMessages.prev_name_title)}
                  </Text>
                )}
              </View>
            )}
            {isVisible(formCongif, "prev_first_name") && (
              <InputField
                label={t("form_fields.first_name")}
                value={value.prev_first_name}
                required={isRequired(
                  formCongif,
                  "prev_first_name",
                  value.change_of_name,
                )}
                errorMessage={t(errorMessages.prev_first_name)}
                onChangeText={(text: string) =>
                  updateField("prev_first_name", text)
                }
              />
            )}
            {isVisible(formCongif, "prev_middle_name") && (
              <InputField
                label={t("form_fields.middle_name")}
                value={value.prev_middle_name}
                required={isRequired(
                  formCongif,
                  "prev_middle_name",
                  value.change_of_name,
                )}
                errorMessage={t(errorMessages.prev_middle_name)}
                onChangeText={(text: string) =>
                  updateField("prev_middle_name", text)
                }
              />
            )}
            {isVisible(formCongif, "prev_last_name") && (
              <InputField
                label={t("form_fields.last_name")}
                required={isRequired(
                  formCongif,
                  "prev_last_name",
                  value.change_of_name,
                )}
                errorMessage={t(errorMessages.prev_last_name)}
                value={value.prev_last_name}
                onChangeText={(text: string) =>
                  updateField("prev_last_name", text)
                }
              />
            )}
            {isVisible(formCongif, "prev_name_suffix") && (
              <View>
                <Text style={styles.inputLabel}>
                  {t("form_fields.name_suffix")}
                  {isRequired(
                    formCongif,
                    "prev_name_suffix",
                    value.change_of_name,
                  ) && <Text style={styles.required}> *</Text>}
                </Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                    selectedValue={value.prev_name_suffix}
                    onValueChange={itemValue =>
                      updateField("prev_name_suffix", itemValue)
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
                {errorMessages.prev_name_suffix && (
                  <Text style={styles.required}>
                    {t(errorMessages.prev_name_suffix)}
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
      {isVisible(formCongif, "us_citizen") && (
        <Checkbox
          label={t("nvra_form_page.citizen")}
          value={value.us_citizen}
          required={isRequired(formCongif, "us_citizen")}
          errorText={t(errorMessages.us_citizen)}
          onValueChange={() => updateField("us_citizen", !value.us_citizen)}
        />
      )}
      {showAgeEligibility && (
        <Checkbox
          label={t("nvra_form_page.age_eligibility")}
          required
          value={value.age_eligibility}
          errorText={t(errorMessages.age_eligibility)}
          onValueChange={checked => {
            if (!checked) {
              // Update age_eligibility and clear all prev_* and mailing_* fields in one batch
              onChange({
                ...value,
                change_of_name: checked,
                prev_name_title: "",
                prev_first_name: "",
                prev_middle_name: "",
                prev_last_name: "",
                prev_name_suffix: "",

                has_mailing_address: false,
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
              });
              // Clear errors for prev_* fields
              const clearedErrors = { ...errorMessages };
              clearedErrors.prev_name_title = "";
              clearedErrors.prev_first_name = "";
              clearedErrors.prev_middle_name = "";
              clearedErrors.prev_last_name = "";
              clearedErrors.prev_name_suffix = "";

              clearedErrors.mailing_address = "";
              clearedErrors.mailing_unit = "";
              clearedErrors.mailing_city = "";
              clearedErrors.mailing_state = "";
              clearedErrors.mailing_zip_code = "";

              clearedErrors.prev_address = "";
              clearedErrors.prev_unit = "";
              clearedErrors.prev_city = "";
              clearedErrors.prev_state = "";
              clearedErrors.prev_zip_code = "";
              onChangeError(clearedErrors);
            } else {
              updateField("age_eligibility", checked);
            }
          }}
        />
      )}
      {showWillBe18ByElection && (
        <Checkbox
          label={
            formCongif?.fields?.will_be_18_by_election?.label ||
            t("michigan.eligibility.age")
          }
          required
          value={value.will_be_18_by_election}
          errorText={t(errorMessages.will_be_18_by_election)}
          onValueChange={checked =>
            updateField("will_be_18_by_election", checked)
          }
        />
      )}
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    section: {},
    sectionTitle: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 18,
      fontWeight: "semibold",
    },
    inputLabel: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      color: theme.textPrimary,
      textTransform: "uppercase",
      marginTop: 5,
    },
    required: {
      color: theme.secondary,
    },
    row: {
      flexWrap: "wrap",
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
      borderRadius: 6,
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
