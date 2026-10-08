import React, { useState, useMemo, useContext, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { useTranslation } from "react-i18next";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../components/Navigation";
import { partyDisplayName } from "../utils/constants";
import Header from "../layout/Header";
import { ThemeContext } from "../styles/ThemeProvider";

export interface FlattenedBallotItem {
  id: number;
  itemType: "race" | "measure";
  level: "Federal" | "State" | "County" | "Local" | "Other";
  title: string;
  rawData: any;
}

export interface SelectionItem {
  id: string;
  type: "office" | "measure";
  title: string;
  selections: string[];
}

type Props = NativeStackScreenProps<RootStackParamList, "Ballot">;

export default function BallotDetailsScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  const {
    ballotData,
    electionTitle = "",
    form,
    stateData,
    savedSelections = {},
  } = route.params || {};

  const [selections, setSelections] =
    useState<Record<string, any>>(savedSelections);
  const [expandedDetails, setExpandedDetails] = useState<
    Record<string, boolean>
  >({});

  const scrollViewRef = useRef<ScrollView>(null);
  const categoryYPositions = useRef<Record<string, number>>({});

  const sortedBallotItems = useMemo(() => {
    const election = ballotData?.elections?.[0];
    if (!election || !election.districts) return [];

    const allItems: FlattenedBallotItem[] = [];
    const normalizeLevel = (
      levelStr: string,
    ): "Federal" | "State" | "County" | "Local" | "Other" => {
      const formatted =
        levelStr?.charAt(0).toUpperCase() + levelStr?.slice(1).toLowerCase();
      if (["Federal", "State", "County", "Local"].includes(formatted)) {
        return formatted as any;
      }
      return "Other";
    };

    election.districts.forEach((district: any) => {
      const districtType = district.type;

      if (district.races) {
        district.races.forEach((race: any) => {
          allItems.push({
            id: race.id,
            itemType: "race",
            level: normalizeLevel(race.office?.level),
            title: race.office?.name || "Unknown Office",
            rawData: race,
          });
        });
      }

      if (district.ballot_measures) {
        district.ballot_measures.forEach((measure: any) => {
          allItems.push({
            id: measure.id,
            itemType: "measure",
            level: normalizeLevel(districtType),
            title: measure.official_title || measure.name,
            rawData: measure,
          });
        });
      }
    });

    return allItems.sort((a, b) => {
      const getWeight = (item: FlattenedBallotItem) => {
        const levelWeights = {
          Federal: 1,
          State: 2,
          County: 3,
          Local: 4,
          Other: 5,
        };
        const baseWeight = item.itemType === "race" ? 10 : 20;
        return baseWeight + (levelWeights[item.level] || 5);
      };
      return getWeight(a) - getWeight(b);
    });
  }, [ballotData]);

  const buildFormattedSelections = (): SelectionItem[] => {
    const result: SelectionItem[] = [];
    sortedBallotItems.forEach(item => {
      if (item.itemType === "race") {
        const selectedCandidateIds: number[] =
          selections[`race-${item.id}`] || [];
        if (selectedCandidateIds.length > 0) {
          const selectedNames = item.rawData.candidates
            ?.filter((c: any) => selectedCandidateIds.includes(c.id))
            .map((c: any) => c.person?.name || "Unknown Candidate");

          if (selectedNames && selectedNames.length > 0) {
            result.push({
              id: `race-${item.id}`,
              type: "office",
              title: item.title,
              selections: selectedNames,
            });
          }
        }
      } else if (item.itemType === "measure") {
        const measureChoice = selections[`measure-${item.id}`];
        if (measureChoice) {
          result.push({
            id: `measure-${item.id}`,
            type: "measure",
            title: item.title,
            selections: [measureChoice === "yes" ? "Yes" : "No"],
          });
        }
      }
    });
    return result;
  };

  const totalSelectionsCount = useMemo(() => {
    let count = 0;
    Object.keys(selections).forEach(key => {
      if (key.startsWith("race-")) {
        count += (selections[key] || []).length;
      } else if (key.startsWith("measure-")) {
        if (selections[key]) count += 1;
      }
    });
    return count;
  }, [selections]);

  const categories = useMemo(() => {
    if (!sortedBallotItems.length) return [];

    const categoryDefs = [
      {
        key: "Federal",
        label: "Federal",
        filter: (i: FlattenedBallotItem) =>
          i.itemType === "race" && i.level === "Federal",
      },
      {
        key: "State",
        label: "State",
        filter: (i: FlattenedBallotItem) =>
          i.itemType === "race" && i.level === "State",
      },
      {
        key: "Local",
        label: "Local",
        filter: (i: FlattenedBallotItem) =>
          i.itemType === "race" &&
          (i.level === "Local" || i.level === "County"),
      },
      {
        key: "Measures",
        label: "Measures",
        filter: (i: FlattenedBallotItem) => i.itemType === "measure",
      },
    ];

    return categoryDefs
      .map(cat => {
        const items = sortedBallotItems.filter(cat.filter);
        let selectedCount = 0;
        items.forEach(item => {
          if (item.itemType === "race") {
            const raceSels = selections[`race-${item.id}`];
            if (raceSels && raceSels.length > 0) selectedCount += 1;
          } else if (item.itemType === "measure") {
            if (selections[`measure-${item.id}`]) selectedCount += 1;
          }
        });
        return {
          key: cat.key,
          label: cat.label,
          total: items.length,
          selectedCount,
        };
      })
      .filter(cat => cat.total > 0);
  }, [sortedBallotItems, selections]);

  const handleCandidateToggle = (
    raceId: number,
    candidateId: number,
    maxSeats: number,
  ) => {
    const key = `race-${raceId}`;
    setSelections(prev => {
      const current: number[] = prev[key] || [];
      const isAlreadySelected = current.includes(candidateId);

      if (isAlreadySelected) {
        return { ...prev, [key]: current.filter(id => id !== candidateId) };
      }
      if (current.length >= maxSeats) return prev;

      return { ...prev, [key]: [...current, candidateId] };
    });
  };

  const handleMeasureToggle = (measureId: number, choice: "yes" | "no") => {
    const key = `measure-${measureId}`;
    setSelections(prev => ({
      ...prev,
      [key]: prev[key] === choice ? null : choice,
    }));
  };

  const toggleAccordion = (id: string) => {
    setExpandedDetails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getItemCategoryKey = (item: FlattenedBallotItem): string => {
    if (item.itemType === "measure") return "Measures";
    if (item.level === "County" || item.level === "Local") return "Local";
    return item.level;
  };

  const scrollToCategory = (categoryKey: string) => {
    const y = categoryYPositions.current[categoryKey];
    if (y !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y, animated: true });
    }
  };

  const formattedAddress = form
    ? `${form.address}, ${form.city}, ${stateData?.name ?? ""}, ${form.zip}`
    : "";

  const handleContinue = () => {
    // navigation.navigate("SavedSelections", {
    //   selections: buildFormattedSelections(),
    //   rawSelections: selections,
    //   totalContestsCount: sortedBallotItems.length,
    //   form,
    //   submitState: stateData,
    //   availableElections: route.params?.availableElections,
    //   selectedElectionId: route.params?.selectedElectionId,
    // });
    navigation.navigate("Dashboard", {});
  };

  const goToPrevious = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Dashboard", {});
    }
  };

  const stripHtml = (html: string) => html?.replace(/<[^>]*>?/gm, "") || "";

  if (!sortedBallotItems.length) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyText}>
          {t("ballot_lookup_page2.empty_ballot")}
        </Text>

        {stateData?.learn_about_url && (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => Linking.openURL(stateData.learn_about_url || "")}
          >
            <Text style={styles.primaryButtonText}>
              {t("lookup_success_page.cta_learn_about", {
                state_abbr: stateData.abbreviation,
              })}
            </Text>
          </TouchableOpacity>
        )}

        {/* <TouchableOpacity style={styles.linkButton} onPress={goToPrevious}>
          <Text style={styles.linkButtonText}>
            {"< "}
            {t("general.previous_step")}
          </Text>
        </TouchableOpacity> */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header showMenu text={"Your Simply Ballot"} />
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        {Boolean(formattedAddress) && (
          <Text style={styles.addressText}>
            Showing races for{" "}
            <Text style={styles.boldText}>{formattedAddress}</Text>
          </Text>
        )}

        <Text style={styles.titleText}>{electionTitle}</Text>

        <Text style={styles.reviewedText}>
          {totalSelectionsCount} {t("ballot_lookup_page2.of")}{" "}
          {sortedBallotItems.length} {t("ballot_lookup_page2.races_reviewed")}
        </Text>

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            <Text style={styles.boldText}>
              This is your personal research guide, not your official ballot.
            </Text>{" "}
            Explore each race, mark your picks here to remember them, then save
            to send yourself a copy.
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.jumpNavContainer}
        >
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={styles.pillButton}
              onPress={() => scrollToCategory(cat.key)}
            >
              <Text style={styles.pillText}>{cat.label}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {cat.selectedCount}/{cat.total}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.listContainer}>
          {sortedBallotItems.map((item, index) => {
            const catKey = getItemCategoryKey(item);
            const isFirstOfCategory =
              sortedBallotItems.findIndex(
                i => getItemCategoryKey(i) === catKey,
              ) === index;

            if (item.itemType === "race") {
              const maxSeats = item.rawData.number_of_seats || 1;
              const currentRaceSelections: number[] =
                selections[`race-${item.id}`] || [];
              const isMaxReached = currentRaceSelections.length >= maxSeats;
              const isNonPartisan = Boolean(
                item.rawData.office.is_partisan?.includes("Nonpartisan") ||
                  item.rawData.office.is_partisan?.includes("Non-Partisan"),
              );

              return (
                <View
                  key={`race-${item.id}`}
                  onLayout={e => {
                    if (isFirstOfCategory) {
                      categoryYPositions.current[catKey] =
                        e.nativeEvent.layout.y;
                    }
                  }}
                  style={styles.card}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardHeaderTitle}>
                      {item.level.toUpperCase()} ELECTION
                    </Text>
                  </View>

                  <View style={styles.cardBody}>
                    <Text style={styles.raceTitle}>{item.title}</Text>
                    {isNonPartisan && (
                      <Text style={styles.nonPartisanText}>
                        {t("ballot_lookup_page2.nonpartisan_race")}
                      </Text>
                    )}

                    <Text style={styles.candidatesHint}>
                      {t("ballot_lookup_page2.candidates")}{" "}
                      {maxSeats > 1
                        ? `(${t(
                            "ballot_lookup_page2.choose_up_to",
                          )} ${maxSeats})`
                        : `(${t("ballot_lookup_page2.choose")} ${maxSeats})`}
                      :
                    </Text>

                    {/* Список кандидатов */}
                    {item.rawData.candidates?.map((candidate: any) => {
                      const isChecked = currentRaceSelections.includes(
                        candidate.id,
                      );
                      const isDisabled = !isChecked && isMaxReached;
                      const personUrl = candidate.person?.url?.trim();

                      return (
                        <TouchableOpacity
                          key={candidate.id}
                          disabled={isDisabled}
                          style={[
                            styles.candidateRow,
                            isDisabled && { opacity: 0.5 },
                          ]}
                          onPress={() =>
                            handleCandidateToggle(
                              item.id,
                              candidate.id,
                              maxSeats,
                            )
                          }
                        >
                          <View
                            style={[
                              styles.checkbox,
                              isChecked && styles.checkboxChecked,
                            ]}
                          >
                            {isChecked && (
                              <Text style={styles.checkmark}>✓</Text>
                            )}
                          </View>

                          <View style={styles.candidateInfo}>
                            <View style={styles.candidateNameRow}>
                              <Text style={styles.candidateName}>
                                {candidate.person?.name}
                              </Text>
                              {personUrl ? (
                                <TouchableOpacity
                                  onPress={() => Linking.openURL(personUrl)}
                                >
                                  <Text style={styles.linkIconText}> 🔗</Text>
                                </TouchableOpacity>
                              ) : null}
                              {candidate.is_incumbent && (
                                <Text style={styles.incumbentText}>
                                  {" "}
                                  ({t("ballot_lookup_page2.incumbent")})
                                </Text>
                              )}
                            </View>

                            {!isNonPartisan && (
                              <Text style={styles.partyText}>
                                {partyDisplayName(
                                  candidate.party_affiliation?.[0]?.name,
                                  t,
                                )}
                              </Text>
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            } else {
              const currentMeasureSelection = selections[`measure-${item.id}`];
              const measureUrl = item.rawData?.url?.trim();
              const isExpanded = expandedDetails[`measure-${item.id}`];

              return (
                <View
                  key={`measure-${item.id}`}
                  onLayout={e => {
                    if (isFirstOfCategory) {
                      categoryYPositions.current[catKey] =
                        e.nativeEvent.layout.y;
                    }
                  }}
                  style={styles.card}
                >
                  <View style={[styles.cardHeader, styles.cardHeaderMeasure]}>
                    <Text style={styles.cardHeaderTitle}>
                      {item.level.toUpperCase()} MEASURE
                    </Text>
                  </View>

                  <View style={styles.cardBody}>
                    <Text style={styles.raceTitle}>{item.title}</Text>
                    <Text style={styles.measureType}>{item.rawData.type}</Text>
                    <Text style={styles.measureName}>{item.rawData.name}</Text>

                    <TouchableOpacity
                      style={styles.candidateRow}
                      onPress={() => handleMeasureToggle(item.id, "yes")}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          currentMeasureSelection === "yes" &&
                            styles.checkboxChecked,
                        ]}
                      >
                        {currentMeasureSelection === "yes" && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </View>
                      <Text style={styles.boldText}>Vote YES</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.candidateRow}
                      onPress={() => handleMeasureToggle(item.id, "no")}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          currentMeasureSelection === "no" &&
                            styles.checkboxChecked,
                        ]}
                      >
                        {currentMeasureSelection === "no" && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </View>
                      <Text style={styles.boldText}>Vote NO</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.accordionHeader}
                      onPress={() => toggleAccordion(`measure-${item.id}`)}
                    >
                      <Text style={styles.accordionHeaderText}>
                        Details {isExpanded ? "▲" : "▼"}
                      </Text>
                    </TouchableOpacity>

                    {isExpanded && (
                      <View style={styles.accordionBody}>
                        {item.rawData?.yes_vote && (
                          <View style={styles.voteDetailSection}>
                            <Text style={styles.boldText}>
                              Yes Vote Meaning:
                            </Text>
                            <Text style={styles.detailText}>
                              {stripHtml(item.rawData.yes_vote)}
                            </Text>
                          </View>
                        )}

                        {item.rawData?.no_vote && (
                          <View style={styles.voteDetailSection}>
                            <Text style={styles.boldText}>
                              No Vote Meaning:
                            </Text>
                            <Text style={styles.detailText}>
                              {stripHtml(item.rawData.no_vote)}
                            </Text>
                          </View>
                        )}

                        {measureUrl && (
                          <TouchableOpacity
                            style={{ marginTop: 8 }}
                            onPress={() => Linking.openURL(measureUrl)}
                          >
                            <Text style={styles.linkText}>
                              {t("ballot_lookup_page2.learn_more")} 🔗
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              );
            }
          })}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerCount}>
            {totalSelectionsCount} {t("ballot_lookup_page2.of")}{" "}
            {sortedBallotItems.length} {t("ballot_lookup_page2.races_reviewed")}
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleContinue}
          >
            <Text style={styles.primaryButtonText}>
              {t("ballot_lookup_page2.continue_button_text")}
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.linkButton} onPress={goToPrevious}>
            <Text style={styles.linkButtonText}>
              {"< "}
              {t("general.previous_step")}
            </Text>
          </TouchableOpacity> */}

          {/* <Text style={styles.nextNotice}>
            {t("ballot_lookup_page2.next_notice")}
          </Text> */}
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.white,
    },
    scrollContent: {
      padding: 10,
    },
    centerContent: {
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    addressText: {
      fontSize: 14,
      marginBottom: 4,
    },
    titleText: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 12,
    },
    reviewedText: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 8,
    },
    disclaimerBox: {
      backgroundColor: "#f8f9fa",
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
      borderRadius: 6,
      padding: 12,
      marginBottom: 16,
    },
    disclaimerText: {
      fontSize: 13,
      lineHeight: 18,
    },
    boldText: {
      fontWeight: "bold",
    },
    jumpNavContainer: {
      flexDirection: "row",
      marginBottom: 16,
    },
    pillButton: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: theme.primary,
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginRight: 8,
    },
    pillText: {
      color: theme.primary,
      fontWeight: "bold",
      fontSize: 13,
      marginRight: 6,
    },
    badge: {
      backgroundColor: "#e7f1ff",
      borderRadius: 10,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    badgeText: {
      fontSize: 11,
      color: theme.primary,
      fontWeight: "bold",
    },
    listContainer: {
      marginVertical: 8,
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#e0e0e0",
      marginBottom: 16,
      overflow: "hidden",
      // Тень для iOS/Android
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    cardHeader: {
      backgroundColor: "#f1f3f5",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#e0e0e0",
    },
    cardHeaderMeasure: {
      backgroundColor: "#e9ecef",
    },
    cardHeaderTitle: {
      fontSize: 12,
      fontWeight: "bold",
    },
    cardBody: {
      padding: 12,
    },
    raceTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 4,
    },
    nonPartisanText: {
      fontSize: 12,
      color: "#6c757d",
      fontWeight: "600",
      marginBottom: 6,
    },
    candidatesHint: {
      fontSize: 12,
      color: "#6c757d",
      marginBottom: 8,
    },
    candidateRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#f1f3f5",
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: "#6c757d",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    checkboxChecked: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    checkmark: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "bold",
    },
    candidateInfo: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    candidateNameRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      flex: 1,
    },
    candidateName: {
      fontSize: 14,
      fontWeight: "bold",
    },
    incumbentText: {
      fontSize: 12,
      color: "#6c757d",
      fontStyle: "italic",
    },
    partyText: {
      fontSize: 12,
      color: "#6c757d",
      marginLeft: 8,
    },
    measureType: {
      fontSize: 12,
      color: "#6c757d",
      fontStyle: "italic",
      marginBottom: 4,
    },
    measureName: {
      fontSize: 13,
      color: "#495057",
      marginBottom: 12,
    },
    accordionHeader: {
      marginTop: 8,
      paddingVertical: 8,
    },
    accordionHeaderText: {
      fontSize: 13,
      fontWeight: "600",
      color: "#6c757d",
    },
    accordionBody: {
      backgroundColor: "#f8f9fa",
      padding: 10,
      borderRadius: 6,
      marginTop: 4,
    },
    voteDetailSection: {
      marginBottom: 8,
    },
    detailText: {
      fontSize: 12,
      color: "#333",
      marginTop: 2,
    },
    footer: {
      alignItems: "center",
      // marginVertical: 20,
    },
    footerCount: {
      fontSize: 15,
      fontWeight: "500",
      marginBottom: 12,
    },
    primaryButton: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 6,
      width: "100%",
      alignItems: "center",
      marginBottom: 12,
    },
    primaryButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    linkButton: {
      paddingVertical: 6,
      marginBottom: 8,
    },
    linkButtonText: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: "500",
    },
    linkIconText: {
      fontSize: 12,
      color: theme.primary,
    },
    linkText: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: "600",
    },
    nextNotice: {
      fontSize: 12,
      color: "#6c757d",
      textAlign: "center",
    },
    emptyText: {
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 16,
    },
  });
