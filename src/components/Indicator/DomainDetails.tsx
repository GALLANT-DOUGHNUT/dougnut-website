import { useMemo, useState } from "react";
import type {
  DonutData,
  IndicatorConnection,
  IndicatorDataDict,
} from "../../types/DonutData";
import Box from "@mui/material/Box";
import type { SxProps } from "@mui/material/styles";
import { Fade, Typography } from "@mui/material";
import { findIconSrc } from "../../helpers/DonutHelpers";
import { IndicatorText } from "./IndicatorText";
import { ImageCircle } from "../InterfaceComponents/ImageCircle";
import { ConnectionsDetailsModal } from "./ConnectionDetailsModal";
import { DomainConnectionsFlowchart } from "./DomainConnectionsFlowchart";

type DetailsProps = {
  visible: boolean;
  indicatorDataRecord: IndicatorDataDict;
  data: DonutData;
  indicatorConnections: IndicatorConnection[];
  allConnections: IndicatorConnection[];
  unrolled: boolean;
  showConnections: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIndicatorDataRecord: React.Dispatch<
    React.SetStateAction<IndicatorDataDict | null>
  >;
  setShowConnections: React.Dispatch<React.SetStateAction<boolean>>;
};

const overlayHalfStyles: SxProps = {
  position: "absolute",
  left: 0,
  right: 0,
  height: "50%",
};

const overlayHalfUnrolledStyles: SxProps = {
  position: "absolute",
  width: "51%",
  height: "100%",
};

const descriptionStyles: SxProps = {
  position: "absolute",
  top: "70%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#ffffff",
  boxShadow: 6,
  borderColor: "#000000",
  border: "solid",
  cursor: "pointer",
  borderRadius: "25px",
};

export const DomainDetails = ({
  visible,
  setVisible,
  indicatorDataRecord,
  setIndicatorDataRecord,
  data,
  indicatorConnections,
  unrolled,
  showConnections,
  setShowConnections,
}: DetailsProps) => {
  const indicatorName = Object.keys(indicatorDataRecord!)[0];
  const indicatorData = Object.values(indicatorDataRecord!)[0];
  const symbolId = indicatorData.symbol_id;
  const iconSrc = findIconSrc(symbolId);

  const displayName = useMemo(() => {
    return indicatorName.split("_").join(" ");
  }, [indicatorName]);

  const [openConnections, setOpenConnections] = useState<IndicatorConnection[]>(
    [],
  );

  const isGlobalIndicator =
    indicatorData.quarter === "global_ecological" ||
    indicatorData.quarter === "global_social";

  const onClose = () => {
    setVisible(false);

    // Cleanup other conditional elements after transition ends
    setTimeout(() => {
      setShowConnections(false);
      setOpenConnections([]);
      setIndicatorDataRecord(null);
      document.body.style.overflow = "auto";
    }, 450);
  };

  return (
    <Fade
      in={visible}
      timeout={{ enter: 450, exit: 450 }}
      mountOnEnter
      unmountOnExit
    >
      <Box
        id="indicator-details-canvas"
        sx={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box>
          <Box
            id="global-indicator-overlay"
            sx={{
              ...(unrolled ? overlayHalfUnrolledStyles : overlayHalfStyles),
              top: 0,
              left: 0,
              width: unrolled ? "49.25%" : "100%",
              bgcolor: showConnections
                ? "rgba(0, 0, 0, 0.8)"
                : isGlobalIndicator
                  ? "rgba(0, 0, 0, 0.2)"
                  : "rgba(0, 0, 0, 0.8)",
            }}
            onClick={onClose}
          />
          <Box
            id="local-indicator-overlay"
            sx={{
              ...(unrolled ? overlayHalfUnrolledStyles : overlayHalfStyles),
              bottom: 0,
              left: unrolled ? "49.25vw" : 0,
              width: unrolled ? "51%" : "100%",
              bgcolor: showConnections
                ? "rgba(0, 0, 0, 0.8)"
                : isGlobalIndicator
                  ? "rgba(0, 0, 0, 0.8)"
                  : "rgba(0, 0, 0, 0.2)",
            }}
            onClick={onClose}
          />
          <ConnectionsDetailsModal
            data={data}
            showConnections={showConnections}
            openConnections={openConnections}
            setOpenConnections={setOpenConnections}
          />
          <Fade in={!showConnections} timeout={{ enter: 450, exit: 450 }}>
            <Box>
              <ImageCircle
                id="indicator-details"
                onClick={() => {}}
                text={displayName}
                imageSrc={iconSrc}
                sx={{
                  transform: "translate(-50%, -50%)",
                  height: {
                    md: "calc(min(180px, 30vmin))",
                    xl: "22vmin",
                    xs: "22vmin",
                  },
                  bgcolor: "#D0EBF1",
                  borderColor: "#000000",
                  zIndex: 20,
                }}
                fontSize={{ md: "1.25rem", xl: "1.35rem" }}
              />
            </Box>
          </Fade>

          {showConnections ? (
            <DomainConnectionsFlowchart
              data={data}
              connections={indicatorConnections}
              indicator={indicatorDataRecord}
              openConnections={openConnections}
              setOpenConnections={setOpenConnections}
              setShowConnections={setShowConnections}
            />
          ) : (
            <>
              <IndicatorText
                position="left"
                text={indicatorData.description}
                title="Thriving Glasgow Definition"
              />
              <IndicatorText
                position="right"
                text={indicatorData.target}
                title="What could this look like?"
              />
            </>
          )}
          <Box
            id="connection-description-toggle"
            sx={descriptionStyles}
            onClick={() => {
              setShowConnections(!showConnections);
              if (openConnections.length > 0) {
                setOpenConnections([]);
              }
            }}
          >
            <Typography sx={{ fontSize: "1.3rem", px: "35px", py: "5px" }}>
              {showConnections ? "Thriving Definition" : "Connections"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
};
