import { useEffect, useMemo, useState } from "react";
import type {
  DonutData,
  IndicatorConnection,
  IndicatorDataDict,
} from "../../types/DonutData";
import { useWindowDimensions } from "./hooks/useWindowDimensions";
import Box from "@mui/material/Box";
import type { SxProps } from "@mui/material/styles";
import { Fade, Stack, Typography } from "@mui/material";
import { findIconSrc } from "../../helpers/DonutHelpers";
import { IndicatorText } from "./IndicatorText";
import { IndicatorConnections } from "./IndicatorConnections";
import { ImageCircle } from "../InterfaceComponents/ImageCircle";

type DetailsProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  indicatorDataRecord: IndicatorDataDict | null;
  data: DonutData;
  connections: IndicatorConnection[];
};

const overlayHalfStyles: SxProps = {
  position: "absolute",
  left: 0,
  right: 0,
  height: "50%",
};

export const IndicatorDetailsNew = ({
  visible,
  setVisible,
  indicatorDataRecord,
  data,
  connections,
}: DetailsProps) => {
  if (!indicatorDataRecord) {
    return <></>;
  }

  const indicatorName = Object.keys(indicatorDataRecord!)[0];
  const indicatorData = Object.values(indicatorDataRecord!)[0];
  const symbolId = indicatorData.symbol_id;
  const iconSrc = findIconSrc(symbolId);

  const displayName = useMemo(() => {
    return indicatorName.split("_").join(" ");
  }, [indicatorName]);

  const [showConnections, setShowConnections] = useState(false);
  const [openConnectionDescription, setOpenConnectionDescription] = useState<
    string | null
  >(null);

  const isGlobalIndicator =
    indicatorData.quarter === "global_ecological" ||
    indicatorData.quarter === "global_social";

  const onClose = () => {
    setVisible(false);

    // Cleanup other conditional elements after transition ends
    setTimeout(() => {
      setShowConnections(false);
      setOpenConnectionDescription(null);
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
              ...overlayHalfStyles,
              top: 0,
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
              ...overlayHalfStyles,
              bottom: 0,
              bgcolor: showConnections
                ? "rgba(0, 0, 0, 0.8)"
                : isGlobalIndicator
                  ? "rgba(0, 0, 0, 0.8)"
                  : "rgba(0, 0, 0, 0.2)",
            }}
            onClick={onClose}
          />
          <Fade
            in={openConnectionDescription !== null}
            timeout={{ enter: 450, exit: 450 }}
          >
            <Box
              id="indicator-connection-description"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                borderRadius: "25px",
                bgcolor: "#f6f8f9",
                boxShadow: 6,
                borderColor: "#000000",
                cursor: "pointer",
                minWidth: "200px",
                width: "400px",
                maxHeight: "22.5%",
                overflow: "scroll",
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.4rem",
                  padding: "25px",
                  overflowWrap: "break-word",
                  textOverflow: "ellipsis",
                }}
              >
                {openConnectionDescription
                  ? openConnectionDescription[0].toUpperCase() +
                    openConnectionDescription.slice(1)
                  : ""}
              </Typography>
            </Box>
          </Fade>
          <Fade
            in={openConnectionDescription === null}
            timeout={{ enter: 450, exit: 450 }}
          >
            <Box>
              <ImageCircle
                key="indicator-details"
                onClick={() => {}}
                text={displayName}
                imageSrc={iconSrc}
                sx={{
                  transform: "translate(-50%, -50%)",
                  height: { md: "calc(min(180px, 30vmin))", xl: "22vmin" },
                  bgcolor: "#D0EBF1",
                  borderColor: "#000000",
                }}
                fontSize={{ xl: "2rem", md: "1.25rem" }}
              />
            </Box>
          </Fade>

          {showConnections ? (
            <IndicatorConnections
              data={data}
              connections={connections}
              indicator={indicatorDataRecord}
              openDescription={openConnectionDescription}
              setOpenDescription={setOpenConnectionDescription}
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
            sx={{
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
            }}
            onClick={() => {
              setShowConnections(!showConnections);
            }}
          >
            <Typography sx={{ fontSize: "1.5rem", px: "35px", py: "5px" }}>
              {showConnections ? "Details" : "Connections"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
};
