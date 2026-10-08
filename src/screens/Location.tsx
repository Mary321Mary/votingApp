import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { VOTER_FORM_STORAGE_KEY } from "@/utils/constants";
import { getLocations } from "@/utils/api";

import { ThemeContext } from "@/styles/ThemeProvider";
import Header from "@/layout/Header";
import { RootStackParamList } from "@/components/Navigation";
import { LocationItem, LocationsData } from "../utils/types";
import { LocationCard } from "../components/modules/LocationCard";
import { CustomButton } from "../components/atoms/CustomButton";

type LocationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Location"
>;

export default function LocationScreen({ navigation }: LocationScreenProps) {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

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

  const [loading, setLoading] = useState<boolean>(true);
  const [isEarlyOpen, setIsEarlyOpen] = useState(earlyCount <= 3);
  const [isDropboxesOpen, setIsDropboxesOpen] = useState(dropboxCount <= 3);

  const hasLocations = pollingCount > 0 || earlyCount > 0 || dropboxCount > 0;
  const hasMapCenter =
    Boolean(locations.map_center) &&
    typeof locations.map_center?.lat === "number" &&
    typeof locations.map_center?.lng === "number";

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [storedForm] = await Promise.all([
          AsyncStorage.getItem(VOTER_FORM_STORAGE_KEY),
        ]);

        if (storedForm) {
          const parsedForm = JSON.parse(storedForm);
          const apiLocationResponse = await getLocations(parsedForm);
          setLocations(apiLocationResponse.data.locations);
        }
      } catch (error) {
        console.error("Failed to load user data from AsyncStorage:", error);
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header showMenu text={"Your Voting Locations"} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* {hasMapCenter && <LocationMap data={locations} />} */}

        {!hasLocations ? (
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
          title={"Return to Dashboard"}
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
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
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
