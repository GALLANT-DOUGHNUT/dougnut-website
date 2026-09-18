import type { SxProps } from "@mui/material";
import { DonutStrings } from "../resources/strings";
import theme from "../theme";

export const getHoverTextStyling = (
  hoverText: string,
  unrolled: boolean,
): SxProps => {
  const { innerWidth, innerHeight } = window;
  const strings = DonutStrings.hoverText;

  const global = Boolean(
    hoverText === strings.globalEcological ||
    hoverText === strings.globalSocial,
  );

  const color =
    hoverText === strings.localEcological ||
    hoverText === strings.globalEcological
      ? theme.palette.common.ecologicalBoundary
      : theme.palette.common.socialBoundary;

  if (unrolled) {
    return {
      color,
      position: "absolute",
      textAlign: "end",
      maxWidth: `${innerWidth / 3}px`,
      fontSize: `${(innerWidth + innerHeight) / 100}px`,
      fontWeight: 700,
      right: 10,
      top: 10,
    };
  }
  return {
    color,
    position: "absolute",
    textAlign: "start",
    maxWidth: `${innerWidth / 7}px`,
    fontSize: `${(innerWidth + innerHeight) / 100}px`,
    fontWeight: 700,
    left: innerWidth <= 992 ? 16 : 32,
    bottom: global ? innerHeight / 2 + 5 : null,
    top: global ? null : innerHeight / 2 + 5,
  };
};
