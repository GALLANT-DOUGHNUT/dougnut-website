import { useMemo } from "react"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"

export const useScreenSizes = () => {
  const theme = useTheme()

  const isXL = useMediaQuery(theme.breakpoints.up("xl"))
  const isLg = useMediaQuery(theme.breakpoints.up("lg"))
  const isMd = useMediaQuery(theme.breakpoints.up("md"))
  const isSm = useMediaQuery(theme.breakpoints.down("md"))
  const isXs = useMediaQuery(theme.breakpoints.down("sm"))
  const betweenSmMd = useMediaQuery(theme.breakpoints.between("sm", "md"))
  const betweenXsSm = useMediaQuery(theme.breakpoints.between("xs", "sm"))

  const results = useMemo(() => {
    return { isXL, isLg, isMd, isSm, isXs, betweenSmMd, betweenXsSm }
  }, [isXL, isLg, isMd, betweenSmMd])

  return results
}
