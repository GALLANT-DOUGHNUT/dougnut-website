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

  const [fadeOut, setFadeOut] = useState(false);

  const [showConnections, setShowConnections] = useState(false);
  const [openConnectionDescription, setOpenConnectionDescription] = useState<
    string | null
  >(null);

  const isGlobalIndicator =
    indicatorData.quarter === "global_ecological" ||
    indicatorData.quarter === "global_social";

  // Allow the Fade-out transition to run before unmounting the visibility-linked components
  useEffect(() => {
    if (fadeOut) {
      const timer = setTimeout(() => {
        setFadeOut(false);
        setVisible(false);
        setShowConnections(false);
        setOpenConnectionDescription(null);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [fadeOut]);

  return visible ? (
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
      <Fade in={!fadeOut} timeout={{ enter: 450, exit: 450 }}>
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
            onClick={() => {
              setFadeOut(true);
            }}
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
            onClick={() => {
              setFadeOut(true);
            }}
          />
          {openConnectionDescription ? (
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
                {openConnectionDescription}
              </Typography>
            </Box>
          ) : (
            <Box
              id="indicator-details-primary-circle"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                height: "calc(min(180px, 30vmin))",
                aspectRatio: "1/1",
                borderRadius: "50%",
                bgcolor: "#D0EBF1",
                boxShadow: 6,
                borderColor: "#000000",
                border: "solid",
                cursor: "pointer",
              }}
            >
              <Box
                id="indicator-image-container"
                sx={{
                  position: "relative",
                  top: "18%",
                  left: "37%",
                  width: "26%",
                  height: "26%",
                  display: "flex",
                  alignSelf: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  id="indicator-image"
                  component="img"
                  src={iconSrc}
                  alt={"primary circle"}
                  sx={{
                    objectFit: "contain",
                    alignSelf: "center",
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                />
              </Box>
              <Box
                sx={{
                  position: "relative",
                  top: "20%",
                  left: "13%",
                  width: "78%",
                }}
              >
                <Typography
                  sx={{
                    color: "black",
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: "20px",
                  }}
                >
                  {displayName}
                </Typography>
              </Box>
            </Box>
          )}

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
              top: "66%",
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
      </Fade>
    </Box>
  ) : (
    <></>
  );
};
