import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    grey: {
      0: "#f9f9f9",
      10: "#f0f0f0",
      50: "#e0e0e0",
      100: "#cccccc",
      200: "#999999",
      300: "#666666",
      400: "#333333",
      500: "#000000",
      600: "#000000",
      700: "#000000",
      800: "#000000",
      900: "#000000",
      1000: "#ffffff",
    },
    primary: {
      main: "#006400",
      light: "#66a266",
      dark: "#003c00",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ffd166",
      light: "#ffe3a3",
      dark: "#997d3d",
      contrastText: "#332a14",
    },
    tertiary: {
      main: "#4098D7",
      light: "#B6E0FE",
      dark: "#003E6B",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f9f9f9",
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
      disabled: "#999999",
      hint: "#cccccc",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.125rem",
      fontWeight: 500,
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 500,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 500,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 500,
    },
    h5: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    h6: {
      fontSize: "0.875rem",
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 400,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
