import React, { useContext } from "react";
import { View, Text, StyleSheet, Linking, Alert } from "react-native";
import { useTranslation } from "react-i18next";

import { ThemeContext } from "@/styles/ThemeProvider";
import { LocationHours } from "./LocationHours";
import { CustomButton } from "../atoms/CustomButton";

interface LocationCardProps {
  item: {
    address: {
      locationName?: string;
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      zip?: string;
    };
    pollingHours?: any;
    startDate?: string;
    endDate?: string;
    map_url?: string;
    map_data?: {
      placeHours?: any;
      placeNotes?: string;
    };
  };
  idPrefix?: string;
}

const formatCityStateZip = (city?: string, state?: string, zip?: string) => {
  return [city, state, zip].filter(Boolean).join(", ");
};

const hasMeaningfulAddressPart = (part?: string) => {
  return Boolean(part && part.trim().length > 0);
};

const resolveLocationHours = (pollingHours: any, placeHours: any) => {
  if (placeHours) {
    if (Array.isArray(placeHours)) return { type: "list", items: placeHours };
    if (typeof placeHours === "string")
      return { type: "raw", text: placeHours };
  }
  if (pollingHours) {
    if (Array.isArray(pollingHours))
      return { type: "list", items: pollingHours };
    if (typeof pollingHours === "string")
      return { type: "raw", text: pollingHours };
  }
  return null;
};

export const LocationCard: React.FC<LocationCardProps> = ({ item }) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  const { address, pollingHours, startDate, endDate, map_url, map_data } = item;

  const handleMapClick = async () => {
    if (!map_url) return;

    try {
      const decodedUrl = decodeURIComponent(map_url);
      const safeUrl = encodeURI(decodedUrl);
      await Linking.openURL(safeUrl);
    } catch (error) {
      console.error("Failed to open map URL:", error);
      Alert.alert("Error", "Could not open map link.");
    }
  };

  const cityLine = formatCityStateZip(
    address?.city,
    address?.state,
    address?.zip,
  );
  const hours = resolveLocationHours(pollingHours, map_data?.placeHours);
  const placeNotes = map_data?.placeNotes?.trim() ?? "";

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{address?.locationName?.trim() ?? ""}</Text>

      <View style={styles.body}>
        <View style={styles.details}>
          {hasMeaningfulAddressPart(address?.line1) && (
            <Text style={styles.addressText}>{address.line1?.trim()}</Text>
          )}
          {hasMeaningfulAddressPart(address?.line2) && (
            <Text style={styles.addressText}>{address.line2?.trim()}</Text>
          )}
          {!!cityLine && <Text style={styles.addressText}>{cityLine}</Text>}

          {hours && <LocationHours hours={hours} />}

          {!!placeNotes && (
            <Text style={styles.notesText}>
              <Text style={styles.bold}>
                {t("location_lookup_page2.notes", "Notes")}:{" "}
              </Text>
              {placeNotes}
            </Text>
          )}

          {!!startDate && !!endDate && (
            <Text style={styles.datesText}>
              Dates: {startDate} — {endDate}
            </Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title={t("location_lookup_page2.map_button_text")}
            onPress={handleMapClick}
            disabled={!map_url}
          />
        </View>
      </View>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme?.white || "#FFFFFF",
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
      borderWidth: 1,
      borderColor: "#F3F4F6",
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme?.textColor || "#111827",
      marginBottom: 8,
    },
    body: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 12,
    },
    details: {
      flex: 1,
    },
    addressText: {
      fontSize: 14,
      color: "#374151",
      lineHeight: 20,
    },
    notesText: {
      fontSize: 13,
      color: "#6B7280",
      marginTop: 6,
    },
    datesText: {
      fontSize: 13,
      fontWeight: "600",
      color: "#4B5563",
      marginTop: 6,
    },
    bold: {
      fontWeight: "bold",
    },
    buttonContainer: {
      minWidth: 80,
    },
  });
