import Box from "@mui/material/Box"
import Slider from "@mui/material/Slider"
import type { DomainData } from "../../types/DonutData"
import { useScreenSizes } from "../../hooks/useScreenSizes"

type YearSliderProps = {
  data: DomainData[]
  year: number
  setYear: React.Dispatch<React.SetStateAction<number>>
  hideSlider: boolean
}

export const YearSlider = ({
  setYear,
  year,
  data,
  hideSlider,
}: YearSliderProps) => {
  const yearValues = data.flatMap((d) =>
    (d.indicators ?? []).flatMap((id) => id.data.map((d) => d.year))
  )

  const uniqueYears = [...new Set(yearValues)].sort((a, b) => a - b)
  const { isSm, isXs } = useScreenSizes()

  const labelledYears =
    uniqueYears.length > 10
      ? uniqueYears.toReversed().filter((_, index) => index % 2 === 0)
      : uniqueYears

  const mobileView = isXs

  return hideSlider || mobileView ? (
    <></>
  ) : (
    <Box
      sx={{
        position: "absolute",
        top: 38,
        left: 37,
        width: isSm ? 350 : 400,
      }}
    >
      <Slider
        sx={{
          zIndex: 50000,
          color: "rgb(255, 117, 24)",
          "& .MuiSlider-markLabel": {
            fontSize: 12,
            color: "#666",
            fontWeight: 700,
            marginTop: -0.4,
          },
          "& .MuiSlider-markLabelActive": {
            fontSize: 12,
            color: "#df4a00",
            fontWeight: 700,
            marginTop: 0.2,
          },
        }}
        aria-label="year-slider"
        value={year}
        step={null}
        track={false}
        min={uniqueYears[0]}
        max={uniqueYears[uniqueYears.length - 1]}
        onChange={(e, value) => {
          if (e.target) {
            setYear(value)
          }
        }}
        marks={uniqueYears.map((year) => {
          return {
            value: year,
            label: labelledYears.includes(year) ? `${year}` : undefined,
          }
        })}
      />
    </Box>
  )
}
