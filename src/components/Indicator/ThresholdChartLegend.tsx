import Box from "@mui/material/Box"
import { LegendOrdinal } from "@visx/legend"
import theme from "../../theme"
import Typography from "@mui/material/Typography"
import { scaleOrdinal } from "@visx/scale"
import type { SxProps } from "@mui/material/styles"

type LegendProps = { color: string }

export const ThresholdChartLegend = ({ color }: LegendProps) => {
  const legendScale = scaleOrdinal({
    domain: ["Measured", "Imputed", "Baseline", "Ambition"],
  })

  const legendItemStyles: SxProps = {
    display: "flex",
    flexWrap: "wrap",
    gap: 3,
    mb: theme.spacing(1.1),
    ml: theme.spacing(3),
    width: "70%",
    rowGap: 0,
  }

  const labelStyles: SxProps = {
    ml: theme.spacing(1.1),
    fontSize: { md: "0.8rem", xl: "0.9rem" },
    fontWeight: 600,
  }

  return <LegendOrdinal scale={legendScale}>
    {(labels) => (
      <Box sx={{ width: "100%", justifyItems: "center" }}>
        <Box
          sx={legendItemStyles}
        >
          {labels.map((label) => (
            <Box
              key={label.text}
              sx={{ display: "flex", alignItems: "center", width: "105px" }}
            >
              <svg width={16} height={16}>
                {label.text === "Measured" || label.text === "Imputed" ? (
                  <circle
                    cx={8}
                    cy={8}
                    r={5}
                    fill={label.text === "Measured" ? color : "#ffffff"}
                    stroke={color}
                    strokeWidth={2.2}
                  />
                ) : (
                  <rect
                    x={2}
                    y={6}
                    width={16}
                    height={4}
                    rx={2}
                    fill={label.text === "Baseline" ? theme.palette.graph.baseline : theme.palette.graph.target}
                  />
                )}
              </svg>
              <Typography
                sx={labelStyles}
              >
                {label.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    )}
  </LegendOrdinal>
}