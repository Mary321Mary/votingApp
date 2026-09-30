import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

// import LocationCard from "@/components/organisms/LocationCard";
// import LocationMap from "@/components/organisms/LocationMap";

import { LocationsData, LocationItem } from "@/utils/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VOTER_POOLING_KEY } from "../../utils/constants";
import { LocationCard } from "../modules/LocationCard";

export const PollingLocationsBlock = () => {
  const { t } = useTranslation();
  const [locations, setLocations] = useState<LocationsData>({
    map_key: "",
    map_center: { lat: 0, lng: 0 },
    pollingLocations: [],
    earlyVoteSites: [],
    dropOffLocations: [],
  });

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

  useEffect(() => {
    const loadUserData = async () => {
      const data = await AsyncStorage.getItem(VOTER_POOLING_KEY);

      if (data) {
        const parsedForm = JSON.parse(data);
        setLocations(parsedForm);
      }
    };

    loadUserData();
  }, []);

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
      {/* {hasMapCenter && <LocationMap data={locations} />} */}

      {!hasLocations ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {!hasMapCenter
              ? t(
                  "location_lookup_page2.address_not_found",
                  "Address not found",
                )
              : t(
                  "location_lookup_page2.locations_not_found",
                  "No locations found",
                )}
          </Text>
        </View>
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
            t("location_lookup_page2.early_list_header", "Early Voting Sites"),
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 16,
  },
  centered: {
    padding: 20,
    alignItems: "center",
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
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
    color: "#111827",
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
