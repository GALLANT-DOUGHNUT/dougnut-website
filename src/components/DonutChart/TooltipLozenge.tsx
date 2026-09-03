import Box from "@mui/material/Box"
import type { LozengeType } from "../../types/DonutData"
import { Typography } from "@mui/material"
import theme from "../../theme"

type LozengeProps = {
  type: LozengeType
}

export const TooltipLozenge = ({ type }: LozengeProps) => {
  const lozengeText =
    type === "overshoot"
      ? "Overshoot"
      : type === "shortfall"
        ? "Shortfall"
        : type === "safe"
          ? "In Safe Space"
          : "Not Known"

  return (
    <Box
      sx={{
        borderRadius: "25px",
        backgroundColor: theme.palette.lozenge[type],
      }}
    >
      <Typography
        sx={{
          py: theme.spacing(1),
          px: theme.spacing(2),
          fontWeight: 600,
          fontSize: "0.8rem",
        }}
      >
        {lozengeText}
      </Typography>
    </Box>
  )
}
