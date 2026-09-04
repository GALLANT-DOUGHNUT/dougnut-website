import { createTheme } from "@mui/material/styles"

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
      0: "#b957f1",
      1: "#4cc9e2",
      2: "#277da1",
      3: "#e0691f",
      4: "#edb126",
      imputed: "#c5c5c54e",
    },
    lozenge: {
      overshoot: "#e84b6d",
      shortfall: "#70c7ea",
      safe: "#7ed037",
      unknown: "#aaaaaa",
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
})

export default theme
