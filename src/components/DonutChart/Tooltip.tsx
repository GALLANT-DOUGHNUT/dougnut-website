import type { SxProps, Theme } from "@mui/material/styles"
import type {
  DomainData,
  IndicatorPoint,
  LozengeType,
} from "../../types/DonutData"
import { Box, Stack, Typography } from "@mui/material"
import theme from "../../theme"
import { findArcValue } from "../../helpers/DonutHelpers"
import { TooltipLozenge } from "./TooltipLozenge"

type TooltipProps = {
  visible: boolean
  year: number
  domain: DomainData | null
  x: number
  y: number
}

export const Tooltip = ({ visible, year, domain, x, y }: TooltipProps) => {
  const rightJustify = x > 0.85 * window.innerWidth

  const containerStyles: SxProps = {
    display: visible ? "block" : "none",
    position: "fixed",
    top: y + "px",
    left: rightJustify ? x - 150 + "px" : x + "px",
    pointerEvents: "none",
    textAlign: "center",
  }

  const tooltipStyles: SxProps<Theme> = {
    minWidth: "150px",
    maxWidth: "350px",
    minHeight: "80px",
    maxHeight: "300px",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    display: "inline-block",
    borderRadius: 3,
    py: theme.spacing(1),
    px: theme.spacing(1.5),
    backgroundColor: "rgba(240, 240, 240, 0.88)",
  }

  // Get Title Text
  const title = domain
    ? domain.name
        .split(" ")
        .map((word) => word?.[0]?.toUpperCase() + word?.substring(1))
        .join(" ")
    : ""

  // Get main Indicator Measurement
  let mainText: string = ""
  let subText: string | null = null
  let lozengeText: LozengeType = "unknown"

  if (domain && domain.indicators.length > 0) {
    let indicatorCode: string | null = null
    if (domain.indicators.length > 0) {
      indicatorCode =
        domain.indicators.find((id) => id.primary)?.indicatorCode ?? null
    }

    const indicator = domain.indicators.find(
      (id) => id.indicatorCode === indicatorCode,
    )
    const dataPoint: IndicatorPoint | undefined = indicator?.data.find(
      (d) => d.year === year,
    )
    const arcValue = findArcValue(domain.indicators, indicatorCode, year)

    if (dataPoint) {
      const value =
        dataPoint.unit === "Index"
          ? Math.round(dataPoint.value * 10000) / 10000
          : Math.round(dataPoint.value)

      mainText =
        `${value}${dataPoint.unit === "Percentage" ? "%" : ` ${dataPoint.unit}`}`.replace(
          "Index",
          "",
        )
    }

    lozengeText =
      arcValue.type === "unsafe"
        ? domain.quarter.includes("ecological")
          ? "overshoot"
          : "shortfall"
        : arcValue.type

    if (indicator) {
      subText = indicator.indicatorName
    }
  }

  return (
    <Box sx={containerStyles}>
      <Box sx={tooltipStyles}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1.3rem",
            textAlign: "center",
            lineHeight: theme.spacing(2.8),
            pt: theme.spacing(0.5),
          }}
        >
          {title}
        </Typography>
        <Stack
          direction="row"
          spacing={3}
          sx={{ justifyContent: "center", my: theme.spacing(1) }}
        >
          {mainText ? (
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "1.15rem",
                textAlign: "center",
                alignContent: "center",
                lineHeight: theme.spacing(2.8),
              }}
            >
              {mainText}
            </Typography>
          ) : (
            <></>
          )}
          <TooltipLozenge type={lozengeText} />
        </Stack>
        {subText ? (
          <Box
            sx={{
              mt: theme.spacing(1.2),
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography>{subText}</Typography>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  )
}
