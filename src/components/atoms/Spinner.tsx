import { COLORS } from "@/styles/colors";
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const Spinner = ({ color = COLORS.primary }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={color} />
    </View>
  );
};

export default Spinner;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  }
});
