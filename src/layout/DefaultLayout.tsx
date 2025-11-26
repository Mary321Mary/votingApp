import React, { ReactNode } from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { COLORS } from "@/styles/colors";

const DefaultLayout = ({ children }: { children: ReactNode }) => (
  <React.Suspense
    fallback={
      <View style={styles.container}>
        <Text style={styles.text}>Loading…</Text>
      </View>
    }
  >
    {children}
  </React.Suspense>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
});

export default DefaultLayout;
