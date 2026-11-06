import React, { useContext, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";
import HelpTooltip from "./HelpTooltip";
import { ThemeContext } from "@/styles/ThemeProvider";
import { COLORS } from "@/styles/colors";
import { useFormScroll } from "@/contexts/FormScrollContext";

interface AddressAutocompleteProps {
  apiKey: string;
  name: string;
  value: string;
  label?: string;
  required?: boolean;
  helpText?: string;
  onAddressSelect: (data: {
    address: string;
    aptunit: string;
    city: string;
    zip: string;
    formattedAddress: string;
  }) => void;
  errorText?: string;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  apiKey,
  name,
  value,
  label,
  required,
  helpText,
  onAddressSelect,
  errorText,
}) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { registerField } = useFormScroll();

  const googleRef = useRef<GooglePlacesAutocompleteRef>(null);

  const addressTextRef = useRef("");
  const googleSelectedText = useRef("");
  const lastProcessedAddress = useRef("");
  const isGeocoding = useRef(false);

  useEffect(() => {
    if (value !== undefined && googleRef.current) {
      googleRef.current.setAddressText(value);
      addressTextRef.current = value;
    }
  }, [value]);

  const handleAddressEndEditing = async (text: string) => {
    const rawAddress = text.trim();

    if (
      !rawAddress ||
      rawAddress === googleSelectedText.current ||
      rawAddress === lastProcessedAddress.current ||
      isGeocoding.current
    ) {
      return;
    }

    isGeocoding.current = true;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          rawAddress,
        )}&components=country:US&key=${apiKey}`,
      );

      const data = await response.json();
      if (data.status !== "OK" || !data.results?.length) {
        console.log("ADDRESS GEOCODING ERROR:", data.status);
        return;
      }

      if (addressTextRef.current.trim() !== rawAddress) {
        return;
      }

      const result = data.results[0];
      const components = result.address_components;
      const getComponent = (type: string) =>
        components.find((item: any) => item.types.includes(type))?.long_name ||
        "";

      const streetNumber = getComponent("street_number");
      const route = getComponent("route");
      const originalStreetNumber =
        rawAddress.match(/^\s*(\d+[a-zA-Z]?(?:-\d+[a-zA-Z]?)?)/)?.[1] || "";

      const finalStreetNumber = streetNumber || originalStreetNumber;
      const streetAddress = `${finalStreetNumber} ${route}`.trim();
      const formattedAddress = result.formatted_address;

      const addressData = {
        address: streetAddress || rawAddress,
        aptunit:
          getComponent("subpremise") ||
          rawAddress.match(
            /\b(?:apt|apartment|unit|suite|ste)\.?\s*#?\s*([a-zA-Z0-9-]+)/i,
          )?.[1] ||
          "",
        city:
          getComponent("locality") ||
          getComponent("postal_town") ||
          getComponent("sublocality"),
        zip: getComponent("postal_code"),
        formattedAddress,
      };

      lastProcessedAddress.current = rawAddress;

      onAddressSelect(addressData);
    } catch (error) {
      console.log("ADDRESS GEOCODING ERROR:", error);
    } finally {
      isGeocoding.current = false;
    }
  };

  return (
    <View style={styles.container}>
      {!!label && (
        <Text ref={registerField(name)} style={styles.inputLabel}>
          {label}
          {required && <Text style={styles.requiredStar}> *</Text>}{" "}
          {helpText && <HelpTooltip text={helpText} />}
        </Text>
      )}
      <GooglePlacesAutocomplete
        ref={googleRef}
        placeholder="Enter your street address..."
        minLength={2}
        fetchDetails={true}
        keyboardShouldPersistTaps="handled"
        textInputProps={{
          textContentType: "fullStreetAddress",
          autoComplete: "street-address",
          onChangeText: (text: string) => {
            addressTextRef.current = text;
            if (text !== googleSelectedText.current) {
              googleSelectedText.current = "";
              lastProcessedAddress.current = "";
            }
          },
          onEndEditing: event =>
            handleAddressEndEditing(event.nativeEvent.text),
        }}
        onPress={(data, details = null) => {
          if (!details || !details.address_components) return;

          let streetNumber = "";
          let route = "";
          let aptunit = "";
          let locality = "";
          let postalCode = "";

          details.address_components.forEach((component: any) => {
            const types: string[] = component.types;
            if (types.includes("street_number"))
              streetNumber = component.long_name;
            if (types.includes("subpremise")) aptunit = component.long_name;
            if (types.includes("route")) route = component.long_name;
            if (types.includes("locality")) locality = component.long_name;
            if (types.includes("postal_code")) postalCode = component.long_name;
          });

          const streetAddress = `${streetNumber} ${route}`.trim();
          const formattedAddress =
            details.formatted_address || data.description;

          googleSelectedText.current = data.description;
          addressTextRef.current = data.description;
          lastProcessedAddress.current = data.description;

          onAddressSelect({
            address: streetAddress || formattedAddress,
            aptunit,
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

const getStyles = (theme: typeof COLORS) =>
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
