import React, { ReactNode, useContext } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native";
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
        <View style={styles.container}>
          {/* <View style={styles.scrollContent}> */}
          {children}
          {/* </View> */}
        </View>
        <Footer />
      </SafeAreaView>
    </React.Suspense>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      fontFamily: "Inter-VariableFont_opsz_wght",
      fontSize: 14,
      fontWeight: "regular",
      alignItems: "center",
    },
    safeArea: {
      flex: 1,
    },
  });

export default DefaultLayout;
