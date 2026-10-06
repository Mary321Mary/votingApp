import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import HelpTooltip from "./HelpTooltip";
import { ThemeContext } from "@/styles/ThemeProvider";

interface AddressAutocompleteProps {
  apiKey: string;
  label?: string;
  required?: boolean;
  helpText?: string;
  onAddressSelect: (data: {
    address: string;
    city: string;
    zip: string;
    formattedAddress: string;
  }) => void;
  errorText?: string;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  apiKey,
  label,
  required,
  helpText,
  onAddressSelect,
  errorText,
}) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      {!!label && (
        <Text style={styles.inputLabel}>
          {label}
          {required && <Text style={styles.requiredStar}> *</Text>}{" "}
          {helpText && <HelpTooltip text={helpText} />}
        </Text>
      )}
      <GooglePlacesAutocomplete
        placeholder="Enter your street address..."
        minLength={2}
        fetchDetails={true}
        keyboardShouldPersistTaps="handled"
        onPress={(data, details = null) => {
          if (!details || !details.address_components) return;

          let streetNumber = "";
          let route = "";
          let locality = "";
          let postalCode = "";

          details.address_components.forEach((component: any) => {
            const types: string[] = component.types;
            if (types.includes("street_number")) {
              streetNumber = component.long_name;
            }
            if (types.includes("route")) {
              route = component.long_name;
            }
            if (types.includes("locality")) {
              locality = component.long_name;
            }
            if (types.includes("postal_code")) {
              postalCode = component.long_name;
            }
          });

          const fullStreetAddress = `${streetNumber} ${route}`.trim();
          const formattedAddress =
            details.formatted_address || data.description;

          onAddressSelect({
            address: fullStreetAddress || formattedAddress,
            city: locality,
            zip: postalCode,
            formattedAddress,
          });
        }}
        onFail={error => console.log("GOOGLE PLACES ERROR:", error)}
        onNotFound={() => console.log("GOOGLE PLACES: DETAILS NOT FOUND")}
        query={{
          key: apiKey,
          language: "en",
          types: "address",
          components: "country:us",
        }}
        styles={{
          textInputContainer: styles.textInputContainer,
          textInput: [
            styles.textInput,
            {
              backgroundColor: theme.white,
              color: theme.textPrimary,
              borderColor: errorText ? theme.secondary : theme.borderColor,
            },
          ],
          listView: [styles.listView, { backgroundColor: theme.white }],
          row: {
            backgroundColor: theme.white,
            padding: 13,
            height: 44,
            flexDirection: "row",
          },
          separator: {
            height: 0.5,
            backgroundColor: theme.borderColor,
          },
          description: {
            color: theme.textPrimary,
          },
        }}
      />
      {errorText && <Text style={styles.errorText}>{errorText}</Text>}
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      zIndex: 1000,
    },
    inputLabel: {
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 5,
      color: theme.textPrimary,
    },
    requiredStar: {
      color: theme.secondary,
    },
    textInputContainer: {
      padding: 0,
    },
    textInput: {
      height: 48,
      borderWidth: 1,
      borderRadius: 6,
      paddingHorizontal: 10,
      fontSize: 14,
    },
    listView: {
      borderRadius: 6,
      borderWidth: 1,
      borderColor: "#ccc",
      marginTop: 4,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    errorText: {
      color: "red",
      fontSize: 11,
      marginTop: 4,
    },
  });
