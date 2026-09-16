import React, { SetStateAction, useContext, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import RenderHTML from "react-native-render-html";

import { ThemeContext } from "@/styles/ThemeProvider";
import { RegisterFormState } from "@/utils/types";
import { Checkbox } from "@/components/atoms/Checkbox";
import { CustomButton } from "../../atoms/CustomButton";

interface ConnectedWAStep3ReviewProps {
  value: RegisterFormState;
  goBack?: (step: SetStateAction<1 | 2 | 3 | 4 | 5>) => void;
  handleMainButtonClick: () => void;
  isSubmitting?: boolean;
}

export const ConnectedWAStep3Review = ({
  value,
  goBack,
  handleMainButtonClick,
  isSubmitting = false,
}: ConnectedWAStep3ReviewProps) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { width } = useWindowDimensions();

  const [confirm, setConfirm] = useState(false);
  const [showErrorConfirm, setShowErrorConfirm] = useState(false);
  const signatureSsnEditStep = value.has_no_state_license ? 3 : 2;

  const renderRow = (
    label: string,
    content: React.ReactNode,
    step: SetStateAction<1 | 2 | 3 | 4 | 5>,
  ) => (
    <>
      <View style={styles.row}>
        <View style={styles.labelWrapper}>
          <Text style={styles.label}>{label}</Text>
        </View>

        <View style={styles.contentWrapper}>
          {content}
          <CustomButton
            title={t("general.edit")}
            onPress={() => goBack?.(step)}
          />
        </View>
      </View>
      <View style={styles.divider} />
    </>
  );

  const fullName = [
    value.name_title,
    value.first_name,
    value.middle_name,
    value.last_name,
    value.suffix,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const prevName = [
    value.prev_name_title,
    value.prev_first_name,
    value.prev_middle_name,
    value.prev_last_name,
    value.prev_name_suffix,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const dob =
    value.birthYear && value.birthMonth && value.birthDay
      ? new Date(
          Number(value.birthYear),
          Number(value.birthMonth) - 1,
          Number(value.birthDay),
        ).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "";

  const hasMailingAddress = [
    value.mailing_address?.trim(),
    value.mailing_city?.trim(),
    value.mailing_state?.trim(),
    value.mailing_zip_code?.trim(),
    value.mailing_unit?.trim(),
    value.mailing_unit_type?.trim(),
    value.mailing_unit_number?.trim(),
    value.mailing_po_box_number?.trim(),
    value.mailing_box_group_type?.trim(),
    value.mailing_box_group_number?.trim(),
    value.mailing_box_number?.trim(),
    value.mailing_apo?.trim(),
    value.mailing_ap?.trim(),
    value.mailing_address_line1?.trim(),
    value.mailing_address_line2?.trim(),
    value.mailing_address_line3?.trim(),
    value.mailing_postal_code?.trim(),
    value.mailing_country?.trim(),
  ].some(Boolean);

  const hasPreviousAddress = [
    value.prev_address?.trim(),
    value.prev_city?.trim(),
    value.prev_state?.trim(),
    value.prev_zip_code?.trim(),
    value.prev_unit?.trim(),
  ].some(Boolean);

  const showSsn4Row =
    value.has_no_state_license === true &&
    (value.has_no_ssn === true || !!value.last_four_ss_number?.trim());
  const showSignature = !!value.signature_base64?.trim();

  return (
    <View>
      {renderRow(
        t("form_fields.name"),
        <Text style={styles.value}>{fullName}</Text>,
        1,
      )}

      {value.change_of_name && prevName
        ? renderRow(
            t("form_fields.previous_name"),
            <Text style={styles.value}>{prevName}</Text>,
            1,
          )
        : null}

      {dob
        ? renderRow(
            t("form_fields.dob"),
            <Text style={styles.value}>{dob}</Text>,
            1,
          )
        : null}

      {renderRow(
        t("form_fields.home_address"),
        <>
          <Text style={styles.value}>
            {[
              value.home_address,
              value.address_line_2,
              value.home_unit_type && value.home_unit
                ? `${value.home_unit_type} ${value.home_unit}`
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          </Text>
          <Text style={styles.value}>
            {value.home_city}, {value.state} {value.home_zip_code}
          </Text>
          {!!value.home_county && (
            <Text style={styles.value}>
              {value.home_county} {t("form_fields.county")}
            </Text>
          )}
        </>,
        1,
      )}

      {hasMailingAddress
        ? renderRow(
            t("nvra_form_page.section_mailing_address"),
            <>
              <Text style={styles.value}>
                {[
                  value.mailing_address,
                  value.mailing_unit_type && value.mailing_unit_number
                    ? `${value.mailing_unit_type} ${value.mailing_unit_number}`
                    : "",
                  value.mailing_unit,
                ]
                  .filter(Boolean)
                  .join(" ")}
              </Text>
              <Text style={styles.value}>
                {value.mailing_city}, {value.mailing_state}{" "}
                {value.mailing_zip_code}
              </Text>
            </>,
            1,
          )
        : null}

      {hasPreviousAddress
        ? renderRow(
            t("nvra_form_page.section_previous_address"),
            <>
              <Text style={styles.value}>
                {[value.prev_address, value.prev_unit]
                  .filter(Boolean)
                  .join(" ")}
              </Text>
              <Text style={styles.value}>
                {value.prev_city}, {value.prev_state} {value.prev_zip_code}
              </Text>
            </>,
            1,
          )
        : null}

      {renderRow(
        t("washington.wdl_number"),
        <Text style={styles.value}>
          {value.has_no_state_license === true
            ? t("general.none")
            : value.state_id_number}
        </Text>,
        1,
      )}

      {showSsn4Row
        ? renderRow(
            t("washington.ssn4_yes"),
            <Text style={styles.value}>
              {value.has_no_ssn === true
                ? t("general.none")
                : value.last_four_ss_number}
            </Text>,
            signatureSsnEditStep,
          )
        : null}

      {showSignature
        ? renderRow(
            t("washington.signature_image_yes"),
            <Image
              source={{ uri: value.signature_base64 }}
              style={styles.signature}
              resizeMode="contain"
            />,
            signatureSsnEditStep,
          )
        : null}

      <View style={styles.declarationBox}>
        <RenderHTML
          contentWidth={width}
          source={{ html: t("washington.declaration") }}
          tagsStyles={{
            body: {
              color: "#333",
              fontSize: 14,
              lineHeight: 22,
            },
            strong: {
              fontWeight: "700",
            },
            ul: {
              marginVertical: 10,
              paddingLeft: 20,
            },
            li: {
              marginBottom: 8,
            },
          }}
        />
        <Text style={styles.declarationText}>
          {t("washington.declaration2")}
        </Text>
      </View>
      {/* Confirm */}
      <Checkbox
        name="you_must_confirm"
        label={t("washington.i_confirm")}
        value={confirm}
        required
        errorText={showErrorConfirm && t("pennsylvania.you_must_confirm")}
        onValueChange={() => setConfirm(prev => !prev)}
      />

      <CustomButton
        title={
          isSubmitting
            ? t("michigan.submitting_button")
            : t("ovr_landing_page.next_button")
        }
        disabled={isSubmitting}
        onPress={() => {
          if (confirm) {
            handleMainButtonClick();
          } else {
            setShowErrorConfirm(true);
          }
        }}
      />
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingVertical: 15,
      gap: 15,
    },
    labelWrapper: {
      width: "35%",
    },
    contentWrapper: {
      width: "55%",
      // flex: 1,
    },
    label: {
      fontSize: 14,
      textAlign: "right",
      fontWeight: "600",
      color: theme.textPrimary ?? "#111",
    },
    value: {
      fontSize: 14,
      marginBottom: 6,
      color: theme.textPrimary ?? "#111",
    },
    divider: {
      width: "100%",
      height: 1,
      backgroundColor: theme.gray ?? "#ddd",
    },
    signature: {
      height: 60,
      width: 160,
      borderWidth: 1,
      borderColor: theme.gray ?? "#ddd",
      marginBottom: 10,
    },

    declarationBox: {
      marginVertical: 15,
      backgroundColor: theme.background,
      padding: 16,
      borderRadius: 12,
    },
    declarationText: {
      fontSize: 14,
      lineHeight: 22,
      marginBottom: 10,
    },
  });
