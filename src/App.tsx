/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from "react";
import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { UIConfigProvider } from "./contexts/UIConfigContext";
import { ThemeProvider } from "./styles/ThemeProvider";
import Navigation from "./components/organisms/Navigation";
import { loadRemoteTranslations } from "./i18n/loader";
import i18n from "./i18n";
import { FormScrollProvider } from "./contexts/FormScrollContext";

function App() {
  const isDarkMode = useColorScheme() === "dark";

  useEffect(() => {
    loadRemoteTranslations(i18n.language);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    // <AuthProvider>
    <UIConfigProvider>
      <ThemeProvider>
        <FormScrollProvider>
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
        </FormScrollProvider>
      </ThemeProvider>
    </UIConfigProvider>
    // </AuthProvider>
  );
}

export default App;
