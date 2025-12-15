import React, { ReactNode, useContext } from "react";
import { View, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "@/components/modules/Footer";
import Spinner from "@/components/modules/Spinner";
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {children}
          <Footer />
        </ScrollView>
      </SafeAreaView>
    </React.Suspense>
  )
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "regular",
    },
    safeArea: {
      flex: 1,
      backgroundColor: theme.white,
    },
    scrollContent: {
      alignItems: "center",
      paddingBottom: 40,
    },
  });

export default DefaultLayout;
