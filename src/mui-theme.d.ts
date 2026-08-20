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

  interface GraphColors {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    imputed: string;
  }

  interface Palette {
    common: CommonColors;
    graph: GraphColors;
  }

  interface PaletteOptions {
    common?: Partial<CommonColors>;
    graph?: Partial<GraphColors>;
  }
}

export {};
