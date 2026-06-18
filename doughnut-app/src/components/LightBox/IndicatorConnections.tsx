import { useMemo, useState } from "react";
import { findIconSrc, formatConnectionName } from "../../helpers/DonutHelpers";
import type {
  DonutData,
  IndicatorConnection,
  IndicatorDataDict,
} from "../../types/DonutData";
import { Box, Fade, Stack, Typography, type SxProps } from "@mui/material";

type IndicatorConnectionProps = {
  data: DonutData;
  indicator: IndicatorDataDict | null;
  connections: IndicatorConnection[];
  openDescription: string | null;
  setOpenDescription: React.Dispatch<React.SetStateAction<string | null>>;
};

const connectionCircleStyles: SxProps = {
  position: "absolute",
  top: "50%",
  left: "50%",
  display: "flex",
  alignItems: "center",
  zIndex: 15,
  border: "3px solid",
  borderColor: "black",
  borderRadius: "50%",
  "&:hover": { filter: "brightness(1.5)" },
};

const connectionImageStyles: SxProps = {
  maxWidth: "30%",
  height: "auto",
  objectFit: "contain",
  alignSelf: "center",
};

export const IndicatorConnections = ({
  indicator,
  data,
  connections,
  openDescription,
  setOpenDescription,
}: IndicatorConnectionProps) => {
  const getCircleSize = (numConnections: number) => {
    if (numConnections >= 12 && numConnections <= 14) {
      return {
        circleHeight: "120px",
        circleWidth: "120px",
        imgMaxWidth: "7vh",
        imgMaxHeight: "7vh",
      };
    } else if (numConnections >= 15 && numConnections <= 17) {
      return {
        circleHeight: "100px",
        circleWidth: "100px",
        imgMaxWidth: "6vh",
        imgMaxHeight: "6vh",
      };
    } else if (numConnections >= 18 && numConnections <= 19) {
      return {
        circleHeight: "90px",
        circleWidth: "90px",
        imgMaxWidth: "5vh",
        imgMaxHeight: "5vh",
      };
    } else if (numConnections >= 20) {
      return {
        circleHeight: "80px",
        circleWidth: "80px",
        imgMaxWidth: "4vh",
        imgMaxHeight: "4vh",
      };
    } else {
      return {
        circleHeight: "150px",
        circleWidth: "150px",
        imgMaxWidth: "7vh",
        imgMaxHeight: "5vh",
      };
    }
  };

  const findConnectionDataByName = (connectionName: string) => {
    let connectionData =
      data.ecological.global[connectionName] ||
      data.ecological.local[connectionName];

    if (!connectionData) {
      connectionData =
        data.social.global[connectionName] || data.social.local[connectionName];
    }

    return connectionData;
  };

  const findDataByChildName = (childName: string) => {
    const childItem = connections.find((item) => item.name === childName);
    if (childItem) {
      setOpenDescription(childItem.description);
    } else {
      console.log("No child data found for:", childName);
    }
  };

  const adjacencies: string[][] | null = useMemo(() => {
    if (indicator && Object.values(indicator) && Object.values(indicator)[0]) {
      const indicatorData = Object.values(indicator)[0];
      return indicatorData.adjacent;
    }
    return null;
  }, [indicator]);

  return (
    <>
      {adjacencies &&
        adjacencies.length > 0 &&
        adjacencies.map((connectionArray, index) => {
          const connectionName = connectionArray[2];
          const connectionData = findConnectionDataByName(connectionName);

          if (connectionData) {
            const iconSrc = findIconSrc(connectionData.symbol_id);
            const angle = (index / adjacencies.length) * 2 * Math.PI;

            const circleColor = connectionData.quarter.includes("ecological")
              ? "#3AADC6"
              : "#8FC53A";

            const radius = 330;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            const sizings = getCircleSize(adjacencies.length);

            return (
              <Fade
                in={true}
                timeout={{ enter: 380 }}
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                <Box
                  sx={{
                    ...connectionCircleStyles,
                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                    width: sizings.circleWidth,
                    height: sizings.circleHeight,
                    bgcolor: circleColor,
                  }}
                  key={`connection-${connectionName}-${index}`}
                  onClick={() => {
                    if (openDescription) {
                      setOpenDescription(null);
                    } else {
                      findDataByChildName(connectionName);
                    }
                  }}
                >
                  <Stack direction={"column"} spacing={0.75}>
                    <Box
                      component="img"
                      src={iconSrc}
                      alt={connectionName}
                      sx={connectionImageStyles}
                    />
                    <Typography
                      sx={{ color: "black", px: "15px", fontWeight: 500 }}
                    >
                      {formatConnectionName(connectionName)}
                    </Typography>
                  </Stack>
                </Box>
              </Fade>
            );
          } else {
            return <></>;
          }
        })}
    </>
  );
};
