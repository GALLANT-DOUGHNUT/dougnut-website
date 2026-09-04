import { Group } from "@visx/group"
import { curveBasis } from "@visx/curve"
import { LinePath } from "@visx/shape"
import { Threshold } from "@visx/threshold"
import { scaleLinear, scaleOrdinal } from "@visx/scale"
import { AxisLeft, AxisBottom } from "@visx/axis"
import { GridRows, GridColumns } from "@visx/grid"
import type { IndicatorPoint } from "../../types/DonutData"
import { LegendOrdinal } from "@visx/legend"
import Box from "@mui/material/Box"
import theme from "../../theme"
import { Typography } from "@mui/material"

export const background = "#ffffff00"
const defaultMargin = { top: 40, right: 30, bottom: 50, left: 40 }

export type ThresholdProps = {
  width: number
  height: number
  margin?: { top: number; right: number; bottom: number; left: number }
  data: IndicatorPoint[]
  baseline: number
  target: number
  color: string
}

export const IndicatorThesholdChart = ({
  width,
  height,
  margin = defaultMargin,
  data,
  baseline,
  target,
  color,
}: ThresholdProps) => {
  if (width < 10) return null
  const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]

  const isGrowthTarget = target > baseline

  // Bounds
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  const xScale = scaleLinear<number>({
    domain: [2015, 2024],
    nice: true,
  })

  const yScale = scaleLinear<number>({
    domain: [0, 100],
    nice: true,
  })

  const legendScale = scaleOrdinal({
    domain: ["Measured", "Imputed", "Baseline", "Ambition"],
  })

  xScale.range([0, xMax])
  yScale.range([yMax, 0])

  const baselineSeries: IndicatorPoint[] = years.map((y) => {
    return {
      year: y,
      value: baseline,
      unit: "",
      type: "real",
      localAuthority: "Glasgow",
    }
  })

  const targetSeries: IndicatorPoint[] = years.map((y) => {
    return {
      year: y,
      value: target,
      unit: "",
      type: "real",
      localAuthority: "Glasgow",
    }
  })

  return (
    <Box sx={{ width: "100%" }}>
      <svg width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={background}
          rx={14}
        />
        <Group left={margin.left} top={margin.top}>
          <GridRows
            scale={yScale}
            width={xMax}
            height={yMax}
            stroke="#e0e0e0"
          />
          <GridColumns
            scale={xScale}
            width={xMax}
            height={yMax}
            stroke="#e0e0e0"
          />
          <line x1={xMax} x2={xMax} y1={0} y2={yMax} stroke="#e0e0e0" />
          <AxisBottom
            top={yMax}
            scale={xScale}
            numTicks={width > 520 ? 10 : 5}
            tickFormat={(year) => year.toString()}
            tickLabelProps={{ fontSize: "0.75rem", fontWeight: 550 }}
          />
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickLabelProps={{ fontSize: "0.75rem", fontWeight: 550 }}
          />
          <text
            x={-yMax / 2}
            y="-34"
            transform="rotate(-90)"
            fontSize={"0.9rem"}
            fontWeight={600}
            textAnchor="middle"
          >
            {data[0].unit
              .replace("Percentage", "%")
              .replace("Crimes per 10,000 population", "Crimes / 10k")}
          </text>
          <Threshold<IndicatorPoint>
            id={`${Math.random()}`}
            data={data}
            x={(d) => xScale(d.year)}
            y0={(d) => yScale(d.value)}
            y1={(d) => yScale(target)}
            clipAboveTo={0}
            clipBelowTo={yMax}
            // curve={curveBasis}
            belowAreaProps={
              isGrowthTarget
                ? {
                  fill: "red",
                  fillOpacity: 0.3,
                }
                : {
                  fill: "green",
                  fillOpacity: 0,
                }
            }
            aboveAreaProps={
              isGrowthTarget
                ? {
                  fill: "green",
                  fillOpacity: 0,
                }
                : {
                  fill: "red",
                  fillOpacity: 0.3,
                }
            }
          />
          <LinePath
            data={baselineSeries}
            curve={curveBasis}
            x={(d) => xScale(d.year)}
            y={(d) => yScale(d.value)}
            stroke="#be1b36"
            strokeWidth={2.5}
            strokeOpacity={1}
          />
          <LinePath
            data={targetSeries}
            curve={curveBasis}
            x={(d) => xScale(d.year)}
            y={(d) => yScale(d.value)}
            stroke="#64c324"
            strokeWidth={2.5}
            strokeOpacity={0.8}
          />
          <LinePath
            data={data}
            x={(d) => xScale(d.year)}
            y={(d) => yScale(d.value)}
            stroke={color}
            strokeWidth={2.5}
          />
          {data.map((d, i) => (
            <circle
              key={`point-${i}`}
              cx={xScale(d.year)}
              cy={yScale(d.value)}
              r={4}
              fill={d.type === "real" ? color : "#ffffff"}
              stroke={color}
              strokeWidth={2}
            />
          ))}
        </Group>
      </svg>
      <LegendOrdinal scale={legendScale}>
        {(labels) => (
          <Box sx={{ width: "100%", justifyItems: "center" }}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mb: theme.spacing(1.5),
                width: "70%",
                rowGap: 0,
              }}
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
                        fill={label.text === "Baseline" ? "#be1b36" : "#64c324"}
                      />
                    )}
                  </svg>
                  <Typography
                    sx={{
                      ml: theme.spacing(1.1),
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    {label.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </LegendOrdinal>
    </Box>
  )
}
