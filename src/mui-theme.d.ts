declare module "@mui/material/styles" {
  interface CommonColors {
    arc: string;
    arcHover: string;
    arcEmpty: string;
    arcEmptyHover: string;
    ecological: string;
    ecologicalBoundary: string;
    social: string;
    socialBoundary: string;
    panelMain: string;
    white: string;
  }

  interface Palette {
    common: CommonColors;
  }

  interface PaletteOptions {
    common?: Partial<CommonColors>;
  }
}

export {};
