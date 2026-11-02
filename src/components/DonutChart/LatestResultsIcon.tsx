import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import DonutLargeIcon from "@mui/icons-material/DonutLarge"
import type { SxProps } from "@mui/material"

type LatestResultsProps = {
  active: boolean
  number: number
  inline?: boolean
}

export const LatestResultsIcon = ({
  active,
  number,
  inline,
}: LatestResultsProps) => {
  const iconStyles: SxProps = inline
    ? {
        display: "inline",
        top: 0,
        my: 0,
        py: 0,
        lineHeight: "8px",
        mx: 0,
        verticalAlign: "middle",
        position: "relative",
      }
    : {
        position: "relative",
        width: "25px",
        height: "25px",
      }

  return (
    <Box sx={iconStyles}>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "0.5rem",
          position: "absolute",
          bottom: inline ? 12 : 7,
          left: inline ? 7 : 7.5,
          color: active ? "#000000" : "#00000045",
        }}
      >
        {number}
      </Typography>
      <DonutLargeIcon
        sx={{
          color: active ? "#000000" : "#00000045",
        }}
      />
    </Box>
  )
}
