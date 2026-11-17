import Box from "@mui/material/Box"
import type { IndicatorConnection } from "../../types/DonutData"
import Typography from "@mui/material/Typography"
import type { SxProps } from "@mui/material/styles"
import theme from "../../theme"
import { useScreenSizes } from "../../hooks/useScreenSizes"

type ToggleProps = {
  showConnections: boolean
  openConnections: IndicatorConnection[]
  setShowConnections: React.Dispatch<React.SetStateAction<boolean>>
  setOpenConnections: React.Dispatch<
    React.SetStateAction<IndicatorConnection[]>
  >
}

const buttonStyles: SxProps = {
  position: "absolute",
  bottom: theme.spacing(1.5),
  left: "260px",
  bgcolor: "#ffffff",
  boxShadow: 6,
  borderColor: "#000000",
  border: "solid",
  cursor: "pointer",
  borderRadius: "25px",
}

export const DomainDisplaySwitchButton = ({
  showConnections,
  openConnections,
  setShowConnections,
  setOpenConnections,
}: ToggleProps) => {
  const { isXs } = useScreenSizes()

  return (
    <Box
      id="connection-thriving-definition-toggle"
      sx={{
        ...buttonStyles,
        ...(isXs
          ? {
              left: "50%",
              transform: "translateX(-50%)",
              bottom: "4%",
            }
          : {}),
      }}
      onClick={() => {
        setShowConnections(!showConnections)
        if (openConnections.length > 0) {
          setOpenConnections([])
        }
      }}
    >
      <Typography
        sx={{
          fontSize: isXs ? "0.7rem" : "1rem",
          px: isXs ? "20px" : "35px",
          py: "5px",
        }}
      >
        {showConnections ? "Thriving Definition" : "Connections"}
      </Typography>
    </Box>
  )
}
