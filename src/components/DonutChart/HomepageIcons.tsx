import { Tooltip } from "@mui/material"
import Box from "@mui/material/Box"
import type { SxProps } from "@mui/material/styles"
import DonutSmallIcon from "@mui/icons-material/DonutSmall"
import BarChartIcon from "@mui/icons-material/BarChart"
import { LatestResultsIcon } from "./LatestResultsIcon"
import { useScreenSizes } from "../../hooks/useScreenSizes"

const chartTypeStyles: SxProps = {
  position: "absolute",
  scale: 1.5,
  cursor: "pointer",
  width: "25px",
  zIndex: 100000,
  mt: 2.5,
  left: 470,
}

type IconProps = {
  unrolled: boolean
  setUnrolled: React.Dispatch<React.SetStateAction<boolean>>
  showWireframe: boolean
  setShowWireframe: React.Dispatch<React.SetStateAction<boolean>>
}

export const HomepageIcons = ({
  unrolled,
  setUnrolled,
  showWireframe,
  setShowWireframe,
}: IconProps) => {
  const { isXs } = useScreenSizes()

  return isXs ? (
    <></>
  ) : (
    <>
      <Box
        id={`chart-type`}
        sx={chartTypeStyles}
        onClick={() => {
          setUnrolled(!unrolled)
        }}
      >
        <Tooltip
          title={unrolled ? "Roll me up!" : "Unroll me!"}
          placement="bottom-start"
        >
          {unrolled ? (
            <DonutSmallIcon
              sx={{ color: "#000000" }}
              aria-label="Roll me up!"
            />
          ) : (
            <BarChartIcon
              sx={{ color: "#000000" }}
              aria-label="Unroll me!"
            />
          )}
        </Tooltip>
      </Box>
      <Box
        id={`latest-results-wireframe-toggle`}
        sx={{ ...chartTypeStyles, left: 510, top: -2 }}
        onClick={() => {
          setShowWireframe(!showWireframe)
        }}
      >
        <Tooltip
          title={
            showWireframe
              ? "Hide latest (2024) results"
              : "Keep latest (2024) results"
          }
          placement="bottom-start"
        >
          <LatestResultsIcon active={showWireframe} number={24} />
        </Tooltip>
      </Box>
    </>
  )
}
