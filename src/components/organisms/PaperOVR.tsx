import React, { useContext, useEffect, useState } from "react";
import { FormProps, RegisterFormState } from "@/utils/types";
import { NameSection } from "../modules/NameSection";
import { AddressSection } from "../modules/AddressSection";
import { IDSection } from "../modules/IDSection";
import { ContactSection } from "../modules/ContactSection";
import { RaceAndParty } from "../modules/RaceAndParty";
import { isRequired, isVisible } from "@/utils/constants";
import { DateRow } from "../atoms/DateOfBirth/DateRow";
import { Checkbox } from "../atoms/Checkbox";
import { useTranslation } from "react-i18next";
import { PhoneSection } from "../modules/PhoneSection";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemeContext } from "@/styles/ThemeProvider";
import { PrevNameSection } from "../modules/PrevNameSection";
import { PrevAddressSection } from "../modules/PrevAddressSection";

interface PropsPaperOVR extends FormProps {
  counties: string[];
  showOnlySSN?: boolean;
  showQuestions?: boolean;
  isRedirectedCompressNVRA?: boolean;
}

export const PaperOVR = ({
  state,
  counties,
  value,
  formCongif,
  errorMessages,
  onChangeError,
  onChange,
  handleMainButton,
  showOnlySSN = false,
  showQuestions = false,
  isRedirectedCompressNVRA = false,
}: PropsPaperOVR) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  const [isCompressed, setIsCompressed] = useState<boolean>(
    isRedirectedCompressNVRA,
  );

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

  const fullName = [value.first_name, value.middle_name, value.last_name]
    .filter(Boolean)
    .join(" ");

  const fullAddress = [
    value.home_address,
    value.home_unit ? `Unit ${value.home_unit}` : "",
    value.home_city,
    value.state,
    value.home_zip_code,
  ]
    .filter(Boolean)
    .join(", ");

  const dobFormatted =
    value.birthMonth && value.birthDay && value.birthYear
      ? `${value.birthMonth}/${value.birthDay}/${value.birthYear}`
      : "";

  const infoDetails = [fullName, fullAddress, dobFormatted, value.phone]
    .filter(Boolean)
    .join(" • ");

  useEffect(() => {
    if (counties && counties.length === 1) {
      if (value.home_county !== counties[0]) {
        onChange({ ...value, home_county: counties[0] });
      }
    } else if (
      (!counties || counties.length === 0) &&
      value.home_county !== ""
    ) {
      onChange({ ...value, home_county: "" });
    }
  }, [counties, value.home_county]);

  return (
    <>
      {isCompressed && (
        <View style={styles.infoPanel}>
          <View style={styles.textContainer}>
            <Text style={styles.infoText}>
              <Text style={styles.boldText}>Your Info: </Text>
              {infoDetails}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsCompressed(false)}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      )}

      {isCompressed && (
        <IDSection
          showOnlySSN={showOnlySSN}
          value={value}
          state={state}
          formCongif={formCongif}
          errorMessages={errorMessages}
          onChange={onChange}
          onChangeError={onChangeError}
        />
      )}

      {!isCompressed && (
        <NameSection
          value={value}
          state={state}
          formCongif={formCongif}
          errorMessages={errorMessages}
          showChangeName
          onChange={onChange}
          onChangeError={onChangeError}
        />
      )}

      {!isCompressed && (
        <AddressSection
          value={value}
          state={state}
          formCongif={formCongif}
          errorMessages={errorMessages}
          showChangeOfAddress
          isCompressed={isCompressed}
          onChange={onChange}
          onChangeError={onChangeError}
        />
      )}

      {isCompressed && (
        <View style={styles.fieldset}>
          {isCompressed && (
            <View style={styles.legendContainer}>
              <Text style={styles.legendText}>
                {t("nvra_form_page.name_address_details_header")}
              </Text>
            </View>
          )}
          <PrevNameSection
            value={value}
            formCongif={formCongif}
            errorMessages={errorMessages}
            onChange={onChange}
            onChangeError={onChangeError}
          />
          <PrevAddressSection
            value={value}
            state={state}
            formCongif={formCongif}
            errorMessages={errorMessages}
            showChangeOfAddress
            onChange={onChange}
            onChangeError={onChangeError}
          />
        </View>
      )}

      {!isCompressed && (
        <IDSection
          showOnlySSN={showOnlySSN}
          value={value}
          state={state}
          formCongif={formCongif}
          errorMessages={errorMessages}
          onChange={onChange}
          onChangeError={onChangeError}
        />
      )}
      <RaceAndParty
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        isCompressed={isCompressed}
        onChange={onChange}
        onChangeError={onChangeError}
      />

      {!isCompressed && isVisible(formCongif, "date_of_birth") && (
        <DateRow
          value={{
            month: {
              name: "birthMonth",
              value: value.birthMonth,
              errorText: t(errorMessages.birthMonth),
            },
            day: {
              name: "birthDay",
              value: value.birthDay,
              errorText: t(errorMessages.birthDay),
            },
            year: {
              name: "birthYear",
              value: value.birthYear,
              errorText: t(errorMessages.birthYear),
            },
          }}
          required={isRequired(formCongif, "date_of_birth")}
          updateField={updateField}
        />
      )}
      {!isCompressed && (
        <PhoneSection
          value={value}
          state={state}
          formCongif={formCongif}
          errorMessages={errorMessages}
          onChange={onChange}
          onChangeError={onChangeError}
        />
      )}
      <ContactSection
        value={value}
        state={state}
        formCongif={formCongif}
        errorMessages={errorMessages}
        showQuestions={showQuestions}
        isRedirectedCompressNVRA={isRedirectedCompressNVRA}
        onChange={onChange}
        onChangeError={onChangeError}
      />
      <View style={styles.infoPanel}>
        {isVisible(formCongif, "mail_form") && (
          <Checkbox
            name="mailForm"
            label={t("nvra_form_page.mail_form")}
            value={value.mailForm}
            onValueChange={(checked: boolean) =>
              updateField("mailForm", checked)
            }
          />
        )}
      </View>
      {handleMainButton}
    </>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    label: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "medium",
      textTransform: "uppercase",
    },
    required: {
      color: theme.secondary,
    },

    infoPanel: {
      marginVertical: 10, // my-4
      padding: 12, // p-3
      backgroundColor: "#f8f9fa",
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8, // gap-2
    },
    textContainer: {
      flex: 1,
    },
    infoText: {
      fontSize: 14,
      lineHeight: 20,
    },
    boldText: {
      fontWeight: "bold", // fw-bold
    },
    editButton: {
      padding: 4,
    },
    editButtonText: {
      color: theme.primary, // variant="link" / text-primary
      fontWeight: "600", // fw-semibold
      fontSize: 14,
    },

    fieldset: {
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 15,
      marginTop: 20,
      marginBottom: 20,
      position: "relative",
    },
    legendContainer: {
      position: "absolute",
      top: -10,
      left: 12,
      backgroundColor: theme.white,
      borderRadius: 5,
      padding: 3,
      flexDirection: "row",
      alignItems: "center",
    },
    legendText: {
      fontSize: 14,
      fontWeight: "bold",
      textTransform: "uppercase",
      color: theme.textPrimary,
    },
  });
