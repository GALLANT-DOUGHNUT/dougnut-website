import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import type { SxProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import type { IndicatorConnection } from "../../types/DonutData";
import { findIconSrc } from "../../helpers/DonutHelpers";
import Stack from "@mui/material/Stack";
import EastIcon from "@mui/icons-material/East";
import { domainData } from "../../data/DomainData";

type ConnectionDetailProps = {
  showConnections: boolean;
  openConnections: IndicatorConnection[];
  setOpenConnections: React.Dispatch<
    React.SetStateAction<IndicatorConnection[]>
  >;
};

const connectionModalStyles: SxProps = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: "15px",
  bgcolor: "#f6f8f9",
  boxShadow: 6,
  borderColor: "#000000",
  cursor: "pointer",
  minWidth: "200px",
  width: "400px",
  overflowY: "hidden",
  height: "25vh",
};

const iconStyles: SxProps = {
  objectFit: "contain",
  alignSelf: "center",
  maxWidth: "10%",
  maxHeight: "10%",
  display: "flex",
};

const arrowStyles: SxProps = {
  height: "100%",
  display: "flex",
  scale: 1.5,
  pt: 1,
  px: 4,
};

const findDomainImage = (name: string, quarter: string) => {
  const matchingData = domainData.find(
    (dd) =>
      dd.name.replace(" and ", " & ").toLowerCase() === name &&
      dd.quarter === quarter,
  );

  if (matchingData) {
    return findIconSrc(matchingData.symbolId);
  }
  return "";
};

export const ConnectionsDetailsModal = ({
  showConnections,
  openConnections,
  setOpenConnections,
}: ConnectionDetailProps) => {
  return (
    <Modal
      open={showConnections && openConnections.length > 0}
      sx={connectionModalStyles}
      onClose={() => {
        setOpenConnections([]);
      }}
      slotProps={{
        backdrop: {
          sx: { backgroundColor: "transparent", pointerEvents: "auto" },
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          overflowY: "scroll",
          scrollbarWidth: "thin",
          scrollbarColor: "#888 #e0e0e0",
          scrollPadding: "15px",
        }}
      >
        {openConnections.map(
          (connection: IndicatorConnection, index: number) => {
            const srcImage = findDomainImage(
              connection.sourceName,
              connection.sourceQuarter,
            );
            const trgImage = findDomainImage(
              connection.targetName,
              connection.targetQuarter,
            );

            return (
              <>
                <Stack direction={"row"} sx={{ pl: 2, pt: 2 }}>
                  <Box
                    id={`${connection.sourceName}-icon-${index}`}
                    component="img"
                    src={srcImage}
                    alt={`from ${connection.sourceName}`}
                    sx={iconStyles}
                  />
                  <Box id={`direction-arrow-${index}`} sx={arrowStyles}>
                    <EastIcon />
                  </Box>
                  <Box
                    id={`${connection.targetName}-icon-${index}`}
                    component="img"
                    src={trgImage}
                    alt={`to ${connection.targetName}`}
                    sx={iconStyles}
                  />
                </Stack>
                <Typography
                  sx={{
                    fontSize: "1.15rem",
                    padding: "25px",
                    overflowWrap: "break-word",
                    textOverflow: "ellipsis",
                  }}
                >
                  {connection.description}
                </Typography>
              </>
            );
          },
        )}
      </Box>
    </Modal>
  );
};
