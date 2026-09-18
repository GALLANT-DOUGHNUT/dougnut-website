import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export const useScreenSizes = () => {
  const theme = useTheme();

  const isXL = useMediaQuery(theme.breakpoints.up("xl"));
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));
  const isMd = useMediaQuery(theme.breakpoints.up("md"));
  const betweenSmMd = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const results = useMemo(() => {
    return { isXL, isLg, isMd, betweenSmMd };
  }, [isXL, isLg, isMd, betweenSmMd]);

  return results;
};
