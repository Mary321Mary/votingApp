/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";
import { LogBox, StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import notifee, { EventType } from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { UIConfigProvider } from "./contexts/UIConfigContext";
import { ThemeProvider } from "./styles/ThemeProvider";
import Navigation from "./components/Navigation";
import { FormScrollProvider } from "./contexts/FormScrollContext";
import { PENDING_NOTIFICATION_ID_KEY } from "./utils/constants";

LogBox.ignoreLogs([
  "VirtualizedLists should never be nested inside plain ScrollViews",
]);

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const notificationId = detail.notification?.data?.notificationId;
  if (type === EventType.PRESS && notificationId) {
    await AsyncStorage.setItem(
      PENDING_NOTIFICATION_ID_KEY,
      String(notificationId),
    );
  }
});

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
