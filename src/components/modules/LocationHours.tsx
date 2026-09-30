import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

export interface HoursData {
  type: string;
  text?: string;
  items?: string[];
}

interface LocationHoursProps {
  hours: HoursData;
}

export const LocationHours: React.FC<LocationHoursProps> = ({ hours }) => {
  const { t } = useTranslation();
  const label = `${t("location_lookup_page2.hours")}:`;

  const cleanHoursText = (str: string = "") => {
    return str
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/^hours:\s*/i, "")
      .trim();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {hours.type === "raw" ? (
        <Text style={styles.text}>{cleanHoursText(hours.text)}</Text>
      ) : (
        <View style={styles.hoursList}>
          {hours.items?.map((item, index) => (
            <Text key={`${item}-${index}`} style={styles.text}>
              {item}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#4B5563",
  },
  text: {
    fontSize: 14,
    color: "#6B7280",
  },
  hoursList: {
    marginTop: 2,
    gap: 2,
  },
});
