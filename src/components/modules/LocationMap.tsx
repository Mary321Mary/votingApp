import React from "react";
import { View, StyleSheet, Linking } from "react-native";
import { WebView } from "react-native-webview";
import { LocationsData } from "utils/types";

export function LocationMap({ data }: { data?: LocationsData }) {
  const isBogusKey =
    data?.map_key === "AIzaSyB1cD3f4Gh5Ij6Kl7Mn8Op9Qr0St1Uv2Wx";
  const isEmptyKey = !data?.map_key || data.map_key.trim() === "";

  const actualMapKey =
    (isBogusKey || isEmptyKey
      ? process.env.REACT_APP_GOOGLE_MAP_API_KEY
      : data?.map_key) || "";

  if (!actualMapKey || !data?.map_center) return null;

  const centerLat =
    "lat" in data.map_center
      ? data.map_center.lat
      : (data.map_center as any).latitude;
  const centerLng =
    "lng" in data.map_center
      ? data.map_center.lng
      : (data.map_center as any).longitude;

  if (typeof centerLat !== "number" || typeof centerLng !== "number")
    return null;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          html, body, #map { height: 100%; margin: 0; padding: 0; }
        </style>
        <script src="https://maps.googleapis.com/maps/api/js?key=${actualMapKey}"></script>
        <script>
          function initMap() {
            const center = { lat: ${centerLat}, lng: ${centerLng} };
            const map = new google.maps.Map(document.getElementById("map"), {
              zoom: 11,
              center: center,
              disableDefaultUI: true,
            });

            // Red
            const markers = ${JSON.stringify(data.pollingLocations || [])};
            markers.forEach(loc => {
              const pos = loc.map_data?.LatLng?.[0];
              if (pos && typeof pos.lat === "number" && typeof pos.lng === "number") {
                new google.maps.Marker({
                  position: { lat: pos.lat, lng: pos.lng },
                  map: map,
                  title: loc.map_data?.placeName || loc.address?.locationName || "",
                  icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
                });
              }
            });

            // Green
            const earlymarkers = ${JSON.stringify(data.earlyVoteSites || [])};
            earlymarkers.forEach(loc => {
              const pos = loc.map_data?.LatLng?.[0];
              if (pos && typeof pos.lat === "number" && typeof pos.lng === "number") {
                new google.maps.Marker({
                  position: { lat: pos.lat, lng: pos.lng },
                  map: map,
                  title: loc.map_data?.placeName || loc.address?.locationName || "",
                  icon: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
                });
              }
            });

            // Blue
            const dropmarkers = ${JSON.stringify(data.dropOffLocations || [])};
            dropmarkers.forEach(loc => {
              const pos = loc.map_data?.LatLng?.[0];
              if (pos && typeof pos.lat === "number" && typeof pos.lng === "number") {
                new google.maps.Marker({
                  position: { lat: pos.lat, lng: pos.lng },
                  map: map,
                  title: loc.map_data?.placeName || loc.address?.locationName || "",
                  icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                });
              }
            });
          }
          window.onload = initMap;
        </script>
      </head>
      <body>
        <div id="map"></div>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={styles.map}
        setBuiltInZoomControls={false}
        onShouldStartLoadWithRequest={request => {
          if (request.url.startsWith("https://www.google.com/maps")) {
            Linking.openURL(request.url);
            return false;
          }
          return true;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 400,
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
  },
  map: { flex: 1 },
});
