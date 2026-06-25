import React, { SetStateAction, useContext, useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { RegisterFormState } from "@/utils/types";
import { ThemeContext } from "@/styles/ThemeProvider";
import { Checkbox } from "@/components/atoms/Checkbox";
import RenderHTML from "react-native-render-html";
import { Eye, EyeOff } from "lucide-react-native";

interface ConnectedPAStep3HasIDProps {
  value: RegisterFormState;
  handleMainButtonClick: () => void;
  goBack?: (step: SetStateAction<1 | 2 | 3 | 4 | 5>) => void;
  isSubmitting?: boolean;
}

export const ConnectedPAStep3HasID = ({
  value,
  handleMainButtonClick,
  goBack,
  isSubmitting = false,
}: ConnectedPAStep3HasIDProps) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { width } = useWindowDimensions();

  const [showLast4Numbers, setShowLast4Numbers] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [showErrorConfirm, setShowErrorConfirm] = useState(false);

  const hasMailingAddress = [
    value.mailing_address?.trim(),
    value.mailing_city?.trim(),
    value.mailing_state?.trim(),
    value.mailing_zip_code?.trim(),
    value.mailing_unit?.trim(),
  ].some(Boolean);

  const hasPreviousAddress = [
    value.prev_address?.trim(),
    value.prev_city?.trim(),
    value.prev_state?.trim(),
    value.prev_zip_code?.trim(),
    value.prev_unit?.trim(),
  ].some(Boolean);

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
          <Button title={t("general.edit")} onPress={() => goBack?.(step)} />
        </View>
      </View>
      <View style={styles.divider} />
    </>
  );

  return (
    <View style={styles.content}>
      {renderRow(
        t("form_fields.name"),
        <Text style={styles.value}>
          {value.name_title} {value.first_name} {value.middle_name}{" "}
          {value.last_name}
        </Text>,
        1,
      )}
      {value.change_of_name &&
        renderRow(
          t("form_fields.previous_name"),
          <Text style={styles.value}>
            {value.prev_name_title} {value.prev_first_name}{" "}
            {value.prev_middle_name} {value.prev_last_name}
          </Text>,
          1,
        )}

      {renderRow(
        t("form_fields.dob"),
        <Text style={styles.value}>
          {new Date(
            Number(value.birthYear),
            Number(value.birthMonth) - 1,
            Number(value.birthDay),
          ).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </Text>,
        1,
      )}

      {renderRow(
        t("form_fields.home_address"),
        <>
          <Text style={styles.value}>{value.home_address}</Text>

          <Text style={styles.value}>
            {value.home_city}, {value.state} {value.home_zip_code}
          </Text>

          <Text style={styles.value}>
            {value.home_county} {t("form_fields.county")}
          </Text>
        </>,
        1,
      )}

      {hasMailingAddress
        ? renderRow(
            t("nvra_form_page.section_mailing_address"),
            <>
              <Text style={styles.value}>
                {[value.mailing_address, value.mailing_unit]
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

      {value.party &&
        renderRow(
          t("form_fields.political_party"),
          <Text style={styles.value}>{value.party}</Text>,
          1,
        )}

      {value.party &&
        value.changed_party &&
        renderRow(
          t("pennsylvania.changed_party_review_text"),
          <Text style={styles.value}>{t("general.yes")}</Text>,
          1,
        )}

      {value.has_no_state_license ? (
        <>
          {!!value.last_four_ss_number &&
            renderRow(
              t("form_fields.ssn_last4_number"),
              <View style={styles.ssnRow}>
                <Text style={styles.value}>
                  {showLast4Numbers ? value.last_four_ss_number : "••••"}
                </Text>

                <TouchableOpacity
                  onPress={() => setShowLast4Numbers(prev => !prev)}
                >
                  {showLast4Numbers ? (
                    <EyeOff size={20} color="#666" />
                  ) : (
                    <Eye size={20} color="#666" />
                  )}
                </TouchableOpacity>
              </View>,
              3,
            )}

          {renderRow(
            t("form_fields.image"),
            <Image
              source={{ uri: value.signature_base64 }}
              style={styles.signature}
              resizeMode="contain"
            />,
            3,
          )}
        </>
      ) : (
        renderRow(
          t("pennsylvania.penn_dot_number"),
          <Text style={styles.value}>{value.state_id_number}</Text>,
          2,
        )
      )}

      {!!value.phone &&
        renderRow(
          t("form_fields.phone"),
          <Text style={styles.value}>{value.phone}</Text>,
          1,
        )}
      {value.helper_name &&
        renderRow(
          t("pennsylvania.helper_name_label"),
          <Text style={styles.value}>{value.helper_name}</Text>,
          4,
        )}
      {value.helper_address &&
        renderRow(
          t("pennsylvania.helper_address_label"),
          <Text style={styles.value}>{value.helper_address}</Text>,
          4,
        )}
      {value.helper_phone &&
        renderRow(
          t("pennsylvania.helper_phone_label"),
          <Text style={styles.value}>{value.helper_phone}</Text>,
          4,
        )}

      {/* Declaration */}
      <View style={styles.declarationBox}>
        {/* <Text style={styles.declarationText}>
          {t("pennsylvania.declaration")}
        </Text> */}
        <RenderHTML
          contentWidth={width}
          source={{ html: t("pennsylvania.declaration") }}
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
          {t("pennsylvania.declaration2")}
        </Text>
      </View>

      {/* Confirm */}
      <Checkbox
        label={t("pennsylvania.i_confirm")}
        value={confirm}
        required
        errorText={showErrorConfirm && t("pennsylvania.you_must_confirm")}
        onValueChange={() => setConfirm(prev => !prev)}
      />
      <Button
        title={
          isSubmitting
            ? t("michigan.submitting_button")
            : t("pennsylvania.finish_with_pa")
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
    content: {
      marginRight: 20,
    },

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
      flex: 1,
      // marginHorizontal: 20,
    },

    label: {
      fontSize: 14,
      textAlign: "right",
      fontWeight: "600",
    },

    value: {
      fontSize: 15,
      marginBottom: 4,
      lineHeight: 22,
    },

    divider: {
      height: 1,
      backgroundColor: theme.borderColor,
    },

    ssnRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    signature: {
      width: 220,
      height: 140,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 10,
      marginBottom: 8,
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
