import React, { ReactNode, useContext } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "@/layout/Footer";
import Spinner from "@/components/atoms/Spinner";
import { ThemeContext } from "@/styles/ThemeProvider";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  return (
    <React.Suspense
      fallback={
        <View style={styles.container}>
          <Spinner />
        </View>
      }
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.container}>{children}</View>

          <Footer />
        </ScrollView>
      </SafeAreaView>
    </React.Suspense>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },

    scrollContent: {
      flexGrow: 1,
    },

    container: {
      flex: 1,
      width: "100%",
      alignItems: "center",
    },
  });

export default DefaultLayout;
