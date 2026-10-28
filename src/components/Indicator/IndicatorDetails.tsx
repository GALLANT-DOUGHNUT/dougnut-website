import type { GraphColors, SxProps } from "@mui/material/styles"
import type { Indicator } from "../../types/DonutData"
import { Box, Tooltip, Typography } from "@mui/material"
import theme from "../../theme"
import { IndicatorThesholdChart } from "./IndicatorThresholdChart"
import WarningIcon from "@mui/icons-material/Warning"

type IndicatorProps = {
  index: number
  indicator: Indicator
}

export const IndicatorDetails = ({ index, indicator }: IndicatorProps) => {
  const titleStyles: SxProps = {
    fontWeight: 600,
    fontSize: { sm: "1rem", md: "1.1rem", xl: "1.3rem" },
    textAlign: "start",
    pl: theme.spacing(3),
    pr: theme.spacing(2),
    mb: theme.spacing(1.4),
  }

  const textStyles: SxProps = {
    paddingTop: "5px",
    paddingBottom: theme.spacing(1),
    px: "15px",
    fontSize: { md: "0.9rem", xl: "1.1rem" },
    textAlign: "start",
    mx: theme.spacing(1.5),
  }

  const sourceStyles: SxProps = {
    px: "15px",
    fontSize: { md: "0.8rem", xl: "1rem" },
    textAlign: "start",
    mx: theme.spacing(1.5),
    mb: theme.spacing(2.5),
  }

  const graphStyles: SxProps = {
    backgroundColor: theme.palette.background.paper,
    paddingTop: "7px",
    borderRadius: theme.spacing(1.5),
    border: "3px solid",
    borderColor: "#004c9334",
    mx: theme.spacing(3.5),
    mt: theme.spacing(0.5),
    mb: theme.spacing(1),
  }

  // const unit = (
  //   indicator.data.length > 0 ? `${indicator.data[0].unit}` : ""
  // ).replace("Percentage", "%")

  const graphWidth = window.innerWidth * 0.23

  const imputedCount = indicator.data.filter(
    (d) => d.type === "imputed"
  ).length
  const imputedPercentage = (imputedCount / indicator.data.length) * 100
  const warningText =
    imputedPercentage >= 70
      ? "At least 70% of the results for this Indicator have been imputed - Care should be taken when interpreting these results."
      : "At least 40% of the results for this Indicator have been imputed - Gaps in measured data should be noted."

  return (
    <>
      <Box sx={{ width: "100%", display: "flex" }}>
        <Typography
          sx={{
            ...titleStyles,
            width: imputedPercentage >= 40 ? "82%" : "90%",
          }}
          variant="h3"
          aria-label="indicator-chart-title"
        >
          {indicator.indicatorName}
        </Typography>
        {imputedPercentage >= 40 ? (
          <Box sx={{ width: "20%" }}>
            <Tooltip title={warningText}>
              <WarningIcon
                sx={{
                  color:
                    imputedPercentage >= 70
                      ? "#e40654ff"
                      : "rgba(60, 132, 163, 0.72)",
                }}
              />
            </Tooltip>
          </Box>
        ) : (
          <></>
        )}
      </Box>
      <Box sx={graphStyles} aria-label="indicator-chart-container">
        <IndicatorThesholdChart
          width={graphWidth}
          height={205}
          margin={{ top: 20, bottom: 23, left: 55, right: 22 }}
          data={indicator.data}
          baseline={indicator.baseline}
          target={indicator.target}
          color={theme.palette.graph[(index % 5) as keyof GraphColors]}
        />
      </Box>
      <Typography
        sx={textStyles}
        variant="body1"
        aria-label="indicator-definition"
      >
        {indicator.definition && indicator.definition.length > 0
          ? `${indicator.definition} ${indicator.note}`
          : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."}
      </Typography>
      {indicator.source ? (
        <Typography
          sx={sourceStyles}
          variant="body1"
          aria-label="indicator-source"
        >
          <b>Source:</b> {indicator.source}
        </Typography>
      ) : (
        <></>
      )}
      <hr
        style={{
          width: "90%",
          height: "2px",
          border: "none",
          backgroundColor: "#10324c1a",
        }}
      />
    </>
  )
}
