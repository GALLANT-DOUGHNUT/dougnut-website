import type { SxProps } from "@mui/material"
import Box from "@mui/material/Box"
import { useScreenSizes } from "../../hooks/useScreenSizes"

type OverlayProps = {
  type: "local" | "global"
  unrolled: boolean
  showConnections: boolean
  isGlobalDomain: boolean
  onClose: () => void
}

const overlayHalfStyles: SxProps = {
  position: "absolute",
  left: 0,
  right: 0,
  height: "50%",
}

const overlayHalfUnrolledStyles: SxProps = {
  position: "absolute",
  width: "51%",
  height: "100%",
}

export const DomainOverlay = ({
  type,
  unrolled,
  showConnections,
  isGlobalDomain,
  onClose,
}: OverlayProps) => {
  const { isXs } = useScreenSizes()
  const localStyles: SxProps = {
    ...(unrolled ? overlayHalfUnrolledStyles : overlayHalfStyles),
    bottom: 0,
    left: unrolled ? "49.25vw" : 0,
    width: unrolled ? "51%" : "100%",
    bgcolor: showConnections
      ? "rgba(0, 0, 0, 0.8)"
      : isGlobalDomain
        ? "rgba(0, 0, 0, 0.8)"
        : "rgba(0, 0, 0, 0.2)",
  }

  const globalStyles: SxProps = {
    ...(unrolled ? overlayHalfUnrolledStyles : overlayHalfStyles),
    top: 0,
    left: 0,
    width: unrolled ? "49.25%" : "100%",
    bgcolor: showConnections
      ? "rgba(0, 0, 0, 0.8)"
      : isGlobalDomain
        ? "rgba(0, 0, 0, 0.2)"
        : "rgba(0, 0, 0, 0.8)",
  }

  const mobileStyles: SxProps = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    bgcolor: "rgba(0, 0, 0, 0.17)",
  }

  return (
    <Box
      id={`${type}-domain-overlay`}
      onClick={onClose}
      sx={
        isXs ? mobileStyles : type === "local" ? localStyles : globalStyles
      }
    />
  )
}
