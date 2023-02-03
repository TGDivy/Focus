import create from "zustand";
import { persist } from "zustand/middleware";

export interface ThemeColorsType {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;

  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;

  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;

  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;

  background: string;
  onBackground: string;

  outline: string;

  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
}

export interface ThemeType {
  colors: ThemeColorsType;
  theme: "blue" | "green" | "red" | "purple" | "orange";
}

export interface ThemeStoreType extends ThemeType {
  setTheme: (theme: ThemeType) => void;
  setThemeByName: (
    themeName: "blue" | "green" | "red" | "purple" | "orange"
  ) => void;
}

const defaultLightTheme: ThemeColorsType = {
  primary: "#6750A4",
  onPrimary: "#FFFFFF",
  primaryContainer: "#EADDFF",
  onPrimaryContainer: "#6750A4",

  secondary: "#625B71",
  onSecondary: "#FFFFFF",
  secondaryContainer: "#E8DEF8",
  onSecondaryContainer: "#1D192B",

  tertiary: "#7D5260",
  onTertiary: "#FFFFFF",
  tertiaryContainer: "#FFD8E4",
  onTertiaryContainer: "#31111D",

  error: "#B3261E",
  onError: "#FFFFFF",
  errorContainer: "#F9DEDC",
  onErrorContainer: "#410E0B",

  background: "#FFFBFE",
  onBackground: "#1C1B1F",

  surface: "#FFFBFE",
  onSurface: "#1C1B1F",
  surfaceVariant: "#E7E0EC",
  onSurfaceVariant: "#49454F",

  outline: "#79747E",
};

const defaultDarkTheme: ThemeColorsType = {
  primary: "#D0BCFF",
  onPrimary: "#381E72",
  primaryContainer: "#4F378B",
  onPrimaryContainer: "#EADDFF",

  secondary: "#CCC2DC",
  onSecondary: "#332D41",
  secondaryContainer: "#4A4458",
  onSecondaryContainer: "#E8DEF8",

  tertiary: "#EFB8C8",
  onTertiary: "#492532",
  tertiaryContainer: "#633B48",
  onTertiaryContainer: "#FFD8E4",

  error: "#F2B8B5",
  onError: "#601410",
  errorContainer: "#8C1D18",
  onErrorContainer: "#F9DEDC",

  background: "#1C1B1F",
  onBackground: "#E6E1E5",

  outline: "#938F99",

  surface: "#1C1B1F",
  onSurface: "#E6E1E5",
  surfaceVariant: "#49454F",
  onSurfaceVariant: "#CAC4D0",
};

const useThemeStore = create<ThemeStoreType>()(
  persist(
    (set) => ({
      colors: defaultLightTheme,
      theme: "blue",
      setTheme: (theme: ThemeType) => {
        set(theme);
      },
      setThemeByName: (
        themeName: "blue" | "green" | "red" | "purple" | "orange"
      ) => {
        switch (themeName) {
          case "blue":
            set({
              colors: defaultDarkTheme,
              theme: "blue",
            });
            break;
        }
      },
    }),
    {
      name: "theme",
      getStorage: () => localStorage,
    }
  )
);

export default useThemeStore;
