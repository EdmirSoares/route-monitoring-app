export const palette = {
  internationalOrange: {
    50: "#fff7ec",
    100: "#ffecd3",
    200: "#ffd5a5",
    300: "#ffb86d",
    400: "#ff8e32",
    500: "#ff6d0a",
    600: "#ff5300",
    700: "#cc3a02",
    800: "#a12d0b",
    900: "#82280c",
    950: "#461104",
  },
  codGray: {
    50: "#f8f7f7",
    100: "#CCC7C7",
    200: "#9E9494",
    300: "#6E6363",
    400: "#605757",
    500: "#534B4B",
    600: "#463F3F",
    700: "#383333",
    800: "#2B2727",
    900: "#201D1D",
    950: "#131111",
  },
  dune: {
    50: "#f4f3f2",
    100: "#F3F2F2",
    200: "#E4E2E2",
    300: "#D8D4D4",
    400: "#CAC4C4",
    500: "#ADA4A4",
    600: "#908484",
    700: "#736868",
    800: "#564E4E",
    900: "#3b3535",
    950: "#201D1D",
  },
  status: {
    error: "#FF0000",
    errorDark: "#BD0A0A",
    success: "#22c55e",
    warning: "#f59e0b",
    live: "#ff3b30",
  },
  white: "#FFFFFF",
  black: "#000000",
  overlayDim: "rgba(130, 40, 12, 0.21)",
} as const;

export const lightTheme = {
  colors: {
    background: palette.dune[100],
    surface: palette.white,
    surfaceAlt: palette.dune[200],
    surfaceMuted: palette.dune[500],
    text: {
      primary: palette.dune[900],
      secondary: palette.codGray[300],
      inverse: palette.dune[100],
      disabled: palette.dune[500],
      subtle: "rgba(50,50,50,0.4)",
      white: palette.white,
    },
    primary: {
      default: palette.internationalOrange[600],
      hover: palette.internationalOrange[700],
      light: palette.internationalOrange[100],
    },
    border: palette.dune[300],
    status: palette.status,
    icon: palette.codGray[300],
    overlayDim: palette.overlayDim,
  },
} as const;

export const darkTheme = {
  colors: {
    background: palette.codGray[900],
    surface: palette.codGray[950],
    surfaceAlt: palette.dune[900],
    surfaceMuted: palette.codGray[200],
    text: {
      primary: palette.dune[100],
      secondary: palette.codGray[200],
      inverse: palette.dune[900],
      disabled: palette.codGray[400],
      subtle: "rgba(242,243,242,0.4)",
      white: palette.white,
    },
    primary: {
      default: palette.internationalOrange[600],
      hover: palette.internationalOrange[500],
      light: palette.internationalOrange[950],
    },
    border: palette.codGray[600],
    status: palette.status,
    icon: palette.codGray[200],
    overlayDim: palette.overlayDim,
  },
} as const;

export const typography = {
  fontFamily: {
    thin: "Inter_100Thin",
    extraLight: "Inter_200ExtraLight",
    light: "Inter_300Light",
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semiBold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
    extraBold: "Inter_800ExtraBold",
    black: "Inter_900Black",
  },
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    "2xl": 30,
    "3xl": 36,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export type Theme = typeof lightTheme;
export type ColorScheme = "light" | "dark";
