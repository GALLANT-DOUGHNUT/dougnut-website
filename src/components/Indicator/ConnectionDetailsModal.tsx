import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"
import type { SxProps } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import type { IndicatorConnection } from "../../types/DonutData"
import { findIconSrc } from "../../helpers/DonutHelpers"
import Stack from "@mui/material/Stack"
import EastIcon from "@mui/icons-material/East"
import { domainData } from "../../data/DomainData"
import theme from "../../theme"
import { useScreenSizes } from "../../hooks/useScreenSizes"

type ConnectionDetailProps = {
  showConnections: boolean
  openConnections: IndicatorConnection[]
  setOpenConnections: React.Dispatch<
    React.SetStateAction<IndicatorConnection[]>
  >
}

const connectionModalStyles: SxProps = {
  borderColor: "#000000",
  cursor: "pointer",
}

const modalContainerStyles: SxProps = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: "15px",
  minWidth: "200px",
  width: "400px",
  maxHeight: "44vh",
  overflow: "hidden",
}

const scrollableContentStyles: SxProps = {
  overflowY: "auto",
  overflow: "auto",
  height: "100%",
  bgcolor: "#f6f8f9",
  boxShadow: 6,
  scrollPadding: "15px",
  "&::-webkit-scrollbar": {
    width: "10px",
  },
  "&::-webkit-scrollbar-track": {
    overflow: "auto",
    borderRadius: 8,
    backgroundColor: "#ffffffd3",
    my: 2,
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#5070907b",
    borderRadius: "5px",
  },
}

const iconStyles: SxProps = {
  objectFit: "contain",
  alignSelf: "center",
  maxWidth: "100%",
  maxHeight: "100%",
  display: "flex",
}

const arrowStyles: SxProps = {
  height: "100%",
  display: "flex",
  scale: 1.5,
  pt: 1,
  px: 4,
}

const findDomainImage = (name: string, quarter: string) => {
  const matchingData = domainData.find(
    (dd) =>
      dd.name.replace(" and ", " & ").toLowerCase() === name &&
      dd.quarter === quarter
  )

  if (matchingData) {
    return findIconSrc(matchingData.symbolId)
  }
  return ""
}

const capitaliseString = (name: string) => {
  const parts = name.split(" ")
  const partsCapitalised = parts.map((p) => {
    return p[0].toUpperCase() + p.slice(1)
  })
  return partsCapitalised.join(" ")
}

export const ConnectionsDetailsModal = ({
  showConnections,
  openConnections,
  setOpenConnections,
}: ConnectionDetailProps) => {
  const { isXs } = useScreenSizes()
  const containerStyles = {
    ...modalContainerStyles,
    ...(isXs ? { minWidth: "100px", width: "73vw" } : {}),
  }

  const iconSize = isXs ? "22px" : "34px"

  return (
    <Modal
      open={showConnections && openConnections.length > 0}
      sx={connectionModalStyles}
      onClose={() => {
        setOpenConnections([])
      }}
      slotProps={{
        backdrop: {
          sx: { backgroundColor: "transparent", pointerEvents: "auto" },
        },
      }}
    >
      <Box
        sx={{
          ...containerStyles,
          height: openConnections.length > 2 ? "44vh" : "28vh",
        }}
      >
        <Box sx={scrollableContentStyles}>
          {openConnections.map(
            (connection: IndicatorConnection, index: number) => {
              const srcImage = findDomainImage(
                connection.sourceName,
                connection.sourceQuarter
              )
              const trgImage = findDomainImage(
                connection.targetName,
                connection.targetQuarter
              )

              return (
                <>
                  <Stack
                    direction={"row"}
                    sx={{ pl: theme.spacing(2), pt: theme.spacing(2) }}
                  >
                    <Stack
                      direction={"column"}
                      sx={{
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ width: iconSize, height: iconSize }}>
                        <Box
                          id={`${connection.sourceName}-icon-${index}`}
                          component="img"
                          src={srcImage}
                          alt={`from ${connection.sourceName}`}
                          sx={iconStyles}
                        />
                      </Box>
                      <Typography
                        sx={{ fontSize: isXs ? "0.7rem" : "0.9rem" }}
                      >
                        {capitaliseString(connection.sourceName)}
                      </Typography>
                    </Stack>
                    <Box id={`direction-arrow-${index}`} sx={arrowStyles}>
                      <EastIcon />
                    </Box>
                    <Stack
                      direction={"column"}
                      sx={{
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ width: iconSize, height: iconSize }}>
                        <Box
                          id={`${connection.targetName}-icon-${index}`}
                          component="img"
                          src={trgImage}
                          alt={`to ${connection.targetName}`}
                          sx={iconStyles}
                        />
                      </Box>
                      <Typography
                        sx={{ fontSize: isXs ? "0.7rem" : "0.9rem" }}
                      >
                        {capitaliseString(connection.targetName)}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Typography
                    sx={{
                      fontSize: isXs ? "0.8rem" : "1.1rem",
                      px: theme.spacing(2),
                      pt: theme.spacing(2),
                      pb: theme.spacing(1),
                      overflowWrap: "break-word",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {connection.description}
                  </Typography>
                  <hr
                    style={{
                      width: "90%",
                      height: "2px",
                      border: "none",
                      backgroundColor: "#10324c1a",
                    }}
                  />
                </>
              )
            }
          )}
        </Box>
      </Box>
    </Modal>
  )
}
