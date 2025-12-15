import React, { createContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { DARK_COLORS, COLORS } from "./colors";

export const ThemeContext = createContext(COLORS);

export const ThemeProvider = ({ children }) => {
  const mode = useColorScheme();

  const theme = useMemo(
    () => (mode === "dark" ? DARK_COLORS : COLORS),
    [mode]
  );

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
