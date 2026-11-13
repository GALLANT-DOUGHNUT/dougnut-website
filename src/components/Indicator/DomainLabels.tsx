import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import type { DomainData } from "../../types/DonutData"
import { type SxProps } from "@mui/system"
import { useScreenSizes } from "../../hooks/useScreenSizes"

type DomainLabelProps = {
  domain: DomainData | null
  unrolled: boolean
}

const labelStyles: SxProps = {
  // fontSize: "1.4rem",
  fontWeight: 550,
  justifySelf: "end",
  lineHeight: 1.3,
}

export const DomainLabels = ({ domain, unrolled }: DomainLabelProps) => {
  const { isXs, isSm } = useScreenSizes()
  const globalStyles: SxProps = {
    ...labelStyles,
    color:
      domain && domain.quarter.includes("global") ? "#ffffff" : "#000000",
    fontSize: isSm ? "1.1rem" : "1.4rem",
  }

  const localStyles: SxProps = {
    ...labelStyles,
    justifySelf: unrolled ? "start" : "end",
    fontSize: isSm ? "1.1rem" : "1.4rem",
    color:
      domain && domain.quarter.includes("local") ? "#ffffff" : "#000000",
  }

  return isXs ? (
    <></>
  ) : (
    <>
      <Box
        sx={
          unrolled
            ? { position: "absolute", right: "51.5%", bottom: 15 }
            : {
                position: "absolute",
                top: 15,
                right: 25,
              }
        }
      >
        <Typography sx={globalStyles}>GLOBAL</Typography>
        <Typography sx={globalStyles}>RESPONSIBILITIES</Typography>
      </Box>
      <Box
        sx={
          unrolled
            ? { position: "absolute", left: "50%", bottom: 15 }
            : {
                position: "absolute",
                bottom: 15,
                right: 25,
              }
        }
      >
        <Typography sx={localStyles}>LOCAL</Typography>
        <Typography sx={localStyles}>ASPIRATIONS</Typography>
      </Box>
    </>
  )
}
