import { Tooltip, Typography } from "@mui/material"
import Box from "@mui/material/Box"
import type { SxProps } from "@mui/material/styles"
import DonutSmallIcon from "@mui/icons-material/DonutSmall"
import BarChartIcon from "@mui/icons-material/BarChart"
import DonutLargeIcon from "@mui/icons-material/DonutLarge"

const chartTypeStyles: SxProps = {
  position: "absolute",
  scale: 1.5,
  cursor: "pointer",
  width: "25px",
  zIndex: 100000,
  mt: 3,
  left: 475,
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
  return (
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
        sx={{ ...chartTypeStyles, left: 515, top: -2 }}
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
          <Box
            sx={{ position: "relative", width: "25px", height: "25px" }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.5rem",
                position: "absolute",
                bottom: 7,
                left: 8,
                color: showWireframe ? "#000000" : "#00000045",
              }}
            >
              24
            </Typography>
            <DonutLargeIcon
              sx={{
                color: showWireframe ? "#000000" : "#00000045",
              }}
            />
          </Box>
        </Tooltip>
      </Box>
    </>
  )
}
