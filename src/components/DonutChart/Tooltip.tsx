import type { SxProps } from "@mui/material/styles"
import type { DomainData, IndicatorPoint } from "../../types/DonutData"
import { Box, Typography } from "@mui/material"
import theme from "../../theme"

type TooltipProps = {
  visible: boolean
  year: number
  domain: DomainData | null
  x: number
  y: number
}

const tooltipStyles: SxProps = {
  minWidth: "150px",
  maxWidth: "350px",
  minHeight: "80px",
  maxHeight: "245px",
  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  display: "inline-block",
  borderRadius: 1,
  margin: "0",
  padding: "6px",
  backgroundColor: "rgba(240,240,240,0.9)",
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

  // Get Title Text
  const title = domain
    ? domain.name
        .split(" ")
        .map((word) => word?.[0]?.toUpperCase() + word?.substring(1))
        .join(" ")
    : ""

  // Get main Indicator Measurement
  let mainText: string = "Not Known"
  let subText: string | null = null

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

    if (dataPoint) {
      const value =
        dataPoint.unit === "Index"
          ? Math.round(dataPoint.value * 10000) / 10000
          : Math.round(dataPoint.value * 100) / 100
      mainText = `${value}${dataPoint.unit === "Percentage" ? "%" : ` ${dataPoint.unit}`} (${dataPoint.type === "imputed" ? "Imputed" : "Measured"})`
    }

    if (indicator) {
      subText = indicator.indicatorName
    }
  }

  let scrollTime: number = 3
  if (subText && subText.length > 105) {
    scrollTime = 6
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
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: "1.1rem",
            textAlign: "center",
            lineHeight: theme.spacing(2.8),
            pt: theme.spacing(0.5),
          }}
        >
          {mainText}
        </Typography>
        {subText ? (
          <Box
            sx={{
              mt: theme.spacing(1.2),
              overflow: "hidden",
              height: "50px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                animation: `scrollUp ${scrollTime}s linear infinite`,
                "@keyframes scrollUp": {
                  from: {
                    transform: "translateY(40%)",
                  },
                  to: {
                    transform: "translateY(-50%)",
                  },
                },
              }}
            >
              {subText}
            </Typography>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  )
}
