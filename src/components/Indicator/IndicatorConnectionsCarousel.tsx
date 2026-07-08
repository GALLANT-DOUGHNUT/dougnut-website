import { findIconSrc, formatConnectionName } from "../../helpers/DonutHelpers";
import type {
  DonutData,
  IndicatorConnection,
  IndicatorDataDict,
} from "../../types/DonutData";
import { Box, Fade, IconButton, Typography, type SxProps } from "@mui/material";
import { ImageCircle } from "../InterfaceComponents/ImageCircle";
import { VerticalCarousel } from "../Carousel/VerticalCarousel";
import React from "react";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import theme from "../../theme";
import { useScreenSizes } from "../../hooks/useScreenSizes";

type IndicatorConnectionCarouselProps = {
  data: DonutData;
  indicator: IndicatorDataDict | null;
  connections: IndicatorConnection[];
  openDescription: string | null;
  setOpenDescription: React.Dispatch<React.SetStateAction<string | null>>;
};

const arrowCircleStyles: SxProps = {
  width: "80px",
  height: "100%",
  alignSelf: "center",
  zIndex: 40,
  position: "relative",
  aspectRatio: "1/1",
  borderRadius: "50%",
  boxShadow: 6,
  borderColor: "#000000",
  backgroundColor: "#ffffff",
  border: "3px solid",
};

export const IndicatorConnectionsCarousel = ({
  indicator,
  data,
  connections,
  openDescription,
  setOpenDescription,
}: IndicatorConnectionCarouselProps) => {
  const indicatorName = indicator ? Object.keys(indicator)[0] : "";

  const findConnectedIndicatorData = (connectionName: string) => {
    let connectionData =
      data.ecological.global[connectionName] ||
      data.ecological.local[connectionName];

    if (!connectionData) {
      connectionData =
        data.social.global[connectionName] || data.social.local[connectionName];
    }
    return connectionData;
  };

  const setConnectionDescription = (connectionName: string) => {
    const childItem = connections.find(
      (item) =>
        item.sourceName === connectionName ||
        item.targetName === connectionName,
    );
    if (childItem) {
      setOpenDescription(childItem.description);
    } else {
      console.log("No child data found for:", connectionName);
    }
  };

  const forwardConnections = connections.filter(
    (c) => c.sourceName.toLowerCase() === indicatorName.toLowerCase(),
  );

  const reverseConnections = connections.filter(
    (c) => c.targetName.toLowerCase() === indicatorName.toLowerCase(),
  );

  const { isXL } = useScreenSizes();
  const slideSize = isXL ? "25%" : "33%";

  const renderCarousel = (forward: boolean) => {
    const connectionsToRender = forward
      ? forwardConnections
      : reverseConnections;

    const offset = "13vw";

    const carouselStyles: SxProps = forward
      ? { position: "relative", left: offset }
      : { position: "relative", right: offset };

    return (
      <VerticalCarousel
        slideSize={slideSize}
        slideSpacing="0.2rem"
        containerWidth="200px"
        sx={carouselStyles}
        options={{ align: "start", axis: "y", slidesToScroll: 2 }}
        slides={connectionsToRender.map((connection, index) => {
          const isForward =
            connection.sourceName.toLowerCase() === indicatorName.toLowerCase();

          const connectionName = isForward
            ? connection.targetName
            : connection.sourceName;

          const connectionData = findConnectedIndicatorData(connectionName);
          if (connectionData) {
            const iconSrc = findIconSrc(connectionData.symbol_id);
            const circleColor = connectionData.quarter.includes("ecological")
              ? "#3AADC6"
              : "#8FC53A";

            return (
              <Fade
                in={true}
                timeout={{ enter: 380 }}
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                <Box>
                  <ImageCircle
                    id={`connection-${connectionName}-${index}`}
                    absolutePositioning={false}
                    fontSize={"1rem"}
                    onClick={() => {
                      if (openDescription) {
                        setOpenDescription(null);
                      } else {
                        setConnectionDescription(connectionName);
                      }
                    }}
                    text={formatConnectionName(connectionName)}
                    imageSrc={iconSrc}
                    sx={{
                      width: { md: "120px", lg: "150px", xl: "140px" },
                      height: { md: "120px", lg: "150px", xl: "140px" },
                      bgcolor: circleColor,
                      "&:hover": { filter: "brightness(1.5)" },
                      zIndex: 15,
                    }}
                  />
                </Box>
              </Fade>
            );
          }
          return <></>;
        })}
      />
    );
  };

  return (
    <>
      {connections && connections.length > 0 && (
        <>
          <Box sx={{ display: "flex" }}>
            {renderCarousel(false)}
            <Box
              id="inverse-connections-arrow"
              sx={{ ...arrowCircleStyles, right: "10vw" }}
            >
              <DoubleArrowIcon
                sx={{ fontSize: "3rem", color: "#000000", pt: "16px" }}
              />
            </Box>
            <Box
              id="forward-connections-arrow"
              sx={{ ...arrowCircleStyles, left: "10vw" }}
            >
              <DoubleArrowIcon
                sx={{ fontSize: "3rem", color: "#000000", pt: "16px" }}
              />
            </Box>
            {renderCarousel(true)}
          </Box>
        </>
      )}
    </>
  );
};
