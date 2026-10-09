import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ThemeContext } from "@/styles/ThemeProvider";
import Header from "@/layout/Header";
import { RootStackParamList } from "@/components/Navigation";
import { LocationItem } from "../utils/types";
import { LocationCard } from "../components/modules/LocationCard";
import { CustomButton } from "../components/atoms/CustomButton";
import { LocationMap } from "../components/modules/LocationMap";

type LocationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Location"
>;

export default function LocationScreen({
  navigation,
  route,
}: LocationScreenProps) {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  const locations = route.params.locations || {
    map_key: "",
    map_center: { lat: 0, lng: 0 },
    pollingLocations: [],
    earlyVoteSites: [],
    dropOffLocations: [],
  };
  const form = route.params.form;

  const pollingCount = locations.pollingLocations?.length || 0;
  const earlyCount = locations.earlyVoteSites?.length || 0;
  const dropboxCount = locations.dropOffLocations?.length || 0;

  const [isEarlyOpen, setIsEarlyOpen] = useState(earlyCount <= 3);
  const [isDropboxesOpen, setIsDropboxesOpen] = useState(dropboxCount <= 3);

  const hasLocations = pollingCount > 0 || earlyCount > 0 || dropboxCount > 0;
  const hasMapCenter =
    Boolean(locations.map_center) &&
    typeof locations.map_center?.lat === "number" &&
    typeof locations.map_center?.lng === "number";

  const renderAccordionSection = (
    title: string,
    count: number,
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    items: LocationItem[],
  ) => {
    if (count === 0) return null;

    const headerText = count > 1 ? `${title} (${count})` : title;

    return (
      <View style={styles.sectionContainer}>
        <TouchableOpacity
          style={styles.accordionHeader}
          activeOpacity={0.7}
          onPress={() => setIsOpen(!isOpen)}
        >
          <Text style={styles.sectionTitle}>{headerText}</Text>
          <Text style={styles.chevronIcon}>{isOpen ? "▲" : "▼"}</Text>
        </TouchableOpacity>

        {isOpen && (
          <View style={styles.listContainer}>
            {items.map((item, index) => (
              <LocationCard key={`loc-${index}`} item={item} />
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header showMenu text={t("native_local.dashboard.your_locations")} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text>
          <Text>{t("location_lookup_page2.subtitle1")}</Text>
          {form ? form.address : "N/A"}
        </Text>
        {hasMapCenter && <LocationMap data={locations} />}

        {!hasLocations ? (
          <Text style={styles.emptyText}>
            {!hasMapCenter
              ? t("location_lookup_page2.address_not_found")
              : t("location_lookup_page2.locations_not_found")}
          </Text>
        ) : (
          <View style={styles.resultsContainer}>
            {/* Primary Polling Place */}
            {pollingCount > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>
                  {t(
                    "location_lookup_page2.polling_place_title",
                    "Polling Place",
                  )}
                </Text>
                <View style={styles.listContainer}>
                  <LocationCard item={locations.pollingLocations[0]} />
                </View>
              </View>
            )}

            {/* Early Voting */}
            {renderAccordionSection(
              t(
                "location_lookup_page2.early_list_header",
                "Early Voting Sites",
              ),
              earlyCount,
              isEarlyOpen,
              setIsEarlyOpen,
              locations.earlyVoteSites,
            )}

            {/* Drop-off Locations */}
            {renderAccordionSection(
              t(
                "location_lookup_page2.dropbox_list_header",
                "Drop-off Locations",
              ),
              dropboxCount,
              isDropboxesOpen,
              setIsDropboxesOpen,
              locations.dropOffLocations,
            )}
          </View>
        )}

        <CustomButton
          title={"Back to Dashboard"}
          onPress={() => navigation.navigate("Dashboard", {})}
        />
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      flex: 1,
      backgroundColor: theme.white,
    },
    content: {
      padding: 10,
    },
    emptyText: {
      fontSize: 14,
      color: theme.gray,
    },
    resultsContainer: {
      marginTop: 12,
    },
    sectionContainer: {
      marginBottom: 16,
    },
    accordionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#E5E7EB",
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
    },
    chevronIcon: {
      fontSize: 12,
      color: "#6B7280",
    },
    listContainer: {
      paddingTop: 10,
      gap: 10,
    },
  });
