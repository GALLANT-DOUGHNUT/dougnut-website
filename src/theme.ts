import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#9c27b0",
    },
    common: {
      arc: "#ff7518",
      arcHover: "#f9b429",
      arcEmpty: "#51515157",
      arcEmptyHover: "#30303057",
      ecological: "#39adc6",
      ecologicalBoundary: "#297c8e",
      social: "#8fc53b",
      socialBoundary: "#487c3a",
      panelMain: "#d0ebf1",
      white: "#ffffff",
    },
    graph: {
      0: "#90be6d",
      1: "#b957f1",
      2: "#f9844a",
      3: "#277da1",
      4: "#f94144",
      5: "#f9c74f",
      imputed: "#b4b2b37e",
    },
  },

  typography: {
    fontFamily: `"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
  },

  shape: {
    borderRadius: 8,
  },

  components: {
    MuiTypography: {
      styleOverrides: {
        body1: {
          textAlign: "left",
        },
        body2: {
          textAlign: "left",
        },
      },
    },
  },
});

export default theme;
