/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";
import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { UIConfigProvider } from "./contexts/UIConfigContext";
import { ThemeProvider } from "./styles/ThemeProvider";
import Navigation from "./components/organisms/Navigation";
import { FormScrollProvider } from "./contexts/FormScrollContext";

function App() {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <UIConfigProvider>
      <ThemeProvider>
        <FormScrollProvider>
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
        </FormScrollProvider>
      </ThemeProvider>
    </UIConfigProvider>
  );
}

export default App;
