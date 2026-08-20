import { useMemo, useState } from "react";
import type { DomainData, IndicatorConnection } from "../../types/DonutData";
import Box from "@mui/material/Box";
import type { SxProps } from "@mui/material/styles";
import { Fade, Typography } from "@mui/material";
import { findIconSrc } from "../../helpers/DonutHelpers";
import { DomainContentBox } from "./DomainContentBox";
import { ImageCircle } from "../InterfaceComponents/ImageCircle";
import { ConnectionsDetailsModal } from "./ConnectionDetailsModal";
import { DomainConnectionsFlowchart } from "./DomainConnectionsFlowchart";
import { DomainContentText } from "./DomainContentText";
import { IndicatorDetails } from "./IndicatorDetails";

type DetailsProps = {
  visible: boolean;
  domain: DomainData;
  indicatorConnections: IndicatorConnection[];
  allConnections: IndicatorConnection[];
  unrolled: boolean;
  showConnections: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setDomain: React.Dispatch<React.SetStateAction<DomainData | null>>;
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
  domain,
  setDomain,
  indicatorConnections,
  unrolled,
  showConnections,
  setShowConnections,
}: DetailsProps) => {
  const indicatorName = domain.name;
  const symbolId = domain.symbolId;
  const iconSrc = findIconSrc(symbolId);
  const { indicators } = domain;

  const displayName = useMemo(() => {
    return indicatorName.split("_").join(" ");
  }, [indicatorName]);

  const [openConnections, setOpenConnections] = useState<IndicatorConnection[]>(
    [],
  );

  const isGlobalIndicator =
    domain.quarter === "global_ecological" ||
    domain.quarter === "global_social";

  const onClose = () => {
    setVisible(false);

    // Cleanup other conditional elements after transition ends
    setTimeout(() => {
      setShowConnections(false);
      setOpenConnections([]);
      setDomain(null);
      document.body.style.overflow = "auto";
    }, 450);
  };

  return (
    <>
      {visible ? (
        <Box
          id="glass-blur"
          sx={{
            width: "100vw",
            height: "100vh",
            backdropFilter: "blur(8px)",
            zIndex: 0,
            position: "fixed",
            inset: 0,
          }}
        ></Box>
      ) : (
        <></>
      )}
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
                domain={domain}
                connections={indicatorConnections}
                openConnections={openConnections}
                setOpenConnections={setOpenConnections}
                setShowConnections={setShowConnections}
              />
            ) : (
              <>
                <DomainContentBox position="left">
                  {domain.narrative ? (
                    <DomainContentText text={domain.narrative} title={""} />
                  ) : (
                    <></>
                  )}
                  <DomainContentText
                    text={domain.description}
                    title="Thriving Glasgow Definition"
                  />
                  {indicators.length > 0 ? (
                    <DomainContentText
                      text={domain.target}
                      title="What could this look like?"
                    />
                  ) : (
                    <></>
                  )}
                </DomainContentBox>

                {indicators.length > 0 ? (
                  <DomainContentBox position="right" stickyHeader="Indicators">
                    {indicators.map((i, index) => (
                      <IndicatorDetails indicator={i} index={index} />
                    ))}
                  </DomainContentBox>
                ) : (
                  <DomainContentBox position="right">
                    <DomainContentText
                      text={domain.target}
                      title="What could this look like?"
                    />
                  </DomainContentBox>
                )}
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
    </>
  );
};
