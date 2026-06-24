import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#9c27b0",
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
