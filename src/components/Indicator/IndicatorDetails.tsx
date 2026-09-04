import type { GraphColors, SxProps } from "@mui/material/styles"
import type { Indicator } from "../../types/DonutData"
import { Box, Typography } from "@mui/material"
import theme from "../../theme"
import { IndicatorThesholdChart } from "./IndicatorThresholdChart"

type IndicatorProps = {
  index: number
  indicator: Indicator
}

export const IndicatorDetails = ({ index, indicator }: IndicatorProps) => {
  const titleStyles: SxProps = {
    pb: 0,
    fontWeight: 600,
    fontSize: { md: "1.1rem", xl: "1.5rem" },
    textAlign: "start",
    pl: theme.spacing(3),
    pr: theme.spacing(2),
  }

  const textStyles: SxProps = {
    paddingTop: "5px",
    paddingBottom: "15px",
    px: "15px",
    fontSize: { md: "0.9rem", xl: "1.3rem" },
    textAlign: "start",
    mx: theme.spacing(1.5),
  }

  const graphStyles: SxProps = {
    backgroundColor: theme.palette.background.paper,
    paddingTop: "7px",
    borderRadius: theme.spacing(1.5),
    border: "3px solid",
    borderColor: "#004c9334",
    mx: theme.spacing(3.5),
    my: theme.spacing(2),
  }

  const unit = (
    indicator.data.length > 0 ? `${indicator.data[0].unit}` : ""
  ).replace("Percentage", "%")
  const unitText = ` (${unit})`

  const graphWidth = window.innerWidth * 0.23

  return (
    <>
      <Typography sx={titleStyles}>
        {indicator.indicatorName}
        {unitText}
      </Typography>
      <Box sx={graphStyles}>
        <IndicatorThesholdChart
          width={graphWidth}
          height={220}
          margin={{ top: 20, bottom: 23, left: 55, right: 22 }}
          data={indicator.data}
          baseline={indicator.baseline}
          target={indicator.target}
          color={theme.palette.graph[(index % 5) as keyof GraphColors]}
        />
      </Box>
      <Typography sx={textStyles}>
        {indicator.indicatorNarrative && indicator.indicatorNarrative.length > 0
          ? indicator.indicatorNarrative
          : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."}
      </Typography>
    </>
  )
}
